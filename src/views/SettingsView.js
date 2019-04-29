import { Container, Sprite } from "pixi.js";
import Assets from "../controllers/Assets";
import BaseButton from "./elements/BaseButton";
import { TweenMax } from "gsap";
import Config from "../utils/Config";
import HUDEvents from "../events/HUDEvents";
import FastSoundManager from "../utils/FastSoundManager";
import Utility from "../utils/Utility";

export default class SettingsView extends Container
{
    constructor()
    {
        super();
        super.on("added", this.onAdded);

		this.back = new Sprite(Assets.getSource("dm_panel"));
        this.menuBtn = new BaseButton();
        this.homeBtn = new BaseButton();
        this.soundBtn1 = new BaseButton();
        this.soundBtn2 = new BaseButton();
        this.paysBtn = new BaseButton();
        this.closeBtn = new BaseButton();
        this.quickBtn = new BaseButton();
        this.fullBtn = new BaseButton();
		this.menu = new Container();
		
		this.isMenuOpen = false;
		this.delayFreeze = -1;
    }

    onAdded(event)
    {
        super.removeListener("added", this.onAdded);

        this.addChild(this.menu);
		this.addChild(this.menuBtn);
		
		this.menu.addChild(this.back);
		this.menu.addChild(this.homeBtn);
		this.menu.addChild(this.quickBtn);
		this.menu.addChild(this.fullBtn);
		this.menu.addChild(this.soundBtn1);
		this.menu.addChild(this.soundBtn2);
		this.menu.addChild(this.paysBtn);
        this.menu.addChild(this.closeBtn);
        
        this.menuBtn.init(["dmi_menu_n", "dmi_menu_n", "dmi_menu_n", "dmi_menu_n"]);
		this.homeBtn.init(["dmi_home_n", "dmi_home_h", "dmi_home_n", "dmi_home_n"], null, "HOME");
		this.soundBtn1.init(["dmi_soundon_n", "dmi_soundon_h", "dmi_soundon_n", "dmi_soundon_n"], null, "SOUND ON");
		this.soundBtn2.init(["dmi_soundoff_n", "dmi_soundoff_h", "dmi_soundoff_n", "dmi_soundoff_n"], null, "SOUND OFF");
		this.paysBtn.init(["dmi_paytable_n", "dmi_paytable_h", "dmi_paytable_n", "dmi_paytable_n"], null, "PAYTABLE");
		this.closeBtn.init(["dmi_close_n", "dmi_close_h", "dmi_close_n", "dmi_close_n"]);
		this.quickBtn.init(["quickspin_normal", "quickspin_hover", "quickspin_active", "quickspin_normal"], null, "QUICK SPIN");
		this.fullBtn.init(["fullscreen_normal", "fullscreen_hover", "fullscreen_normal", "fullscreen_normal"], null, "FULLSCREEN");
		
		this.back.height = Config.MAX_HEIGHT;

		this.menu.x = -100;
		this.menu.alpha = 0;
		this.menuBtn.x = 40;
		this.menuBtn.y = 1000;
		
		this.homeBtn.x = this.back.width / 2 - this.homeBtn.width / 2;
		this.homeBtn.y = 50;
		
		this.quickBtn.x = this.back.width / 2 - this.quickBtn.width / 2;
		this.quickBtn.y = 250;
		
		this.fullBtn.x = this.back.width / 2 - this.fullBtn.width / 2;
		this.fullBtn.y = 400;
        
        this.soundBtn2.visible = false;
		this.soundBtn1.x = this.back.width / 2 - this.soundBtn1.width / 2;
		this.soundBtn2.x = this.back.width / 2 - this.soundBtn2.width / 2;
		this.soundBtn1.y = this.soundBtn2.y = 550;
		
		this.paysBtn.x = this.back.width / 2 - this.paysBtn.width / 2;
		this.paysBtn.y = 700;
		
		this.closeBtn.x = this.back.width / 2 - this.closeBtn.width / 2;
		this.closeBtn.y = 1018;
		
		this.closeBtn.on("pointertap", this.showMenu, this);
		this.soundBtn1.on("pointertap", this.showSound, this);
		this.soundBtn2.on("pointertap", this.showSound, this);
		this.paysBtn.on("pointertap", this.showPays, this);
		this.homeBtn.on("pointertap", this.toHome, this);
		this.menuBtn.on("pointertap", this.showMenu, this);
		this.quickBtn.on("pointertap", this.setQuick, this);
		this.fullBtn.on("pointertap", this.setFullScreen, this);
		
		this.interactive = true;
    }

    setFullScreen(e) 
	{
		Utility.setFullScreen();
	}
	
	setQuick(e) 
	{
		this.emit(HUDEvents.SET_MOBILE_QUICK);
	}

	selectQuick()
	{
		this.quickBtn.makeOnlyOver();
	}
	
	deselectQuick()
	{
		this.quickBtn.enable();
	}
	
	lock()
	{
		this.paysBtn.disable();
		
		if (this.menu.visible) this.killMove();
	}
	
	unlock()
	{
		this.paysBtn.enable();
	}
	
	toHome(e) 
	{
		window.history.back();
	}
	
	showPays(e) 
	{
		this.emit(HUDEvents.SHOW_PAYTABLE);
	}
	
	showSound(e) 
	{
		this.soundBtn1.visible = !this.soundBtn1.visible;
		this.soundBtn2.visible = !this.soundBtn2.visible;

		if (this.soundBtn1.visible) this.soundBtn1.emit("mouseover");
		else this.soundBtn2.emit("mouseover");
		
		if (this.soundBtn1.visible) FastSoundManager.setGlobalVolume(1);
		else FastSoundManager.setGlobalVolume(0);
	}
	
	showMenu(e) 
	{
		clearTimeout(this.delayFreeze);

		if (!this.isMenuOpen)
		{
			this.menuBtn.visible = false;

			TweenMax.killTweensOf(this.menu);
			
			this.menu.alpha = 0;
			this.menu.x = -100;
			
			TweenMax.to(this.menu, 0.2, { x:0 , alpha:1, ease:Linear.easeNone, onComplete:() => this.checkMove()});

			this.isMenuOpen = true;
		}
		else
		{
			this.off("mousemove", this.onOverStage);
			
			this.menuBtn.visible = true;
			
			TweenMax.killTweensOf(this.menu);
			
			this.menu.alpha = 1;
			this.menu.x = 0;
			
			TweenMax.to(this.menu, 0.2, { x:-100 , alpha:0, ease:Linear.easeNone});

			this.isMenuOpen = false;
		}
	}
	
	checkMove()
	{
		this.on("mousemove", this.onOverStage, this);
	}
	
	onOverStage(e) 
	{
		clearTimeout(this.delayFreeze);

		if(e.target != null) return;
		
		this.delayFreeze = setTimeout(() => this.killMove(), 300);
	}

	killMove()
	{
		this.off("mousemove", this.onOverStage);
		
		TweenMax.to(this.menu, 0.2, { x:-100 , alpha:0, ease:Linear.easeNone});

		this.menuBtn.visible = true;
		this.isMenuOpen = false;
	}
}

SettingsView.useQuickSpin = false;