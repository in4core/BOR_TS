import HUDModelEvent from "../events/HUDModelEvent";

export default class HUDModel extends PIXI.utils.EventEmitter 
{
	public bets:Array<number> = [];
    public currentBet:number = 0;
    public balance:number = 0;
    public maxLines:number = 10;
	public betsIndex:number = 0;
	public linesMax:number = 0;
	public currency:string = "";
	public denom:number = 0;

    constructor()
    {
		super();
    }

    public plusBetLevel():void
	{
		this.betsIndex++;
		
		this.currentBet = Number((this.bets[this.betsIndex] / 100).toFixed(2));
		
		this.emit(HUDModelEvent.CHANGE);
	}
	
	public minusBetLevel():void
	{
		this.betsIndex--;
		
		this.currentBet = Number((this.bets[this.betsIndex] / 100).toFixed(2));
		
		this.emit(HUDModelEvent.CHANGE);
	}
	
	
	public getMainBet():string
	{
		return this.currency + " " + (this.currentBet * this.maxLines).toFixed(2);
	}
	
	public getMainBalance():string
	{
        return this.currency + " " + (this.balance / 100).toFixed(2);
	}
	
	public getLocker():Array<boolean>
	{
		return [this.betsIndex == this.bets.length - 1, this.betsIndex == 0];
	}
	
	public lessSpinBalance():void
	{
		this.balance = this.balance - this.bets[this.betsIndex] * this.maxLines;
		
		this.emit(HUDModelEvent.BALANCE_UPDATE);
	}
	
	public updateBalance(n:number):void
	{
		this.balance = n;
		
		this.emit(HUDModelEvent.BALANCE_UPDATE);
	}
	
	public maxBet():void
	{
		this.betsIndex = this.bets.length - 1;
		this.currentBet = Number((this.bets[this.betsIndex] / 100).toFixed(2));
		
		this.emit(HUDModelEvent.CHANGE);
	}
	
	public get isMaxBet():boolean
	{
		return this.betsIndex == this.bets.length - 1;
	}

	public get isNoBalance():boolean
	{
		return (this.balance / 100) < Number(this.currentBet) * this.maxLines;
	}
}