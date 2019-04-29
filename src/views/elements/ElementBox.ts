import { Container, Graphics, Text } from "pixi.js";
import BaseButton from "./BaseButton";
import HUDEvents from "../../events/HUDEvents";
import Config from "../../utils/Config";

export default class ElementBox extends Container
{
		private _back = new Graphics();
        private _minusLevelButton = new BaseButton();
        private _plusLevelButton = new BaseButton();
       
        private _contText = new Text('', Config.TEXT_STYLES.mobileElementBoxValue);
		private _headText = new Text('', Config.TEXT_STYLES.mobileElementBoxHeader);
		
		private _type:string = "";

    constructor(head:string, type:string)
    {
        super();
        super.on("added", this.onAdded);

		this._type = type;
		this._headText.text = head;
	}
	
	public get type():string
	{
		return this._type;
	}

    private onAdded():void
    {
        super.removeListener("added", this.onAdded);

		this.addChild(this._back);
		this.addChild(this._minusLevelButton);
		this.addChild(this._plusLevelButton);
		this.addChild(this._contText);
		this.addChild(this._headText);

        this._back.beginFill(0x666666);
		this._back.drawRect(0, 0, 730, 300);
		this._back.beginFill(0);
		this._back.drawRect(2, 2, 726, 296);
        
		this._headText.anchor.set(0.5, 0);
		this._contText.anchor.set(0.5, 0);
		
		this._minusLevelButton.init(["btn_minus", "btn_minus", "btn_minus", "btn_minus"]);
		this._plusLevelButton.init(["btn_plus", "btn_plus", "btn_plus", "btn_plus"]);

		this._headText.y = 70;
		this._headText.x = this._back.width / 2;
		this._contText.x = this._back.width / 2;
		
		this._minusLevelButton.x = 50;
		this._plusLevelButton.x = this._back.width - this._plusLevelButton.width - 50;
		
		this._minusLevelButton.y = this._plusLevelButton.y = this._back.height / 2 - this._minusLevelButton.height / 2 + 50;
		this._contText.y = this._minusLevelButton.y + 5;
		
		this._minusLevelButton.on("pointertap", this.downChange, this);
		this._plusLevelButton.on("pointertap", this.upChange, this);
	}
	
	public setContentText(t:string):void
	{
		this._contText.text = t;
	}

    upChange():void
	{
		this.emit(HUDEvents.ELEMENT_BOX_UP);
	}
	
	downChange():void 
	{
		this.emit(HUDEvents.ELEMENT_BOX_DOWN);
	}

	public lockMinus():void
	{
		this._minusLevelButton.disable();
	}

	public lockPlus():void
	{
		this._plusLevelButton.disable();
	}

	public unlockMinus():void
	{
		this._minusLevelButton.enable();
	}

	public unlockPlus():void
	{
		this._plusLevelButton.enable();
	}
}