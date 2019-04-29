import { Point, Text } from "pixi.js";
import GFXUtil from "./GFXUtil";
import PaytableSymbol from "../views/elements/PaytableSymbol";
import Utility from "./Utility";

export default class Config
{
    public static MAX_WIDTH:number = 1920;
    public static MAX_HEIGHT:number = 1080;

    public static MAX_SYMBOLS:number = 3;
    public static MAX_REELS:number = 5;

    public static REEL_SEPARATOR:number = 291;
    public static SYMBOL_WIDTH_REAL:number = 222; 
    public static SYMBOL_HEIGHT_REAL:number = 222;
    public static SYMBOL_SCALE:number = 1.2;
    public static SYMBOL_WIDTH:number = Config.SYMBOL_WIDTH_REAL * Config.SYMBOL_SCALE;
    public static SYMBOL_HEIGHT:number = Config.SYMBOL_HEIGHT_REAL * Config.SYMBOL_SCALE;

    public static TIME_NORMAL_STOP:Array<number> = [800, 300];
    public static TIME_QUICK_STOP:Array<number> = [200, 100];

    public static linesLeft:Array<number> = [4, 2, 9, 6, 1, 7, 8, 3, 5, 10];
    public static linesRight:Array<number> = [10, 4, 2, 8, 6, 1, 7, 9, 3, 5];
    public static winPosition:Array<number> = [1, 0, 2, 2, 0, 2, 0, 1, 1, 1];

    public static SCATTER:number = 0;
    public static WILD:number = -1;

    public static SYMBOLS_MAP_SELECT:Object = 
    {
        "scatters" : new Point(9, 8),
        "sym5" : new Point(7, 5),
        "sym4" : new Point(6, 4),
        "sym3" : new Point(5, 5),
        "sym2" : new Point(5, 5),
        "sym0" : new Point(5, 5)
    };

    public static TEXT_STYLES = 
    {
        paytableHeaders : {fontFamily : 'Avenir_Medium', fontSize: Utility.isMobilePlatform() ? 60 : 24, fill : "#ffffff", align : 'left'},
        paytableTexts : {fontFamily : 'Avenir_Medium', fontSize: Utility.isMobilePlatform() ? 46 : 21, fill : "#ffffff", align : 'left', wordWrap:true, 
        wordWrapWidth: Utility.isMobilePlatform() ? 1600 : 1370},

        paytableSymbol : { 
            default : { fontFamily:"Avenir_Medium", fill:"#fcd159", fontSize:Utility.isMobilePlatform() ? 34 : 30 }, 
            c : { fontFamily:"Avenir_Medium", fill:"#ffffff", fontSize:Utility.isMobilePlatform() ? 34 : 30} 
        },

        desktopHUD_fs_totalwin : { 
            default : { fontFamily:"Avenir_Medium", fill:"#ffffff", fontSize:28, align:"center" }, 
            c : { fontFamily:"Avenir_Demi", fill:"#fcd159", fontSize:26 , align:"center"} 
        },

        sgText : { 
            default : { fontFamily:"Avenir_Medium", fill:"#ffffff", fontSize:28, align:"center" }, 
            c : { fontFamily:"Avenir_Medium", fill:"#fcd159", fontSize:28 , align:"center"} 
        },

        defaultHUDDesktopValues : {fontFamily : 'Avenir_Demi', fontSize: 30, fill : "#ffffff", align : 'center'},
        defaultHUDDesktopTexts : {fontFamily : 'Avenir_Medium', fontSize: 18, fill : "#ffffff", align : 'center'},
        desktopMenuButtonsText : {fontFamily : 'Avenir_Medium', fontSize: 28, fill : "#ffffff", align : 'left',
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 4
        },

        desktopButtonsText : {fontFamily : 'Avenir_Demi', fontSize: 30, fill : "#ffffff", align : 'center',
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 2
        },

        linesWinonSquareText : {fontFamily : 'Avenir_Medium', fontSize: 26, fill : "#ffffff", align : 'center'},
        paytableLineBoxLineText : { fontFamily:"Avenir_Demi", fill:"#ffffff", fontSize:30},

        mobileMenuHeadersText : {fontFamily : 'Avenir_Medium', fontSize: 66, fill : "#ffffff", align : 'center'},
        mobileElementBoxHeader : {fontFamily : 'Avenir_Medium', fontSize: 44, fill : "#aaaaaa", align : 'center'},
        mobileElementBoxValue : {fontFamily : 'Avenir_Medium', fontSize: 88, fill : "#ffffff", align : 'center'},
        mobileCheckBoxValue : {fontFamily : 'Avenir_Medium', fontSize: 46, fill : 0xffffff, align : 'center'},

        mobileHUDText : { 
            default : { fontFamily:"Avenir_Medium", fill:"#ffffff", fontSize:54 }, 
            c : { fontFamily:"Avenir_Demi", fill:"#fcd159", fontSize:54} 
        }

    };
    
    constructor()
    {

    }

    static resizeApplication(stage)
    {
        const w = Math.max(window.innerWidth, document.documentElement.clientWidth);
        const h = Math.min(window.innerHeight, document.documentElement.clientHeight);
        
        const scaleFactor = Math.min(
            w / Config.MAX_WIDTH,
            h / Config.MAX_HEIGHT
        );

        const newWidth = Math.ceil(Config.MAX_WIDTH * scaleFactor);
        const newHeight = Math.ceil(Config.MAX_HEIGHT * scaleFactor);

        stage.scale.set(scaleFactor);

        stage.x = Math.floor(w / 2 - newWidth / 2);
        stage.y = Math.floor(h / 2 - newHeight / 2); 
    }

    static resizeApplicationNoScale(stage)
    {
        stage.scale.set(1);
        stage.x = stage.y = 0;
    }

    static createPaytableContent(content, models)
    {
        const h1 = new Text("Mystery Symbol\n".toUpperCase(), Config.TEXT_STYLES.paytableHeaders);

        const t1 = new Text(
            "Mystery Symbol is Wild and substitute for all symbols in a combination on a pay line." +								
            " Winnings of 3 and more scattered Mystery symbols are paid as total bet times the bet multiplier " +					
             "3,4 or 5 scattered Mystery symbols award 10 Free Spins with Special Expanding symbol feature in it " + 				
             "Mystery symbol can appear in both main game and free spins.\n", Config.TEXT_STYLES.paytableTexts);

        const h2 = new Text("Free Spins with Special Expanding symbol feature\n".toUpperCase(), Config.TEXT_STYLES.paytableHeaders);

        const t2 = new Text(
            "Free spins plays automatically at the Level and Coin Value at which they were won. All payments are " + 																									
            "made in accordance with the paytable. Additional Free Spins can be won in the current free spins series, " + 																									
            "according to general rules\n", Config.TEXT_STYLES.paytableTexts);

        const t3 = new Text(
            "One Special Expanding symbol is randomly selected from the whole set of symbols except for the Mystery symbol. "+						
            "The selected Special symbol remains special for the whole Free Spins series, including all possibly additional Free Spins. "+					
            "The Special symbol will expand the reel where it present and will pay like the regular symbol but even on non-adjacent "+					
            "positions. The feature will be triggered in Free Spins only and in case of enough Special symbol for a win are present.\n"+						                 
            "The Special Expanding symbol can not be substituted by a Mystery symbol\n", Config.TEXT_STYLES.paytableTexts);
        
        const bs = new PaytableSymbol(Config.SCATTER, models.paytable);

        const h3 = new Text("Special Games feature\n".toUpperCase(), Config.TEXT_STYLES.paytableHeaders);

        const t4 = new Text(
            "The Special Games feature is a free games that can be won in both main game and Free Spins with Special "+				
            "Expanding symbol feature according to Symbol payout values, that marked with SG.\n"+						
            "The Special Games feature can not be won with Sprecial Expanding symbol payout\n", Config.TEXT_STYLES.paytableTexts);

        const h4 = new Text("Bet Lines\n".toUpperCase(), Config.TEXT_STYLES.paytableHeaders);

        const t5 = new Text(
            "Only the highest win per bet line is paid. Bet line wins pay if in succession from the leftmost reel to the "+					
            "rightmost reel. The payout values are based on current bet level and increases proportionally with its "+ 					
            "changing.  Malfunction voids all pays and plays.\n", Config.TEXT_STYLES.paytableTexts);

        content.addChild(h1);
        content.addChild(t1);
        content.addChild(bs);
        content.addChild(h2);
        content.addChild(t2);
        content.addChild(t3);
        content.addChild(h3);
        content.addChild(t4);
        content.addChild(h4);
        content.addChild(t5);

        h1.y = content.height + 20;
        bs.y = content.height;
        t1.y = content.height + 30;

        h2.y = content.height + 40;
        t2.y = h2.y + h2.height;
        t3.y = content.height + 20;

        h3.y = content.height;
        t4.y = h3.y + h3.height;

        h4.y = content.height;
        
        const linesContainer = GFXUtil.getLineBoxGFXPaytable(models.lines);
        content.addChild(linesContainer);

        if(Utility.isMobilePlatform()) linesContainer.scale.set(1.2);

        linesContainer.y = Math.floor(h4.y + h4.height + 40);
        t5.y = linesContainer.y + linesContainer.height + 20;
    }
}







