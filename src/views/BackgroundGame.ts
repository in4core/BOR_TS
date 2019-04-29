import {Container, Sprite} from "pixi.js";
import Assets from "../controllers/Assets";
import BaseModel from "../models/BaseModel";


export default class BackgroundGame extends Container
{
	private _normalTexture = new Sprite(Assets.getSource("backNormal"));
	private _freespinTexture = new Sprite(Assets.getSource("backFree"));
	private _logo = new Sprite(Assets.getSource("logo"));
		
    constructor()
    {
        super();
        super.on("added", this.onAdded);
    }

    private onAdded(e):void
    {
        super.removeListener("added", this.onAdded);

		this.addChild(this._logo);
		
		this._freespinTexture.cacheAsBitmap = this._normalTexture.cacheAsBitmap = true;
		
		this.resizeLandscape();
    }

    public resizePortrait(ratio):void
	{
		
    }
    
    public resizeLandscape():void
	{
		if (BaseModel.isFreespinsGame) this.toFS();
		else this.toNormal();
			
		this._logo.x = Math.floor(this._normalTexture.width / 2 - this._logo.width / 2);
		this._logo.y = 0;
    }
    
    public toFS():void
	{
		if(this._normalTexture.parent != null) this.removeChild(this._normalTexture);
        this.addChildAt(this._freespinTexture, 0);
	}
	
	public toNormal():void
	{
		if(this._freespinTexture.parent != null) this.removeChild(this._freespinTexture);
        this.addChildAt(this._normalTexture, 0);
		
	}
}