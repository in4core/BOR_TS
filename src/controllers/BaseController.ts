import ServerSide from "./ServerSide";
import BaseModel from "../models/BaseModel";
import BaseView from "../views/BaseView";
import Assets from "./Assets";
import Config from "../utils/Config";
import Utility from "../utils/Utility";
import { Application } from "pixi.js";
import HUDEvents from "../events/HUDEvents";
import FullscreenIOS from "@mascot/fullscreen";

export default class BaseController
{
    private _assets:Assets = new Assets();
    private _application:Application = null;
    private _baseModel:BaseModel = null;
    private _baseView:BaseView = null;
    private _server:ServerSide = new ServerSide();

    constructor(app:Application)
    {
        this._application = app;

        //this.onResize = this.onResize.bind(this);
       
        if(Utility.isAndroidPlatform()) 
		{
            this._application.stage.interactive = true;
            this._application.stage.interactiveChildren = true;
			this._application.stage.on("pointertap", () => Utility.setFullScreen(true));
        }
        else if(Utility.isIOSPlatform()) 
        {
            FullscreenIOS.init();
            FullscreenIOS.onToggle.add(()=> this.onResize());
        }

        window.addEventListener("resize", Utility.time(this.onResize, 100, this));
        window.addEventListener("orientationchange", () => setTimeout(()=>this.onResize(), 100)); 
       
        this._assets.on("loadingComplete", ()=> this._server.send({"action" : "init"}));
        this._server.on(ServerSide.SERVER_REQUEST, this.onServerDataRecived, this);

        this.onResize();
        this._assets.loadResouces(this._application.stage);
    }

    onServerDataRecived(data:any):void
    {
        if(data.action == "init")
        {
            this._baseModel = new BaseModel();
            this._baseModel.initParams = data;
            this._baseModel.spinParams = data;
            this._baseModel.init();
		
            this._baseView = new BaseView(this._baseModel);
            this._baseView.on(HUDEvents.SPIN, this.trySpin, this);
            this._baseView.on(HUDEvents.UPDATE_BALANCE, this.doUpdateBalance, this);
            //this._application.stage.addChild(this._baseView);

            this.onResize();

            if (this._baseModel.isFreeSpins) this._baseView.reloadSession();
        }
        
        else if(data.action == "spin")
        {
            this._baseModel.spinParams = data;
		    this._baseView.spinDataAdded();
        }
    }

    private doUpdateBalance():void 
	{
		this._baseModel.hudModel.updateBalance(this._baseModel.spinParams.balance);
	}

    trySpin():void
	{
		const o:Object = {
			"action" : "spin" , 
			"bet" : this._baseModel.hudModel.currentBet * 100
        };
        
        if(!BaseModel.isFreespinsGame && this._baseModel.gameFeature != BaseModel.FEATURE_SG) this._baseModel.hudModel.lessSpinBalance();
		
		this._baseModel.spinParams = null;
		this._server.send(o);
	}

    onResize():void
    {
        console.log(this);
        
        window.scrollTo(0,0);

        this._application.renderer.resize(window.innerWidth, window.innerHeight);
        Config.resizeApplication(this._application.stage);

        if(this._baseView == null) return;
       

        if (Utility.isMobilePlatform())
        {
            if (!Utility.isLandscape())
            {
                Config.resizeApplicationNoScale(this._application.stage);
                //this._baseView.onResizePortrait();
                return;
            }
            else if(Utility.isLandscape())
            {
                //this._baseView.onResizeLandscape();
            }
        }
        else
        {
            //this._baseView.onResizeDesktop();
        }
    }
}
