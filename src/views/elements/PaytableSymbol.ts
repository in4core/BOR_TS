import { Container, Sprite } from "pixi.js";
import Assets from "../../controllers/Assets";
import MultiStyleText from "pixi-multistyle-text";
import Utility from "../../utils/Utility";
import Config from "../../utils/Config";

export default class PaytableSymbol extends Container
{
	private _img:Sprite = new Sprite();
	private _text5:MultiStyleText = new MultiStyleText(" ", Config.TEXT_STYLES.paytableSymbol);
	private _text4:MultiStyleText = new MultiStyleText(" ", Config.TEXT_STYLES.paytableSymbol);
	private _text3:MultiStyleText = new MultiStyleText(" ", Config.TEXT_STYLES.paytableSymbol);
	private _text2:MultiStyleText = new MultiStyleText(" ", Config.TEXT_STYLES.paytableSymbol);
	private _text1:MultiStyleText = new MultiStyleText(" ", Config.TEXT_STYLES.paytableSymbol);
	private _textCont:Container = new Container();

	private _id:number = -1;
	private _params = null;

    constructor(id:number, params)
    {
        super();
        super.on("added", this.onAdded);

		this._id = id;
		this._params = params;
    }

    private onAdded(event):void
    {
		super.removeListener("added", this.onAdded);
		
		this.addChild(this._textCont);
		this.addChild(this._img);

		this._img.texture = Assets.getSource("sym" + this._id);

		if(!Utility.isMobilePlatform()) this._img.scale.set(0.8);
		
		this._textCont.x = this._img.width + 20;
		
		this._text5.y = 0;
		this._text4.y = this._text5.y + this._text5.height + 5;
		this._text3.y = this._text4.y + this._text4.height + 5;
		this._text2.y = this._text3.y + this._text3.height + 5;
		this._text1.y = this._text2.y + this._text2.height + 5;
	}
	
	public update(bet:number)
	{
		for (let i = 0; i < this._params.length; i++)
		{
			if (this._id == this._params[i].sym)
			{
				let fs = this._params[i].freespins;
				let sg = fs && this._id != Config.SCATTER ? (" + " + fs + "SG") : "";
				let kn = this._id == Config.SCATTER ? 10 : 1;
				let len = this._params[i].n;
				let mul = this._params[i].mul;
				let tf = this["text" + len];
				
				tf.text = len + "   <c>" + (mul * bet * kn).toFixed(2) + sg;

				this._textCont.addChild(tf);
			}
		}

		this._textCont.y = this._img.height / 2 - this._textCont.height / 2 + 5;
	}
}