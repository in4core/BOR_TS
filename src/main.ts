import { Application } from "pixi.js";
import BaseController from "./controllers/BaseController";
import Config from "./utils/Config";

export default class Main 
{
    private _application:Application = null;

    constructor()
    {
        
        this._application = new Application(
        {
            width: Config.MAX_WIDTH, 
            height: Config.MAX_HEIGHT, 
            antialias: true, 
            transparent: false, 
            resolution: (window.devicePixelRatio || 1), 
            autoResize:true,
            legacy:true,
            forceCanvas:false
        });

        this._application.renderer.view.id = "game";
        this._application.renderer.plugins.interaction.autoPreventDefault = false;

        document.body.appendChild(this._application.view);
        
        window.addEventListener("load" , () => new BaseController(this._application)); 
        window.addEventListener("error", function(msg) { alert(msg.message); });
    }
}

new Main();
