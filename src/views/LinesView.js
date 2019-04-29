import { Container, Graphics } from "pixi.js";
import Config from "../utils/Config";
import Assets from "../controllers/Assets";
import FastSoundManager from "../utils/FastSoundManager";
import LinesEvent from "../events/LinesEvent";
import GFXUtil from "../utils/GFXUtil";
import GameUtils from "../utils/GameUtils";

export default class LinesView extends Container
{
    constructor(baseModel)
    {
        super();
		super.on("added", this.onAdded);
		
		//this.nextSoundLine = this.nextSoundLine.bind(this);

        this.baseModel = baseModel;

		this.linesCont = new Container();
		this.squaresCont = new Container();
		this.dotsCont = new Container();
		this.linesMask = new Graphics();

		this.lineShowTimer = -100;
		this.lineShowIndex = 0;

		this.startWidth = 0;
		this.startHeight = 0;
		this.lastSound = null;
		this.noSound = false;
		this.useFill = false;
    }
    
    onAdded(event)
    {
        super.removeListener("added", this.onAdded);

		this.addChild(this.linesCont);
		this.addChild(this.dotsCont);
		this.addChild(this.squaresCont);
		this.addChild(this.linesMask);

		this.squaresCont.x = 50;
		this.squaresCont.y = 0;

		var coords = [[],[],[],[],[],[],[],[],[],[]];

		for(let i = 0; i < 10; i++)
		{
			const dot = new PIXI.extras.TilingSprite(Assets.getSource("win_lines"), 79, 56);
			dot.y = (dot.height + 20) * i + 110-44;
			dot.x = -79;
			dot.interactive = true;
			dot.id = Config.linesLeft[i] - 1;
			dot.tilePosition.set(0, -(Config.linesLeft[i] - 1) * 56);
			
			const dot2 = new PIXI.extras.TilingSprite(Assets.getSource("win_lines"), 79, 56);
			dot2.y = (dot2.height + 20) * i - 10;
			dot2.x = 1528;
			dot2.interactive = true;
			dot2.id = Config.linesRight[i] - 1;
			dot2.tilePosition.set(0, -(Config.linesRight[i] - 1) * 56);
			
			this.dotsCont.addChild(dot2);
			this.dotsCont.addChild(dot);

			coords[dot.id][0] = dot.y;
			coords[dot2.id][1] = dot2.y;

			dot.cacheAsBitmap = dot2.cacheAsBitmap = true;
		}
		
		const lines = this.baseModel.initParams.lines;
		const wn = 4;
		const an = 3;

		for (let i = 0; i < lines.length; i++)
		{
			const a = lines[i];
			const cont = new Container();
			
			const lineC = new Graphics();
			const lineU = new Graphics();
			const lineD = new Graphics();

			lineC.lineStyle(wn, GFXUtil.colors10[i], 1, 0);
			lineU.lineStyle(an, GFXUtil.colors10[i] - 0x333333, 1, 0);
			lineD.lineStyle(an, GFXUtil.colors10[i] - 0x333333, 1, 0);

			let startY = coords[i][0] + 25;
			let endY = coords[i][1] + 25;

			let start = 0;
			
			for (let j = 0; j < a.length; j++)
			{
				const center = GameUtils.getCenterSymbol(j, a[j]);

				if(i == 0 || i == 1 || i == 2) center.y = startY = endY;
				if(i == 7 && j == 1) center.y = startY;
				if(i == 7 && j == 3) center.y = endY;
				if(i == 8 && j == 1) center.y = startY;
				if(i == 8 && j == 3) center.y = endY;
				
				if (j == 0) 
				{
					lineC.moveTo(0, startY);
					lineC.lineTo(center.x, startY);
					lineU.moveTo(0, startY - an);
					lineU.lineTo(center.x, startY - an);
					lineD.moveTo(0, startY + an);
					lineD.lineTo(center.x, startY + an);
					
					start = lineC.width;
				}
				else if(j == a.length - 1)
				{
					lineC.lineTo(center.x, endY);
					lineC.lineTo(center.x + start, endY);
					lineU.lineTo(center.x, endY - an);
					lineU.lineTo(center.x + start, endY - an);
					lineD.lineTo(center.x, endY + an);
					lineD.lineTo(center.x + start, endY + an);
				}
				else 
				{
					lineC.lineTo(center.x, center.y);
					lineU.lineTo(center.x, center.y - an);
					lineD.lineTo(center.x, center.y + an);
				}
			}
			
			cont.addChild(lineC,lineD,lineU);
			cont.cacheAsBitmap = true;
            this.linesCont.addChild(cont);
		}

		for(let i = 0; i < Config.MAX_REELS * Config.MAX_SYMBOLS; i++)
		{
			const square = new Graphics();
			
			GFXUtil.redrawSquare(square);

			square.x = Math.floor(i / Config.MAX_SYMBOLS) * Config.REEL_SEPARATOR;
			square.y = Math.floor(i % Config.MAX_SYMBOLS) * square.height;

			this.squaresCont.addChild(square);
		}

		this.startWidth = this.linesCont.width;
		this.startHeight = this.height + 20;
		this.linesCont.mask = this.linesMask;

		this.hideLines();
		this.hideSquares();
	}
	
    onOutDot(e) 
	{
		this.hideLines();
	}
	
	onOverDot(e) 
	{
        const id = e.target.id;
        
        this.showLine(id);
        
		for (let i = 0; i < this.dotsCont.children.length; i++)
		{
			const cur = this.dotsCont.getChildAt(i);
			if (cur.id == id) cur.alpha = 1;
			else cur.alpha = 0.2;
		}
	}
	
	hideLines()
	{
		for (let i = 0; i < this.linesCont.children.length; i++)
		{
			this.linesCont.getChildAt(i).visible = false;
		}
		
		/* for (let i = 0; i < this.dotsCont.children.length; i++)
		{
			const cur = this.dotsCont.getChildAt(i);
			cur.alpha = 1;
		}  */
	}
	
	showLine(num)
	{
		this.hideLines();
		this.linesCont.getChildAt(num).visible = true;

		/* for (let i = 0; i < this.dotsCont.children.length; i++)
		{
			const cur = this.dotsCont.getChildAt(i);
			if (cur.id == num) cur.alpha = 1;
			else cur.alpha = 0.2;
		} */
	}

	startShowWinLines(useFill)
	{
		this.useFill = useFill;
		this.lineShowIndex = 0;
		this.nextSoundLine();
	}

	nextSoundLine()
	{
		let o = this.baseModel.spinParams.lines;

		if(this.useFill) o = GameUtils.getSpecialBonusLines(this.baseModel.initParams.lines, this.baseModel.spinParams.special.pos, this.baseModel.spinParams.special.win);

		if(this.lineShowIndex == o.length) 
		{
			this.lineShowIndex = 0;

			if(!this.noSound && o.length > 1 && !this.useFill) 
			{
				this.noSound = true;
				this.lineShowTimer = setInterval(() => this.nextSoundLine(), 1000);
				this.emit(LinesEvent.LINES_COMPLETED);
				return;
			}
			else if(o.length == 1 || this.useFill) 
			{
				if(this.useFill) this.emit(LinesEvent.LINES_COMPLETED_SPECIAL);
				else this.emit(LinesEvent.LINES_COMPLETED);
				return;
			}
		}

		const lineObject = o[this.lineShowIndex];
		
		if(!this.noSound) 
		{
			if(!this.useFill) 
			{
				this.lastSound = FastSoundManager.playSound(this.getLogicSounds(lineObject.n, lineObject.sym), false, 0, () => this.nextSoundLine());
			}
			else
			{
				this.lastSound = FastSoundManager.playSound("f_ding", false, 0, () => this.nextSoundLine());
			}
		}

		this.showLine(lineObject.line);
		this.hideSquares();

		GFXUtil.clearMaskLine(this.linesMask, this.startWidth, this.startHeight);

		let kx = 0;

		for(let i = 0; i < lineObject.pos.length; i++)
		{
			const ps = lineObject.pos[i];
			const n = (i * Config.MAX_SYMBOLS) + ps;

			if(ps != -1) 
			{
				this.squaresCont.getChildAt(n).visible = true;

				let last = kx == 0;
				
				kx++;

				let win = this.baseModel.hudModel.currency + " " + (lineObject.win / 100).toFixed(2);

				GFXUtil.redrawSquare(this.squaresCont.getChildAt(n), GFXUtil.colors10[lineObject.line], 3, 4, last, win);

				const $x = this.squaresCont.getChildAt(n).x + 50;
				const $y = this.squaresCont.getChildAt(n).y;
				const $px = Config.SYMBOL_WIDTH;
				const $py = Config.SYMBOL_HEIGHT;

				GFXUtil.addHoleMaskLine(this.linesMask, $x, $y, $px, $py);

			}
		}


		this.emit(LinesEvent.NEXT_LINE, this.lineShowIndex, this.useFill);

		this.lineShowIndex++;
	}

	clear()
	{
		clearInterval(this.lineShowTimer);
		if(this.lastSound) FastSoundManager.stopSound(this.lastSound);
		this.noSound = false;
		this.hideLines();
		this.hideSquares();
	}
	
	
	hideSquares()
	{
		GFXUtil.clearMaskLine(this.linesMask, this.startWidth, this.startHeight);

		for(let i = 0; i < this.squaresCont.children.length; i++)
		{
			this.squaresCont.getChildAt(i).visible = false;
		}
	}
	
	showWinLines()
	{
		const o = this.baseModel.spinParams.lines;
		
		for (let i = 0; i < o.length; i++)
		{
			this.linesCont.getChildAt(o[i].line).visible = true;
			
			for (let j = 0; j < this.dotsCont.children.length; j++)
			{
				/* const cur = this.dotsCont.getChildAt(j);
				if (cur.id == o[i].line) cur.alpha = 1;
				else cur.alpha = 0; */
			} 
		}
	}
	
	disableDotLines()
	{
		for (let i = 0; i < this.dotsCont.children.length; i++)
		{
			const cur = this.dotsCont.getChildAt(i);
			cur.interactive = false;
			cur.alpha = 1;
		} 
	}
	
	enableDotLines()
	{
		for (let i = 0; i < this.dotsCont.children.length; i++)
		{
			const cur = this.dotsCont.getChildAt(i);
			cur.interactive = true;
			cur.alpha = 1;
		} 
	}
	
	getLogicSounds(len , id)
	{
		len = Number(len);
		id = Number(id);

		if (len == 2)
		{
			if (id == 5) return "win2";
			if (id == 4) return "win2";
			if (id == 3) return "win2";
			if (id == 2) return "win10";
		}
		else if (len == 3)
		{
			if (id == 10) return "win2";
			if (id == 9) return "win2";
			if (id == 8) return "win2";
			if (id == 7) return "win2";
			if (id == 6) return "win2";
			if (id == 5) return "short_6";
			if (id == 4) return "short_7";
			if (id == 3) return "short_8";
			if (id == 2) return "short_9";
		}
		else if (len == 4)
		{
			if (id == 10) return "win20";
			if (id == 9) return "win20";
			if (id == 8) return "win20";
			if (id == 7) return "win25";
			if (id == 6) return "win25";
			if (id == 5) return "long_6";
			if (id == 4) return "long_7";
			if (id == 3) return "long_8";
			if (id == 2) return "long_9";
		}
		else if (len == 5)
		{
			if (id == 10) return "oneadmi";
			if (id == 9) return "oneadmi";
			if (id == 8) return "oneadmi";
			if (id == 7) return "threeadmi";
			if (id == 6) return "threeadmi";
			if (id == 5) return "long_6";
			if (id == 4) return "long_7";
			if (id == 3) return "long_8";
			if (id == 2) return "long_9";
		}		
		
		return "";
	}
}