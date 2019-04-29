export default class ServerSide extends PIXI.utils.EventEmitter
{
    public static SERVER_REQUEST:string = "server_request";

    private _url:string = "https://3r8obok9cd.casinomodule.org/mss/spin.php";
    private _xhr:XMLHttpRequest = new XMLHttpRequest();

    constructor()
    {
        super();

        let outerUrl:string = window["serverUrl"];

        if(outerUrl != null && outerUrl != "https://") this._url = outerUrl;

        this._xhr.addEventListener("readystatechange", (e) => this.dataRecived(e), false);
    }

    public send(defParams:any = { "action":"init" } ):void
    {
        this._xhr.open('POST', this._url + "?params=" + JSON.stringify(defParams), true );
        this._xhr.send();
    }
    
    private dataRecived(e):void
    {
        if(e.currentTarget.readyState == 4 && e.currentTarget.status == 200)
        {
            console.log(e.currentTarget.responseText);

            this.emit(ServerSide.SERVER_REQUEST, JSON.parse(e.currentTarget.responseText));
        }
    }
}