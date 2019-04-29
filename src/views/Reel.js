import { Container, Graphics } from "pixi.js";
import SymbolOnGame from "./SymbolOnGame.js";
import Config from "../utils/Config.js";
import { TweenMax } from "gsap";
import ReelEvent from "../events/ReelEvent.js";
import FastSoundManager from "../utils/FastSoundManager.js";
import BonusView from "./BonusView.js";
import GameUtils from "../utils/GameUtils.js";

export default class Reel extends Container
{
    constructor(baseModel)
    {
        super();
        super.on("added", this.onAdded);
       
        this.baseModel = baseModel;

		this.ticker = new PIXI.ticker.Ticker();
        this.symbolsCont = new Container();
        this.finalCont = new Container();
        this.sMask = new Graphics();
        this.isRunning = false;
        this.stopData = [];
        this.counter = 0;
        this.timerInterval = -1;
        this.cacheTime = 0;
		this.reelID = -1;
		this.nIndex = 0;
		this.nReelsArray = [];
		
		this.fillTimer = -1;
		this.fillIndex = 1;
    }

    onAdded(event)
    {
        super.removeListener("added", this.onAdded);

        this.addChild(this.symbolsCont);
        this.addChild(this.sMask);

		const reels = this.baseModel.initParams.reels[this.reelID];
		const nReels = this.baseModel.initParams.nReels[this.reelID];
		
        for (let i = 0; i < Config.MAX_SYMBOLS + 2; i++)
		{
			let symbol = new SymbolOnGame();
			if (i == 0) symbol.setStaticImage(nReels[0]);
			else if(i == Config.MAX_SYMBOLS + 1) symbol.setStaticImage(nReels[4]);
			else symbol.setStaticImage(reels[i - 1]);
			symbol.scale.set(Config.SYMBOL_SCALE);
			symbol.y = Math.floor(i * Config.SYMBOL_HEIGHT - Config.SYMBOL_HEIGHT);
			this.symbolsCont.addChild(symbol);
		}
	
		for (let i = 0; i < Config.MAX_SYMBOLS + 1; i++)
		{
			let symbol = new SymbolOnGame();
			if (i == 0) symbol.setStaticImage(nReels[0]);
			else symbol.setStaticImage(reels[i - 1]);
			symbol.scale.set(Config.SYMBOL_SCALE);
			symbol.y = Math.floor(i * Config.SYMBOL_HEIGHT - Config.SYMBOL_HEIGHT);
			this.finalCont.addChild(symbol);
        }
        
		this.sMask.beginFill(0);
		this.sMask.drawRect(0, 0, Config.SYMBOL_WIDTH, Config.SYMBOL_HEIGHT * Config.MAX_SYMBOLS);
		this.sMask.endFill();
		this.mask = this.sMask;
		
		this.ticker.autoStart = false;
		this.ticker.add(this.onFrame, this);
    }

    startTime(t)
	{
        clearTimeout(this.timerInterval);
		this.timerInterval = setTimeout(() => this.stop(), t);
	}
	
	stopTime()
	{
        clearTimeout(this.timerInterval);
	}
	
    startRoll()
	{
		if (this.isRunning) return;
		
		this.isRunning = true;

		this.nReelsArray = this.baseModel.spinParams.nReels[this.reelID];
		this.nIndex = 1;

		if(this.finalCont.parent != null) this.removeChild(this.finalCont);

		this.addChild(this.symbolsCont);
		
		this.destroyAnimation();
		
		this.symbolsCont.y = 0;
		
		for (let i = 0; i < Config.MAX_SYMBOLS + 2; i++) 
		{
			let symbol = this.symbolsCont.getChildAt(i);
			
			if (i == 0) symbol.setBlurImage(this.nReelsArray[0]);
			else if(i == Config.MAX_SYMBOLS + 1) symbol.setBlurImage(this.nReelsArray[4]);
			else if (this.stopData != null && i > 0) symbol.setBlurImage(this.stopData[i - 1]);
		}
		
        TweenMax.to(this.symbolsCont, 0.05, { y:-80, ease:Linear.easeNone, onComplete: ()=> this.ticker.start()});
    }
   
    onFrame(delta)
    {
        let a = 0;
		
		if (this.counter < 10)
		{
			a = this.counter * 3;
			this.counter++;
		}
		else a = 55;
		
		this.symbolsCont.y += (a * delta);
		
		if (this.symbolsCont.y < Config.SYMBOL_HEIGHT) return;
		
		this.symbolsCont.y = this.symbolsCont.y - Config.SYMBOL_HEIGHT;
        
		let lastSymbol = this.symbolsCont.getChildAt(Config.MAX_SYMBOLS);
       
        this.symbolsCont.addChildAt(lastSymbol, 0);
        
		lastSymbol.y = -lastSymbol.height;
		
		lastSymbol.setBlurImage(this.nReelsArray[this.nIndex]);

		this.nIndex++;

		if(this.nIndex == this.nReelsArray.length) this.nIndex = 0;
        
        for (let i = 1; i < Config.MAX_SYMBOLS + 1; i++)  this.symbolsCont.getChildAt(i).y += lastSymbol.height;
    }

    stop()
	{
		if (!this.isRunning) return;
		
		this.isRunning = false;
		
		this.stopTime();
		
		this.ticker.stop();

		this.addChild(this.finalCont);
		
		this.stopData = this.baseModel.spinParams.reels[this.reelID];
		
		this.finalCont.y = this.symbolsCont.y - this.finalCont.height;
		
		for (let i = 1; i < Config.MAX_SYMBOLS + 1; i++)
		{
			let symbol = this.finalCont.getChildAt(i);
			symbol.setStaticImage(this.stopData[i - 1]);
		}

		this.finalCont.getChildAt(0).setStaticImage(this.baseModel.spinParams.nReels[this.reelID][0]);
		
		TweenMax.to(this.symbolsCont, 0.3, { y: this.symbolsCont.height - Config.SYMBOL_HEIGHT, ease:Linear.easeNone});
		TweenMax.to(this.finalCont, 0.3, { y: 0, ease:Linear.easeNone, onComplete: ()=> this.preStop() });
		
		const xid = GameUtils.getTeasersArray(this.baseModel.spinParams.reels, this.reelID);
		if(xid == -1) FastSoundManager.playSound("reel_stop", false, 300);
		else FastSoundManager.playSound("teaser" + xid, false, 300);
		
		this.counter = 0;
	}
	
	preStop()
	{
        TweenMax.to(this.finalCont, 0.15, { y: 80, yoyo:true, repeat:1, ease:Linear.easeNone, onComplete:()=> this.finalStop() });
    }
	
	finalStop()
	{
		this.finalCont.y = 0;

		this.removeChild(this.symbolsCont);
		
		if(this.reelID == (Config.MAX_REELS - 1)) this.emit(ReelEvent.REEL_STOPPED);
	}
	
	animateInReel(id, useScatter = false)
	{
		for (let i = 1; i < this.finalCont.children.length; i++)
		{
			let symbol = this.finalCont.getChildAt(i);
			
			if (id + 1 == i) 
			{
				if(useScatter) symbol.setStaticImage(0);
				symbol.animate( -1, useScatter);
			}
			else symbol.blink();
		}
		
	}
	
	destroyAnimation()
	{
		for (let i = 0; i < this.finalCont.children.length; i++)
		{
			let symbol = this.finalCont.getChildAt(i);
			symbol.destroyFull();
		}
	}

	update()
	{
		for (let i = 0; i < this.finalCont.children.length; i++)
		{
			let symbol = this.finalCont.getChildAt(i);
			symbol.setStaticImage();
		}

		for (let i = 0; i < this.symbolsCont.children.length; i++)
		{
			let symbol = this.symbolsCont.getChildAt(i);
			symbol.setStaticImage();
		}
	}


	fill()
	{
		this.fillIndex = 1;
		this.fillTimer = setInterval( ()=> this.onFillTime(), 300);
		this.onFillTime(null);
	}
	
	onFillTime() 
	{
		let symbol = this.finalCont.getChildAt(this.fillIndex);
		
		if (symbol.id == BonusView.bonusSymbol) 
		{
			this.fillIndex++;
			
			if (this.fillIndex == 4) 
			{
				clearInterval(this.fillTimer);
				this.emit(ReelEvent.FILLED, this.reelID);
				return;
			}
			
			this.onFillTime(null);
			return;
		}
		
		FastSoundManager.playSound("f_took");
		symbol.setStaticImage(BonusView.bonusSymbol);
		
		this.fillIndex++;

		if (this.fillIndex == 4) 
		{
			clearInterval(this.fillTimer);
			setTimeout( () => this.emit(ReelEvent.FILLED), 300);
		}
	}
}