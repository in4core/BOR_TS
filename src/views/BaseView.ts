import {Container} from "pixi.js";
import BackgroundGame from "../views/BackgroundGame";
import ReelsView from "../views/ReelsView";
import LinesView from "./LinesView";
import HUDView from "./HUDView";
import Config from "../utils/Config";
import BonusView from "./BonusView";
import RotateView from "./elements/RotateView";
import PaytableView from "./PaytableView";
import HUDEvents from "../events/HUDEvents";
import ReelEvent from "../events/ReelEvent";
import FastSoundManager from "../utils/FastSoundManager";
import LinesEvent from "../events/LinesEvent";
import Utility from "../utils/Utility";
import BaseModel from "../models/BaseModel";

export default class BaseView extends Container
{
    private _backgroundGame:BackgroundGame = new BackgroundGame();
    private _reelsView:any = null;
    private _linesView:any = null;
    private _hudView:any = null;
    private _paytableView:any = null;
    private _bonusView:any = null;
	private _rotateView:any = null;
	private _baseModel:BaseModel = null;
		
    constructor(baseModel:BaseModel)
    {
        super();
		super.on("added", this.onAdded);
		
		this._baseModel = baseModel;
    }

    private onAdded(e):void
    {
        super.removeListener("added", this.onAdded);
        
        this.addChild(this._backgroundGame);
        this.addChild(this._reelsView);
		this.addChild(this._linesView);
		
		if(!Utility.isMobilePlatform()) this.addChild(this._paytableView);
		
		this.addChild(this._hudView);
        
		this._paytableView.visible = false;

        this._reelsView.x = 245;
        this._reelsView.y = 105;
        
        this._linesView.y = this._reelsView.y;
		this._linesView.x = 195;
		
		this._bonusView.x = Config.MAX_WIDTH / 2 - this._bonusView.width / 2;
		this._bonusView.y = Config.MAX_HEIGHT / 2 - this._bonusView.height / 2 - 50;

        this._hudView.setView.on(HUDEvents.SHOW_PAYTABLE, this.showPaytable, this);
        this._hudView.on(HUDEvents.SPIN_BUTTON, this.spinButtonHandler, this);
        this._hudView.on(HUDEvents.STOP_BUTTON, this.fasterStopButtonHandler, this);
		this._hudView.on(HUDEvents.AUTO_BUTTON, this.autoButtonHandler, this);
		
		this._linesView.on(LinesEvent.NEXT_LINE, this.onNextLine, this);
		this._linesView.on(LinesEvent.LINES_COMPLETED, this.onLinesCompletedSound, this);
		this._linesView.on(LinesEvent.LINES_COMPLETED_SPECIAL, this.onLinesCompletedSoundSpecial, this);
		
		this._reelsView.on(ReelEvent.REEL_STOPPED, this.onReelsStopped, this);
		this._reelsView.on(ReelEvent.SCATTERS_SHOWN, this.onScattersShown, this);
		this._reelsView.on(ReelEvent.FILLED_COMPLETE, this.onReelsFilledComplete, this);

		this._bonusView.on("start_bonus_complete", this.onBonusStartCompleted, this);
		this._bonusView.on("end_bonus_complete", this.onBonusEndCompleted, this);
	}

	public reloadSession():void
	{
		this._hudView.lockSpin();
		this._hudView.updateFSCount();
		
		if(this._baseModel.gameFeature == BaseModel.FEATURE_FS)
		{
			BaseModel.isFreespinsGame = true;
			BonusView.bonusSymbol = this._baseModel.specialElement;
			
			this._hudView.toFS();
			this._backgroundGame.toFS();
			this._reelsView.setBonusField();
			
			FastSoundManager.playSound("f_loop", true);
		}
		
		setTimeout(() => this.spinButtonHandler(), 2000);
	}
	
	private onLinesCompletedSoundSpecial():void
	{
		if (this._baseModel.isScatters)
		{
			this._reelsView.showScatterAnimation();
			this._linesView.clear();
			this._linesView.disableDotLines();
			return;
		}
		
		BaseModel.gameState = 0;
		
		if (BaseModel.isFreespinsGame && this._baseModel.freeSpinsCount == 0) 
		{
			this._linesView.clear();
			this.endBonus();
			return;
		}
		
		this.spinButtonHandler();
	}

	private onBonusStartCompleted():void
	{
		BaseModel.isFreespinsGame = true;
		
		this._hudView.toFS();
		this._backgroundGame.toFS();
		this._hudView.updateFSCount();
		
		setTimeout(() => this.startBonus(), 2000);
	}

	private startBonus():void
	{
		BaseModel.gameState = 0;

		this._bonusView.destroyBonus();
		this.removeChild(this._bonusView);
		this.spinButtonHandler();
	}

	private onBonusEndCompleted():void
	{
		BaseModel.isFreespinsGame = false;
		BaseModel.gameState = 0;
		
		this.removeChild(this._bonusView);
		this._hudView.stopWinCount();
		this._hudView.toNormal();
		this._hudView.unlockAllHUD();
		this._backgroundGame.toNormal();
		//this._reelsView.destroyAnimation();
		//this._linesView.clear();
		this._linesView.enableDotLines();
		
		this.emit(HUDEvents.UPDATE_BALANCE);
	}

	private onScattersShown():void
	{
		this._hudView.clearWinCount();
		this._hudView.updateFSCount();
		
		BonusView.bonusSymbol = this._baseModel.specialElement;
		
		this.addChildAt(this._bonusView, 3);

		this._bonusView.startBonus(BaseModel.isFreespinsGame, this._baseModel.spinTotalSG);
		
		BaseModel.isFreespinsGame = true;
		FastSoundManager.playSound("f_loop", true);
	}

	private endBonus():void
	{
		this._hudView.updateFSCount();
		this.addChildAt(this._bonusView, 3);

		this._bonusView.endBonus(this._baseModel.freespinsWonString, this._baseModel.freespinsWithoutSGPlayed, this._baseModel.sgTotalPlayed);

		FastSoundManager.stopSound("f_loop");
	}

	private onReelsFilledComplete():void
	{
		this._linesView.clear();
		this._reelsView.destroyAnimation();
		this._linesView.startShowWinLines(true);
	}

	private onLinesCompletedSound(e):void
	{
		if(BaseModel.isFreespinsGame && this._baseModel.spinTotalSG != 0 && !e)
		{
			this._hudView.showSGOnce();
			setTimeout( ()=> this.onLinesCompletedSound(true), 3000);
			return;
		}
		
		if (BaseModel.gameState == 3)
		{
			if(!this._baseModel.isFreeSpins) this.emit(HUDEvents.UPDATE_BALANCE);
			
			if (BaseModel.isFreespinsGame && this._baseModel.isSpecial)
			{
				this._linesView.clear();
				this._reelsView.destroyAnimation();
				this._reelsView.computeSpecial();
				return;
			}
			else if (this._baseModel.isScatters)
			{
				this._reelsView.showScatterAnimation();
				this._linesView.clear();
				this._linesView.disableDotLines();
				return;
			}
			
			else if (BaseModel.isFreespinsGame)
			{
				BaseModel.gameState = 0;
				
				if (this._baseModel.freeSpinsCount == 0) 
				{
					this.endBonus();
					return;
				}
				
				this.spinButtonHandler();
				return;
			}
			if (this._baseModel.gameFeature == BaseModel.FEATURE_SG)
			{
				BaseModel.gameState = 0;
				this.spinButtonHandler();
				return;
			}
			
			BaseModel.gameState = 0;
			
			this._hudView.unlockAllHUD();
			this.autoButtonHandler(null);
		}
	}
	
	private onNextLine(index, fromFill):void
	{
		if(fromFill) this._hudView.addWonSpecial();
		
		else this._reelsView.showOneCombination(index);
	}

    private onReelsStopped(e):void
    {
		FastSoundManager.stopSound("reel_run");

		if (this._baseModel.gameFeature == BaseModel.FEATURE_SG)
		{
			this._hudView.lockSpin();
			this._hudView.updateFSCount(false);
		}

        if (this._baseModel.isScatters) 
		{
			this._hudView.lockSpin();
			this._hudView.removeAutoPlay();
		}
		
		if (this._baseModel.isLines)
		{
			BaseModel.gameState = 3;
			
			this._linesView.startShowWinLines();
			this._hudView.startWinCount();
		}
		else if (this._baseModel.isSpecial)
		{
			this._linesView.clear();
			this._reelsView.destroyAnimation();
			this._reelsView.computeSpecial();
		}
		else if (this._baseModel.isScatters)
		{
            BaseModel.gameState = 3;
            
			this._reelsView.showScatterAnimation();
			this._hudView.startWinCount();
			this._linesView.clear();
			this._linesView.disableDotLines();
		}
		else
		{
			BaseModel.gameState = 0;
			
			if (BaseModel.isFreespinsGame)
			{
				if (this._baseModel.freeSpinsCount == 0) 
				{
					this.endBonus();
					return;
				}
                
                this.spinButtonHandler();
				return;
			}

			if (this._baseModel.gameFeature == BaseModel.FEATURE_SG)
			{
				this.spinButtonHandler();
				return;
			}

			this.emit(HUDEvents.UPDATE_BALANCE);
			
			this._linesView.enableDotLines();
			this._hudView.unlockAllHUD();
			
			if (this._hudView.isAutoPlay && !this._baseModel.hudModel.isNoBalance) this.spinButtonHandler();
			else if(this._baseModel.hudModel.isNoBalance) this._hudView.removeAutoPlay();
		}
    }

    private showPaytable(e):void
    {
		if(this._paytableView.visible) this._paytableView.hide();
		this._paytableView.show();
    }

    private autoButtonHandler(e):void
	{
		if (this._hudView.isAutoPlay && !this._baseModel.hudModel.isNoBalance && BaseModel.gameState == 0) this.spinButtonHandler();
	}

    private fasterStopButtonHandler(e):void
	{
		this._reelsView.useFaster = true;
		
		if (this._baseModel.isSpinDataRecived && BaseModel.gameState == 1) 
		{
			BaseModel.gameState = 2;
			this._reelsView.stopSpin();
		}
		else if (BaseModel.gameState == 3)
		{
			BaseModel.gameState = 0;
			
			this.emit(HUDEvents.UPDATE_BALANCE);
			
			this._linesView.clear();
			this._linesView.enableDotLines();
			this._hudView.clearWinCount();
			this._reelsView.destroyAnimation();
			this._hudView.unlockAllHUD();
			
			this.autoButtonHandler(null);
		}
	}

    private spinButtonHandler():void 
	{
		BaseModel.gameState = 1;
		
		this._hudView.lockHUDSpin();
		this._hudView.stopWinCount();
		this._linesView.clear();
		this._linesView.disableDotLines();
		this._reelsView.startSpin();
		
		if (BaseModel.isFreespinsGame || this._baseModel.gameFeature == BaseModel.FEATURE_SG) this._hudView.updateFSCount(true);
		
		if (this._paytableView.visible) this._paytableView.hide();

		if(!BaseModel.isFreespinsGame) FastSoundManager.playSound("reel_run", true);
		
		this.emit(HUDEvents.UPDATE_BALANCE);
		this.emit(HUDEvents.SPIN);
    }
    
    public spinDataAdded():void
	{
		this._reelsView.stopSpin();
	}

    public onResizeDesktop():void
    {
        this._hudView.setDeviceView("desktop");
    }

    public onResizePortrait():void
    {
		this._hudView.setDeviceView("portrait");
		this.addChild(this._rotateView);
		this._rotateView.clear();
		this._rotateView.resizePortrait();
    }

    public onResizeLandscape():void
    {
        this._hudView.setDeviceView("landscape");
		
		this._backgroundGame.resizeLandscape();
				
		this._reelsView.x = 245;
        this._reelsView.y = 105;
        
        this._linesView.y = this._reelsView.y;
        this._linesView.x = 195;
		
		this._bonusView.x = Config.MAX_WIDTH / 2 - this._bonusView.width / 2;
		this._bonusView.y = Config.MAX_HEIGHT / 2 - this._bonusView.height / 2 - 50;
		
		if(this._rotateView.parent != null) 
		{
			this._rotateView.clear();
			this.removeChild(this._rotateView);
		}
    }
}
