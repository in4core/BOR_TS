import Config from "./Config";
import { Point } from "pixi.js";

export default class GameUtils
{
    constructor()
    {

    }

    static getCenterSymbol(x:number, y:number, start:number = 50)
    {
        var p = new Point();
		
		p.x = start + Config.SYMBOL_WIDTH / 2 + x * Config.REEL_SEPARATOR;
		p.y = (y * Config.SYMBOL_HEIGHT) + Config.SYMBOL_HEIGHT / 2;
		
		return p;
    }

    static getSpecialBonusLines(arr, pos, nwin)
    {
        let o = [];
        let w = nwin / arr.length;

        for(let i:number = 0; i < arr.length; i++)
        {
            let obj = { line:i, pos:[], win:w  };

            for(let j = 0; j < pos.length; j++)
            {
                if(pos[j] == 1) obj.pos.push(arr[i][j]);
                else if(pos[j] == -1) obj.pos.push(-1);
            }

            o.push(obj);
        }

        return o;
    }

    static getTeasersArray(reels, id)
    {
        let k = 1;
        let m = [];

        for(let i = 0; i < reels.length; i++)
        {
            let reel = reels[i];

            for(let j = 0; j < reel.length; j++)
            {
                if(reel[j] == Config.SCATTER)
                {
                    if(i <= 2 || (i == 3 && k > 1) || (i == 4 && k > 2))
                    {
                        m.push(k);
                        k++;
                        break;
                    }
                    else 
                    {
                        m.push(-1);
                        break;
                    }
                }
                else if(j == reel.length - 1)
                {
                    m.push(-1);
                }
            }
        }
        
        if(m.length < reels.length) m.push(-1);
        
        return m[id];
    }
}