import { Container, Graphics } from "pixi.js";
import ElementBox from "./ElementBox";
import HUDModelEvent from "../../events/HUDModelEvent";
import HUDEvents from "../../events/HUDEvents";
import BaseModel from "../../models/BaseModel";

export default class BetsBox extends Container
{
    private _baseModel = null;
    private _box = new ElementBox("BET", "bets");
    private _betRedLine = new Graphics();

    constructor(baseModel:BaseModel)
    {
        super();
        super.on("added", this.onAdded);

        this._baseModel = baseModel;
    }

    private onAdded(e):void
    {
        super.removeListener("added", this.onAdded);

        this.addChild(this._box);
        this.addChild(this._betRedLine);

        this._box.y = 250;
        
        this._betRedLine.beginFill(0xff0000);
        this._betRedLine.drawRect(0, 0, this._box.width, 10);
        this._betRedLine.y = this._box.y;

        this._box.on(HUDEvents.ELEMENT_BOX_UP, this.onUpBoxA, this);
        this._box.on(HUDEvents.ELEMENT_BOX_DOWN, this.onDownBoxA, this);
        this._baseModel.hudModel.on(HUDModelEvent.CHANGE, this.onChangeHUDValues, this);
        
        this.onChangeHUDValues();
    }

    private onUpBoxA()
    {
        this._baseModel.hudModel.plusBetLevel();
    }
    
    private onDownBoxA()
    {
        this._baseModel.hudModel.minusBetLevel();
    }

    private onChangeHUDValues() 
	{
        let locker:Array<boolean> = this._baseModel.hudModel.getLocker();
		
		if (this._box.type == "bets")
		{
			this._box.setContentText(this._baseModel.hudModel.getMainBet());
			
            if (locker[0]) this._box.lockPlus();
            else this._box.unlockPlus();
            
            if (locker[1]) this._box.lockMinus();
            else this._box.unlockMinus();

            this._betRedLine.width = this._box.width * ((this._baseModel.hudModel.betsIndex + 1) / this._baseModel.hudModel.bets.length);
		}
    }
    
    public resizeLandscape():void
	{
		
	}
}