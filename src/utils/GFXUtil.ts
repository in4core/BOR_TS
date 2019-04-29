import Config from "./Config";
import { Text, Graphics, Container } from "pixi.js";

export default class GFXUtil 
{
    public static colors10:Array<number> = [0x76b3fc , 0xdf5656, 0x5bab4f, 0xf2e64f, 0xff9cdd , 0xd1ff67 , 0xf6bca7, 0xafd8db, 0xfec573 , 0xeab0ff];

    constructor()
    {

    }

    static redrawSquare(square:Graphics, color:number = GFXUtil.colors10[0], an:number = 3, wn:number = 4, last:boolean = false, text:string = null)
    {
        square.removeChildren();
        square.clear();
        square.beginFill(color - 0x333333);
       
        square.moveTo(0,0);
        square.lineTo(Config.SYMBOL_WIDTH_REAL,0);
		square.lineTo(Config.SYMBOL_WIDTH_REAL,Config.SYMBOL_HEIGHT_REAL);
		square.lineTo(0,Config.SYMBOL_HEIGHT_REAL);
        square.closePath();

        square.beginFill(color);
        square.moveTo(3,3);
        square.lineTo(3,Config.SYMBOL_HEIGHT_REAL - 3);
		square.lineTo(Config.SYMBOL_WIDTH_REAL - 3,Config.SYMBOL_HEIGHT_REAL - 3);
        square.lineTo(Config.SYMBOL_WIDTH_REAL - 3,3);
        square.addHole();
       
        square.beginFill(color);
        square.moveTo(3,3);
        square.lineTo(Config.SYMBOL_WIDTH_REAL - 3,3);
		square.lineTo(Config.SYMBOL_WIDTH_REAL - 3,Config.SYMBOL_HEIGHT_REAL - 3);
        square.lineTo(3,Config.SYMBOL_HEIGHT_REAL - 3);
        square.closePath();
       
        square.beginFill(color - 0x333333);
        square.moveTo(6,6);
        square.lineTo(Config.SYMBOL_WIDTH_REAL - 6,6);
		square.lineTo(Config.SYMBOL_WIDTH_REAL - 6,Config.SYMBOL_HEIGHT_REAL - 6);
        square.lineTo(6, Config.SYMBOL_HEIGHT_REAL - 6);
        square.addHole(); 

        square.beginFill(color - 0x333333);
        square.moveTo(6,6);
        square.lineTo(Config.SYMBOL_WIDTH_REAL - 6,6);
		square.lineTo(Config.SYMBOL_WIDTH_REAL - 6,Config.SYMBOL_HEIGHT_REAL - 6);
        square.lineTo(6, Config.SYMBOL_HEIGHT_REAL - 6);
        square.closePath(); 

        square.beginFill(color - 0x333333);
        square.moveTo(9,9);
        square.lineTo(Config.SYMBOL_WIDTH_REAL - 9,9);
		square.lineTo(Config.SYMBOL_WIDTH_REAL - 9,Config.SYMBOL_HEIGHT_REAL - 9);
        square.lineTo(9, Config.SYMBOL_HEIGHT_REAL - 9);
        square.addHole(); 
        square.closePath();
        square.endFill();

        if(last)
        {
            square.beginFill(color);
            square.drawRect(Config.SYMBOL_WIDTH_REAL / 2 - 50, -20, 100, 40);
            square.beginFill(0);
            square.drawRect(Config.SYMBOL_WIDTH_REAL / 2 - 50 + 2, -20 + 2, 96, 36);

            let wintext = new Text(text, Config.TEXT_STYLES.linesWinonSquareText);

            wintext.x = Config.SYMBOL_WIDTH_REAL / 2 - wintext.width / 2;
            wintext.y = -15;
            square.addChild(wintext);
        }
        
		square.scale.set(Config.SYMBOL_SCALE, Config.SYMBOL_SCALE);
    }

    static addHoleMaskLine(shape, x, y, wx, wy)
    {
        shape.moveTo(x,y);
        shape.lineTo(x, y + wy);
        shape.lineTo(x + wx, y + wy);
        shape.lineTo(x + wx, y);
        shape.addHole();
        shape.endFill();
    }

    static clearMaskLine(shape, w, h)
    {
        shape.clear();
        shape.beginFill(0xff0000);
        shape.moveTo(0, 0);
        shape.lineTo(w, 0);
        shape.lineTo(w, h);
        shape.lineTo(0, h);
        shape.closePath();
    }

    static getLineBoxGFXPaytable(lines)
    {
        var cont = new Container();

        for(let i = 0; i < lines.length; i++)
        {
            var g = new Graphics();

            g.beginFill(0x222222);
            g.drawRect(0, 0, 39 * 5, 40 * 3);
            g.beginFill(0);
            g.drawRect(3, 3, 39 * 5 - 6, 40 * 3 - 6);
            g.endFill();

            for(let j = 0; j < 15; j++)
            {
                g.beginFill(0x222222);
                
                if(Math.floor(j / 5) == lines[i][Math.floor(j % 5)] ) g.beginFill(0xffffff);

                g.drawRect( Math.floor((j % 5)) * 37 + 8, Math.floor(j / 5) * 37 + 8, 30, 30 );
            }
            
            cont.addChild(g);

            var te = new Text((i + 1).toString(), Config.TEXT_STYLES.paytableLineBoxLineText);

            cont.addChild(te);

            g.x = Math.floor( (i % 5) * (g.width + 75) );
            g.y = Math.floor( Math.floor(i / 5) * (g.height + 75) );
            
            te.x = (g.x + g.width / 2) - te.width / 2;
            te.y = g.y - te.height - 5;
        }

        return cont;
    }
}

