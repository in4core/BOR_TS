import { Container, Text, Sprite } from "pixi.js";
import Assets from "../../controllers/Assets";
import PaytableSymbol from "./PaytableSymbol";
import HUDModelEvent from "../../events/HUDModelEvent";
import Config from "../../utils/Config";

export default class PaytableViewMobile extends Container
{
    constructor(baseModel)
    {
        super();
        super.on("added", this.onAdded);

        this.baseModel = baseModel;

        this.logo = new Sprite(Assets.getSource("logo"));
	    this.textA = new Text('', {fontFamily : 'Avenir_Medium', fontSize: 60, fill : "#ffffff", align : 'center'});
	
	    this.content = new Container();
    }

    onAdded(e)
    {
        super.removeListener("added", this.onAdded);

        this.addChild(this.logo);
		this.addChild(this.content);
		
		this.content.addChild(this.textA);
		
		this.textA.text = "SYMBOL PAYOUT VALUES";
		
        this.content.y = this.logo.height + 50;
        
        this.baseModel.hudModel.on(HUDModelEvent.CHANGE, this.onChangeHUDValues, this);
    }

    onChangeHUDValues(e)
    {
        for(let i = 1; i < this.content.children.length; i++)
        {
            const sym = this.content.getChildAt(i);
            if( sym instanceof PaytableSymbol ) sym.update(this.baseModel.hudModel.currentBet);
        }
    }

    resizeLandscape()
	{
		this.content.removeChildren();
		this.content.addChild(this.textA);
		
		let j = 0;
		let k = 80;
		
		for (let i = 0; i < 11; i++)
		{
			if (i == 1 || i == 0) continue;
			
			const paySymbol = new PaytableSymbol(i, this.baseModel.initParams.paytable);
            this.content.addChild(paySymbol);
			
			paySymbol.x = (j % 3) * 550;
			
			if (j % 3 == 0 && i != 2) k += 290;
			
			paySymbol.y = k;
			
			j++;
		}
		
        Config.createPaytableContent(this.content, this.baseModel.initParams);
        
        this.logo.x = (Config.MAX_WIDTH - this.parent.x) / 2 - this.logo.width / 2 - 5;

        this.onChangeHUDValues(null);

    }
}