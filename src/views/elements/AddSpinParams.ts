import { Container, Sprite } from "pixi.js";
import BaseButton from "./BaseButton";
import Assets from "../../controllers/Assets";
import { TweenMax, Linear } from "gsap";
import HUDEvents from "../../events/HUDEvents";

export default class AddSpinParams extends Container
{
	private _maskFor = new Sprite(Assets.getSource("btn_advanced_bg_open2"));
	private _slider = new Sprite(Assets.getSource("btn_advanced_bg_open"));
	private _spinAdv = new BaseButton();
	private _closeBtn = new BaseButton();
	private _autoBtn = new BaseButton();
	private _quickBtn = new BaseButton();

    constructor()
    {
        super();
		super.on("added", this.onAdded);
    }

    private onAdded(e):void
    {
        super.removeListener("added", this.onAdded);

		this.addChild(this._slider);
		this.addChild(this._maskFor);
		
		this._slider.addChild(this._closeBtn);
		this._slider.addChild(this._quickBtn);
		this._slider.addChild(this._autoBtn);
		this._slider.addChild(this._spinAdv);
		
        this._spinAdv.init(["icn_advanced_open2", "icn_advanced_open2", "icn_advanced_open2", "icn_advanced_open2"]);
		this._closeBtn.init(["icn_advanced_close2", "icn_advanced_close2", "icn_advanced_close2", "icn_advanced_close2"]);
		this._quickBtn.init(["icn_advanced_quickspin_normal", "icn_advanced_quickspin_normal", "icn_advanced_quickspin_on", "icn_advanced_quickspin_normal"]);
        this._autoBtn.init(["icn_advanced_autoplay", "icn_advanced_autoplay", "icn_advanced_autoplay_on", "icn_advanced_autoplay"]);
        
		this._maskFor.x = -this._maskFor.width + 170;
		this._quickBtn.x = 180;
		this._autoBtn.x = 380;
		this._quickBtn.y = this._slider.height / 2 - this._quickBtn.height / 2;
		this._autoBtn.y = this._slider.height / 2 - this._autoBtn.height / 2;

		this._closeBtn.visible = false;
		this._slider.mask = this._maskFor;

		this._spinAdv.on("pointertap", this.onOpen, this);
		this._closeBtn.on("pointertap", this.onClose, this);
		this._quickBtn.on("pointertap", this.onClickQuick, this);
		this._autoBtn.on("pointertap", this.onClickAuto, this);

		this._maskFor.cacheAsBitmap = true;
    }

    private onClickAuto():void 
	{
		this.emit(HUDEvents.SET_MOBILE_AUTO);
	}
	
	private onClickQuick():void 
	{
		this.emit(HUDEvents.SET_MOBILE_QUICK);
	}
	
	private onClose():void 
	{
		this._closeBtn.visible = false;
		this._spinAdv.visible = true;
		
		TweenMax.to(this._slider, 0.2, { x: 0, ease:Linear.easeNone});
	}
	
	private onOpen():void 
	{
		this._spinAdv.visible = false;
		this._closeBtn.visible = true;
		this._slider.x = -100;
		
		TweenMax.to(this._slider, 0.2, { x: -this._slider.width + 170, ease:Linear.easeNone });
	}

	public selectQuick():void
	{
		this._quickBtn.makeOnlyOver();
	}
	
	public deselectQuick():void
	{
		this._quickBtn.enable();
	}

	public selectAuto():void
	{
		this._autoBtn.makeOnlyOver();
	}
	
	public deselectAuto():void
	{
		this._autoBtn.enable();
	}
	
	public hide():void
	{
		this.onClose();
	}
}