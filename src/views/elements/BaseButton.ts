import { Container, Sprite, Text } from "pixi.js";
import Assets from "../../controllers/Assets";
import { TweenMax, Linear } from "gsap";
import Config from "../../utils/Config";

export default class BaseButton extends Container
{
	private _normalTexture:Sprite = null;
	private _hoverTexture:Sprite = null;
	private _pressTexture:Sprite = null;
	private _inactiveTexture:Sprite = null;
	
	private _isAutoPlay = false;
	private _isMaxBet = false;
	
	private _menuTextfield = new Text('', Config.TEXT_STYLES.desktopMenuButtonsText);
	private _baseTextfield = new Text('', Config.TEXT_STYLES.desktopButtonsText);

	private _isOver = false;
    private _enabled = true;
    private _id = -1;

    constructor(fontSize:number = 30)
    {
        super();
        super.on("added", this.onAdded);

		this._baseTextfield.style.fontSize = fontSize;

        this.buttonMode = true;
        this.interactive = true;
	}

	public set id(n:number)
	{
		this._id = n;
	}
	
	public get enabled():boolean
	{
		return this._enabled;
	}

    private onAdded(e):void
    {
        super.removeListener("added", this.onAdded);
    }

    public init(textures:Array<string>, text:string = null, menuText:string = null, isAutoPlay:boolean = false, isMaxBet:boolean = false):void
	{
		this._isAutoPlay = isAutoPlay;
		this._isMaxBet = isMaxBet;

		this._baseTextfield.anchor.set(0.5, 0.5);

		this._normalTexture = new Sprite(Assets.getSource(textures[0]));
		this.addChild(this._normalTexture);

		if (textures[1] != null) 
		{
			this._hoverTexture = new Sprite(Assets.getSource(textures[1]));
			this.addChild(this._hoverTexture);
		}
		if (textures[2] != null) 
		{
			this._pressTexture = new Sprite(Assets.getSource(textures[2]));
			this.addChild(this._pressTexture);
		}
		if (textures[3] != null) 
		{
			this._inactiveTexture = new Sprite(Assets.getSource(textures[3]));
			this.addChild(this._inactiveTexture);
		}
		
		if(this._isAutoPlay)
		{
			this._normalTexture.scale.x = this._hoverTexture.scale.x = this._inactiveTexture.scale.x = this._pressTexture.scale.x = -1;
			this._normalTexture.x += this._normalTexture.width;
			this._hoverTexture.x += this._hoverTexture.width;
			this._inactiveTexture.x += this._inactiveTexture.width;
			this._pressTexture.x += this._pressTexture.width;
		}
		
		if (menuText != null) 
		{
			this._menuTextfield.text = menuText;
			this._menuTextfield.x = this._normalTexture.width + 100;
			this._menuTextfield.y = this._normalTexture.height / 2 - this._menuTextfield.height / 2;
			this.addChild(this._menuTextfield);
		}
		
		if (text != null)
		{
			this._baseTextfield.text = text;
			this._baseTextfield.x = this._normalTexture.width / 2 + 1;
			this._baseTextfield.y = this._normalTexture.height / 2 + 1;
			this.addChild(this._baseTextfield);

			if(this._isMaxBet) 
			{
				this._baseTextfield.style.fontSize = 28;
				this._baseTextfield.x -= 14;
				this._baseTextfield.y += 3;
			}
			else if(this._isAutoPlay)
			{
				this._baseTextfield.style.fontSize = 28;
				this._baseTextfield.x += 22;
				this._baseTextfield.y += 3;
			}
		}

		this.on("mouseover", this.onOver);
		this.on("mouseout", this.onOut);
		this.on("mousedown", this.onDown);
		this.on("pointertap", this.onOver);
		this.on("mouseout", this.onOutText);
		this.on("mouseover", this.onOverText);

		this.onOut();
		this.onOutText();
    }
    
    private onOverText():void
	{
		if (this._menuTextfield.text != null)
		{
			if (this._menuTextfield.alpha > 0 && this._menuTextfield.visible) return;
			
			this._menuTextfield.visible = true;
			this._menuTextfield.alpha = 0;
			this._menuTextfield.x = this._normalTexture.width + 50;
			
			TweenMax.to(this._menuTextfield, 0.3, { alpha:1 , x:this._normalTexture.width + 70, ease:Linear.easeNone});
		}
	}
	
	private onOutText():void
	{
		this._menuTextfield.visible = false;
	}
	
	private onDown():void
	{
		if(!this._enabled) return;

		this._normalTexture.visible = this._hoverTexture.visible = this._inactiveTexture.visible = false;
		this._pressTexture.visible = true;

		if(this._isAutoPlay || this._isMaxBet) this._baseTextfield.scale.set(0.9, 0.9);
	}
	
	private onOut():void 
	{
		if(!this.enabled) return;

		this._hoverTexture.visible = this._pressTexture.visible = this._inactiveTexture.visible = false;
		this._normalTexture.visible = true;

		if(this._isAutoPlay || this._isMaxBet) this._baseTextfield.scale.set(1, 1);
	}
	
	private onOver():void
	{
		if(!this.enabled) return;

		this._normalTexture.visible = this._pressTexture.visible = this._inactiveTexture.visible = false;
		this._hoverTexture.visible = true;

		if(this._isAutoPlay || this._isMaxBet) this._baseTextfield.scale.set(1, 1);
	}
	
	public disable():void
	{
		this.buttonMode = false;
		this._enabled = false;
        this.interactive = false;
        
		this.off("mouseover", this.onOver);
		this.off("mouseout", this.onOut);
		this.off("mousedown", this.onDown);
		this.off("pointertap", this.onOver);
		
		this._hoverTexture.visible = this._pressTexture.visible = this._normalTexture.visible = false;
		this._inactiveTexture.visible = true;

		if(this._isAutoPlay || this._isMaxBet) this._baseTextfield.scale.set(1, 1);
		
		this._baseTextfield.alpha = 0.5;
	}

	public set text(s:string)
	{
		this._baseTextfield.text = s;
	}
	
	public enable():void
	{
		this.buttonMode = true;
		this._enabled = true;
		this.interactive = true;

		if(this._isOver)
		{
			this.onOut();
			return;
		}
        
       	this.on("mouseover", this.onOver);
		this.on("mouseout", this.onOut);
       	this.on("mousedown", this.onDown);
       	this.on("pointertap", this.onOver);
		
		this.onOut();
		this._isOver = false;

		this._baseTextfield.alpha = 1;
	}
	
	public makeOnlyOver():void
	{
		this.off("mouseover", this.onOver);
		this.off("mouseout", this.onOut);
		this.off("mousedown", this.onDown);
        this.off("pointertap", this.onOver);
		
		this.onDown();
		this._isOver = true;
	}
	
	public makeReturnOver():void
	{
		this.onOut();
		
		this.on("mouseover", this.onOver);
		this.on("mouseout", this.onOut);
		this.on("mousedown", this.onDown);
        this.on("pointertap", this.onOver);
	}

	public get width():number
	{
		return this._normalTexture.width;
	}

	public get height():number
	{
		return this._normalTexture.height;
	}
}