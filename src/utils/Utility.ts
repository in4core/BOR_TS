export default class Utility
{
	public static TEST_MOBILE:boolean = false;

    public static getBrowserType()
	{
		let browserType = "Undefined";
		let browserAgent = navigator.userAgent;
	
		if (browserAgent != null) 
		{
			if	(	browserAgent.indexOf("Mobile") >= 0
				||	browserAgent.indexOf("Android") >= 0
				||	browserAgent.indexOf("BlackBerry") >= 0
				||	browserAgent.indexOf("iPhone") >= 0
				||	browserAgent.indexOf("iPad") >= 0
				||	browserAgent.indexOf("iPod") >= 0
				||	browserAgent.indexOf("Opera Mini") >= 0
				||	browserAgent.indexOf("IEMobile") >= 0
				) 
			{
				browserType = "MOBILE";
			}
			else 
			{
				browserType = "DESKTOP";
			}
		}
	
		return browserType;
    }
    
    public static isMobilePlatform()
	{
		return Utility.getBrowserType() == "MOBILE" || Utility.TEST_MOBILE;
	}
	
	public static isIOSPlatform()
	{
		let browserAgent = navigator.userAgent;
		
		if (browserAgent.indexOf("iPhone") >= 0 || browserAgent.indexOf("iPad") >= 0 || browserAgent.indexOf("iPod") >= 0)
		{
			return true;
		}
		
		return false;
	}
	
	public static isAndroidPlatform()
	{
		let browserAgent = navigator.userAgent;
		
		if (browserAgent.indexOf("Android") >= 0 ) return true;
		
		return false;
	}
	
	public static isLandscape()
	{
		if (window.innerWidth > window.innerHeight) return true;
		return false;
	}
	
	public static isMobileLandscape()
	{
		return Utility.isLandscape() && Utility.isMobilePlatform();
	}
	
	public static isMobilePortrait()
	{
		return !Utility.isLandscape() && Utility.isMobilePlatform();
	}

	public static setFullScreen(noReset = false)
	{
		/* if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) 
		{  
			if (document.documentElement.requestFullscreen) 
			{
				document.getElementById("game").documentElement.requestFullscreen();
			}
			else if (document.documentElement.mozRequestFullScreen) 
			{
				document.getElementById("game").documentElement.mozRequestFullScreen();
			}
			else if (document.documentElement.webkitRequestFullscreen) 
			{
				document.getElementById("game").webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		} 
		else 
		{
			if(noReset) return;

		  	if (document.cancelFullScreen) document.cancelFullScreen();
		  	else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
		  	else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
		} */
	}

	static time(f:Function, n:number, context:any, ...args):any
	{
		return () => setTimeout(()=> f(), 100, ...args);
	}
} 