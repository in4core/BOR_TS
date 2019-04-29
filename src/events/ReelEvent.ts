import { Container } from "pixi.js";

export default class ReelEvent extends Container
{
    public static REEL_STOPPED:string = "reel_stopped";
    public static FILLED:string = "filled";
    public static FILLED_COMPLETE:string = "filledComplete";
    public static SCATTERS_SHOWN:string = "scatters_was_shown";
}

