import HUDModel from "./HUDModel";

export default class BaseModel
{
    public static FEATURE_SG = "SG";
    public static FEATURE_FS = "freespin";
    public static gameState:number = 0; // idle , 1 - running, 2 - startStop, 3 - stopped start anim
    public static isFreespinsGame:boolean = false;

    public initParams:any = null;
    public spinParams:any = null; 
    
    private _hudModel:HUDModel = new HUDModel();

    public get hudModel():HUDModel
    {
        return this._hudModel;
    }

    public init():void
	{
        this._hudModel.denom = 100;
        this._hudModel.bets = this.initParams.bets;
        this._hudModel.betsIndex = this._hudModel.bets.indexOf(this.initParams.bet);
		this._hudModel.currentBet = Number((this.initParams.bet / 100).toFixed(2));
        this._hudModel.balance = this.initParams.balance;
        this._hudModel.linesMax = this.initParams.lines.length;

        let currency = this.initParams.currency;

        if(currency == "NAN") currency = "";
        else if(currency == "USD") currency = "$";
        else if(currency == "EUR") currency = "€";

        this._hudModel.currency = currency;
    }
    
    public get finalWonString():string
    {
        return this._hudModel.currency + " " 
        + (this.spinParams.win / this._hudModel.denom - 
            (this.spinParams.special ? this.spinParams.special.win / this._hudModel.denom : 0)).toFixed(2);
    }

    public get finalWonSpecialString():string
    {
        return this._hudModel.currency + " " + (this.spinParams.win / this._hudModel.denom).toFixed(2);
    }

    public get finalWon():number
    {
        return this.spinParams.win / this._hudModel.denom - (this.spinParams.special ? this.spinParams.special.win / this._hudModel.denom : 0);
    }

    public get finalWonSpecial():number
    {
        return this.spinParams.win / this._hudModel.denom;
    }

    public get freeSpinsCount():number
    {
        return this.spinParams.freespins ? this.spinParams.freespins.left : 0;
    }

    public get gameFeature():string
    {
        return this.spinParams.feature; // SG, freespin, basic
    }

    public get freespinsWonString():string
    {
        return this._hudModel.currency + " " + (this.spinParams.freespins.win / this._hudModel.denom).toFixed(2);
    }

    public get isFreeSpins():boolean
    {
        return this.spinParams.freespins != null;
    }

    public get freeGamesPlayed():number
    {
        return this.spinParams.freespins.played;
    }

    public get specialElement():any
    {
        return this.spinParams.freespins.special;
    }

    public get isScatters():boolean
    {
        return this.spinParams.scatters != null;
    }

    public get isSpecial():boolean
    {
        return this.spinParams.special != null;
    }

    public get isLines():boolean
    {
        return this.spinParams.lines.length > 0;
    }

    public get isSpinDataRecived():boolean
    {
        return this.spinParams != null;
    }

    public get sgTotalPlayed():number
    {
        return this.spinParams.freespins.sgTotal;
    }

    public get spinTotalSG():number
    {
        let sg:number = 0;

        for(let i:number = 0; i < this.spinParams.lines.length; i++)
        {
            let line:any = this.spinParams.lines[i];

            if(line.sg) sg += line.sg;
        }
        
        return sg;
    }

    public get freespinsWithoutSGPlayed():number
    {
        return this.freeGamesPlayed - this.sgTotalPlayed;
    }
}
