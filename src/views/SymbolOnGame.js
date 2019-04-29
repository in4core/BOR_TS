import { Container, Sprite, Graphics } from "pixi.js";
import Assets from "../controllers/Assets";
import Config from "../utils/Config";
import { TweenMax } from "gsap";
import BaseView from "./BaseView";
import BonusView from "./BonusView";

export default class SymbolOnGame extends Container
{
    constructor()
    {
        super();
		super.on("added", this.onAdded);
		
        this.id = -1;
        this.image = new Sprite();
        this.image2 = new Sprite();
        this.back = new Graphics();
        this.useScatters = false;
        this.animatedTimer = -3;
		this.isAnimated = false;
		this.animBitmap = null;
		this.counter = 0;
    }

    onAdded(event)
    {
		super.removeListener("added", this.onAdded);
		
		this.addChild(this.image);
		this.addChild(this.image2);
		this.addChild(this.back);
		
		this.back.beginFill(0, 0);
		this.back.drawRect(0, 0, Config.SYMBOL_WIDTH_REAL, Config.SYMBOL_HEIGHT_REAL);
		this.back.endFill();

		//this.back.cacheAsBitmap = true;
    }

    setStaticImage(textureID = -1)
	{
		this.clear();
		
		if(textureID != -1) this.id = textureID;
		
		let casesA = BaseView.isFreespinsGame && this.id == BonusView.bonusSymbol ? "_s" : "";
		
		this.image.texture = Assets.getSource("sym" + this.id + casesA);
    }
    
    setBlurImage(textureID = -1)
	{
		this.clear();
		
		if(textureID != -1) this.id = textureID;
		
		let casesA = BaseView.isFreespinsGame && this.id == BonusView.bonusSymbol ? "_sb" : "_b";
		
		this.image.texture = Assets.getSource("sym" + this.id + casesA);
	}

	animate(textureID = -1, useScatters = false)
	{
		if (this.isAnimated) return;
		
		this.isAnimated = true;
		
		this.image.alpha = 1;
		
		if (textureID != -1) this.id = textureID;
		
		if (this.id > 5)
		{
			this.image2.addChild(new Sprite(Assets.getSource("sym" + this.id + "_a")));
			this.image2.alpha = 0;
		}
		else
		{
			let source = Assets.getSource("sym" + this.id + "_a");

			if(useScatters)
			{
				this.useScatters = true;
				source = Assets.getSource("scatters");
			}

			this.animBitmap = new PIXI.extras.TilingSprite(source, Config.SYMBOL_WIDTH_REAL, Config.SYMBOL_HEIGHT_REAL);
			this.image.visible = false;
			this.image2.addChild(this.animBitmap);
			this.animatedTimer = setInterval(() => this.onAnimTime(null), 80);
		}

		this.onAnimTime(null);
	}

	onAnimTime() 
	{
		if (this.id > 5) 
		{
			if (this.image2.alpha == 0) 
			{
				TweenMax.to(this.image2, 1, { alpha:1, ease:Linear.easeNone, onComplete:()=>this.onAnimTime() });
			}
			else 
			{
				TweenMax.to(this.image2, 1, { alpha:0, ease:Linear.easeNone, onComplete:()=>this.onAnimTime() });
			}
		}
		else
		{
			let xx = Config.SYMBOLS_MAP_SELECT["sym" + this.id].x;
			let yy = Config.SYMBOLS_MAP_SELECT["sym" + this.id].y;
			
			if (this.useScatters)
			{
				xx = Config.SYMBOLS_MAP_SELECT["scatters"].x;
				yy = Config.SYMBOLS_MAP_SELECT["scatters"].y;
			}
			
			if (this.counter >= (xx * yy) - 1) 
			{
				clearInterval(this.animatedTimer);
				this.counter = 0;
				if (this.useScatters) return;
				this.animatedTimer = setInterval(()=> this.onAnimTime(), 80);
				this.onAnimTime(null);
				return;
			}

			this.animBitmap.tilePosition.set(-Math.floor(Math.floor(this.counter % xx) * 222), -Math.floor(Math.floor(this.counter / xx) * 222));
			this.counter++;
		}
	}
	
	blink()
	{
		if (this.isAnimated) return;
		this.image.alpha = 0.5;
	}

    clear()
	{
		this.image.removeChildren();
		this.useScatters = false;
    }
    
    destroyFull()
	{
		clearInterval(this.animatedTimer);
		
		TweenMax.killTweensOf(this.image2);
		
		this.isAnimated = false;
		this.image.visible = true;
		this.image2.visible = true;
		this.image.alpha = this.image2.alpha = 1;
		this.image2.removeChildren();
		this.useScatters = false;
		this.counter = 0;
	}
}