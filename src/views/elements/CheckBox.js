import { Container } from "pixi.js";
import BaseButton from "./BaseButton";
import HUDEvents from "../../events/HUDEvents";

export default class CheckBox extends Container
{
    constructor()
    {
        super();
        super.on("added", this.onAdded);

        this.offBtn = new BaseButton();
        this.onBtn = new BaseButton();
        this.isSelected = false;
    }

    onAdded(e)
    {
        super.removeListener("added", this.onAdded);
		
		this.addChild(this.offBtn);
		this.addChild(this.onBtn);
		
        this.offBtn.init(["check_off", "check_off", "check_off", "check_off"]);
		this.onBtn.init(["check_on", "check_on", "check_on", "check_on"]);
		
		this.buttonMode = this.interactive = true;
		this.onBtn.visible = false;

		this.on("pointertap", this.onClick);
    }

    onClick()
    {
        if (this.offBtn.visible) 
		{
			this.onBtn.visible = true;
			this.offBtn.visible = false;
			this.isSelected = true;
		}
		else
		{
			this.onBtn.visible = false;
			this.offBtn.visible = true;
			this.isSelected = false;
		}
		
		this.emit(HUDEvents.CHECK_BOX_CHANGE);
    }

    select()
	{
		this.onBtn.visible = true;
		this.offBtn.visible = false;
		this.isSelected = true;
	}
	
	deselect()
	{
		this.onBtn.visible = false;
		this.offBtn.visible = true;
		this.isSelected = false;
	}
}