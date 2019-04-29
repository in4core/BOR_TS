import { Container, Text, Graphics, Sprite } from "pixi.js";
import BaseButton from "./elements/BaseButton";
import Config from "../utils/Config";
import HUDEvents from "../events/HUDEvents";
import SettingsBox from "./elements/SettingsBox";
import BetsBox from "./elements/BetsBox";
import PaytableViewMobile from "./elements/PaytableViewMobile";

export default class SettingsViewMobile extends Container
{
    constructor(baseModel)
    {
        super();
		super.on("added", this.onAdded);
		
        this.baseModel = baseModel;
	    this.header = new Text('PAYTABLE', Config.TEXT_STYLES.mobileMenuHeadersText);
	
        this.closeBtnM = new BaseButton();
        this.betsBtnM = new BaseButton();
        this.paysBtnM = new BaseButton();
        this.settBtnM = new BaseButton();
        
        this.bask = new Graphics();
        this.content = new Container();
        this.maskCont = new Graphics();
        this.btnCont = new Container();
        this.sideGraphics = new Graphics();
        
        this.paytable = new PaytableViewMobile(baseModel);
        this.betsBox = new BetsBox(baseModel);
        this.settingsBox = new SettingsBox(baseModel);
        
		this.panelWidth = 210;
		this.startYP = 0;
    }

    onAdded(event)
    {
        super.removeListener("added", this.onAdded);

        this.addChild(this.bask);
		this.addChild(this.sideGraphics);
		this.addChild(this.content);
		this.addChild(this.maskCont);
		this.addChild(this.header);
		this.addChild(this.btnCont);
        this.addChild(this.closeBtnM);
        
        this.bask.interactive = true;
		
		this.content.addChild(this.paytable);
		this.content.addChild(this.betsBox);
		this.content.addChild(this.settingsBox);
		
		this.btnCont.addChild(this.betsBtnM);
		this.btnCont.addChild(this.paysBtnM);
		this.btnCont.addChild(this.settBtnM);

		this.maskCont.beginFill(0xFF0000);
		this.maskCont.drawRect(0, 0, Config.MAX_WIDTH, Config.MAX_HEIGHT);
		
		this.closeBtnM.init(["icn_close", "icn_close", "icn_close", "icn_close"]);
		this.betsBtnM.init(["icn_bet_normal", "icn_bet_normal", "icn_bet_normal", "icn_bet_active"]);
		this.paysBtnM.init(["icn_paytable_normal", "icn_paytable_normal", "icn_paytable_normal", "icn_paytable_active"]);
		this.settBtnM.init(["icn_settings_normal", "icn_settings_normal", "icn_settings_normal", "icn_settings_active"]);
		
		this.paysBtnM.x = this.betsBtnM.width + 150;
		this.settBtnM.x = this.paysBtnM.x + this.betsBtnM.width + 150;
		
		this.paysBtnM.y = this.betsBtnM.height / 2 - this.paysBtnM.height / 2;
		
		this.bask.beginFill(0x111111);
		this.bask.drawRect(0, 0, Config.MAX_WIDTH, Config.MAX_HEIGHT);
        this.bask.endFill();
        
		this.sideGraphics.beginFill(0x0, 1);
        this.sideGraphics.drawRect(0, 0, this.panelWidth,  Config.MAX_HEIGHT);
        this.sideGraphics.endFill();
		
		this.content.mask = this.maskCont;

		this.betsBox.visible = false;
        this.settingsBox.visible = false;
		
		this.header.anchor.set(0.5, 0);
        this.header.x = 1030;
		this.header.y = 50;
		
		this.betsBox.x = 350;
		this.betsBox.y = 0;
		this.paytable.x = -80;
		this.paytable.y = 0;
		
		this.settingsBox.on(HUDEvents.CHANGE_HAND_MODE, this.onChangeHandMode, this);
		this.settingsBox.on(HUDEvents.SET_MOBILE_QUICK, this.onSetMobileQuick, this);
		
		this.closeBtnM.on("pointertap", this.closeMobileSettings, this);
		this.betsBtnM.on("pointertap", this.showBetsBox, this);
		this.paysBtnM.on("pointertap", this.showPaytable, this);
		this.settBtnM.on("pointertap", this.showSettingsBox, this);

		this.bask.on("pointerdown", this.startScrollPaytable, this);
		this.bask.on("pointerup", this.stopScrollPaytable, this);
		this.bask.on("pointerupoutside", this.stopScrollPaytable, this);

		this.paysBtnM.disable();
	}

	onSetMobileQuick()
	{
		this.emit(HUDEvents.SET_MOBILE_QUICK);
	}

	selectQuick()
	{
		this.settingsBox.selectQuick();
	}
	
	deselectQuick()
	{
		this.settingsBox.deselectQuick();
	}

	stopScrollPaytable(e)
	{
		this.bask.off("pointermove", this.moveScrollPaytable, this);
	}

	moveScrollPaytable(e)
	{
		this.content.y = e.data.getLocalPosition(this.content.parent).y - this.startYP;

		if(this.content.y > this.maskCont.y) this.content.y = this.maskCont.y;

		else if(this.content.y < this.maskCont.y - this.content.height + this.maskCont.height) 
		{
			this.content.y = this.maskCont.y - this.content.height + this.maskCont.height;
		}
		
	}
	startScrollPaytable(e)
	{
		if(!this.paytable.visible) return;

		this.startYP = e.data.getLocalPosition(this.content.parent).y - this.content.y;
		this.bask.on("pointermove", this.moveScrollPaytable, this);
	}

	openBets()
	{
		this.betsBtnM.emit("pointertap");
	}

	showBetsBox(e) 
	{
		this.paytable.visible = false;
		this.betsBox.visible = true;
		this.settingsBox.visible = false;
		this.content.y = this.maskCont.y;
		this.header.text = "BET SETTINGS";
		this.paysBtnM.enable();
		this.settBtnM.enable();
		this.betsBtnM.disable();
	}
	
	showPaytable(e) 
	{
		this.paytable.visible = true;
		this.betsBox.visible = false;
		this.settingsBox.visible = false;
		this.content.y = this.maskCont.y;
		this.header.text = "PAYTABLE";
		this.paysBtnM.disable();
		this.settBtnM.enable();
		this.betsBtnM.enable();
	}
	
	showSettingsBox(e) 
	{
		this.paytable.visible = false;
		this.betsBox.visible = false;
		this.settingsBox.visible = true;
		this.content.y = this.maskCont.y;
		this.header.text = "GAME SETTINGS";
		this.paysBtnM.enable();
		this.settBtnM.disable();
		this.betsBtnM.enable();
	}
	
	closeMobileSettings()
	{
		this.emit(HUDEvents.SHOW_MOBILE_SETTINGS);
	}

	onChangeHandMode(e) 
	{
		if (this.settingsBox.getHandMode() == "left")
		{
			this.closeBtnM.x = Config.MAX_WIDTH - this.panelWidth / 2 - this.closeBtnM.width / 2;
			this.sideGraphics.x = Config.MAX_WIDTH - this.sideGraphics.width;
			this.btnCont.x = Config.MAX_WIDTH - this.panelWidth;
			this.content.x = 100;
			this.maskCont.x = 0;
			this.header.x = 1030 - this.panelWidth;
			SettingsViewMobile.handMode = "left";
		}
		else
		{
			this.sideGraphics.x = 0;
			this.btnCont.x = 0;
			this.content.x = this.panelWidth + 100;
			this.maskCont.x = this.panelWidth;
			this.header.x = 1030;
			this.closeBtnM.x = this.panelWidth / 2 - this.closeBtnM.width / 2;
			SettingsViewMobile.handMode = "right";
		}

		this.emit(HUDEvents.CHANGE_HAND_MODE);
	}

    resizeLandscape()
	{
		this.closeBtnM.y = Config.MAX_HEIGHT - 200;
		this.closeBtnM.x = this.panelWidth / 2 - this.closeBtnM.width / 2;
		
		this.settBtnM.y = (Config.MAX_HEIGHT - 35) / 2 - 200 - this.settBtnM.height;
		this.settBtnM.x = this.panelWidth / 2 - this.settBtnM.width / 2;
		
		this.paysBtnM.y = (Config.MAX_HEIGHT - 35) / 2 + 200;
		this.paysBtnM.x = this.panelWidth / 2 - this.paysBtnM.width / 2;
		
		this.betsBtnM.scale.set(0.7);
		this.betsBtnM.y = (Config.MAX_HEIGHT - 35) / 2 - this.betsBtnM.height / 2 + 28;
		this.betsBtnM.x = this.panelWidth / 2 - this.betsBtnM.width / 2 + 28;
		
		this.maskCont.x = this.panelWidth;
		this.maskCont.y = 150;
		this.maskCont.width = Config.MAX_WIDTH - this.panelWidth;
		this.maskCont.height = Config.MAX_HEIGHT - this.maskCont.y;
		
		this.content.x = this.panelWidth + 100;
		this.content.y = this.maskCont.y;
		
		this.betsBox.resizeLandscape();
		this.settingsBox.resizeLandscape();
		this.paytable.resizeLandscape();
	}


}

SettingsViewMobile.handMode = "right";