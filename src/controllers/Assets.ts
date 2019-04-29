import * as pixiSound from "pixi-sound";
import { Sprite, Graphics, Container, loaders, Texture } from "pixi.js";
import Config from "../utils/Config";
import Utility from "../utils/Utility";

export default class Assets extends PIXI.utils.EventEmitter
{
    private static _loader:loaders.Loader = new loaders.Loader();
    
    private _host:Container = null;
    
    constructor()
    {
        super();
        pixiSound;
    }

    public static getSourcesList():loaders.ResourceDictionary
    {
        return this._loader.resources;
    }

    static getSource(name):Texture
    {
        return this._loader.resources[name].texture;
    }

    static getSound(name):pixiSound.Sound
    {
        return this._loader.resources[name]["sound"];
    }

    static getResource(name):any
    {
        return this._loader.resources[name].data;
    }

    public loadResouces(host:Container):void
    {
        this._host = host;
        
        Assets._loader
        .add("preloader", "assets/img/preloader.png")
        .load(() => this.startLoadResources());
    }

    private startLoadResources():void
    {
        const loaderSprite:Sprite = new Sprite(Assets.getSource("preloader"));
        const loaderPercent:Graphics = new Graphics();

        let scale:number = 1;

        if(Utility.isMobilePlatform())
        {
            scale = 2;
            loaderSprite.scale.set(scale);
            loaderPercent.scale.set(scale);
        }
        
        loaderSprite.x = Config.MAX_WIDTH / 2 - loaderSprite.width / 2;
        loaderSprite.y = Config.MAX_HEIGHT / 2 - loaderSprite.height / 2 - 15 * scale;
    
        loaderPercent.beginFill(0xFF0000);
        loaderPercent.drawRect(0,0, loaderSprite.width, 4);
        loaderPercent.endFill();
        
        loaderPercent.y = loaderSprite.y + loaderSprite.height + 30 * scale;
        loaderPercent.x = loaderSprite.x;
        loaderPercent.scale.x = 0;

        this._host.addChild(loaderSprite);
        this._host.addChild(loaderPercent);

        Assets._loader
        .add("backNormal", "assets/img/backgroundNormal.jpg")
        .add("backFree", "assets/img/backgroundFS.jpg")
        .add("logo", "assets/img/logo.png")
        .add("rotate", "assets/img/rotate.png")
        .add("arrows", "assets/img/arrows.png")
        .add("circle", "assets/img/ring.png")
        .add("phoneA", "assets/img/phone.png")
        .add("phoneB", "assets/img/phone2.png")
        .add("bg_sg", "assets/img/bg_free_games.png")

        .add("dot_normal", "assets/img/dot_normal.png")
        .add("dot_active", "assets/img/dot_active.png")

        .add("win_lines", "assets/img/winlines.png")

        .add("dm_panel", "assets/img/menu/desktop/dm_panel.png")

        .add("icn_close", "assets/img/menu/mobile/icn_close.png")
        .add("icn_bet_normal", "assets/img/menu/mobile/icn_bet_normal.png")
        .add("icn_bet_active", "assets/img/menu/mobile/icn_bet_active.png")
        .add("icn_paytable_normal", "assets/img/menu/mobile/icn_paytable_normal.png")
        .add("icn_paytable_active", "assets/img/menu/mobile/icn_paytable_active.png")
        .add("icn_settings_normal", "assets/img/menu/mobile/icn_settings_normal.png")
        .add("icn_settings_active", "assets/img/menu/mobile/icn_settings_active.png")
        .add("check_off", "assets/img/menu/mobile/check_off.png")
        .add("check_on", "assets/img/menu/mobile/check_on.png")
        .add("btn_minus", "assets/img/menu/mobile/btn_minus.png")
        .add("btn_plus", "assets/img/menu/mobile/btn_plus.png")
        
        .add("dmi_menu_n", "assets/img/menu/desktop/dmi_menu_n.png")
        .add("dmi_home_n", "assets/img/menu/desktop/dmi_home_n.png")
        .add("dmi_home_h", "assets/img/menu/desktop/dmi_home_h.png")
        .add("dmi_soundon_n", "assets/img/menu/desktop/dmi_soundon_n.png")
        .add("dmi_soundon_h", "assets/img/menu/desktop/dmi_soundon_h.png")
        .add("dmi_soundoff_n", "assets/img/menu/desktop/dmi_soundoff_n.png")
        .add("dmi_soundoff_h", "assets/img/menu/desktop/dmi_soundoff_h.png")
        .add("dmi_paytable_n", "assets/img/menu/desktop/dmi_paytable_n.png")
        .add("dmi_paytable_h", "assets/img/menu/desktop/dmi_paytable_h.png")
        .add("dmi_close_n", "assets/img/menu/desktop/dmi_close_n.png")
        .add("dmi_close_h", "assets/img/menu/desktop/dmi_close_h.png")
        .add("quickspin_normal", "assets/img/menu/desktop/quickspin_normal.png")
        .add("quickspin_hover", "assets/img/menu/desktop/quickspin_hover.png")
        .add("quickspin_active", "assets/img/menu/desktop/quickspin_active.png")
        .add("fullscreen_normal", "assets/img/menu/desktop/fullscreen_normal.png")
        .add("fullscreen_hover", "assets/img/menu/desktop/fullscreen_hover.png")

        .add("btn_advanced_bg_open", "assets/img/hud/mobile/btn_advanced_bg_open.png")
        .add("btn_advanced_bg_open2", "assets/img/hud/mobile/btn_advanced_bg_open2.png")
        .add("icn_advanced_open", "assets/img/hud/mobile/icn_advanced_open.png")
        .add("icn_advanced_close", "assets/img/hud/mobile/icn_advanced_close.png")
        .add("icn_advanced_open2", "assets/img/hud/mobile/icn_advanced_open2.png")
        .add("icn_advanced_close2", "assets/img/hud/mobile/icn_advanced_close2.png")
        .add("icn_advanced_quickspin_normal", "assets/img/hud/mobile/icn_advanced_quickspin_normal.png")
        .add("icn_advanced_quickspin_on", "assets/img/hud/mobile/icn_advanced_quickspin_on.png")
        .add("icn_advanced_autoplay", "assets/img/hud/mobile/icn_advanced_autoplay.png")
        .add("icn_advanced_autoplay_on", "assets/img/hud/mobile/icn_advanced_autoplay_on.png")

        .add("+normal", "assets/img/hud/desktop/+normal.png")
        .add("+hover", "assets/img/hud/desktop/+hover.png")
        .add("+click", "assets/img/hud/desktop/+click.png")
        .add("+disabled", "assets/img/hud/desktop/+disabled.png")

        .add("-normal", "assets/img/hud/desktop/-normal.png")
        .add("-hover", "assets/img/hud/desktop/-hover.png")
        .add("-click", "assets/img/hud/desktop/-click.png")
        .add("-disabled", "assets/img/hud/desktop/-disabled.png")

        .add("btn_big_normal", "assets/img/hud/desktop/btn_big_normal.png")
        .add("btn_big_hover", "assets/img/hud/desktop/btn_big_hover.png")
        .add("btn_big_press", "assets/img/hud/desktop/btn_big_press.png")
        .add("btn_big_inactive", "assets/img/hud/desktop/btn_big_inactive.png")
        .add("spin_normal", "assets/img/hud/desktop/spin_normal.png")
        .add("spin_hover", "assets/img/hud/desktop/spin_hover.png")
        .add("spin_press", "assets/img/hud/desktop/spin_press.png")
        .add("spin_inactive", "assets/img/hud/desktop/spin_inactive.png")
        .add("icn_home", "assets/img/hud/mobile/icn_home.png")
        .add("icn_menu", "assets/img/hud/mobile/icn_menu.png")
        .add("icn_spin", "assets/img/hud/mobile/icn_spin.png")
        .add("icn_spin_stop", "assets/img/hud/mobile/icn_spin_stop.png")
        .add("btn_bet", "assets/img/hud/mobile/btn_bet.png")

        .add("sym10", "assets/img/symbols/static/ten.png")
        .add("sym9", "assets/img/symbols/static/jack.png")
        .add("sym8", "assets/img/symbols/static/queen.png")
        .add("sym7", "assets/img/symbols/static/king.png")
        .add("sym6", "assets/img/symbols/static/ace.png")
        .add("sym5", "assets/img/symbols/static/scarab.png")
        .add("sym4", "assets/img/symbols/static/statue.png")
        .add("sym3", "assets/img/symbols/static/mummy.png")
        .add("sym2", "assets/img/symbols/static/person.jpg")
        .add("sym0", "assets/img/symbols/static/book.jpg")

        .add("sym10_s", "assets/img/symbols/static/special/gold_ten.jpg")
        .add("sym9_s", "assets/img/symbols/static/special/gold_jack.jpg")
        .add("sym8_s", "assets/img/symbols/static/special/gold_queen.jpg")
        .add("sym7_s", "assets/img/symbols/static/special/gold_king.jpg")
        .add("sym6_s", "assets/img/symbols/static/special/gold_ace.jpg")
        .add("sym5_s", "assets/img/symbols/static/special/gold_scarab.jpg")
        .add("sym4_s", "assets/img/symbols/static/special/gold_statue.jpg")
        .add("sym3_s", "assets/img/symbols/static/special/gold_mummy.jpg")
        .add("sym2_s", "assets/img/symbols/static/special/gold_person.jpg")

        .add("sym10_sb", "assets/img/symbols/static/special/blur/blur_gold_ten.jpg")
        .add("sym9_sb", "assets/img/symbols/static/special/blur/blur_gold_jack.jpg")
        .add("sym8_sb", "assets/img/symbols/static/special/blur/blur_gold_queen.jpg")
        .add("sym7_sb", "assets/img/symbols/static/special/blur/blur_gold_king.jpg")
        .add("sym6_sb", "assets/img/symbols/static/special/blur/blur_gold_ace.jpg")
        .add("sym5_sb", "assets/img/symbols/static/special/blur/blur_gold_scarab.jpg")
        .add("sym4_sb", "assets/img/symbols/static/special/blur/blur_gold_statue.jpg")
        .add("sym3_sb", "assets/img/symbols/static/special/blur/blur_gold_mummy.jpg")
        .add("sym2_sb", "assets/img/symbols/static/special/blur/blur_gold_person.jpg")

        .add("sym10_a", "assets/img/symbols/animation/high_ten.png")
        .add("sym9_a", "assets/img/symbols/animation/high_jack.png")
        .add("sym8_a", "assets/img/symbols/animation/high_queen.png")
        .add("sym7_a", "assets/img/symbols/animation/high_king.png")
        .add("sym6_a", "assets/img/symbols/animation/high_ace.png")
        .add("sym5_a", "assets/img/symbols/animation/scarab_short.png")
        .add("sym4_a", "assets/img/symbols/animation/statue_short.png")
        .add("sym3_a", "assets/img/symbols/animation/mummy_short.png")
        .add("sym2_a", "assets/img/symbols/animation/person_short.jpg")
        .add("sym0_a", "assets/img/symbols/animation/book_short.png")
        .add("scatters", "assets/img/symbols/animation/scatters.jpg")

        .add("sym10_b", "assets/img/symbols/static/blur/blur_ten.png")
        .add("sym9_b", "assets/img/symbols/static/blur/blur_jack.png")
        .add("sym8_b", "assets/img/symbols/static/blur/blur_queen.png")
        .add("sym7_b", "assets/img/symbols/static/blur/blur_king.png")
        .add("sym6_b", "assets/img/symbols/static/blur/blur_ace.png")
        .add("sym5_b", "assets/img/symbols/static/blur/blur_scarab.png")
        .add("sym4_b", "assets/img/symbols/static/blur/blur_statue.png")
        .add("sym3_b", "assets/img/symbols/static/blur/blur_mummy.png")
        .add("sym2_b", "assets/img/symbols/static/blur/blur_person.jpg")
        .add("sym0_b", "assets/img/symbols/static/blur/blur_book.jpg")

        .add("win2", "assets/sounds/win2.mp3")
        .add("win10", "assets/sounds/win10.mp3")
        .add("win20", "assets/sounds/win20.mp3")
        .add("win25", "assets/sounds/win25.mp3")
        .add("threeadmi", "assets/sounds/threeadmi.mp3")
        .add("oneadmi", "assets/sounds/oneadmi.mp3")

        .add("short_6", "assets/sounds/brd_scarab_short.mp3")
        .add("short_7", "assets/sounds/brd_statue_short.mp3")
        .add("short_8", "assets/sounds/brd_mummy_short.mp3")
        .add("short_9", "assets/sounds/brd_explorer_short.mp3")

        .add("long_6", "assets/sounds/brd_scarab_long.mp3")
        .add("long_7", "assets/sounds/brd_statue_long.mp3")
        .add("long_8", "assets/sounds/brd_mummy_long.mp3")
        .add("long_9", "assets/sounds/brd_explorer_long.mp3")

        .add("reel_run", "assets/sounds/reelrun.mp3")
        .add("reel_stop", "assets/sounds/reelstop.mp3")
        .add("teaser1", "assets/sounds/brd_teaser1.mp3")
        .add("teaser2", "assets/sounds/brd_teaser2.mp3")
        .add("teaser3", "assets/sounds/brd_teaser3.mp3")
        .add("teaser4", "assets/sounds/brd_teaser4.mp3")
        .add("teaser5", "assets/sounds/brd_teaser5.mp3")

        .add("bet", "assets/sounds/changebet.mp3")
        .add("autoplaystart", "assets/sounds/autoplaystart.mp3")
        .add("autoplaystop", "assets/sounds/autoplaystop.mp3")

        .add("oOpen", "assets/sounds/overlayopen.mp3")
        .add("oClose", "assets/sounds/overlayclose.mp3")
        .add("maxBet", "assets/sounds/changemaxbet.mp3")
        
        // SPECIAL BONUS

        .add("dialogbox", "assets/img/dialogbox.png")
        .add("bookflip_back", "assets/img/bookflip_back.png")
        .add("bookflip_pages", "assets/img/bookflip_pages.png")
        .add("bookflip_symbol_1", "assets/img/bookflip_symbol_1.jpg")
        .add("bookflip_symbol_2", "assets/img/bookflip_symbol_2.jpg")
        .add("bookflip_symbol_3", "assets/img/bookflip_symbol_3.jpg")
        .add("bookflip_symbol_4", "assets/img/bookflip_symbol_4.jpg")

        .add("f_end", "assets/sounds/brd_f_end_long.mp3")
        .add("trigger", "assets/sounds/brd_f_trigger.mp3")
        .add("f_took", "assets/sounds/brd_fx_thud.mp3")
        .add("f_loop", "assets/sounds/brd_loop.mp3")
        .add("f_page", "assets/sounds/brd_fx_page1.mp3")
        .add("f_fin_page", "assets/sounds/brd_fx_page5.mp3")
        .add("f_ding", "assets/sounds/brd_fx_chime.mp3")
        
        .on("progress", (loader)=> this._host.getChildAt(1).scale.x = loader.progress / 100)
        .on("complete", (loader)=> this._host.removeChildren())
        .on("complete", (loader)=> this.emit("loadingComplete"))
        .load();
    }
}

