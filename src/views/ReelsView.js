import { Container, Text, ticker, CanvasRenderer } from "pixi.js";
import Reel from "../views/Reel.js";
import Config from "../utils/Config.js";
import SettingsView from "./SettingsView.js";
import ReelEvent from "../events/ReelEvent.js";
import FastSoundManager from "../utils/FastSoundManager.js";

export default class ReelsView extends Container
{
    constructor(baseModel)
    {
        super();
        super.on("added", this.onAdded);

        this.baseModel = baseModel;
        this.reelsCont = new Container();
		this.useFaster = false;
		
		this.fillIndex = 0;

		//this.renderCanvas(new CanvasRenderer()); TODOOOOOOOOOOO!!!
    }

    onAdded(event)
    {
        super.removeListener("added", this.onAdded);

        for (let i = 0; i < Config.MAX_REELS; i++)
		{
			let reel = new Reel(this.baseModel);
			reel.reelID = i; 
			this.reelsCont.addChild(reel);
			reel.x = i * Config.REEL_SEPARATOR;
			
			reel.on(ReelEvent.FILLED, this.onReelFillComplete, this);

			if (i == (Config.MAX_REELS - 1)) reel.on(ReelEvent.REEL_STOPPED, this.onReelStopped, this);
		}
		
		this.addChild(this.reelsCont);
    }

    startSpin()
	{
		this.useFaster = false;
		this.fillIndex = 0;
		
		for (let i = 0; i < Config.MAX_REELS; i++)
		{
			let reel = this.reelsCont.getChildAt(i);
			reel.startRoll();
		}
	}
	
	stopSpin()
	{
		if (this.useFaster)
		{
			for (let i = 0; i < Config.MAX_REELS; i++)
			{
				let reel = this.reelsCont.getChildAt(i);
				reel.stopTime();
				reel.stop();
			}
		}
		else
		{
			for (let i = 0; i < Config.MAX_REELS; i++)
			{
				let reel = this.reelsCont.getChildAt(i);
				var a = SettingsView.useQuickSpin ? Config.TIME_QUICK_STOP : Config.TIME_NORMAL_STOP;
				reel.startTime(a[0] + i * a[1]);
			}
		}
	}

	onReelStopped(e) 
	{
		this.useFaster = false;
		this.emit(ReelEvent.REEL_STOPPED);
	}

	showAllWinAnimation()
	{
		let lines = this.baseModel.spinParams.lines;
		
		for (let i = 0; i < lines.length; i++)
		{
			let o = lines[i];
			let pos = o.pos;
			
			for (let j = 0; j < Config.MAX_REELS; j++)
			{
				let reel = this.reelsCont.getChildAt(j);
				
				reel.animateInReel( pos[j] );
			}
		}
	}

	destroyAnimation() 
	{
		for (let i = 0; i < Config.MAX_REELS; i++)
		{
			let reel = this.reelsCont.getChildAt(i);
			reel.destroyAnimation();
		}
	}
	
	showOneCombination(num)
	{
		this.destroyAnimation();
		
		let lines = this.baseModel.spinParams.lines;
		let o = lines[num];
		let pos = o.pos;
		
		for (let i = 0; i < Config.MAX_REELS; i++)
		{
			let reel = this.reelsCont.getChildAt(i);
			reel.animateInReel( pos[i] );
		}
	}
	
	showScatterAnimation()
	{
		this.destroyAnimation();
		
		let o = this.baseModel.spinParams.scatters;
		let pos = o.pos;
		
		for (let i = 0; i < Config.MAX_REELS; i++)
		{
			let reel = this.reelsCont.getChildAt(i);
			reel.animateInReel( pos[i], true);
		}

		let self = this;

		FastSoundManager.playSound("trigger", false, 0, ()=> this.emit(ReelEvent.SCATTERS_SHOWN) );
	}

	setBonusField()
	{
		this.destroyAnimation();
		
		for (let i = 0; i < Config.MAX_REELS; i++)
		{
			let reel = this.reelsCont.getChildAt(i);
			reel.update();
		}
	}
	
	computeSpecial()
	{
		if (this.fillIndex == 5) 
		{
			this.emit(ReelEvent.FILLED_COMPLETE);
			return;
		}

		let comb = this.baseModel.spinParams.special.comb;
		
		if (comb[this.fillIndex] == "x")
		{
			this.fillIndex++;
			
			if (this.fillIndex == 5) 
			{
				this.emit(ReelEvent.FILLED_COMPLETE);
				return;
			}
			
			this.computeSpecial();
			return;
		}
		
		let reel = this.reelsCont.getChildAt(this.fillIndex);
		reel.fill();
	}
	
	onReelFillComplete(id) 
	{
		if (id == 4) 
		{
			this.fillIndex = 0;
			this.emit(ReelEvent.FILLED_COMPLETE);
		}
		else 
		{
			this.fillIndex++;
			this.computeSpecial();
		}
	}
}