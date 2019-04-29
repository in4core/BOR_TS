import { Container, Sprite } from "pixi.js";
import Assets from "../../controllers/Assets";
import { TweenMax, Linear } from "gsap";

export default class RotateView extends Container
{
    constructor()
    {
        super();
        super.on("added", this.onAdded);

        this.normalTexture = new Sprite(Assets.getSource("rotate"));

        this.arrows = new Sprite(Assets.getSource("arrows"));
        this.phoneA = new Sprite(Assets.getSource("phoneA"));
        this.phoneB = new Sprite(Assets.getSource("phoneB"));
        this.circle = new Sprite(Assets.getSource("circle"));
    }

    onAdded(event)
    {
        super.off("added", this.onAdded);

        this.addChild(this.normalTexture);
        this.addChild(this.arrows);
        this.addChild(this.phoneA);
        this.addChild(this.phoneB);
        this.addChild(this.circle);
    }

    resizePortrait()
	{
		this.normalTexture.width = window.innerWidth;
        this.normalTexture.height = window.innerHeight;
        
        let scalex = this.normalTexture.scale.x;
        
        this.circle.scale.set(scalex, scalex);
        this.circle.anchor.set(0.5,0.5);

        this.arrows.scale.set(scalex, scalex);
        this.arrows.anchor.set(0.5,0.5);

        this.phoneA.scale.set(scalex, scalex);
        this.phoneA.anchor.set(0.5,0.5);

        this.phoneB.scale.set(scalex, scalex);
        this.phoneB.anchor.set(0.5,0.5);

        this.circle.y = this.normalTexture.height / 2 + this.circle.height / 2 + 10;
        this.circle.x = this.normalTexture.width / 2;

        this.arrows.y = this.normalTexture.height / 2 - this.circle.height / 2 - 10;
        this.arrows.x = this.normalTexture.width / 2;

        this.phoneA.y = this.arrows.y ;
        this.phoneA.x = this.normalTexture.width / 2;

        this.phoneB.y = this.circle.y ;
        this.phoneB.x = this.normalTexture.width / 2;

        this.arrows.rotation = 0;
        this.circle.alpha = 1;
        this.phoneA.rotation = 0;

        this.startAnim();
    }
    
    clear()
    {
        TweenMax.killTweensOf(this.circle);
        TweenMax.killTweensOf(this.arrows);
        TweenMax.killTweensOf(this.phoneA);
    }

    startAnim()
    {
        this.arrows.rotation = 0;
        this.circle.alpha = 1;
        this.phoneA.rotation = 0;
       
        TweenMax.to(this.arrows, 1.5, { rotation:Math.PI/2, ease:Linear.easeNone});
        TweenMax.to(this.phoneA, 1.5, { rotation:Math.PI/2, ease:Linear.easeNone, onComplete:()=>this.circleBlink()});
    }

    circleBlink()
    {
        TweenMax.to(this.circle, 0.5, { alpha : 0, ease:Linear.easeNone, repeat:5, onComplete:()=> this.startAnim()}).yoyo(true);
    }
}