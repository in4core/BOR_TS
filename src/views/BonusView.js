import { Container, Graphics, Sprite, Text } from "pixi.js";
import Assets from "../controllers/Assets";
import FastSoundManager from "../utils/FastSoundManager";

export default class BonusView extends Container
{
    constructor()
    {
        super();
        super.on("added", this.onAdded);

		this.onTime = this.onTime.bind(this);
		this.destroyBonus = this.destroyBonus.bind(this);
		this.startBonusComplete = this.startBonusComplete.bind(this);
		this.endBonusComplete = this.endBonusComplete.bind(this);

        this.back = new Sprite(Assets.getSource("dialogbox"));
        this.book = new Sprite(Assets.getSource("bookflip_back"));
        this.pages = new Sprite(Assets.getSource("bookflip_pages"));
        
        this.pagesMask = new Graphics();
        this.symbolsMask = new Graphics();
        
        this.symbolsCur = null;
        
        this.wValuesPages = [0 , 154, 108, 73, 41, 69, 131, 162];
        
        this.nValuesSymbols = [52, 101, 132, 126];
        
        this.listTimer = -1;//new Timer(60);
        this.listTimerCount = 0;
        
        this.nIndex = 0;
        
        this.standBit = new Sprite(Assets.getSource("bookflip_symbol_4"));
        this.standMask = new Graphics();
        
        this.onIndex = 0;
        
        this.isFinish = false;
        
        this.conText = new Text('', {fontFamily : 'Avenir_Demi', fontSize: 45, fill : "#fcd159", align : 'center',
		dropShadow: true,
		dropShadowColor: '#000000',
		dropShadowBlur: 4,
		dropShadowAngle: Math.PI / 6,
		dropShadowDistance: 2
		});
    }
    
    onAdded(event)
    {
        super.removeListener("added", this.onAdded);

        this.addChild(this.back);
		this.addChild(this.book);
		this.addChild(this.conText);
		
		this.book.x = this.back.width / 2 - this.book.width / 2;
		this.book.y = this.back.height / 2 - this.book.height / 2;
		
		this.addChild(this.pages);
		
		this.pagesMask.beginFill(0);
		this.pagesMask.drawRect(0, 0, 1, 288);
		this.pagesMask.endFill();
		
		this.pages.mask = this.pagesMask;
		
		this.addChild(this.pagesMask);
		
		this.symbolsMask.beginFill(0);
		this.symbolsMask.drawRect(0, 0, this.nValuesSymbols[0], 170);
		this.symbolsMask.endFill();
		
		this.standMask.beginFill(0);
		this.standMask.drawRect(0, 0, this.nValuesSymbols[3], 170);
		this.standMask.endFill();
		
		this.standBit.mask = this.standMask;
		
		this.addChild(this.standMask);
		
		this.pages.y = this.book.y;
		this.pages.x = 401;
		
		this.pagesMask.x = this.pages.x;
		this.pagesMask.y = this.pages.y;
    }

    startBonus(secondFS = false, sg = 0)
	{
		if (secondFS)
		{
			this.endBonus("_second_", null, sg);
			return;
		}
        
        this.destroyBonus();
		
		this.book.visible = this.pages.visible = true;
		this.conText.visible = true;

		var tsg = sg == 0 ? "" : " + " + sg + " SG";

		this.conText.text = "10 Free Games" + tsg + "\n\n\n\n\n\n+ Special Expanding Symbol";

		this.conText.x = this.back.width / 2 - this.conText.width / 2;
		this.conText.y = this.back.height / 2 - this.conText.height / 2;
		
		this.listTimer = setInterval(this.onTime, 60);
		this.onTime(null);
    }
    
    endBonus(win, played = null, sgTotal)
	{
		this.destroyBonus();

		var tsg = sgTotal == 0 ? "" : " + " + sgTotal + " SG";
		
		let text = "Congratulations!\n\nYou won: " + win + "\n\n" + played + " Free Spins Played\n" + (sgTotal == 0 ? "" : sgTotal + " SG Played");
		
		if (win == "_second_") text = "Congratulations!\n\nYou won more 10 Free Spins" + tsg + "\n\nGood luck!";
		
		this.book.visible = this.pages.visible = false;
		this.conText.visible = true;
		this.conText.text = text;
		
		this.conText.x = this.back.width / 2 - this.conText.width / 2;
		this.conText.y = this.back.height / 2 - this.conText.height / 2;
		
        if(win == "_second_") 
        {
            setTimeout(this.startBonusComplete, 1000);
        }
        else 
        {
            FastSoundManager.playSound("f_end", false, 0, this.endBonusComplete);
        }
    }
	
	startBonusComplete()
	{
		this.emit("start_bonus_complete");
	}
	
	endBonusComplete()
	{
		this.emit("end_bonus_complete");
	}

    onTime(e) 
	{
		this.listTimerCount ++;
		if (this.listTimerCount == 8)
		{
			
			this.pagesMask.width = 0;
			this.pages.x = 401;
			this.pagesMask.x = this.pages.x;
            clearInterval(this.listTimer);
            this.listTimerCount = 0;
			this.listTimer = setInterval(this.onTime, 60);
			
			this.onIndex++;
			
			if (this.onIndex < 4) return;
			
			if (this.symbolsCur.parent != null)  this.addChildAt(this.standBit, 2);
			
			this.createImageSymbol( 4);
			
			this.standBit.x = this.symbolsCur.x;
			this.standBit.y = this.symbolsCur.y;
			
			this.standMask.x = 390 - this.nValuesSymbols[3];
			this.standMask.y = this.standBit.y;
			
			this.nIndex++;
			
			if (this.isFinish)
			{
				FastSoundManager.playSound("f_fin_page");
				clearInterval(this.listTimer);
				setTimeout( this.startBonusComplete, 1000);
				return;
			}
			
			
			if (this.nIndex == this.getRandomSymbol().length) 
			{
				this.nIndex = BonusView.bonusSymbol;
				this.isFinish = true;
			}
			
			return;
		}
		
		this.pagesMask.width = this.wValuesPages[this.listTimerCount];
		
		if(this.listTimerCount > 0) this.pages.x -= this.wValuesPages[this.listTimerCount - 1];
		
		if (this.listTimerCount == 5) 
		{
			FastSoundManager.playSound("f_page");
			
			this.pagesMask.x -= 66;
			this.pages.x -= 66;
			
			this.createImageSymbol( 1);
		}
		else if (this.listTimerCount == 6)
		{
			this.pagesMask.x -= 62;
			this.pages.x -= 62;
			
			this.createImageSymbol( 2);
		}
		else if (this.listTimerCount == 7)
		{
			this.pagesMask.x -= 32;
			this.pages.x -= 32;
			
			this.createImageSymbol( 3);
		}
	}
	
	destroyBonus()
	{
		this.nIndex = 0;
        this.onIndex = 0;
        this.listTimerCount = 0;
		
		if (this.standBit != null && this.standBit.parent != null) this.removeChild(this.standBit);
		if (this.symbolsCur != null && this.symbolsCur.parent != null) this.removeChild(this.symbolsCur);
		
		this.isFinish = false;
    }
    
    createImageSymbol(id)
	{
		if (this.symbolsCur != null && this.symbolsCur.parent != null) this.removeChild(this.symbolsCur);
		
		if (this.onIndex < 3) return;
		
		this.symbolsCur = new Sprite(Assets.getSource("bookflip_symbol_" + id));
		this.symbolsCur.x = 390 - this.nValuesSymbols[id - 1];
		
		if (id == 1) this.symbolsCur.y = this.book.y + 60;
		else if (id == 2) this.symbolsCur.y = this.book.y + 57;
		else if (id == 3) this.symbolsCur.y = this.book.y + 76;
		else if (id == 4) this.symbolsCur.y = this.book.y + 85;
		
		this.addChild(this.symbolsCur);
		
		this.symbolsMask.width = this.nValuesSymbols[id - 1];
		this.symbolsCur.mask = this.symbolsMask;
		this.symbolsMask.x = this.symbolsCur.x;
		this.symbolsMask.y = this.symbolsCur.y;
		
		
		if(this.isFinish) this.symbolsCur.x -= (BonusView.bonusSymbol - 2)  * this.nValuesSymbols[id - 1];
		else this.symbolsCur.x -= this.getRandomSymbol()[this.nIndex] * this.nValuesSymbols[id - 1];
		
		this.addChild(this.symbolsMask);
	}
	
	getRandomSymbol()
	{
		return [1, 6, 3, 4, 5, 8, 2, 7];
	}

    get width()
    {
        return this.back.width;
    }

    get height()
    {
        return this.back.height;
    }
}

BonusView.bonusSymbol = 3;