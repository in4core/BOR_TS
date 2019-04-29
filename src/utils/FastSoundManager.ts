import Assets from "../controllers/Assets";
import * as pixiSound from 'pixi-sound';

export default class FastSoundManager
{
    private static _playedHash:Object = {};
    private static _delayedHash:Object = {};
    private static _globalVolume:number = 1;

    public static playSound(soundName:string , loop:boolean = false , delayedCall:number = 0 , callBack:Function = null, vol:number = 1):string
	{
        if (soundName == "" || soundName == null) return;

        const sound:pixiSound.Sound = Assets.getSound(soundName);

        sound.volume = vol;
        sound.loop = loop;
       
        if (this._playedHash[soundName] != null && loop) this.stopSound(soundName);

        const timer:number = setTimeout( ()=> sound.play( ()=> setTimeout( ()=> this.onEndSound(), 1)), delayedCall);

        this._delayedHash[soundName] = timer;
        this._playedHash[soundName] = { "sound":sound, "callback":callBack, "name":soundName };

        return soundName;
    }
    
    private static onEndSound():void
    {
        for(let i in this._playedHash)
        {
            const sound:pixiSound.Sound = this._playedHash[i].sound;
            
            if(!sound.isPlaying) 
            {
                if(this._playedHash[i].callback) this._playedHash[i].callback();
                delete this._playedHash[this._playedHash[i].name];
            }
        }
    }
    
    public static stopSound(soundName:string, killDelay:boolean = true):void
	{
        
		if (killDelay && this._delayedHash[soundName] != null) 
		{
			clearTimeout(this._delayedHash[soundName]);
			delete this._delayedHash[soundName];
		}
		
		if (this._playedHash[soundName] == null) return;
		
        const sound:pixiSound.Sound = this._playedHash[soundName].sound;
       
        sound.stop();
        
		delete this._playedHash[soundName];
    }
    
    public static setGlobalVolume(v:number):void
	{
		this._globalVolume = v;
        
        if(v == 0) PIXI.sound.muteAll();
        else PIXI.sound.unmuteAll();
	}
}

