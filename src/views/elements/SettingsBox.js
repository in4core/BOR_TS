import { Container, Graphics, Text } from "pixi.js";
import CheckBox from "./CheckBox";
import HUDEvents from "../../events/HUDEvents";
import SettingsView from "../SettingsView";
import FastSoundManager from "../../utils/FastSoundManager";
import Config from "../../utils/Config";

export default class SettingsBox extends Container
{
    constructor()
    {
        super();
        super.on("added", this.onAdded);

        this.contText1 = new Text('LEFT HAND MODE', Config.TEXT_STYLES.mobileCheckBoxValue);
        this.contText2 = new Text('GAME SOUNDS', Config.TEXT_STYLES.mobileCheckBoxValue);
        this.contText3 = new Text('QUICK SPIN', Config.TEXT_STYLES.mobileCheckBoxValue);
        this.line = new Graphics();
		
        this.checkBoxHand = new CheckBox();
        this.checkBoxSounds = new CheckBox();
        this.checkBoxQuick = new CheckBox();
    }

    onAdded(e)
    {
        super.removeListener("added", this.onAdded);

		this.addChild(this.line);
		this.addChild(this.contText1);
		this.addChild(this.contText2);
		this.addChild(this.contText3);
		this.addChild(this.checkBoxHand);
		this.addChild(this.checkBoxSounds);
		this.addChild(this.checkBoxQuick);

        this.line.beginFill(0x999999);
		this.line.drawRect(0, 0, 500, 3);
		this.line.drawRect(0, 300, 500, 3);
		
		this.checkBoxSounds.select();
		
		this.checkBoxSounds.on(HUDEvents.CHECK_BOX_CHANGE, this.onChangeSounds, this);
		this.checkBoxQuick.on(HUDEvents.CHECK_BOX_CHANGE, this.onChangeQuick, this);
		this.checkBoxHand.on(HUDEvents.CHECK_BOX_CHANGE, this.onChangeHandMode, this);
    }

    getHandMode()
	{
		if (this.checkBoxHand.isSelected) return "left";
		return "right";
	}
	
	onChangeHandMode(e) 
	{
		this.emit(HUDEvents.CHANGE_HAND_MODE);
	}
	
	onChangeQuick(e) 
	{
		if (this.checkBoxQuick.isSelected) SettingsView.useQuickSpin = true;
		else SettingsView.useQuickSpin = false;
		
		this.emit(HUDEvents.SET_MOBILE_QUICK);
	}
	
	onChangeSounds(e) 
	{
		if (this.checkBoxSounds.isSelected) FastSoundManager.setGlobalVolume(1);
		else FastSoundManager.setGlobalVolume(0);
    }
    
    selectQuick()
	{
		this.checkBoxQuick.select();
	}
	
	deselectQuick()
	{
		this.checkBoxQuick.deselect();
    }
    
    resizeLandscape()
	{
		this.checkBoxHand.x = Config.MAX_WIDTH - this.checkBoxHand.width - 400; 
		this.checkBoxSounds.x = Config.MAX_WIDTH - this.checkBoxSounds.width - 400; 
		this.checkBoxQuick.x = Config.MAX_WIDTH - this.checkBoxSounds.width - 400; 
		
		this.contText1.y = 120;
		this.contText2.y = 420;
		this.contText3.y = 720;
		this.line.y = 300;
		
		this.checkBoxHand.y = this.contText1.y - 35;
		this.checkBoxSounds.y = this.contText2.y - 35;
		this.checkBoxQuick.y = this.contText3.y - 35;
		
		this.line.width = Config.MAX_WIDTH - 400;
		this.line.x = this.contText1.x;
	}
}