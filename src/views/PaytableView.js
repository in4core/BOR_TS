import { Container, Sprite, Graphics, Text, Rectangle } from "pixi.js";
import Assets from "../controllers/Assets";
import Config from "../utils/Config";
import BaseButton from "./elements/BaseButton";
import PaytableSymbol from "./elements/PaytableSymbol";
import HUDModelEvent from "../events/HUDModelEvent";
import FastSoundManager from "../utils/FastSoundManager";
import { TweenMax } from "gsap";

export default class PaytableView extends Container
{
    constructor(baseModel)
    {
        super();
        super.on("added", this.onAdded);

        this.onMouseWheel = this.onMouseWheel.bind(this);

        this.baseModel = baseModel;

        this.back = new Graphics();
        this.logo = new Sprite(Assets.getSource("logo"));
        this.contMask = new Graphics();
        this.content = new Container();
        this.closeBtn = new BaseButton();
        this.text = new Text('SYMBOL PAYOUT VALUES', {fontFamily : 'Avenir_Medium', fontSize: 24, fill : 0xffffff, align : 'center'});

        this.startYP = 0;
    }

    onAdded(event)
    {
        super.off("added", this.onAdded);

        this.closeBtn.init(["dmi_close_n", "dmi_close_h", "dmi_close_n", "dmi_close_n"]);
		
		this.closeBtn.y = 100;
		this.closeBtn.x = Config.MAX_WIDTH - this.closeBtn.width - 90;
		
		
		this.back.beginFill(0);
		this.back.drawRect(0, 0, Config.MAX_WIDTH, Config.MAX_HEIGHT);
        this.back.endFill();
        this.back.interactive = true;
        
        this.addChild(this.back);
		this.addChild(this.logo);
		this.addChild(this.content);
        this.addChild(this.closeBtn);
        this.addChild(this.contMask);
		
		this.logo.x = Math.floor(this.width / 2 - this.logo.width / 2);
		
		this.contMask.beginFill(0);
		this.contMask.drawRect(0, 0, Config.MAX_WIDTH, 800);
		this.contMask.endFill();
		
		this.content.x = 270;
		this.content.y = 100;
		this.contMask.y = 100;
		
        this.content.mask = this.contMask;
        
        this.back.on("mousedown", this.startScrollPaytable, this);
		this.back.on("mouseup", this.stopScrollPaytable, this);
        this.back.on("mouseupoutside", this.stopScrollPaytable, this);
        this.closeBtn.on("pointertap", this.hide, this);
        
        this.baseModel.hudModel.on(HUDModelEvent.CHANGE, this.onChangeHUDValues, this);

        this.create();
        this.onChangeHUDValues();
    }

    stopScrollPaytable(e)
	{
		this.back.off("mousemove", this.moveScrollPaytable, this);
	}

	moveScrollPaytable(e)
	{
		this.content.y = e.data.getLocalPosition(this.content.parent).y - this.startYP;

		if(this.content.y > this.contMask.y) this.content.y = this.contMask.y;

		else if(this.content.y < this.contMask.y - this.content.height + this.contMask.height) 
		{
			this.content.y = this.contMask.y - this.content.height + this.contMask.height;
        }
	}
	startScrollPaytable(e)
	{
		if(!this.visible) return;

		this.startYP = e.data.getLocalPosition(this.content.parent).y - this.content.y;
		this.back.on("mousemove", this.moveScrollPaytable, this);
	}

    show()
    {
        FastSoundManager.playSound("oOpen");
        this.visible = true;
        window.addEventListener("mousewheel", this.onMouseWheel);
    }
    
    onChangeHUDValues(e)
    {
        for(let i = 1; i < this.content.children.length; i++)
        {
            const sym = this.content.getChildAt(i);
           
            if( sym instanceof PaytableSymbol ) sym.update(this.baseModel.hudModel.currentBet);
        }
    }

    onMouseWheel(e)
    {
        let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

        if(delta < 0 && this.content.y + this.content.height > this.contMask.y + this.contMask.height) this.content.y -= 60;
        else if(delta > 0 && this.content.y < 100) this.content.y += 60;
        else if(delta > 0 && this.content.y >= 100) this.content.y = 100;
    }

    hide()
    {
        FastSoundManager.playSound("oClose");
        this.visible = false;
        window.removeEventListener("mousewheel", this.onMouseWheel);
    }

    create()
    {
        this.content.addChild(this.text);
		
		let j = 0;
		let k = 80;
		
		for (let i = 0; i < 11; i++)
		{
			if (i == 1 || i == 0) continue;
			
			let paySymbol = new PaytableSymbol(i, this.baseModel.initParams.paytable);
			this.content.addChild(paySymbol);
            
            paySymbol.x = (j % 3) * (480);
			
			if (j % 3 == 0 && i != 2) k += 220;
			
			paySymbol.y = k;
			
			j++;
        }

        Config.createPaytableContent(this.content, this.baseModel.initParams);
    }
}