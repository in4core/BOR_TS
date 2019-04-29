import { Container, Graphics, Text, Sprite } from "pixi.js";
import SettingsView from "./SettingsView";
import BaseButton from "./elements/BaseButton";
import AddSpinParams from "./elements/AddSpinParams";
import Config from "../utils/Config";
import HUDEvents from "../events/HUDEvents";
import HUDModelEvent from "../events/HUDModelEvent";
import BaseView from "./BaseView";
import MultiStyleText from "pixi-multistyle-text";
import SettingsViewMobile from "./SettingsViewMobile";
import Assets from "../controllers/Assets";
import Utility from "../utils/Utility";
import { TweenMax, Linear } from "gsap";
import FastSoundManager from "../utils/FastSoundManager";

export default class HUDView extends Container
{
    constructor(baseModel)
    {
        super();
		super.on("added", this.onAdded);
		
		this.onKeyboardDown = this.onKeyboardDown.bind(this);
		this.spinButtonHandler = this.spinButtonHandler.bind(this);
		this.fasterStopByWindow = this.fasterStopByWindow.bind(this);

        this.baseModel = baseModel;
		this.isAutoPlay = false;
		this.winTimer = -10;
		this.currentCount = 0;
		this.fixCount = 0;
		
		this.sgamesBox = new Container();
		this.sgText = new MultiStyleText("FREE GAMES", Config.TEXT_STYLES.sgText);
		this.sgBoxMask = new Graphics();

	    //desktop

		this.settingsView = new SettingsView();
		this.deskCont = new Container();
		this.panelA = new Graphics();
		this.betRedLine = new Graphics();
        this.minusBetButton = new BaseButton();
        this.plusBetButton = new BaseButton();
        this.maxBetButton = new BaseButton();
        this.autoPlayButton = new BaseButton();
        this.spinButton = new BaseButton();

        this.linesText = new Text('10', Config.TEXT_STYLES.defaultHUDDesktopValues);
        this.betText = new Text('0.01', Config.TEXT_STYLES.defaultHUDDesktopValues);
        this.winText = new Text('', Config.TEXT_STYLES.defaultHUDDesktopValues);
        this.balanceText = new Text('1000.00', Config.TEXT_STYLES.defaultHUDDesktopValues);
        this.staticTextLines = new Text('LINES', Config.TEXT_STYLES.defaultHUDDesktopTexts);
        this.staticTextBet = new Text('BET', Config.TEXT_STYLES.defaultHUDDesktopTexts);
        this.staticTextWin = new Text('WIN', Config.TEXT_STYLES.defaultHUDDesktopTexts);
        this.staticTextBalance = new Text('BALANCE', Config.TEXT_STYLES.defaultHUDDesktopTexts);
        this.totalWinText = new MultiStyleText('FREE SPINS LEFT', Config.TEXT_STYLES.desktopHUD_fs_totalwin);
		this.fsLeftText = new MultiStyleText('TOTAL WIN', Config.TEXT_STYLES.desktopHUD_fs_totalwin);
		 
		//mobile
		
		this.whiteBlock = new Graphics();
		this.settingsMobile = new SettingsViewMobile(this.baseModel);
        this.addSpinParams = new AddSpinParams();
		this.mobiCont = new Container();
		this.panelB = new Graphics();
		this.spinBtnM = new BaseButton();
		this.autoStopBtnM = new BaseButton();
        this.menuBtnM = new BaseButton();
        this.homeBtnM = new BaseButton();
        this.betSettingsBtnM = new BaseButton(54);
		this.winTextM = new MultiStyleText("WIN", Config.TEXT_STYLES.mobileHUDText);
		this.betTextM = new MultiStyleText("BET", Config.TEXT_STYLES.mobileHUDText);
        this.balanceTextM = new MultiStyleText("BALANCE", Config.TEXT_STYLES.mobileHUDText);
        this.fsLeftM = new MultiStyleText("FREE LEFT", Config.TEXT_STYLES.mobileHUDText);
        this.totalWinM = new MultiStyleText("TOTAL WIN", Config.TEXT_STYLES.mobileHUDText);
	}
	
	get setView()
	{
		return this.settingsView;
	}

    onAdded(event)
    {
		super.removeListener("added", this.onAdded);

		//modify SG box
		
		this.sgamesBox.addChild(new Sprite(Assets.getSource("bg_sg")));
		this.sgamesBox.addChild(this.sgText);
		this.sgText.anchor.set(0.5, 0);
		this.sgText.text = "FREE GAMES <c>0</c>";
		this.sgText.x = 165;
		this.sgText.y = 15;
		this.sgamesBox.x = 215;
		this.sgamesBox.y = -this.sgamesBox.height;

		this.sgBoxMask.x = this.sgamesBox.x;
		this.sgBoxMask.beginFill(0);
		this.sgBoxMask.drawRect(0,0, this.sgamesBox.width, this.sgamesBox.height);
		this.sgamesBox.mask = this.sgBoxMask;
		
		this.addChild(this.sgBoxMask);
		this.addChild(this.sgamesBox);

		// end SG box modifiyng

        this.panelA.beginFill(0x0, 0.7);
		this.panelA.moveTo(7, 0);
		this.panelA.lineTo(1393, 0);
		this.panelA.lineTo(1400, 100);
		this.panelA.lineTo(0, 100);
		this.panelA.endFill();
		this.panelA.x = 260;
		
		this.panelB.beginFill(0x0, 0.7);
		this.panelB.drawRect(0, 0, Config.MAX_WIDTH, 100);
		this.panelB.endFill();

		this.betRedLine.beginFill(0xfcd159);
		this.betRedLine.drawRect(0, 0, 160, 3);

		if(!Utility.isMobilePlatform())
		{
			this.addChild(this.panelA);
			this.addChild(this.deskCont);
			this.addChild(this.settingsView);
		} 
		else
		{
			this.addChild(this.panelB);
			this.addChild(this.mobiCont);
		}

        this.minusBetButton.init(["-normal", "-hover", "-click", "-disabled"]);
		this.plusBetButton.init(["+normal", "+hover", "+click", "+disabled"]);
		this.maxBetButton.init(["btn_big_normal", "btn_big_hover", "btn_big_press", "btn_big_inactive"], "MAX BET", null, false, true);
		this.autoPlayButton.init(["btn_big_normal", "btn_big_hover", "btn_big_press", "btn_big_inactive"], "AUTO PLAY", null, true, false);
		this.spinButton.init(["spin_normal", "spin_hover", "spin_press", "spin_inactive"], null, null, false, false);

		this.homeBtnM.init(["icn_home", "icn_home", "icn_home", "icn_home"]);
		this.menuBtnM.init(["icn_menu", "icn_menu", "icn_menu", "icn_menu"]);
		this.spinBtnM.init(["icn_spin", "icn_spin", "icn_spin", "icn_spin"]);
		this.autoStopBtnM.init(["icn_spin_stop", "icn_spin_stop", "icn_spin_stop", "icn_spin_stop"]);
		this.betSettingsBtnM.init(["btn_bet", "btn_bet", "btn_bet", "btn_bet"], "BET");
		
		this.spinButton.hitArea = new PIXI.Circle(this.spinButton.width / 2, this.spinButton.height / 2 + 5, 60);
		this.autoStopBtnM.visible = false;

        this.deskCont.addChild(this.minusBetButton);
		this.deskCont.addChild(this.plusBetButton);
		this.deskCont.addChild(this.maxBetButton);
		this.deskCont.addChild(this.autoPlayButton);
		this.deskCont.addChild(this.spinButton);
		this.deskCont.addChild(this.staticTextLines);
		this.deskCont.addChild(this.staticTextBet);
		this.deskCont.addChild(this.staticTextWin);
		this.deskCont.addChild(this.staticTextBalance);
		this.deskCont.addChild(this.linesText);
		this.deskCont.addChild(this.balanceText);
		this.deskCont.addChild(this.betText);
		this.deskCont.addChild(this.winText);
		this.deskCont.addChild(this.totalWinText);
		this.deskCont.addChild(this.fsLeftText);
		this.deskCont.addChild(this.betRedLine);

		this.mobiCont.addChild(this.betTextM);
		this.mobiCont.addChild(this.balanceTextM);
		this.mobiCont.addChild(this.fsLeftM);
		this.mobiCont.addChild(this.totalWinM);
		this.mobiCont.addChild(this.winTextM);
		this.mobiCont.addChild(this.whiteBlock);
		this.mobiCont.addChild(this.betSettingsBtnM);
		this.mobiCont.addChild(this.menuBtnM);
		this.mobiCont.addChild(this.homeBtnM);
		this.mobiCont.addChild(this.addSpinParams);
		this.mobiCont.addChild(this.spinBtnM);
		this.mobiCont.addChild(this.autoStopBtnM);
		this.mobiCont.addChild(this.settingsMobile);
		
		this.whiteBlock.beginFill(0xffffff);
		this.whiteBlock.drawRect(0,0, Config.MAX_WIDTH, Config.MAX_HEIGHT);
		this.whiteBlock.endFill();
		this.whiteBlock.alpha = 0;
		this.whiteBlock.interactive = true;
		
		this.balanceText.anchor.set(0.5,0);
		this.winText.anchor.set(0.5,0);
		this.linesText.anchor.set(0.5,0);
		this.betText.anchor.set(0.5,0);
		this.fsLeftText.anchor.set(0.5, 0.5);
		this.totalWinText.anchor.set(0.5, 0.5);
		
		this.spinBtnM.pivot.x = this.spinBtnM.width / 2;
		this.spinBtnM.pivot.y = this.spinBtnM.height / 2;
		this.autoStopBtnM.pivot.x = this.autoStopBtnM.width / 2;
		this.autoStopBtnM.pivot.y = this.autoStopBtnM.height / 2;
		
        this.minusBetButton.y = this.plusBetButton.y = 26;
		this.minusBetButton.x = 390;
		this.plusBetButton.x = 600;
		this.maxBetButton.y = this.autoPlayButton.y = -5;
		this.autoPlayButton.x = Config.MAX_WIDTH / 2;
		this.maxBetButton.x = Config.MAX_WIDTH / 2 - this.maxBetButton.width;
		this.spinButton.x = Config.MAX_WIDTH / 2 - this.spinButton.width / 2;
		this.spinButton.y = -40;
		this.staticTextLines.y = this.staticTextBet.y = this.staticTextWin.y = this.staticTextBalance.y = 20;
		this.staticTextLines.x = 321;
		this.staticTextBet.x = 515;
		this.staticTextWin.x = 1310;
		this.staticTextBalance.x = 1477;
		this.linesText.y = this.betText.y = this.winText.y = this.balanceText.y = 44;
		this.linesText.x = 345;
		this.betText.x = 530;
		this.winText.x = 1330;
		this.balanceText.x = 1515;
		this.fsLeftText.y = 44;
		this.fsLeftText.x = 815;
		this.totalWinText.y = 44;
		this.totalWinText.x = 1095;
		this.panelA.y = this.panelB.y = Config.MAX_HEIGHT - this.panelA.height;
		this.deskCont.y = this.panelA.y;
		this.betRedLine.x = this.minusBetButton.x + 63;

		this.menuBtnM.cacheAsBitmap = true;
		this.homeBtnM.cacheAsBitmap = true;
		this.panelA.cacheAsBitmap = this.panelB.cacheAsBitmap = true;
		
		this.maxBetButton.on("pointertap", this.maxBetHandler, this);
		this.autoPlayButton.on("pointertap", this.autoButtonHandler, this);
		this.spinButton.on("pointertap", this.spinButtonHandler, this);
		this.plusBetButton.on("pointertap", this.plusLevelHandler, this);
		this.minusBetButton.on("pointertap", this.minusLevelHandler, this);
        this.betSettingsBtnM.on("pointertap", this.showMenuMobileByBetButton, this);
		this.menuBtnM.on("pointertap", this.showMenuMobile, this);
		this.homeBtnM.on("pointertap", this.toHomeHandler, this);
		this.spinBtnM.on("pointerdown", this.spinMobileAnimationDown, this);
		this.autoStopBtnM.on("pointertap", this.stopMobileAuto, this);

		this.baseModel.hudModel.on(HUDModelEvent.CHANGE, this.onChangeHUDValues, this);
        this.baseModel.hudModel.on(HUDModelEvent.BALANCE_UPDATE, this.onChangeBalance, this);
		this.settingsMobile.on(HUDEvents.SHOW_MOBILE_SETTINGS, this.showMenuMobile, this);
		this.settingsMobile.on(HUDEvents.CHANGE_HAND_MODE, this.changeHandModeHUD, this);
		this.settingsMobile.on(HUDEvents.SET_MOBILE_QUICK, this.onSetAllQuick, this);
		this.settingsView.on(HUDEvents.SET_MOBILE_QUICK, this.onSetAllQuick, this);
		this.addSpinParams.on(HUDEvents.SET_MOBILE_QUICK, this.onSetAllQuick, this);
		this.addSpinParams.on(HUDEvents.SET_MOBILE_AUTO, this.onSetMobileAuto, this);

		if(!Utility.isMobilePlatform()) window.addEventListener("keydown", this.onKeyboardDown);
		else this.whiteBlock.on("pointerdown", this.fasterStopByWindow, this);

		this.onChangeHUDValues(null);
		this.showMenuMobile();
		this.toNormal();
	}

	stopMobileAuto()
	{
		this.autoStopBtnM.visible = false;
		this.removeAutoPlay();
	}

	onKeyboardDown(e)
	{
		if(e.code == "Space" && this.spinButton.enabled) this.spinButtonHandler(null);
		else this.fasterStopByWindow(null);
	}

	fasterStopByWindow(e)
	{
		if(BaseView.gameState == 1) 
		{
			this.whiteBlock.alpha = 0;
			TweenMax.killTweensOf(this.whiteBlock);
			TweenMax.to(this.whiteBlock, 0.1, { alpha:0.2, repeat:1, ease:Linear.easeNone}).yoyo(true);

			this.emit(HUDEvents.STOP_BUTTON);
		}
	}

	spinMobileAnimationDown()
	{
		TweenMax.killTweensOf(this.spinBtnM);
		TweenMax.killTweensOf(this.spinBtnM.scale);
		this.spinBtnM.scale.set(1, 1);
		TweenMax.to(this.spinBtnM.scale, 0.3, { x:1.05, y:1.05, repeat:1, onComplete:this.spinButtonHandler, ease:Linear.easeNone}).yoyo(true);
	}

	onSetMobileAuto(e) 
	{
		this.isAutoPlay = !this.isAutoPlay;

		if(this.baseModel.hudModel.isNoBalance()) this.isAutoPlay = false;

		if (this.isAutoPlay) this.addSpinParams.selectAuto();
		else this.addSpinParams.deselectAuto();
		
		this.emit(HUDEvents.AUTO_BUTTON);
	}
	
	onSetAllQuick(e) 
	{
		SettingsView.useQuickSpin = !SettingsView.useQuickSpin;
		
		if (SettingsView.useQuickSpin)
		{
			this.settingsMobile.selectQuick();
			this.addSpinParams.selectQuick();
			this.settingsView.selectQuick();
		}
		else
		{
			this.settingsMobile.deselectQuick();
			this.addSpinParams.deselectQuick();
			this.settingsView.deselectQuick();
		}
	}

	toHomeHandler(e) 
	{
		window.history.back();
	}

	changeHandModeHUD()
	{
		if (SettingsViewMobile.handMode == "left")
		{
			this.spinBtnM.x = 60 + this.spinBtnM.width / 2;
			this.autoStopBtnM.x = this.spinBtnM.x;
			this.homeBtnM.x = Config.MAX_WIDTH - 60 - this.homeBtnM.width;
			this.menuBtnM.x = Config.MAX_WIDTH - 60 - this.menuBtnM.width;
			this.betSettingsBtnM.x = Config.MAX_WIDTH - this.betSettingsBtnM.width - 20;
			this.addSpinParams.scale.x = -1;
			this.addSpinParams.x = 550;
		}
		else
		{
			this.spinBtnM.x = Config.MAX_WIDTH - this.spinBtnM.width - 50 + this.spinBtnM.width / 2;
			this.autoStopBtnM.x = this.spinBtnM.x;
			this.homeBtnM.x = 60;
			this.menuBtnM.x = 60;
			this.betSettingsBtnM.x = 20;
			this.addSpinParams.scale.x = 1;
			this.addSpinParams.x = this.spinBtnM.x - 102 - this.spinBtnM.width / 2;
		}
	}

	showMenuMobileByBetButton()
	{
		this.showMenuMobile(null);
		this.settingsMobile.openBets();
	}

	showMenuMobile()
	{
		this.settingsMobile.visible = !this.settingsMobile.visible;
	}

	autoButtonHandler(e) 
	{
		this.isAutoPlay = !this.isAutoPlay;

		if(this.baseModel.hudModel.isNoBalance()) this.isAutoPlay = false;
		
		if (this.isAutoPlay) 
		{
			this.autoPlayButton.text = "STOP AUTO";
			FastSoundManager.playSound("autoplaystart");
		}
		else 
		{
			this.autoPlayButton.text = "AUTO PLAY";
			FastSoundManager.playSound("autoplaystop");
		}
		
		this.emit(HUDEvents.AUTO_BUTTON);
	}
	
	removeAutoPlay()
	{
		this.isAutoPlay = false;
		this.autoPlayButton.text = "AUTO PLAY";
		this.addSpinParams.deselectAuto();
	}
	
	maxBetHandler(e) 
	{
		if (this.baseModel.hudModel.isMaxBet()) this.spinButtonHandler(null);
		else 
		{
			this.baseModel.hudModel.maxBet();
			FastSoundManager.playSound("maxBet");
		}
	}

	spinButtonHandler(e) 
	{
		if (BaseView.gameState == 0) 
		{
			if(this.baseModel.hudModel.isNoBalance()) return;
			
			this.emit(HUDEvents.SPIN_BUTTON);
		}
		else 
		{
			this.emit(HUDEvents.STOP_BUTTON);
		}
	}
	
	minusLevelHandler(e) 
	{
		this.baseModel.hudModel.minusBetLevel();
		FastSoundManager.playSound("bet");
	}
	
	plusLevelHandler(e) 
	{
		this.baseModel.hudModel.plusBetLevel();

		if (this.baseModel.hudModel.isMaxBet()) FastSoundManager.playSound("maxBet");
		else FastSoundManager.playSound("bet");
	}

    onChangeHUDValues(e)
	{
		this.linesText.text = this.baseModel.hudModel.linesMax;
		this.betText.text = this.baseModel.hudModel.getMainBet();
		this.balanceText.text = this.baseModel.hudModel.getMainBalance();
		
		this.betTextM.text = "BET " + this.baseModel.hudModel.getMainBet() + "";
		this.balanceTextM.text = "BALANCE " + this.baseModel.hudModel.getMainBalance() + "";

		this.betRedLine.width = 160 * ((this.baseModel.hudModel.betsIndex + 1) / this.baseModel.hudModel.bets.length);

		if (e)
		{
			this.winTextM.text = "WIN <c></c>";
			this.winText.text = "";
		}

        let locker = this.baseModel.hudModel.getLocker();

		if (locker[0]) this.plusBetButton.disable();
		else this.plusBetButton.enable();
		
		if (locker[1]) this.minusBetButton.disable();
		else this.minusBetButton.enable();
	}

    onChangeBalance(e)
	{
		this.balanceText.text = this.baseModel.hudModel.getMainBalance();
		this.balanceTextM.text = "BALANCE " + this.baseModel.hudModel.getMainBalance() + "";
	}

	addWonSpecial()
	{
		this.stopWinCount();

		let finCount = this.baseModel.finalWonSpecialString;
        this.winText.text = finCount;
		this.winTextM.text = "WIN " + finCount + "";
	}
	
	startWinCount()
	{
		/* let special = this.baseModel.spinParams.special ? this.baseModel.spinParams.special.win / 100 : 0;

		this.currentCount = 0;
		this.fixCount = (this.baseModel.spinParams.win / 100 - special) / 30;
		this.winTimer = setInterval(this.updateWinCount, 30);
		this.updateWinCount(); */

		let finCount = this.baseModel.finalWonString;
		
		this.winText.text = finCount;
		this.winTextM.text = "WIN " + finCount + "";
	}

	updateWinCount()
	{
		let textCount = this.currentCount.toFixed(2);
		this.winText.text = textCount;
		this.winTextM.text = "WIN " + textCount + "";

		this.currentCount += this.fixCount;

		if (this.currentCount >= this.baseModel.finalWon)
		{
			this.clearWinCount();
			
			let finCount = this.baseModel.finalWonString;
            this.winText.text = finCount;
			this.winTextM.text = "WIN " + finCount + "";
        }
	}

	stopWinCount()
	{
		clearInterval(this.winTimer);
		this.addSpinParams.hide();
		this.winTextM.text = "WIN <c></c>";
		this.winText.text = "";
	}

	clearWinCount()
	{
		clearInterval(this.winTimer);
		
		let finCount = this.baseModel.finalWonString;
		
		this.winText.text = finCount;
		this.winTextM.text = "WIN " + finCount + "";
	}

	showSGOnce()
	{
		this.sgText.text = "FREE GAMES <c>" + this.baseModel.spinTotalSG + "</c>";
		this.sgamesBox.y = -this.sgamesBox.height;
			
		TweenMax.to(this.sgamesBox, 0.5, { y: 0 });
		TweenMax.to(this.sgamesBox, 0.5, { y: -this.sgamesBox.height, delay:2.5, onComplete: ()=>this.updateFSCount() });
	}

	updateFSCount(less = false)
	{
		let count = this.baseModel.freeSpinsCount;
		
		if (less) count--;

		if(this.baseModel.gameFeature == "SG" && !BaseView.isFreespinsGame)
		{
			this.sgText.text = "FREE GAMES <c>" + count + "</c>";
			
			if(count != 0) TweenMax.to(this.sgamesBox, 0.5, { y: 0 });

			else TweenMax.to(this.sgamesBox, 0.5, { y: -this.sgamesBox.height, delay:2 });

			return;
		}
		else if(BaseView.isFreespinsGame) 
		{
			this.sgText.text = "FREE GAMES <c>0</c>";
			TweenMax.to(this.sgamesBox, 0.5, { y: -this.sgamesBox.height, delay:1 });
		}
		
		this.fsLeftText.text = "FREE SPINS LEFT\n<c>" + count + "</c>";
		this.fsLeftM.text = "FREE LEFT <c>" + count + "</c>";

		let freeSpinsWin = this.baseModel.freespinsWonString;

		this.totalWinText.text = "TOTAL WIN\n<c>" + freeSpinsWin + "</c>";
		this.totalWinM.text = "TOTAL WIN <c>" + freeSpinsWin + "</c>";
	}

	unlockAllHUD() 
	{
		if (this.baseModel.freeSpinsCount != 0) return;
		
		this.spinBtnM.enable();
		this.spinButton.enable();
		this.minusBetButton.enable();
		this.plusBetButton.enable();
		this.autoPlayButton.enable();
		this.maxBetButton.enable();
		this.menuBtnM.enable();
		this.betSettingsBtnM.enable();
		this.settingsView.unlock();

		this.addSpinParams.visible = this.spinBtnM.visible = this.betSettingsBtnM.visible = true;
		
		this.onChangeHUDValues(null);
	}
	
	lockHUDSpin()
	{
		if (this.baseModel.freeSpinsCount != 0) return;
		
		this.minusBetButton.disable();
		this.plusBetButton.disable();
		if(!this.isAutoPlay) this.autoPlayButton.disable();
		this.maxBetButton.disable();
		this.menuBtnM.disable();
		this.betSettingsBtnM.disable();
		this.settingsView.lock();

		this.addSpinParams.visible = this.spinBtnM.visible = this.betSettingsBtnM.visible = false;

		if(this.isAutoPlay) this.autoStopBtnM.visible = true;
	}

	lockSpin()
	{
		this.removeAutoPlay();
		this.spinBtnM.disable();
		this.spinButton.disable();
		this.autoPlayButton.disable();
		this.menuBtnM.disable();
		this.betSettingsBtnM.disable();
		this.settingsView.lock();
		this.minusBetButton.disable();
		this.plusBetButton.disable();
		this.maxBetButton.disable();

		this.addSpinParams.visible = this.spinBtnM.visible = this.betSettingsBtnM.visible = false;
	}

	toFS()
	{
		this.fsLeftM.visible = this.totalWinM.visible = true;
		this.winTextM.visible = this.betTextM.visible = false;
		this.spinBtnM.visible = this.spinButton.visible = this.addSpinParams.visible = this.betSettingsBtnM.visible = false;
		this.autoPlayButton.visible = this.maxBetButton.visible = false;
		this.totalWinText.visible = this.fsLeftText.visible = true;
		this.minusBetButton.visible = this.plusBetButton.visible = false;
		this.autoStopBtnM.visible = false;
		this.betRedLine.visible = false;
		this.balanceTextM.x = 1170;
	}
	
	toNormal()
	{
		this.fsLeftM.visible = this.totalWinM.visible = false;
		this.winTextM.visible = this.betTextM.visible = true;
		this.spinBtnM.visible = this.spinButton.visible = this.addSpinParams.visible = this.betSettingsBtnM.visible = true;
		this.autoPlayButton.visible = this.maxBetButton.visible = true;
		this.totalWinText.visible = this.fsLeftText.visible = false;
		this.minusBetButton.visible = this.plusBetButton.visible = true;
		this.betRedLine.visible = true;
		this.balanceTextM.x = 1090;
	}

	setDeviceView(type = "desktop", ratio = 0)
	{
		if (type == "portrait")
		{

		}

		else if (type == "landscape")
		{
			this.panelA.visible = false;
			this.settingsView.visible = false;
			this.deskCont.visible = false;
			this.mobiCont.visible = true;

			this.changeHandModeHUD(null);
			
			this.spinBtnM.y = Config.MAX_HEIGHT / 2 - this.spinBtnM.height / 2 + this.spinBtnM.height / 2;
			this.addSpinParams.y = this.spinBtnM.y + this.spinBtnM.height / 2 - this.addSpinParams.height / 2 - this.spinBtnM.height / 2;
			this.autoStopBtnM.y = this.spinBtnM.y;
			this.homeBtnM.y = Config.MAX_HEIGHT / 2 - this.homeBtnM.height - 200;
			this.menuBtnM.y = Config.MAX_HEIGHT / 2 + 200;
			this.betSettingsBtnM.y = Config.MAX_HEIGHT / 2 - this.betSettingsBtnM.height / 2;

			this.betTextM.x = 220;
			this.winTextM.x = 630;
			this.fsLeftM.x = 150;
			this.totalWinM.x = 550;

			this.betTextM.y = this.winTextM.y = this.balanceTextM.y = this.fsLeftM.y = this.totalWinM.y = this.panelB.y + 18;
			
			this.settingsMobile.resizeLandscape();
		}
		else if (type == "desktop")
		{
			this.deskCont.visible = true;
			this.mobiCont.visible = false;
			this.panelB.visible = false;
		}
	}
}
