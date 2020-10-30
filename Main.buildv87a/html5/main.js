
//${CONFIG_BEGIN}
CFG_BINARY_FILES="*.bin|*.dat";
CFG_BRL_DATABUFFER_IMPLEMENTED="1";
CFG_BRL_GAMETARGET_IMPLEMENTED="1";
CFG_BRL_STREAM_IMPLEMENTED="1";
CFG_BRL_THREAD_IMPLEMENTED="1";
CFG_CD="";
CFG_CONFIG="release";
CFG_HOST="winnt";
CFG_HTML5_WEBAUDIO_ENABLED="1";
CFG_IMAGE_FILES="*.png|*.jpg";
CFG_LANG="js";
CFG_MODPATH="";
CFG_MOJO_AUTO_SUSPEND_ENABLED="1";
CFG_MOJO_DRIVER_IMPLEMENTED="1";
CFG_MUSIC_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_OPENGL_GLES20_ENABLED="0";
CFG_SAFEMODE="0";
CFG_SOUND_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_TARGET="html5";
CFG_TEXT_FILES="*.txt|*.xml|*.json";
//${CONFIG_END}

//${METADATA_BEGIN}
var META_DATA="[mojo_font.png];type=image/png;width=864;height=13;\n[0.0-Floor.png];type=image/png;width=32;height=32;\n[1.0-Wall_Middle.png];type=image/png;width=32;height=32;\n[2.0-Closed_Door.png];type=image/png;width=32;height=32;\n[2.5-Open_Door.png];type=image/png;width=32;height=32;\n[Boss.png];type=image/png;width=256;height=64;\n[ChargerWest.png];type=image/png;width=64;height=32;\n[Controls.png];type=image/png;width=340;height=240;\n[Cursor.png];type=image/png;width=8;height=8;\n[EnemyProjectile.png];type=image/png;width=8;height=8;\n[LMB.png];type=image/png;width=32;height=32;\n[PlayerProjectile.png];type=image/png;width=8;height=8;\n[PlayerSouth.png];type=image/png;width=32;height=32;\n[Shooter.png];type=image/png;width=64;height=32;\n[ShooterSideWays.png];type=image/png;width=32;height=32;\n[ShooterVertical.png];type=image/png;width=32;height=32;\n[SplashScreen.png];type=image/png;width=960;height=640;\n[Strike.png];type=image/png;width=32;height=32;\n[UI Frame.png];type=image/png;width=96;height=32;\n";
//${METADATA_END}

//${TRANSCODE_BEGIN}

// Javascript Monkey runtime.
//
// Placed into the public domain 24/02/2011.
// No warranty implied; use at your own risk.

//***** JavaScript Runtime *****

var D2R=0.017453292519943295;
var R2D=57.29577951308232;

var err_info="";
var err_stack=[];

var dbg_index=0;

function push_err(){
	err_stack.push( err_info );
}

function pop_err(){
	err_info=err_stack.pop();
}

function stackTrace(){
	if( !err_info.length ) return "";
	var str=err_info+"\n";
	for( var i=err_stack.length-1;i>0;--i ){
		str+=err_stack[i]+"\n";
	}
	return str;
}

function print( str ){
	var cons=document.getElementById( "GameConsole" );
	if( cons ){
		cons.value+=str+"\n";
		cons.scrollTop=cons.scrollHeight-cons.clientHeight;
	}else if( window.console!=undefined ){
		window.console.log( str );
	}
	return 0;
}

function alertError( err ){
	if( typeof(err)=="string" && err=="" ) return;
	alert( "Monkey Runtime Error : "+err.toString()+"\n\n"+stackTrace() );
}

function error( err ){
	throw err;
}

function debugLog( str ){
	if( window.console!=undefined ) window.console.log( str );
}

function debugStop(){
	debugger;	//	error( "STOP" );
}

function dbg_object( obj ){
	if( obj ) return obj;
	error( "Null object access" );
}

function dbg_charCodeAt( str,index ){
	if( index<0 || index>=str.length ) error( "Character index out of range" );
	return str.charCodeAt( index );
}

function dbg_array( arr,index ){
	if( index<0 || index>=arr.length ) error( "Array index out of range" );
	dbg_index=index;
	return arr;
}

function new_bool_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=false;
	return arr;
}

function new_number_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=0;
	return arr;
}

function new_string_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]='';
	return arr;
}

function new_array_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=[];
	return arr;
}

function new_object_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=null;
	return arr;
}

function resize_bool_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=false;
	return arr;
}

function resize_number_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=0;
	return arr;
}

function resize_string_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]="";
	return arr;
}

function resize_array_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=[];
	return arr;
}

function resize_object_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=null;
	return arr;
}

function string_compare( lhs,rhs ){
	var n=Math.min( lhs.length,rhs.length ),i,t;
	for( i=0;i<n;++i ){
		t=lhs.charCodeAt(i)-rhs.charCodeAt(i);
		if( t ) return t;
	}
	return lhs.length-rhs.length;
}

function string_replace( str,find,rep ){	//no unregex replace all?!?
	var i=0;
	for(;;){
		i=str.indexOf( find,i );
		if( i==-1 ) return str;
		str=str.substring( 0,i )+rep+str.substring( i+find.length );
		i+=rep.length;
	}
}

function string_trim( str ){
	var i=0,i2=str.length;
	while( i<i2 && str.charCodeAt(i)<=32 ) i+=1;
	while( i2>i && str.charCodeAt(i2-1)<=32 ) i2-=1;
	return str.slice( i,i2 );
}

function string_startswith( str,substr ){
	return substr.length<=str.length && str.slice(0,substr.length)==substr;
}

function string_endswith( str,substr ){
	return substr.length<=str.length && str.slice(str.length-substr.length,str.length)==substr;
}

function string_tochars( str ){
	var arr=new Array( str.length );
	for( var i=0;i<str.length;++i ) arr[i]=str.charCodeAt(i);
	return arr;
}

function string_fromchars( chars ){
	var str="",i;
	for( i=0;i<chars.length;++i ){
		str+=String.fromCharCode( chars[i] );
	}
	return str;
}

function object_downcast( obj,clas ){
	if( obj instanceof clas ) return obj;
	return null;
}

function object_implements( obj,iface ){
	if( obj && obj.implments && obj.implments[iface] ) return obj;
	return null;
}

function extend_class( clas ){
	var tmp=function(){};
	tmp.prototype=clas.prototype;
	return new tmp;
}

function ThrowableObject(){
}

ThrowableObject.prototype.toString=function(){ 
	return "Uncaught Monkey Exception"; 
}


function BBGameEvent(){}
BBGameEvent.KeyDown=1;
BBGameEvent.KeyUp=2;
BBGameEvent.KeyChar=3;
BBGameEvent.MouseDown=4;
BBGameEvent.MouseUp=5;
BBGameEvent.MouseMove=6;
BBGameEvent.TouchDown=7;
BBGameEvent.TouchUp=8;
BBGameEvent.TouchMove=9;
BBGameEvent.MotionAccel=10;

function BBGameDelegate(){}
BBGameDelegate.prototype.StartGame=function(){}
BBGameDelegate.prototype.SuspendGame=function(){}
BBGameDelegate.prototype.ResumeGame=function(){}
BBGameDelegate.prototype.UpdateGame=function(){}
BBGameDelegate.prototype.RenderGame=function(){}
BBGameDelegate.prototype.KeyEvent=function( ev,data ){}
BBGameDelegate.prototype.MouseEvent=function( ev,data,x,y ){}
BBGameDelegate.prototype.TouchEvent=function( ev,data,x,y ){}
BBGameDelegate.prototype.MotionEvent=function( ev,data,x,y,z ){}
BBGameDelegate.prototype.DiscardGraphics=function(){}

function BBDisplayMode( width,height ){
	this.width=width;
	this.height=height;
}

function BBGame(){
	BBGame._game=this;
	this._delegate=null;
	this._keyboardEnabled=false;
	this._updateRate=0;
	this._started=false;
	this._suspended=false;
	this._debugExs=(CFG_CONFIG=="debug");
	this._startms=Date.now();
}

BBGame.Game=function(){
	return BBGame._game;
}

BBGame.prototype.SetDelegate=function( delegate ){
	this._delegate=delegate;
}

BBGame.prototype.Delegate=function(){
	return this._delegate;
}

BBGame.prototype.SetUpdateRate=function( updateRate ){
	this._updateRate=updateRate;
}

BBGame.prototype.SetKeyboardEnabled=function( keyboardEnabled ){
	this._keyboardEnabled=keyboardEnabled;
}

BBGame.prototype.Started=function(){
	return this._started;
}

BBGame.prototype.Suspended=function(){
	return this._suspended;
}

BBGame.prototype.Millisecs=function(){
	return Date.now()-this._startms;
}

BBGame.prototype.GetDate=function( date ){
	var n=date.length;
	if( n>0 ){
		var t=new Date();
		date[0]=t.getFullYear();
		if( n>1 ){
			date[1]=t.getMonth()+1;
			if( n>2 ){
				date[2]=t.getDate();
				if( n>3 ){
					date[3]=t.getHours();
					if( n>4 ){
						date[4]=t.getMinutes();
						if( n>5 ){
							date[5]=t.getSeconds();
							if( n>6 ){
								date[6]=t.getMilliseconds();
							}
						}
					}
				}
			}
		}
	}
}

BBGame.prototype.SaveState=function( state ){
	localStorage.setItem( "monkeystate@"+document.URL,state );	//key can't start with dot in Chrome!
	return 1;
}

BBGame.prototype.LoadState=function(){
	var state=localStorage.getItem( "monkeystate@"+document.URL );
	if( state ) return state;
	return "";
}

BBGame.prototype.LoadString=function( path ){

	var xhr=new XMLHttpRequest();
	xhr.open( "GET",this.PathToUrl( path ),false );
	
//	if( navigator.userAgent.indexOf( "Chrome/48." )>0 ){
//		xhr.setRequestHeader( "If-Modified-Since","Sat, 1 Jan 2000 00:00:00 GMT" );
//	}
	
	xhr.send( null );
	
	if( xhr.status==200 || xhr.status==0 ) return xhr.responseText;
	
	return "";
}

BBGame.prototype.CountJoysticks=function( update ){
	return 0;
}

BBGame.prototype.PollJoystick=function( port,joyx,joyy,joyz,buttons ){
	return false;
}

BBGame.prototype.OpenUrl=function( url ){
	window.location=url;
}

BBGame.prototype.SetMouseVisible=function( visible ){
	if( visible ){
		this._canvas.style.cursor='default';	
	}else{
		this._canvas.style.cursor="url('data:image/cur;base64,AAACAAEAICAAAAAAAACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAgBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA55ZXBgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOeWVxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADnllcGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9////////////////////+////////f/////////8%3D'), auto";
	}
}

BBGame.prototype.GetDeviceWidth=function(){
	return 0;
}

BBGame.prototype.GetDeviceHeight=function(){
	return 0;
}

BBGame.prototype.SetDeviceWindow=function( width,height,flags ){
}

BBGame.prototype.GetDisplayModes=function(){
	return new Array();
}

BBGame.prototype.GetDesktopMode=function(){
	return null;
}

BBGame.prototype.SetSwapInterval=function( interval ){
}

BBGame.prototype.PathToFilePath=function( path ){
	return "";
}

//***** js Game *****

BBGame.prototype.PathToUrl=function( path ){
	return path;
}

BBGame.prototype.LoadData=function( path ){

	var xhr=new XMLHttpRequest();
	xhr.open( "GET",this.PathToUrl( path ),false );

	if( xhr.overrideMimeType ) xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
	
//	if( navigator.userAgent.indexOf( "Chrome/48." )>0 ){
//		xhr.setRequestHeader( "If-Modified-Since","Sat, 1 Jan 2000 00:00:00 GMT" );
//	}

	xhr.send( null );
	if( xhr.status!=200 && xhr.status!=0 ) return null;

	var r=xhr.responseText;
	var buf=new ArrayBuffer( r.length );
	var bytes=new Int8Array( buf );
	for( var i=0;i<r.length;++i ){
		bytes[i]=r.charCodeAt( i );
	}
	return buf;
}

//***** INTERNAL ******

BBGame.prototype.Die=function( ex ){

	this._delegate=new BBGameDelegate();
	
	if( !ex.toString() ){
		return;
	}
	
	if( this._debugExs ){
		print( "Monkey Runtime Error : "+ex.toString() );
		print( stackTrace() );
	}
	
	throw ex;
}

BBGame.prototype.StartGame=function(){

	if( this._started ) return;
	this._started=true;
	
	if( this._debugExs ){
		try{
			this._delegate.StartGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.StartGame();
	}
}

BBGame.prototype.SuspendGame=function(){

	if( !this._started || this._suspended ) return;
	this._suspended=true;
	
	if( this._debugExs ){
		try{
			this._delegate.SuspendGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.SuspendGame();
	}
}

BBGame.prototype.ResumeGame=function(){

	if( !this._started || !this._suspended ) return;
	this._suspended=false;
	
	if( this._debugExs ){
		try{
			this._delegate.ResumeGame();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.ResumeGame();
	}
}

BBGame.prototype.UpdateGame=function(){

	if( !this._started || this._suspended ) return;

	if( this._debugExs ){
		try{
			this._delegate.UpdateGame();
		}catch( ex ){
			this.Die( ex );
		}	
	}else{
		this._delegate.UpdateGame();
	}
}

BBGame.prototype.RenderGame=function(){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.RenderGame();
		}catch( ex ){
			this.Die( ex );
		}	
	}else{
		this._delegate.RenderGame();
	}
}

BBGame.prototype.KeyEvent=function( ev,data ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.KeyEvent( ev,data );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.KeyEvent( ev,data );
	}
}

BBGame.prototype.MouseEvent=function( ev,data,x,y ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.MouseEvent( ev,data,x,y );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.MouseEvent( ev,data,x,y );
	}
}

BBGame.prototype.TouchEvent=function( ev,data,x,y ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.TouchEvent( ev,data,x,y );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.TouchEvent( ev,data,x,y );
	}
}

BBGame.prototype.MotionEvent=function( ev,data,x,y,z ){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.MotionEvent( ev,data,x,y,z );
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.MotionEvent( ev,data,x,y,z );
	}
}

BBGame.prototype.DiscardGraphics=function(){

	if( !this._started ) return;
	
	if( this._debugExs ){
		try{
			this._delegate.DiscardGraphics();
		}catch( ex ){
			this.Die( ex );
		}
	}else{
		this._delegate.DiscardGraphics();
	}
}


var webglGraphicsSeq=1;

function BBHtml5Game( canvas ){

	BBGame.call( this );
	BBHtml5Game._game=this;
	this._canvas=canvas;
	this._loading=0;
	this._timerSeq=0;
	this._gl=null;
	
	if( CFG_OPENGL_GLES20_ENABLED=="1" ){

		//can't get these to fire!
		canvas.addEventListener( "webglcontextlost",function( event ){
			event.preventDefault();
//			print( "WebGL context lost!" );
		},false );

		canvas.addEventListener( "webglcontextrestored",function( event ){
			++webglGraphicsSeq;
//			print( "WebGL context restored!" );
		},false );

		var attrs={ alpha:false };
	
		this._gl=this._canvas.getContext( "webgl",attrs );

		if( !this._gl ) this._gl=this._canvas.getContext( "experimental-webgl",attrs );
		
		if( !this._gl ) this.Die( "Can't create WebGL" );
		
		gl=this._gl;
	}
	
	// --- start gamepad api by skn3 ---------
	this._gamepads = null;
	this._gamepadLookup = [-1,-1,-1,-1];//support 4 gamepads
	var that = this;
	window.addEventListener("gamepadconnected", function(e) {
		that.connectGamepad(e.gamepad);
	});
	
	window.addEventListener("gamepaddisconnected", function(e) {
		that.disconnectGamepad(e.gamepad);
	});
	
	//need to process already connected gamepads (before page was loaded)
	var gamepads = this.getGamepads();
	if (gamepads && gamepads.length > 0) {
		for(var index=0;index < gamepads.length;index++) {
			this.connectGamepad(gamepads[index]);
		}
	}
	// --- end gamepad api by skn3 ---------
}

BBHtml5Game.prototype=extend_class( BBGame );

BBHtml5Game.Html5Game=function(){
	return BBHtml5Game._game;
}

// --- start gamepad api by skn3 ---------
BBHtml5Game.prototype.getGamepads = function() {
	return navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
}

BBHtml5Game.prototype.connectGamepad = function(gamepad) {
	if (!gamepad) {
		return false;
	}
	
	//check if this is a standard gamepad
	if (gamepad.mapping == "standard") {
		//yup so lets add it to an array of valid gamepads
		//find empty controller slot
		var slot = -1;
		for(var index = 0;index < this._gamepadLookup.length;index++) {
			if (this._gamepadLookup[index] == -1) {
				slot = index;
				break;
			}
		}
		
		//can we add this?
		if (slot != -1) {
			this._gamepadLookup[slot] = gamepad.index;
			
			//console.log("gamepad at html5 index "+gamepad.index+" mapped to monkey gamepad unit "+slot);
		}
	} else {
		console.log('Monkey has ignored gamepad at raw port #'+gamepad.index+' with unrecognised mapping scheme \''+gamepad.mapping+'\'.');
	}
}

BBHtml5Game.prototype.disconnectGamepad = function(gamepad) {
	if (!gamepad) {
		return false;
	}
	
	//scan all gamepads for matching index
	for(var index = 0;index < this._gamepadLookup.length;index++) {
		if (this._gamepadLookup[index] == gamepad.index) {
			//remove this gamepad
			this._gamepadLookup[index] = -1
			break;
		}
	}
}

BBHtml5Game.prototype.PollJoystick=function(port, joyx, joyy, joyz, buttons){
	//is this the first gamepad being polled
	if (port == 0) {
		//yes it is so we use the web api to get all gamepad info
		//we can then use this in subsequent calls to PollJoystick
		this._gamepads = this.getGamepads();
	}
	
	//dont bother processing if nothing to process
	if (!this._gamepads) {
	  return false;
	}
	
	//so use the monkey port to find the correct raw data
	var index = this._gamepadLookup[port];
	if (index == -1) {
		return false;
	}

	var gamepad = this._gamepads[index];
	if (!gamepad) {
		return false;
	}
	//so now process gamepad axis/buttons according to the standard mappings
	//https://w3c.github.io/gamepad/#remapping
	
	//left stick axis
	joyx[0] = gamepad.axes[0];
	joyy[0] = -gamepad.axes[1];
	
	//right stick axis
	joyx[1] = gamepad.axes[2];
	joyy[1] = -gamepad.axes[3];
	
	//left trigger
	joyz[0] = gamepad.buttons[6] ? gamepad.buttons[6].value : 0.0;
	
	//right trigger
	joyz[1] = gamepad.buttons[7] ? gamepad.buttons[7].value : 0.0;
	
	//clear button states
	for(var index = 0;index <32;index++) {
		buttons[index] = false;
	}
	
	//map html5 "standard" mapping to monkeys joy codes
	/*
	Const JOY_A=0
	Const JOY_B=1
	Const JOY_X=2
	Const JOY_Y=3
	Const JOY_LB=4
	Const JOY_RB=5
	Const JOY_BACK=6
	Const JOY_START=7
	Const JOY_LEFT=8
	Const JOY_UP=9
	Const JOY_RIGHT=10
	Const JOY_DOWN=11
	Const JOY_LSB=12
	Const JOY_RSB=13
	Const JOY_MENU=14
	*/
	buttons[0] = gamepad.buttons[0] && gamepad.buttons[0].pressed;
	buttons[1] = gamepad.buttons[1] && gamepad.buttons[1].pressed;
	buttons[2] = gamepad.buttons[2] && gamepad.buttons[2].pressed;
	buttons[3] = gamepad.buttons[3] && gamepad.buttons[3].pressed;
	buttons[4] = gamepad.buttons[4] && gamepad.buttons[4].pressed;
	buttons[5] = gamepad.buttons[5] && gamepad.buttons[5].pressed;
	buttons[6] = gamepad.buttons[8] && gamepad.buttons[8].pressed;
	buttons[7] = gamepad.buttons[9] && gamepad.buttons[9].pressed;
	buttons[8] = gamepad.buttons[14] && gamepad.buttons[14].pressed;
	buttons[9] = gamepad.buttons[12] && gamepad.buttons[12].pressed;
	buttons[10] = gamepad.buttons[15] && gamepad.buttons[15].pressed;
	buttons[11] = gamepad.buttons[13] && gamepad.buttons[13].pressed;
	buttons[12] = gamepad.buttons[10] && gamepad.buttons[10].pressed;
	buttons[13] = gamepad.buttons[11] && gamepad.buttons[11].pressed;
	buttons[14] = gamepad.buttons[16] && gamepad.buttons[16].pressed;
	
	//success
	return true
}
// --- end gamepad api by skn3 ---------


BBHtml5Game.prototype.ValidateUpdateTimer=function(){

	++this._timerSeq;
	if( this._suspended ) return;
	
	var game=this;
	var seq=game._timerSeq;
	
	var maxUpdates=4;
	var updateRate=this._updateRate;
	
	if( !updateRate ){

		var reqAnimFrame=(window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame);
	
		if( reqAnimFrame ){
			function animate(){
				if( seq!=game._timerSeq ) return;
	
				game.UpdateGame();
				if( seq!=game._timerSeq ) return;
	
				reqAnimFrame( animate );
				game.RenderGame();
			}
			reqAnimFrame( animate );
			return;
		}
		
		maxUpdates=1;
		updateRate=60;
	}
	
	var updatePeriod=1000.0/updateRate;
	var nextUpdate=0;

	function timeElapsed(){
		if( seq!=game._timerSeq ) return;
		
		if( !nextUpdate ) nextUpdate=Date.now();
		
		for( var i=0;i<maxUpdates;++i ){
		
			game.UpdateGame();
			if( seq!=game._timerSeq ) return;
			
			nextUpdate+=updatePeriod;
			var delay=nextUpdate-Date.now();
			
			if( delay>0 ){
				setTimeout( timeElapsed,delay );
				game.RenderGame();
				return;
			}
		}
		nextUpdate=0;
		setTimeout( timeElapsed,0 );
		game.RenderGame();
	}

	setTimeout( timeElapsed,0 );
}

//***** BBGame methods *****

BBHtml5Game.prototype.SetUpdateRate=function( updateRate ){

	BBGame.prototype.SetUpdateRate.call( this,updateRate );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.GetMetaData=function( path,key ){
	if( path.indexOf( "monkey://data/" )!=0 ) return "";
	path=path.slice(14);

	var i=META_DATA.indexOf( "["+path+"]" );
	if( i==-1 ) return "";
	i+=path.length+2;

	var e=META_DATA.indexOf( "\n",i );
	if( e==-1 ) e=META_DATA.length;

	i=META_DATA.indexOf( ";"+key+"=",i )
	if( i==-1 || i>=e ) return "";
	i+=key.length+2;

	e=META_DATA.indexOf( ";",i );
	if( e==-1 ) return "";

	return META_DATA.slice( i,e );
}

BBHtml5Game.prototype.PathToUrl=function( path ){
	if( path.indexOf( "monkey:" )!=0 ){
		return path;
	}else if( path.indexOf( "monkey://data/" )==0 ) {
		return "data/"+path.slice( 14 );
	}
	return "";
}

BBHtml5Game.prototype.GetLoading=function(){
	return this._loading;
}

BBHtml5Game.prototype.IncLoading=function(){
	++this._loading;
	return this._loading;
}

BBHtml5Game.prototype.DecLoading=function(){
	--this._loading;
	return this._loading;
}

BBHtml5Game.prototype.GetCanvas=function(){
	return this._canvas;
}

BBHtml5Game.prototype.GetWebGL=function(){
	return this._gl;
}

BBHtml5Game.prototype.GetDeviceWidth=function(){
	return this._canvas.width;
}

BBHtml5Game.prototype.GetDeviceHeight=function(){
	return this._canvas.height;
}

//***** INTERNAL *****

BBHtml5Game.prototype.UpdateGame=function(){

	if( !this._loading ) BBGame.prototype.UpdateGame.call( this );
}

BBHtml5Game.prototype.SuspendGame=function(){

	BBGame.prototype.SuspendGame.call( this );
	
	BBGame.prototype.RenderGame.call( this );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.ResumeGame=function(){

	BBGame.prototype.ResumeGame.call( this );
	
	this.ValidateUpdateTimer();
}

BBHtml5Game.prototype.Run=function(){

	var game=this;
	var canvas=game._canvas;
	
	var xscale=1;
	var yscale=1;
	
	var touchIds=new Array( 32 );
	for( i=0;i<32;++i ) touchIds[i]=-1;
	
	function eatEvent( e ){
		if( e.stopPropagation ){
			e.stopPropagation();
			e.preventDefault();
		}else{
			e.cancelBubble=true;
			e.returnValue=false;
		}
	}
	
	function keyToChar( key ){
		switch( key ){
		case 8:case 9:case 13:case 27:case 32:return key;
		case 33:case 34:case 35:case 36:case 37:case 38:case 39:case 40:case 45:return key|0x10000;
		case 46:return 127;
		}
		return 0;
	}
	
	function mouseX( e ){
		var x=e.clientX+document.body.scrollLeft;
		var c=canvas;
		while( c ){
			x-=c.offsetLeft;
			c=c.offsetParent;
		}
		return x*xscale;
	}
	
	function mouseY( e ){
		var y=e.clientY+document.body.scrollTop;
		var c=canvas;
		while( c ){
			y-=c.offsetTop;
			c=c.offsetParent;
		}
		return y*yscale;
	}

	function touchX( touch ){
		var x=touch.pageX;
		var c=canvas;
		while( c ){
			x-=c.offsetLeft;
			c=c.offsetParent;
		}
		return x*xscale;
	}			
	
	function touchY( touch ){
		var y=touch.pageY;
		var c=canvas;
		while( c ){
			y-=c.offsetTop;
			c=c.offsetParent;
		}
		return y*yscale;
	}
	
	canvas.onkeydown=function( e ){
		game.KeyEvent( BBGameEvent.KeyDown,e.keyCode );
		var chr=keyToChar( e.keyCode );
		if( chr ) game.KeyEvent( BBGameEvent.KeyChar,chr );
		if( e.keyCode<48 || (e.keyCode>111 && e.keyCode<122) ) eatEvent( e );
	}

	canvas.onkeyup=function( e ){
		game.KeyEvent( BBGameEvent.KeyUp,e.keyCode );
	}

	canvas.onkeypress=function( e ){
		if( e.charCode ){
			game.KeyEvent( BBGameEvent.KeyChar,e.charCode );
		}else if( e.which ){
			game.KeyEvent( BBGameEvent.KeyChar,e.which );
		}
	}

	canvas.onmousedown=function( e ){
		switch( e.button ){
		case 0:game.MouseEvent( BBGameEvent.MouseDown,0,mouseX(e),mouseY(e) );break;
		case 1:game.MouseEvent( BBGameEvent.MouseDown,2,mouseX(e),mouseY(e) );break;
		case 2:game.MouseEvent( BBGameEvent.MouseDown,1,mouseX(e),mouseY(e) );break;
		}
		eatEvent( e );
	}
	
	canvas.onmouseup=function( e ){
		switch( e.button ){
		case 0:game.MouseEvent( BBGameEvent.MouseUp,0,mouseX(e),mouseY(e) );break;
		case 1:game.MouseEvent( BBGameEvent.MouseUp,2,mouseX(e),mouseY(e) );break;
		case 2:game.MouseEvent( BBGameEvent.MouseUp,1,mouseX(e),mouseY(e) );break;
		}
		eatEvent( e );
	}
	
	canvas.onmousemove=function( e ){
		game.MouseEvent( BBGameEvent.MouseMove,-1,mouseX(e),mouseY(e) );
		eatEvent( e );
	}

	canvas.onmouseout=function( e ){
		game.MouseEvent( BBGameEvent.MouseUp,0,mouseX(e),mouseY(e) );
		game.MouseEvent( BBGameEvent.MouseUp,1,mouseX(e),mouseY(e) );
		game.MouseEvent( BBGameEvent.MouseUp,2,mouseX(e),mouseY(e) );
		eatEvent( e );
	}
	
	canvas.onclick=function( e ){
		if( game.Suspended() ){
			canvas.focus();
		}
		eatEvent( e );
		return;
	}
	
	canvas.oncontextmenu=function( e ){
		return false;
	}
	
	canvas.ontouchstart=function( e ){
		if( game.Suspended() ){
			canvas.focus();
		}
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=-1 ) continue;
				touchIds[j]=touch.identifier;
				game.TouchEvent( BBGameEvent.TouchDown,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	canvas.ontouchmove=function( e ){
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=touch.identifier ) continue;
				game.TouchEvent( BBGameEvent.TouchMove,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	canvas.ontouchend=function( e ){
		for( var i=0;i<e.changedTouches.length;++i ){
			var touch=e.changedTouches[i];
			for( var j=0;j<32;++j ){
				if( touchIds[j]!=touch.identifier ) continue;
				touchIds[j]=-1;
				game.TouchEvent( BBGameEvent.TouchUp,j,touchX(touch),touchY(touch) );
				break;
			}
		}
		eatEvent( e );
	}
	
	window.ondevicemotion=function( e ){
		var tx=e.accelerationIncludingGravity.x/9.81;
		var ty=e.accelerationIncludingGravity.y/9.81;
		var tz=e.accelerationIncludingGravity.z/9.81;
		var x,y;
		switch( window.orientation ){
		case   0:x=+tx;y=-ty;break;
		case 180:x=-tx;y=+ty;break;
		case  90:x=-ty;y=-tx;break;
		case -90:x=+ty;y=+tx;break;
		}
		game.MotionEvent( BBGameEvent.MotionAccel,0,x,y,tz );
		eatEvent( e );
	}

	canvas.onfocus=function( e ){
		if( CFG_MOJO_AUTO_SUSPEND_ENABLED=="1" ){
			game.ResumeGame();
		}else{
			game.ValidateUpdateTimer();
		}
	}
	
	canvas.onblur=function( e ){
		for( var i=0;i<256;++i ) game.KeyEvent( BBGameEvent.KeyUp,i );
		if( CFG_MOJO_AUTO_SUSPEND_ENABLED=="1" ){
			game.SuspendGame();
		}
	}

	canvas.updateSize=function(){
		xscale=canvas.width/canvas.clientWidth;
		yscale=canvas.height/canvas.clientHeight;
		game.RenderGame();
	}
	
	canvas.updateSize();
	
	canvas.focus();
	
	game.StartGame();
	
	game.RenderGame();
}


function BBMonkeyGame( canvas ){
	BBHtml5Game.call( this,canvas );
}

BBMonkeyGame.prototype=extend_class( BBHtml5Game );

BBMonkeyGame.Main=function( canvas ){

	var game=new BBMonkeyGame( canvas );

	try{

		bbInit();
		bbMain();

	}catch( ex ){
	
		game.Die( ex );
		return;
	}

	if( !game.Delegate() ) return;
	
	game.Run();
}


// HTML5 mojo runtime.
//
// Copyright 2011 Mark Sibly, all rights reserved.
// No warranty implied; use at your own risk.

// ***** gxtkGraphics class *****

function gxtkGraphics(){
	this.game=BBHtml5Game.Html5Game();
	this.canvas=this.game.GetCanvas()
	this.width=this.canvas.width;
	this.height=this.canvas.height;
	this.gl=null;
	this.gc=this.canvas.getContext( '2d' );
	this.tmpCanvas=null;
	this.r=255;
	this.b=255;
	this.g=255;
	this.white=true;
	this.color="rgb(255,255,255)"
	this.alpha=1;
	this.blend="source-over";
	this.ix=1;this.iy=0;
	this.jx=0;this.jy=1;
	this.tx=0;this.ty=0;
	this.tformed=false;
	this.scissorX=0;
	this.scissorY=0;
	this.scissorWidth=0;
	this.scissorHeight=0;
	this.clipped=false;
}

gxtkGraphics.prototype.BeginRender=function(){
	this.width=this.canvas.width;
	this.height=this.canvas.height;
	if( !this.gc ) return 0;
	this.gc.save();
	if( this.game.GetLoading() ) return 2;
	return 1;
}

gxtkGraphics.prototype.EndRender=function(){
	if( this.gc ) this.gc.restore();
}

gxtkGraphics.prototype.Width=function(){
	return this.width;
}

gxtkGraphics.prototype.Height=function(){
	return this.height;
}

gxtkGraphics.prototype.LoadSurface=function( path ){
	var game=this.game;

	var ty=game.GetMetaData( path,"type" );
	if( ty.indexOf( "image/" )!=0 ) return null;
	
	game.IncLoading();

	var image=new Image();
	image.onload=function(){ game.DecLoading(); }
	image.onerror=function(){ game.DecLoading(); }
	image.meta_width=parseInt( game.GetMetaData( path,"width" ) );
	image.meta_height=parseInt( game.GetMetaData( path,"height" ) );
	image.src=game.PathToUrl( path );

	return new gxtkSurface( image,this );
}

gxtkGraphics.prototype.CreateSurface=function( width,height ){
	var canvas=document.createElement( 'canvas' );
	
	canvas.width=width;
	canvas.height=height;
	canvas.meta_width=width;
	canvas.meta_height=height;
	canvas.complete=true;
	
	var surface=new gxtkSurface( canvas,this );
	
	surface.gc=canvas.getContext( '2d' );
	
	return surface;
}

gxtkGraphics.prototype.SetAlpha=function( alpha ){
	this.alpha=alpha;
	this.gc.globalAlpha=alpha;
}

gxtkGraphics.prototype.SetColor=function( r,g,b ){
	this.r=r;
	this.g=g;
	this.b=b;
	this.white=(r==255 && g==255 && b==255);
	this.color="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;
}

gxtkGraphics.prototype.SetBlend=function( blend ){
	switch( blend ){
	case 1:
		this.blend="lighter";
		break;
	default:
		this.blend="source-over";
	}
	this.gc.globalCompositeOperation=this.blend;
}

gxtkGraphics.prototype.SetScissor=function( x,y,w,h ){
	this.scissorX=x;
	this.scissorY=y;
	this.scissorWidth=w;
	this.scissorHeight=h;
	this.clipped=(x!=0 || y!=0 || w!=this.canvas.width || h!=this.canvas.height);
	this.gc.restore();
	this.gc.save();
	if( this.clipped ){
		this.gc.beginPath();
		this.gc.rect( x,y,w,h );
		this.gc.clip();
		this.gc.closePath();
	}
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;	
	this.gc.globalAlpha=this.alpha;	
	this.gc.globalCompositeOperation=this.blend;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.SetMatrix=function( ix,iy,jx,jy,tx,ty ){
	this.ix=ix;this.iy=iy;
	this.jx=jx;this.jy=jy;
	this.tx=tx;this.ty=ty;
	this.gc.setTransform( ix,iy,jx,jy,tx,ty );
	this.tformed=(ix!=1 || iy!=0 || jx!=0 || jy!=1 || tx!=0 || ty!=0);
}

gxtkGraphics.prototype.Cls=function( r,g,b ){
	if( this.tformed ) this.gc.setTransform( 1,0,0,1,0,0 );
	this.gc.fillStyle="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.globalAlpha=1;
	this.gc.globalCompositeOperation="source-over";
	this.gc.fillRect( 0,0,this.canvas.width,this.canvas.height );
	this.gc.fillStyle=this.color;
	this.gc.globalAlpha=this.alpha;
	this.gc.globalCompositeOperation=this.blend;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.DrawPoint=function( x,y ){
	if( this.tformed ){
		var px=x;
		x=px * this.ix + y * this.jx + this.tx;
		y=px * this.iy + y * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
		this.gc.fillRect( x,y,1,1 );
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
		this.gc.fillRect( x,y,1,1 );
	}
}

gxtkGraphics.prototype.DrawRect=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
	this.gc.fillRect( x,y,w,h );
}

gxtkGraphics.prototype.DrawLine=function( x1,y1,x2,y2 ){
	if( this.tformed ){
		var x1_t=x1 * this.ix + y1 * this.jx + this.tx;
		var y1_t=x1 * this.iy + y1 * this.jy + this.ty;
		var x2_t=x2 * this.ix + y2 * this.jx + this.tx;
		var y2_t=x2 * this.iy + y2 * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1_t,y1_t );
	  	this.gc.lineTo( x2_t,y2_t );
	  	this.gc.stroke();
	  	this.gc.closePath();
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1,y1 );
	  	this.gc.lineTo( x2,y2 );
	  	this.gc.stroke();
	  	this.gc.closePath();
	}
}

gxtkGraphics.prototype.DrawOval=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
  	var w2=w/2,h2=h/2;
	this.gc.save();
	this.gc.translate( x+w2,y+h2 );
	this.gc.scale( w2,h2 );
  	this.gc.beginPath();
	this.gc.arc( 0,0,1,0,Math.PI*2,false );
	this.gc.fill();
  	this.gc.closePath();
	this.gc.restore();
}

gxtkGraphics.prototype.DrawPoly=function( verts ){
	if( verts.length<2 ) return;
	this.gc.beginPath();
	this.gc.moveTo( verts[0],verts[1] );
	for( var i=2;i<verts.length;i+=2 ){
		this.gc.lineTo( verts[i],verts[i+1] );
	}
	this.gc.fill();
	this.gc.closePath();
}

gxtkGraphics.prototype.DrawPoly2=function( verts,surface,srx,srcy ){
	if( verts.length<4 ) return;
	this.gc.beginPath();
	this.gc.moveTo( verts[0],verts[1] );
	for( var i=4;i<verts.length;i+=4 ){
		this.gc.lineTo( verts[i],verts[i+1] );
	}
	this.gc.fill();
	this.gc.closePath();
}

gxtkGraphics.prototype.DrawSurface=function( surface,x,y ){
	if( !surface.image.complete ) return;
	
	if( this.white ){
		this.gc.drawImage( surface.image,x,y );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,0,0,surface.swidth,surface.sheight );
}

gxtkGraphics.prototype.DrawSurface2=function( surface,x,y,srcx,srcy,srcw,srch ){
	if( !surface.image.complete ) return;

	if( srcw<0 ){ srcx+=srcw;srcw=-srcw; }
	if( srch<0 ){ srcy+=srch;srch=-srch; }
	if( srcw<=0 || srch<=0 ) return;

	if( this.white ){
		this.gc.drawImage( surface.image,srcx,srcy,srcw,srch,x,y,srcw,srch );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,srcx,srcy,srcw,srch  );
}

gxtkGraphics.prototype.DrawImageTinted=function( image,dx,dy,sx,sy,sw,sh ){

	if( !this.tmpCanvas ){
		this.tmpCanvas=document.createElement( "canvas" );
	}

	if( sw>this.tmpCanvas.width || sh>this.tmpCanvas.height ){
		this.tmpCanvas.width=Math.max( sw,this.tmpCanvas.width );
		this.tmpCanvas.height=Math.max( sh,this.tmpCanvas.height );
	}
	
	var tmpGC=this.tmpCanvas.getContext( "2d" );
	tmpGC.globalCompositeOperation="copy";
	
	tmpGC.drawImage( image,sx,sy,sw,sh,0,0,sw,sh );
	
	var imgData=tmpGC.getImageData( 0,0,sw,sh );
	
	var p=imgData.data,sz=sw*sh*4,i;
	
	for( i=0;i<sz;i+=4 ){
		p[i]=p[i]*this.r/255;
		p[i+1]=p[i+1]*this.g/255;
		p[i+2]=p[i+2]*this.b/255;
	}
	
	tmpGC.putImageData( imgData,0,0 );
	
	this.gc.drawImage( this.tmpCanvas,0,0,sw,sh,dx,dy,sw,sh );
}

gxtkGraphics.prototype.ReadPixels=function( pixels,x,y,width,height,offset,pitch ){

	var imgData=this.gc.getImageData( x,y,width,height );
	
	var p=imgData.data,i=0,j=offset,px,py;
	
	for( py=0;py<height;++py ){
		for( px=0;px<width;++px ){
			pixels[j++]=(p[i+3]<<24)|(p[i]<<16)|(p[i+1]<<8)|p[i+2];
			i+=4;
		}
		j+=pitch-width;
	}
}

gxtkGraphics.prototype.WritePixels2=function( surface,pixels,x,y,width,height,offset,pitch ){

	if( !surface.gc ){
		if( !surface.image.complete ) return;
		var canvas=document.createElement( "canvas" );
		canvas.width=surface.swidth;
		canvas.height=surface.sheight;
		surface.gc=canvas.getContext( "2d" );
		surface.gc.globalCompositeOperation="copy";
		surface.gc.drawImage( surface.image,0,0 );
		surface.image=canvas;
	}

	var imgData=surface.gc.createImageData( width,height );

	var p=imgData.data,i=0,j=offset,px,py,argb;
	
	for( py=0;py<height;++py ){
		for( px=0;px<width;++px ){
			argb=pixels[j++];
			p[i]=(argb>>16) & 0xff;
			p[i+1]=(argb>>8) & 0xff;
			p[i+2]=argb & 0xff;
			p[i+3]=(argb>>24) & 0xff;
			i+=4;
		}
		j+=pitch-width;
	}
	
	surface.gc.putImageData( imgData,x,y );
}

// ***** gxtkSurface class *****

function gxtkSurface( image,graphics ){
	this.image=image;
	this.graphics=graphics;
	this.swidth=image.meta_width;
	this.sheight=image.meta_height;
}

// ***** GXTK API *****

gxtkSurface.prototype.Discard=function(){
	if( this.image ){
		this.image=null;
	}
}

gxtkSurface.prototype.Width=function(){
	return this.swidth;
}

gxtkSurface.prototype.Height=function(){
	return this.sheight;
}

gxtkSurface.prototype.Loaded=function(){
	return this.image.complete;
}

gxtkSurface.prototype.OnUnsafeLoadComplete=function(){
}

if( CFG_HTML5_WEBAUDIO_ENABLED=="1" && (window.AudioContext || window.webkitAudioContext) ){

//print( "Using WebAudio!" );

// ***** WebAudio *****

var wa=null;

// ***** WebAudio gxtkSample *****

var gxtkSample=function(){
	this.waBuffer=null;
	this.state=0;
}

gxtkSample.prototype.Load=function( path ){
	if( this.state ) return false;

	var req=new XMLHttpRequest();
	
	req.open( "get",BBGame.Game().PathToUrl( path ),true );
	req.responseType="arraybuffer";
	
	var abuf=this;
	
	req.onload=function(){
		wa.decodeAudioData( req.response,function( buffer ){
			//success!
			abuf.waBuffer=buffer;
			abuf.state=1;
		},function(){
			abuf.state=-1;
		} );
	}
	
	req.onerror=function(){
		abuf.state=-1;
	}
	
	req.send();
	
	this.state=2;
			
	return true;
}

gxtkSample.prototype.Discard=function(){
}

// ***** WebAudio gxtkChannel *****

var gxtkChannel=function(){
	this.buffer=null;
	this.flags=0;
	this.volume=1;
	this.pan=0;
	this.rate=1;
	this.waSource=null;
	this.waPan=wa.create
	this.waGain=wa.createGain();
	this.waGain.connect( wa.destination );
	this.waPanner=wa.createPanner();
	this.waPanner.rolloffFactor=0;
	this.waPanner.panningModel="equalpower";
	this.waPanner.connect( this.waGain );
	this.startTime=0;
	this.offset=0;
	this.state=0;
}

// ***** WebAudio gxtkAudio *****

var gxtkAudio=function(){

	if( !wa ){
		window.AudioContext=window.AudioContext || window.webkitAudioContext;
		wa=new AudioContext();
	}
	
	this.okay=true;
	this.music=null;
	this.musicState=0;
	this.musicVolume=1;
	this.channels=new Array();
	for( var i=0;i<32;++i ){
		this.channels[i]=new gxtkChannel();
	}
}

gxtkAudio.prototype.Suspend=function(){
	if( this.MusicState()==1 ) this.music.pause();
	for( var i=0;i<32;++i ){
		var chan=this.channels[i];
		if( chan.state!=1 ) continue;
		this.PauseChannel( i );
		chan.state=5;
	}
}

gxtkAudio.prototype.Resume=function(){
	if( this.MusicState()==1 ) this.music.play();
	for( var i=0;i<32;++i ){
		var chan=this.channels[i];
		if( chan.state!=5 ) continue;
		chan.state=2;
		this.ResumeChannel( i );
	}
}

gxtkAudio.prototype.LoadSample=function( path ){

	var sample=new gxtkSample();
	if( !sample.Load( BBHtml5Game.Html5Game().PathToUrl( path ) ) ) return null;
	
	return sample;
}

gxtkAudio.prototype.PlaySample=function( buffer,channel,flags ){

	if( buffer.state!=1 ) return;

	var chan=this.channels[channel];
	
	if( chan.state ){
		chan.waSource.onended=null
		chan.waSource.stop( 0 );
	}
	
	chan.buffer=buffer;
	chan.flags=flags;

	chan.waSource=wa.createBufferSource();
	chan.waSource.buffer=buffer.waBuffer;
	chan.waSource.playbackRate.value=chan.rate;
	chan.waSource.loop=(flags&1)!=0;
	chan.waSource.connect( chan.waPanner );
	
	chan.waSource.onended=function( e ){
		chan.waSource=null;
		chan.state=0;
	}

	chan.offset=0;	
	chan.startTime=wa.currentTime;
	chan.waSource.start( 0 );

	chan.state=1;
}

gxtkAudio.prototype.StopChannel=function( channel ){

	var chan=this.channels[channel];
	if( !chan.state ) return;
	
	if( chan.state==1 ){
		chan.waSource.onended=null;
		chan.waSource.stop( 0 );
		chan.waSource=null;
	}

	chan.state=0;
}

gxtkAudio.prototype.PauseChannel=function( channel ){

	var chan=this.channels[channel];
	if( chan.state!=1 ) return;
	
	chan.offset=(chan.offset+(wa.currentTime-chan.startTime)*chan.rate)%chan.buffer.waBuffer.duration;
	
	chan.waSource.onended=null;
	chan.waSource.stop( 0 );
	chan.waSource=null;
	
	chan.state=2;
}

gxtkAudio.prototype.ResumeChannel=function( channel ){

	var chan=this.channels[channel];
	if( chan.state!=2 ) return;
	
	chan.waSource=wa.createBufferSource();
	chan.waSource.buffer=chan.buffer.waBuffer;
	chan.waSource.playbackRate.value=chan.rate;
	chan.waSource.loop=(chan.flags&1)!=0;
	chan.waSource.connect( chan.waPanner );
	
	chan.waSource.onended=function( e ){
		chan.waSource=null;
		chan.state=0;
	}
	
	chan.startTime=wa.currentTime;
	chan.waSource.start( 0,chan.offset );

	chan.state=1;
}

gxtkAudio.prototype.ChannelState=function( channel ){
	return this.channels[channel].state & 3;
}

gxtkAudio.prototype.SetVolume=function( channel,volume ){
	var chan=this.channels[channel];

	chan.volume=volume;
	
	chan.waGain.gain.value=volume;
}

gxtkAudio.prototype.SetPan=function( channel,pan ){
	var chan=this.channels[channel];

	chan.pan=pan;
	
	var sin=Math.sin( pan*3.14159265359/2 );
	var cos=Math.cos( pan*3.14159265359/2 );
	
	chan.waPanner.setPosition( sin,0,-cos );
}

gxtkAudio.prototype.SetRate=function( channel,rate ){

	var chan=this.channels[channel];

	if( chan.state==1 ){
		//update offset for pause/resume
		var time=wa.currentTime;
		chan.offset=(chan.offset+(time-chan.startTime)*chan.rate)%chan.buffer.waBuffer.duration;
		chan.startTime=time;
	}

	chan.rate=rate;
	
	if( chan.waSource ) chan.waSource.playbackRate.value=rate;
}

gxtkAudio.prototype.PlayMusic=function( path,flags ){
	if( this.musicState ) this.music.pause();
	this.music=new Audio( BBGame.Game().PathToUrl( path ) );
	this.music.loop=(flags&1)!=0;
	this.music.play();
	this.musicState=1;
}

gxtkAudio.prototype.StopMusic=function(){
	if( !this.musicState ) return;
	this.music.pause();
	this.music=null;
	this.musicState=0;
}

gxtkAudio.prototype.PauseMusic=function(){
	if( this.musicState!=1 ) return;
	this.music.pause();
	this.musicState=2;
}

gxtkAudio.prototype.ResumeMusic=function(){
	if( this.musicState!=2 ) return;
	this.music.play();
	this.musicState=1;
}

gxtkAudio.prototype.MusicState=function(){
	if( this.musicState==1 && this.music.ended && !this.music.loop ){
		this.music=null;
		this.musicState=0;
	}
	return this.musicState;
}

gxtkAudio.prototype.SetMusicVolume=function( volume ){
	this.musicVolume=volume;
	if( this.musicState ) this.music.volume=volume;
}

}else{

//print( "Using OldAudio!" );

// ***** gxtkChannel class *****

var gxtkChannel=function(){
	this.sample=null;
	this.audio=null;
	this.volume=1;
	this.pan=0;
	this.rate=1;
	this.flags=0;
	this.state=0;
}

// ***** gxtkAudio class *****

var gxtkAudio=function(){
	this.game=BBHtml5Game.Html5Game();
	this.okay=typeof(Audio)!="undefined";
	this.music=null;
	this.channels=new Array(33);
	for( var i=0;i<33;++i ){
		this.channels[i]=new gxtkChannel();
		if( !this.okay ) this.channels[i].state=-1;
	}
}

gxtkAudio.prototype.Suspend=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.state==1 ){
			if( chan.audio.ended && !chan.audio.loop ){
				chan.state=0;
			}else{
				chan.audio.pause();
				chan.state=3;
			}
		}
	}
}

gxtkAudio.prototype.Resume=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.state==3 ){
			chan.audio.play();
			chan.state=1;
		}
	}
}

gxtkAudio.prototype.LoadSample=function( path ){
	if( !this.okay ) return null;

	var audio=new Audio( this.game.PathToUrl( path ) );
	if( !audio ) return null;
	
	return new gxtkSample( audio );
}

gxtkAudio.prototype.PlaySample=function( sample,channel,flags ){
	if( !this.okay ) return;
	
	var chan=this.channels[channel];

	if( chan.state>0 ){
		chan.audio.pause();
		chan.state=0;
	}
	
	for( var i=0;i<33;++i ){
		var chan2=this.channels[i];
		if( chan2.state==1 && chan2.audio.ended && !chan2.audio.loop ) chan.state=0;
		if( chan2.state==0 && chan2.sample ){
			chan2.sample.FreeAudio( chan2.audio );
			chan2.sample=null;
			chan2.audio=null;
		}
	}

	var audio=sample.AllocAudio();
	if( !audio ) return;

	audio.loop=(flags&1)!=0;
	audio.volume=chan.volume;
	audio.play();

	chan.sample=sample;
	chan.audio=audio;
	chan.flags=flags;
	chan.state=1;
}

gxtkAudio.prototype.StopChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state>0 ){
		chan.audio.pause();
		chan.state=0;
	}
}

gxtkAudio.prototype.PauseChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state==1 ){
		if( chan.audio.ended && !chan.audio.loop ){
			chan.state=0;
		}else{
			chan.audio.pause();
			chan.state=2;
		}
	}
}

gxtkAudio.prototype.ResumeChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state==2 ){
		chan.audio.play();
		chan.state=1;
	}
}

gxtkAudio.prototype.ChannelState=function( channel ){
	var chan=this.channels[channel];
	if( chan.state==1 && chan.audio.ended && !chan.audio.loop ) chan.state=0;
	if( chan.state==3 ) return 1;
	return chan.state;
}

gxtkAudio.prototype.SetVolume=function( channel,volume ){
	var chan=this.channels[channel];
	if( chan.state>0 ) chan.audio.volume=volume;
	chan.volume=volume;
}

gxtkAudio.prototype.SetPan=function( channel,pan ){
	var chan=this.channels[channel];
	chan.pan=pan;
}

gxtkAudio.prototype.SetRate=function( channel,rate ){
	var chan=this.channels[channel];
	chan.rate=rate;
}

gxtkAudio.prototype.PlayMusic=function( path,flags ){
	this.StopMusic();
	
	this.music=this.LoadSample( path );
	if( !this.music ) return;
	
	this.PlaySample( this.music,32,flags );
}

gxtkAudio.prototype.StopMusic=function(){
	this.StopChannel( 32 );

	if( this.music ){
		this.music.Discard();
		this.music=null;
	}
}

gxtkAudio.prototype.PauseMusic=function(){
	this.PauseChannel( 32 );
}

gxtkAudio.prototype.ResumeMusic=function(){
	this.ResumeChannel( 32 );
}

gxtkAudio.prototype.MusicState=function(){
	return this.ChannelState( 32 );
}

gxtkAudio.prototype.SetMusicVolume=function( volume ){
	this.SetVolume( 32,volume );
}

// ***** gxtkSample class *****

//function gxtkSample( audio ){
var gxtkSample=function( audio ){
	this.audio=audio;
	this.free=new Array();
	this.insts=new Array();
}

gxtkSample.prototype.FreeAudio=function( audio ){
	this.free.push( audio );
}

gxtkSample.prototype.AllocAudio=function(){
	var audio;
	while( this.free.length ){
		audio=this.free.pop();
		try{
			audio.currentTime=0;
			return audio;
		}catch( ex ){
//			print( "AUDIO ERROR1!" );
		}
	}
	
	//Max out?
	if( this.insts.length==8 ) return null;
	
	audio=new Audio( this.audio.src );
	
	//yucky loop handler for firefox!
	//
	audio.addEventListener( 'ended',function(){
		if( this.loop ){
			try{
				this.currentTime=0;
				this.play();
			}catch( ex ){
//				print( "AUDIO ERROR2!" );
			}
		}
	},false );

	this.insts.push( audio );
	return audio;
}

gxtkSample.prototype.Discard=function(){
}

}


function BBThread(){
	this.result=null;
	this.running=false;
}

BBThread.prototype.Start=function(){
	this.result=null;
	this.running=true;
	this.Run__UNSAFE__();
}

BBThread.prototype.IsRunning=function(){
	return this.running;
}

BBThread.prototype.Result=function(){
	return this.result;
}

BBThread.prototype.Run__UNSAFE__=function(){
	this.running=false;
}


function BBAsyncImageLoaderThread(){
	this._running=false;
}

BBAsyncImageLoaderThread.prototype.Start=function(){

	var thread=this;

	thread._surface=null;
	thread._result=false;
	thread._running=true;

	var image=new Image();

	image.onload=function( e ){
		image.meta_width=image.width;
		image.meta_height=image.height;
		thread._surface=new gxtkSurface( image,thread._device )
		thread._result=true;
		thread._running=false;
	}
	
	image.onerror=function( e ){
		thread._running=false;
	}
	
	image.src=BBGame.Game().PathToUrl( thread._path );
}

BBAsyncImageLoaderThread.prototype.IsRunning=function(){
	return this._running;
}



function BBAsyncSoundLoaderThread(){
	this._running=false;
}
  
if( CFG_HTML5_WEBAUDIO_ENABLED=="1" && (window.AudioContext || window.webkitAudioContext) ){

BBAsyncSoundLoaderThread.prototype.Start=function(){

	this._sample=null;
	if( !this._device.okay ) return;
	
	var thread=this;
	
	thread._sample=null;
	thread._result=false;
	thread._running=true;

	var req=new XMLHttpRequest();
	req.open( "get",BBGame.Game().PathToUrl( this._path ),true );
	req.responseType="arraybuffer";
	
	req.onload=function(){
		//load success!
		wa.decodeAudioData( req.response,function( buffer ){
			//decode success!
			thread._sample=new gxtkSample();
			thread._sample.waBuffer=buffer;
			thread._sample.state=1;
			thread._result=true;
			thread._running=false;
		},function(){	
			//decode fail!
			thread._running=false;
		} );
	}
	
	req.onerror=function(){
		//load fail!
		thread._running=false;
	}
	
	req.send();
}
	
}else{
 
BBAsyncSoundLoaderThread.prototype.Start=function(){

	this._sample=null;
	if( !this._device.okay ) return;
	
	var audio=new Audio();
	if( !audio ) return;
	
	var thread=this;
	
	thread._sample=null;
	thread._result=false;
	thread._running=true;

	audio.src=BBGame.Game().PathToUrl( this._path );
	audio.preload='auto';	
	
	var success=function( e ){
		thread._sample=new gxtkSample( audio );
		thread._result=true;
		thread._running=false;
		audio.removeEventListener( 'canplaythrough',success,false );
		audio.removeEventListener( 'error',error,false );
	}
	
	var error=function( e ){
		thread._running=false;
		audio.removeEventListener( 'canplaythrough',success,false );
		audio.removeEventListener( 'error',error,false );
	}
	
	audio.addEventListener( 'canplaythrough',success,false );
	audio.addEventListener( 'error',error,false );
	
	//voodoo fix for Chrome!
	var timer=setInterval( function(){ if( !thread._running ) clearInterval( timer ); },200 );
	
	audio.load();
}

}
  
BBAsyncSoundLoaderThread.prototype.IsRunning=function(){
	return this._running;
}


function BBDataBuffer(){
	this.arrayBuffer=null;
	this.length=0;
}

BBDataBuffer.tbuf=new ArrayBuffer(4);
BBDataBuffer.tbytes=new Int8Array( BBDataBuffer.tbuf );
BBDataBuffer.tshorts=new Int16Array( BBDataBuffer.tbuf );
BBDataBuffer.tints=new Int32Array( BBDataBuffer.tbuf );
BBDataBuffer.tfloats=new Float32Array( BBDataBuffer.tbuf );

BBDataBuffer.prototype._Init=function( buffer ){
	this.arrayBuffer=buffer;
	this.length=buffer.byteLength;
	this.bytes=new Int8Array( buffer );	
	this.shorts=new Int16Array( buffer,0,this.length/2 );	
	this.ints=new Int32Array( buffer,0,this.length/4 );	
	this.floats=new Float32Array( buffer,0,this.length/4 );
}

BBDataBuffer.prototype._New=function( length ){
	if( this.arrayBuffer ) return false;
	
	var buf=new ArrayBuffer( length );
	if( !buf ) return false;
	
	this._Init( buf );
	return true;
}

BBDataBuffer.prototype._Load=function( path ){
	if( this.arrayBuffer ) return false;
	
	var buf=BBGame.Game().LoadData( path );
	if( !buf ) return false;
	
	this._Init( buf );
	return true;
}

BBDataBuffer.prototype._LoadAsync=function( path,thread ){

	var buf=this;
	
	var xhr=new XMLHttpRequest();
	xhr.open( "GET",BBGame.Game().PathToUrl( path ),true );
	xhr.responseType="arraybuffer";
	
	xhr.onload=function(e){
		if( this.status==200 || this.status==0 ){
			buf._Init( xhr.response );
			thread.result=buf;
		}
		thread.running=false;
	}
	
	xhr.onerror=function(e){
		thread.running=false;
	}
	
	xhr.send();
}


BBDataBuffer.prototype.GetArrayBuffer=function(){
	return this.arrayBuffer;
}

BBDataBuffer.prototype.Length=function(){
	return this.length;
}

BBDataBuffer.prototype.Discard=function(){
	if( this.arrayBuffer ){
		this.arrayBuffer=null;
		this.length=0;
	}
}

BBDataBuffer.prototype.PokeByte=function( addr,value ){
	this.bytes[addr]=value;
}

BBDataBuffer.prototype.PokeShort=function( addr,value ){
	if( addr&1 ){
		BBDataBuffer.tshorts[0]=value;
		this.bytes[addr]=BBDataBuffer.tbytes[0];
		this.bytes[addr+1]=BBDataBuffer.tbytes[1];
		return;
	}
	this.shorts[addr>>1]=value;
}

BBDataBuffer.prototype.PokeInt=function( addr,value ){
	if( addr&3 ){
		BBDataBuffer.tints[0]=value;
		this.bytes[addr]=BBDataBuffer.tbytes[0];
		this.bytes[addr+1]=BBDataBuffer.tbytes[1];
		this.bytes[addr+2]=BBDataBuffer.tbytes[2];
		this.bytes[addr+3]=BBDataBuffer.tbytes[3];
		return;
	}
	this.ints[addr>>2]=value;
}

BBDataBuffer.prototype.PokeFloat=function( addr,value ){
	if( addr&3 ){
		BBDataBuffer.tfloats[0]=value;
		this.bytes[addr]=BBDataBuffer.tbytes[0];
		this.bytes[addr+1]=BBDataBuffer.tbytes[1];
		this.bytes[addr+2]=BBDataBuffer.tbytes[2];
		this.bytes[addr+3]=BBDataBuffer.tbytes[3];
		return;
	}
	this.floats[addr>>2]=value;
}

BBDataBuffer.prototype.PeekByte=function( addr ){
	return this.bytes[addr];
}

BBDataBuffer.prototype.PeekShort=function( addr ){
	if( addr&1 ){
		BBDataBuffer.tbytes[0]=this.bytes[addr];
		BBDataBuffer.tbytes[1]=this.bytes[addr+1];
		return BBDataBuffer.tshorts[0];
	}
	return this.shorts[addr>>1];
}

BBDataBuffer.prototype.PeekInt=function( addr ){
	if( addr&3 ){
		BBDataBuffer.tbytes[0]=this.bytes[addr];
		BBDataBuffer.tbytes[1]=this.bytes[addr+1];
		BBDataBuffer.tbytes[2]=this.bytes[addr+2];
		BBDataBuffer.tbytes[3]=this.bytes[addr+3];
		return BBDataBuffer.tints[0];
	}
	return this.ints[addr>>2];
}

BBDataBuffer.prototype.PeekFloat=function( addr ){
	if( addr&3 ){
		BBDataBuffer.tbytes[0]=this.bytes[addr];
		BBDataBuffer.tbytes[1]=this.bytes[addr+1];
		BBDataBuffer.tbytes[2]=this.bytes[addr+2];
		BBDataBuffer.tbytes[3]=this.bytes[addr+3];
		return BBDataBuffer.tfloats[0];
	}
	return this.floats[addr>>2];
}


function BBStream(){
}

BBStream.prototype.Eof=function(){
	return 0;
}

BBStream.prototype.Close=function(){
}

BBStream.prototype.Length=function(){
	return 0;
}

BBStream.prototype.Position=function(){
	return 0;
}

BBStream.prototype.Seek=function( position ){
	return 0;
}

BBStream.prototype.Read=function( buffer,offset,count ){
	return 0;
}

BBStream.prototype.Write=function( buffer,offset,count ){
	return 0;
}

function c_App(){
	Object.call(this);
}
c_App.m_new=function(){
	if((bb_app__app)!=null){
		error("App has already been created");
	}
	bb_app__app=this;
	bb_app__delegate=c_GameDelegate.m_new.call(new c_GameDelegate);
	bb_app__game.SetDelegate(bb_app__delegate);
	return this;
}
c_App.prototype.p_OnResize=function(){
	return 0;
}
c_App.prototype.p_OnCreate=function(){
	return 0;
}
c_App.prototype.p_OnSuspend=function(){
	return 0;
}
c_App.prototype.p_OnResume=function(){
	return 0;
}
c_App.prototype.p_OnUpdate=function(){
	return 0;
}
c_App.prototype.p_OnLoading=function(){
	return 0;
}
c_App.prototype.p_OnRender=function(){
	return 0;
}
c_App.prototype.p_OnClose=function(){
	bb_app_EndApp();
	return 0;
}
c_App.prototype.p_OnBack=function(){
	this.p_OnClose();
	return 0;
}
function c_DarkDungeon(){
	c_App.call(this);
	this.m_MapWidth=0;
	this.m_MapOffset=.0;
	this.m_player=null;
	this.m_map=null;
	this.m_NextLevelFX=null;
	this.m_EnemyShootFX=null;
	this.m_IntroCutsceneCounter=0;
	this.m_IntroFrames=["*You awake in a cold cell*","The cell door is unlocked, you push through...","Already donning appropriate gear you traverse the dungeon."];
	this.m_playerProjectiles=c_List.m_new.call(new c_List);
	this.m_enemies=c_List2.m_new.call(new c_List2);
	this.m_enemies2=c_List3.m_new.call(new c_List3);
	this.m_enemyProjectiles=c_List.m_new.call(new c_List);
	this.m_doors=c_List4.m_new.call(new c_List4);
	this.m_blocks=c_List5.m_new.call(new c_List5);
	this.m_MapCounter=1;
	this.m_EndCutsceneCounter=0;
	this.m_Death=false;
	this.m_boss=c_List6.m_new.call(new c_List6);
	this.m_EndFrames=["You have defeated the boss and march on forth","The exploration of the dungeon has left you drained.","You have become exhausted...","Continuing forth, you see light before collapsing..."];
}
c_DarkDungeon.prototype=extend_class(c_App);
c_DarkDungeon.m_new=function(){
	c_App.m_new.call(this);
	return this;
}
c_DarkDungeon.prototype.p_OnCreate=function(){
	bb_app_SetUpdateRate(60);
	this.m_MapWidth=20;
	this.m_MapOffset=0.0;
	bb_Main_GameState=0;
	bb_Main_menu=c_MenuClass.m_new.call(new c_MenuClass);
	this.m_player=c_Player.m_new.call(new c_Player,320.0,240.0,100,100);
	this.m_map=c_Map2.m_new.call(new c_Map2);
	bb_audio_PlayMusic("Journey Music.ogg",1);
	bb_Main_MeleeFX=bb_audio_LoadSound("SwordFX.wav");
	bb_Main_ShootFX=bb_audio_LoadSound("ShootFX.wav");
	this.m_NextLevelFX=bb_audio_LoadSound("NextLevel.wav");
	this.m_EnemyShootFX=bb_audio_LoadSound("EnemyFire.wav");
	return 0;
}
c_DarkDungeon.prototype.p_RectangleOverlap=function(t_x1,t_y1,t_width,t_height,t_x2,t_y2,t_width2,t_height2){
	if(t_x1>=t_x2+t_width2 || t_x1+t_width<=t_x2){
		return false;
	}
	if(t_y1>=t_y2+t_height2 || t_y1+t_height<=t_y2){
		return false;
	}
	return true;
}
c_DarkDungeon.prototype.p_PlayerEnemyCollision=function(t_x1,t_y1,t_EnemyPositionX,t_EnemyPositionY){
	var t_colx=(((t_EnemyPositionX+t_x1)/32)|0);
	var t_coly=(((t_EnemyPositionY+t_y1)/32)|0);
	for(var t_y2=t_coly-1;t_y2<t_coly+2;t_y2=t_y2+1){
		for(var t_x2=t_colx-1;t_x2<t_colx+2;t_x2=t_x2+1){
			if(this.p_RectangleOverlap(t_EnemyPositionX+t_x1,t_EnemyPositionY+t_y1,32,32,((this.m_player.m_Position.m_x-16.0)|0),((this.m_player.m_Position.m_y-16.0)|0),32,32)==true){
				return true;
			}
		}
	}
	return false;
}
c_DarkDungeon.prototype.p_PlayerEnemyHitDetection=function(){
	var t_=this.m_enemies.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_Enemy=t_.p_NextObject();
		if(this.p_PlayerEnemyCollision(1,0,((t_Enemy.m_Position.m_x)|0),((t_Enemy.m_Position.m_y)|0)) || this.p_PlayerEnemyCollision(-1,0,((t_Enemy.m_Position.m_x)|0),((t_Enemy.m_Position.m_y)|0)) || this.p_PlayerEnemyCollision(0,1,((t_Enemy.m_Position.m_x)|0),((t_Enemy.m_Position.m_y)|0)) || this.p_PlayerEnemyCollision(0,-1,((t_Enemy.m_Position.m_x)|0),((t_Enemy.m_Position.m_y)|0))){
			this.m_player.m_playerCurHealth=this.m_player.m_playerCurHealth-1.0;
			if(this.m_player.m_Direction=="N"){
				this.m_player.p_SetPosition(this.m_player.m_Position.m_x,this.m_player.m_Position.m_y+3.0);
				if(this.m_player.p_PlayerTileCollision(0,1)){
					this.m_player.m_playerCurHealth=0.0;
				}
			}else{
				if(this.m_player.m_Direction=="S"){
					this.m_player.p_SetPosition(this.m_player.m_Position.m_x,this.m_player.m_Position.m_y-3.0);
					if(this.m_player.p_PlayerTileCollision(0,-1)){
						this.m_player.m_playerCurHealth=0.0;
					}
				}else{
					if(this.m_player.m_Direction=="E"){
						this.m_player.p_SetPosition(this.m_player.m_Position.m_x-3.0,this.m_player.m_Position.m_y);
						if(this.m_player.p_PlayerTileCollision(1,0)){
							this.m_player.m_playerCurHealth=0.0;
						}
					}else{
						if(this.m_player.m_Direction=="W"){
							this.m_player.p_SetPosition(this.m_player.m_Position.m_x+3.0,this.m_player.m_Position.m_y);
							if(this.m_player.p_PlayerTileCollision(-1,0)){
								this.m_player.m_playerCurHealth=0.0;
							}
						}
					}
				}
			}
		}
	}
	return 0;
}
c_DarkDungeon.prototype.p_SetWalls=function(){
	for(var t_y=0;t_y<15;t_y=t_y+1){
		for(var t_x=0;t_x<20;t_x=t_x+1){
			if(c_Map2.m_Layout[t_y][t_x]==1){
				this.m_blocks.p_AddLast5(c_Block.m_new.call(new c_Block,t_x*32,t_y*32));
			}else{
				if(c_Map2.m_Layout[t_y][t_x]==3){
					this.m_enemies.p_AddLast2(c_Enemy.m_new.call(new c_Enemy,(t_x*32),(t_y*32),"N"));
				}else{
					if(c_Map2.m_Layout[t_y][t_x]==4){
						this.m_enemies.p_AddLast2(c_Enemy.m_new.call(new c_Enemy,(t_x*32),(t_y*32),"W"));
					}else{
						if(c_Map2.m_Layout[t_y][t_x]==5){
							this.m_enemies2.p_AddLast3(c_Enemy2.m_new.call(new c_Enemy2,(t_x*32),(t_y*32),"W"));
						}else{
							if(c_Map2.m_Layout[t_y][t_x]==2){
								this.m_doors.p_AddLast4(c_Door.m_new.call(new c_Door,t_x*32,t_y*32,true));
							}
						}
					}
				}
			}
		}
	}
	this.m_map.m_LoadNew=false;
	return 0;
}
c_DarkDungeon.prototype.p_Reset=function(){
	var t_=this.m_blocks.p_ObjectEnumerator();
	while(t_.p_HasNext()){
		var t_Block=t_.p_NextObject();
		this.m_blocks.p_Remove6(t_Block);
	}
	this.m_MapCounter=1;
	this.m_IntroCutsceneCounter=0;
	this.m_EndCutsceneCounter=0;
	this.m_Death=false;
	c_MenuClass.m_Selected=0;
	c_MenuClass.m_SplashScreen=true;
	this.m_player.m_playerCurSP=(this.m_player.m_playerMaxSP);
	this.m_player.m_playerCurHealth=(this.m_player.m_playerMaxHealth);
	this.m_player.m_Direction="N";
	this.m_map.m_RoomCounter=1;
	this.m_map.m_LoadNew=true;
	bb_Main_GameState=0;
	return 0;
}
c_DarkDungeon.prototype.p_OnUpdate=function(){
	var t_1=bb_Main_GameState;
	if(t_1==0){
		bb_Main_menu.p_Update();
	}else{
		if(t_1==1){
			if((bb_input_KeyHit(1))!=0){
				this.m_IntroCutsceneCounter=this.m_IntroCutsceneCounter+1;
			}
			if(this.m_IntroCutsceneCounter>=this.m_IntroFrames.length){
				this.m_IntroCutsceneCounter=this.m_IntroFrames.length;
				bb_Main_GameState=2;
			}
		}else{
			if(t_1==2){
				this.m_player.p_Update();
				if(this.m_player.m_NewProjectile==60.0){
					this.m_playerProjectiles.p_AddLast(c_PlayerProjectile.m_new.call(new c_PlayerProjectile,this.m_player.m_Position.m_x,this.m_player.m_Position.m_y,this.m_player.m_Direction,2,true));
				}
				var t_=this.m_playerProjectiles.p_ObjectEnumerator();
				while(t_.p_HasNext()){
					var t_PlayerProjectile=t_.p_NextObject();
					t_PlayerProjectile.p_Update();
					if(t_PlayerProjectile.m_TileCollision==true){
						this.m_playerProjectiles.p_Remove(t_PlayerProjectile);
					}
					var t_2=this.m_enemies.p_ObjectEnumerator();
					while(t_2.p_HasNext()){
						var t_Enemy=t_2.p_NextObject();
						if(this.p_RectangleOverlap(((t_Enemy.m_Position.m_x)|0),((t_Enemy.m_Position.m_y)|0),32,32,((t_PlayerProjectile.m_Position.m_x)|0),((t_PlayerProjectile.m_Position.m_y)|0),8,8)){
							this.m_playerProjectiles.p_Remove(t_PlayerProjectile);
							this.m_enemies.p_Remove3(t_Enemy);
						}
					}
					var t_3=this.m_enemies2.p_ObjectEnumerator();
					while(t_3.p_HasNext()){
						var t_Enemy2=t_3.p_NextObject();
						if(this.p_RectangleOverlap(((t_Enemy2.m_Position.m_x)|0),((t_Enemy2.m_Position.m_y)|0),32,32,((t_PlayerProjectile.m_Position.m_x)|0),((t_PlayerProjectile.m_Position.m_y)|0),8,8)){
							this.m_playerProjectiles.p_Remove(t_PlayerProjectile);
							this.m_enemies2.p_Remove4(t_Enemy2);
						}
					}
				}
				if(this.m_player.m_MeleeAttack==true){
					var t_4=this.m_enemies.p_ObjectEnumerator();
					while(t_4.p_HasNext()){
						var t_Enemy3=t_4.p_NextObject();
						if(this.m_player.m_Direction=="E"){
							if(this.p_RectangleOverlap(((t_Enemy3.m_Position.m_x)|0),((t_Enemy3.m_Position.m_y)|0),32,32,((this.m_player.m_Position.m_x)|0),((this.m_player.m_Position.m_y-16.0)|0),32,32)){
								this.m_enemies.p_Remove3(t_Enemy3);
							}
						}else{
							if(this.m_player.m_Direction=="W"){
								if(this.p_RectangleOverlap(((t_Enemy3.m_Position.m_x)|0),((t_Enemy3.m_Position.m_y)|0),32,32,((this.m_player.m_Position.m_x-32.0)|0),((this.m_player.m_Position.m_y-16.0)|0),32,32)){
									this.m_enemies.p_Remove3(t_Enemy3);
								}
							}else{
								if(this.m_player.m_Direction=="S"){
									if(this.p_RectangleOverlap(((t_Enemy3.m_Position.m_x)|0),((t_Enemy3.m_Position.m_y)|0),32,32,((this.m_player.m_Position.m_x-16.0)|0),((this.m_player.m_Position.m_y)|0),32,32)){
										this.m_enemies.p_Remove3(t_Enemy3);
									}
								}else{
									if(this.m_player.m_Direction=="N"){
										if(this.p_RectangleOverlap(((t_Enemy3.m_Position.m_x)|0),((t_Enemy3.m_Position.m_y)|0),32,32,((this.m_player.m_Position.m_x-16.0)|0),((this.m_player.m_Position.m_y-32.0)|0),32,32)){
											this.m_enemies.p_Remove3(t_Enemy3);
										}
									}
								}
							}
						}
					}
					var t_5=this.m_enemies2.p_ObjectEnumerator();
					while(t_5.p_HasNext()){
						var t_Enemy22=t_5.p_NextObject();
						if(this.m_player.m_Direction=="E"){
							if(this.p_RectangleOverlap(((t_Enemy22.m_Position.m_x)|0),((t_Enemy22.m_Position.m_y)|0),32,32,((this.m_player.m_Position.m_x)|0),((this.m_player.m_Position.m_y-16.0)|0),32,32)){
								this.m_enemies2.p_Remove4(t_Enemy22);
							}
						}else{
							if(this.m_player.m_Direction=="W"){
								if(this.p_RectangleOverlap(((t_Enemy22.m_Position.m_x)|0),((t_Enemy22.m_Position.m_y)|0),32,32,((this.m_player.m_Position.m_x-32.0)|0),((this.m_player.m_Position.m_y-16.0)|0),32,32)){
									this.m_enemies2.p_Remove4(t_Enemy22);
								}
							}else{
								if(this.m_player.m_Direction=="S"){
									if(this.p_RectangleOverlap(((t_Enemy22.m_Position.m_x)|0),((t_Enemy22.m_Position.m_y)|0),32,32,((this.m_player.m_Position.m_x-16.0)|0),((this.m_player.m_Position.m_y)|0),32,32)){
										this.m_enemies2.p_Remove4(t_Enemy22);
									}
								}else{
									if(this.m_player.m_Direction=="N"){
										if(this.p_RectangleOverlap(((t_Enemy22.m_Position.m_x)|0),((t_Enemy22.m_Position.m_y)|0),32,32,((this.m_player.m_Position.m_x-16.0)|0),((this.m_player.m_Position.m_y-32.0)|0),32,32)){
											this.m_enemies2.p_Remove4(t_Enemy22);
										}
									}
								}
							}
						}
					}
				}
				var t_6=this.m_enemies.p_ObjectEnumerator();
				while(t_6.p_HasNext()){
					var t_Enemy4=t_6.p_NextObject();
					t_Enemy4.p_Update();
				}
				var t_7=this.m_enemies2.p_ObjectEnumerator();
				while(t_7.p_HasNext()){
					var t_Enemy23=t_7.p_NextObject();
					if(t_Enemy23.m_Position.m_y+32.0<this.m_player.m_Position.m_y-16.0){
						t_Enemy23.m_Direction="S";
					}else{
						if(t_Enemy23.m_Position.m_y>this.m_player.m_Position.m_y+16.0){
							t_Enemy23.m_Direction="N";
						}else{
							if(t_Enemy23.m_Position.m_x+16.0<this.m_player.m_Position.m_x-16.0){
								t_Enemy23.m_Direction="E";
							}
							if(t_Enemy23.m_Position.m_x+16.0>this.m_player.m_Position.m_x-16.0){
								t_Enemy23.m_Direction="W";
							}
						}
					}
					t_Enemy23.p_Update();
					if(t_Enemy23.m_Shoot==true){
						this.m_enemyProjectiles.p_AddLast(c_PlayerProjectile.m_new.call(new c_PlayerProjectile,t_Enemy23.m_Position.m_x+16.0,t_Enemy23.m_Position.m_y+16.0,t_Enemy23.m_Direction,1,false));
						bb_audio_PlaySound(this.m_EnemyShootFX,0,0);
					}
				}
				var t_8=this.m_enemyProjectiles.p_ObjectEnumerator();
				while(t_8.p_HasNext()){
					var t_EnemyProjectile=t_8.p_NextObject();
					t_EnemyProjectile.p_Update();
					if(t_EnemyProjectile.m_TileCollision==true){
						this.m_enemyProjectiles.p_Remove(t_EnemyProjectile);
					}
					if(this.p_RectangleOverlap(((t_EnemyProjectile.m_Position.m_x)|0),((t_EnemyProjectile.m_Position.m_y)|0),8,8,((this.m_player.m_Position.m_x-16.0)|0),((this.m_player.m_Position.m_y-16.0)|0),32,32)){
						this.m_enemyProjectiles.p_Remove(t_EnemyProjectile);
						this.m_player.m_playerCurHealth=this.m_player.m_playerCurHealth-1.0;
					}
				}
				this.p_PlayerEnemyHitDetection();
				if(this.m_map.m_LoadNew==true){
					var t_9=this.m_doors.p_ObjectEnumerator();
					while(t_9.p_HasNext()){
						var t_Door=t_9.p_NextObject();
						this.m_doors.p_Remove5(t_Door);
					}
					this.m_map.p_CreateMap();
					this.p_SetWalls();
					this.m_player.p_SetPosition(320.0,420.0);
				}
				if(this.m_enemies.p_Count()==0 && this.m_enemies2.p_Count()==0 && this.m_map.m_RoomCounter!=11){
					var t_10=this.m_doors.p_ObjectEnumerator();
					while(t_10.p_HasNext()){
						var t_Door2=t_10.p_NextObject();
						t_Door2.m_Lock=false;
					}
				}
				var t_11=this.m_doors.p_ObjectEnumerator();
				while(t_11.p_HasNext()){
					var t_Door3=t_11.p_NextObject();
					if(t_Door3.m_Lock==true && this.p_RectangleOverlap(((this.m_player.m_Position.m_x-16.0)|0),((this.m_player.m_Position.m_y)|0),32,32,((t_Door3.m_Position.m_x)|0),((t_Door3.m_Position.m_y)|0),32,32)){
						this.m_player.m_Velocity.m_y=0.0;
						this.m_player.m_Position.m_y=this.m_player.m_Position.m_y+1.0;
					}else{
						if(t_Door3.m_Lock==false && this.p_RectangleOverlap(((this.m_player.m_Position.m_x-16.0)|0),((this.m_player.m_Position.m_y)|0),32,32,((t_Door3.m_Position.m_x)|0),((t_Door3.m_Position.m_y)|0),32,32)){
							bb_audio_PlaySound(this.m_NextLevelFX,0,0);
							var t_12=this.m_blocks.p_ObjectEnumerator();
							while(t_12.p_HasNext()){
								var t_Block=t_12.p_NextObject();
								this.m_blocks.p_Remove6(t_Block);
							}
							this.m_map.m_RoomCounter=this.m_map.m_RoomCounter+1;
							this.m_map.m_LoadNew=true;
							if(this.m_map.m_RoomCounter==11){
								bb_Main_GameState=3;
							}
						}
					}
				}
				if(this.m_player.m_playerCurHealth<=0.0){
					bb_Main_GameState=5;
				}
				if((bb_input_KeyHit(69))!=0){
					bb_Main_GameState=3;
				}
				if((bb_input_KeyHit(27))!=0){
					this.p_Reset();
				}
			}else{
				if(t_1==3){
					this.m_map.m_RoomCounter=11;
					if(this.m_map.m_LoadNew==true){
						var t_13=this.m_doors.p_ObjectEnumerator();
						while(t_13.p_HasNext()){
							var t_Door4=t_13.p_NextObject();
							this.m_doors.p_Remove5(t_Door4);
						}
						var t_14=this.m_blocks.p_ObjectEnumerator();
						while(t_14.p_HasNext()){
							var t_Block2=t_14.p_NextObject();
							this.m_blocks.p_Remove6(t_Block2);
						}
						var t_15=this.m_enemies.p_ObjectEnumerator();
						while(t_15.p_HasNext()){
							var t_Enemy5=t_15.p_NextObject();
							this.m_enemies.p_Remove3(t_Enemy5);
						}
						var t_16=this.m_enemies2.p_ObjectEnumerator();
						while(t_16.p_HasNext()){
							var t_Enemy24=t_16.p_NextObject();
							this.m_enemies2.p_Remove4(t_Enemy24);
						}
						var t_17=this.m_playerProjectiles.p_ObjectEnumerator();
						while(t_17.p_HasNext()){
							var t_PlayerProjectile2=t_17.p_NextObject();
							this.m_playerProjectiles.p_Remove(t_PlayerProjectile2);
						}
						var t_18=this.m_enemyProjectiles.p_ObjectEnumerator();
						while(t_18.p_HasNext()){
							var t_EnemyProjectile2=t_18.p_NextObject();
							this.m_enemyProjectiles.p_Remove(t_EnemyProjectile2);
						}
						this.m_boss.p_AddLast6(c_Boss.m_new.call(new c_Boss,320.0,120.0,100,"E"));
						this.m_map.p_CreateMap();
						this.p_SetWalls();
						this.m_player.p_SetPosition(320.0,420.0);
					}
					this.m_player.p_Update();
					if(this.m_player.m_NewProjectile==60.0){
						this.m_playerProjectiles.p_AddLast(c_PlayerProjectile.m_new.call(new c_PlayerProjectile,this.m_player.m_Position.m_x,this.m_player.m_Position.m_y,this.m_player.m_Direction,2,true));
					}
					if(this.m_player.m_MeleeAttack==true){
						var t_19=this.m_boss.p_ObjectEnumerator();
						while(t_19.p_HasNext()){
							var t_Boss=t_19.p_NextObject();
							if(this.m_player.m_Direction=="E"){
								if(this.p_RectangleOverlap(((t_Boss.m_Position.m_x)|0),((t_Boss.m_Position.m_y)|0),32,32,((this.m_player.m_Position.m_x)|0),((this.m_player.m_Position.m_y-16.0)|0),32,32)){
									t_Boss.m_bossCurHealth=t_Boss.m_bossCurHealth-1.0;
								}
								if(this.p_RectangleOverlap(((t_Boss.m_Position.m_x+32.0)|0),((t_Boss.m_Position.m_y)|0),32,32,((this.m_player.m_Position.m_x)|0),((this.m_player.m_Position.m_y-16.0)|0),32,32)){
									t_Boss.m_bossCurHealth=t_Boss.m_bossCurHealth-1.0;
								}
								if(this.p_RectangleOverlap(((t_Boss.m_Position.m_x)|0),((t_Boss.m_Position.m_y+32.0)|0),32,32,((this.m_player.m_Position.m_x)|0),((this.m_player.m_Position.m_y-16.0)|0),32,32)){
									t_Boss.m_bossCurHealth=t_Boss.m_bossCurHealth-1.0;
								}
								if(this.p_RectangleOverlap(((t_Boss.m_Position.m_x+32.0)|0),((t_Boss.m_Position.m_y+32.0)|0),32,32,((this.m_player.m_Position.m_x)|0),((this.m_player.m_Position.m_y-16.0)|0),32,32)){
									t_Boss.m_bossCurHealth=t_Boss.m_bossCurHealth-1.0;
								}
							}else{
								if(this.m_player.m_Direction=="W"){
									if(this.p_RectangleOverlap(((t_Boss.m_Position.m_x)|0),((t_Boss.m_Position.m_y)|0),32,32,((this.m_player.m_Position.m_x-32.0)|0),((this.m_player.m_Position.m_y-16.0)|0),32,32)){
										t_Boss.m_bossCurHealth=t_Boss.m_bossCurHealth-1.0;
									}
									if(this.p_RectangleOverlap(((t_Boss.m_Position.m_x+32.0)|0),((t_Boss.m_Position.m_y)|0),32,32,((this.m_player.m_Position.m_x-32.0)|0),((this.m_player.m_Position.m_y-16.0)|0),32,32)){
										t_Boss.m_bossCurHealth=t_Boss.m_bossCurHealth-1.0;
									}
									if(this.p_RectangleOverlap(((t_Boss.m_Position.m_x)|0),((t_Boss.m_Position.m_y+32.0)|0),32,32,((this.m_player.m_Position.m_x-32.0)|0),((this.m_player.m_Position.m_y-16.0)|0),32,32)){
										t_Boss.m_bossCurHealth=t_Boss.m_bossCurHealth-1.0;
									}
									if(this.p_RectangleOverlap(((t_Boss.m_Position.m_x+32.0)|0),((t_Boss.m_Position.m_y+32.0)|0),32,32,((this.m_player.m_Position.m_x-32.0)|0),((this.m_player.m_Position.m_y-16.0)|0),32,32)){
										t_Boss.m_bossCurHealth=t_Boss.m_bossCurHealth-1.0;
									}
								}else{
									if(this.m_player.m_Direction=="S"){
										if(this.p_RectangleOverlap(((t_Boss.m_Position.m_x)|0),((t_Boss.m_Position.m_y)|0),32,32,((this.m_player.m_Position.m_x-16.0)|0),((this.m_player.m_Position.m_y)|0),32,32)){
											t_Boss.m_bossCurHealth=t_Boss.m_bossCurHealth-1.0;
										}
										if(this.p_RectangleOverlap(((t_Boss.m_Position.m_x+32.0)|0),((t_Boss.m_Position.m_y)|0),32,32,((this.m_player.m_Position.m_x-16.0)|0),((this.m_player.m_Position.m_y)|0),32,32)){
											t_Boss.m_bossCurHealth=t_Boss.m_bossCurHealth-1.0;
										}
										if(this.p_RectangleOverlap(((t_Boss.m_Position.m_x)|0),((t_Boss.m_Position.m_y+32.0)|0),32,32,((this.m_player.m_Position.m_x-16.0)|0),((this.m_player.m_Position.m_y)|0),32,32)){
											t_Boss.m_bossCurHealth=t_Boss.m_bossCurHealth-1.0;
										}
										if(this.p_RectangleOverlap(((t_Boss.m_Position.m_x+32.0)|0),((t_Boss.m_Position.m_y+32.0)|0),32,32,((this.m_player.m_Position.m_x-16.0)|0),((this.m_player.m_Position.m_y)|0),32,32)){
											t_Boss.m_bossCurHealth=t_Boss.m_bossCurHealth-1.0;
										}
									}else{
										if(this.m_player.m_Direction=="N"){
											if(this.p_RectangleOverlap(((t_Boss.m_Position.m_x)|0),((t_Boss.m_Position.m_y)|0),32,32,((this.m_player.m_Position.m_x-16.0)|0),((this.m_player.m_Position.m_y-32.0)|0),32,32)){
												t_Boss.m_bossCurHealth=t_Boss.m_bossCurHealth-1.0;
											}
											if(this.p_RectangleOverlap(((t_Boss.m_Position.m_x+32.0)|0),((t_Boss.m_Position.m_y)|0),32,32,((this.m_player.m_Position.m_x-16.0)|0),((this.m_player.m_Position.m_y-32.0)|0),32,32)){
												t_Boss.m_bossCurHealth=t_Boss.m_bossCurHealth-1.0;
											}
											if(this.p_RectangleOverlap(((t_Boss.m_Position.m_x)|0),((t_Boss.m_Position.m_y+32.0)|0),32,32,((this.m_player.m_Position.m_x-16.0)|0),((this.m_player.m_Position.m_y-32.0)|0),32,32)){
												t_Boss.m_bossCurHealth=t_Boss.m_bossCurHealth-1.0;
											}
											if(this.p_RectangleOverlap(((t_Boss.m_Position.m_x+32.0)|0),((t_Boss.m_Position.m_y+32.0)|0),32,32,((this.m_player.m_Position.m_x-16.0)|0),((this.m_player.m_Position.m_y-32.0)|0),32,32)){
												t_Boss.m_bossCurHealth=t_Boss.m_bossCurHealth-1.0;
											}
										}
									}
								}
							}
						}
					}
					var t_20=this.m_boss.p_ObjectEnumerator();
					while(t_20.p_HasNext()){
						var t_Boss2=t_20.p_NextObject();
						if(this.p_PlayerEnemyCollision(1,0,((t_Boss2.m_Position.m_x)|0),((t_Boss2.m_Position.m_y)|0)) || this.p_PlayerEnemyCollision(-1,0,((t_Boss2.m_Position.m_x)|0),((t_Boss2.m_Position.m_y)|0)) || this.p_PlayerEnemyCollision(0,1,((t_Boss2.m_Position.m_x)|0),((t_Boss2.m_Position.m_y)|0)) || this.p_PlayerEnemyCollision(0,-1,((t_Boss2.m_Position.m_x)|0),((t_Boss2.m_Position.m_y)|0)) || this.p_PlayerEnemyCollision(1,0,((t_Boss2.m_Position.m_x+32.0)|0),((t_Boss2.m_Position.m_y)|0)) || this.p_PlayerEnemyCollision(-1,0,((t_Boss2.m_Position.m_x+32.0)|0),((t_Boss2.m_Position.m_y)|0)) || this.p_PlayerEnemyCollision(0,1,((t_Boss2.m_Position.m_x+32.0)|0),((t_Boss2.m_Position.m_y)|0)) || this.p_PlayerEnemyCollision(0,-1,((t_Boss2.m_Position.m_x+32.0)|0),((t_Boss2.m_Position.m_y)|0)) || this.p_PlayerEnemyCollision(1,0,((t_Boss2.m_Position.m_x)|0),((t_Boss2.m_Position.m_y+32.0)|0)) || this.p_PlayerEnemyCollision(-1,0,((t_Boss2.m_Position.m_x)|0),((t_Boss2.m_Position.m_y+32.0)|0)) || this.p_PlayerEnemyCollision(0,1,((t_Boss2.m_Position.m_x)|0),((t_Boss2.m_Position.m_y+32.0)|0)) || this.p_PlayerEnemyCollision(0,-1,((t_Boss2.m_Position.m_x)|0),((t_Boss2.m_Position.m_y+32.0)|0)) || this.p_PlayerEnemyCollision(1,0,((t_Boss2.m_Position.m_x+32.0)|0),((t_Boss2.m_Position.m_y+32.0)|0)) || this.p_PlayerEnemyCollision(-1,0,((t_Boss2.m_Position.m_x+32.0)|0),((t_Boss2.m_Position.m_y+32.0)|0)) || this.p_PlayerEnemyCollision(0,1,((t_Boss2.m_Position.m_x+32.0)|0),((t_Boss2.m_Position.m_y+32.0)|0)) || this.p_PlayerEnemyCollision(0,-1,((t_Boss2.m_Position.m_x+32.0)|0),((t_Boss2.m_Position.m_y+32.0)|0))){
							this.m_player.m_playerCurHealth=this.m_player.m_playerCurHealth-1.0;
							if(this.m_player.m_Direction=="N"){
								this.m_player.p_SetPosition(this.m_player.m_Position.m_x,this.m_player.m_Position.m_y+5.0);
								if(this.m_player.p_PlayerTileCollision(0,1)){
									this.m_player.m_playerCurHealth=0.0;
								}
							}else{
								if(this.m_player.m_Direction=="S"){
									this.m_player.p_SetPosition(this.m_player.m_Position.m_x,this.m_player.m_Position.m_y-5.0);
									if(this.m_player.p_PlayerTileCollision(0,-1)){
										this.m_player.m_playerCurHealth=0.0;
									}
								}else{
									if(this.m_player.m_Direction=="E"){
										this.m_player.p_SetPosition(this.m_player.m_Position.m_x-5.0,this.m_player.m_Position.m_y);
										if(this.m_player.p_PlayerTileCollision(1,0)){
											this.m_player.m_playerCurHealth=0.0;
										}
									}else{
										if(this.m_player.m_Direction=="W"){
											this.m_player.p_SetPosition(this.m_player.m_Position.m_x+5.0,this.m_player.m_Position.m_y);
											if(this.m_player.p_PlayerTileCollision(-1,0)){
												this.m_player.m_playerCurHealth=0.0;
											}
										}
									}
								}
							}
						}
					}
					var t_21=this.m_boss.p_ObjectEnumerator();
					while(t_21.p_HasNext()){
						var t_Boss3=t_21.p_NextObject();
						t_Boss3.p_Update();
					}
					var t_22=this.m_boss.p_ObjectEnumerator();
					while(t_22.p_HasNext()){
						var t_Boss4=t_22.p_NextObject();
						if(t_Boss4.m_bossCurHealth>=50.0){
							if(t_Boss4.m_Position.m_y+64.0<this.m_player.m_Position.m_y-16.0 && t_Boss4.m_Shoot){
								bb_audio_PlaySound(this.m_EnemyShootFX,0,0);
								this.m_enemyProjectiles.p_AddLast(c_PlayerProjectile.m_new.call(new c_PlayerProjectile,t_Boss4.m_Position.m_x+32.0,t_Boss4.m_Position.m_y+32.0,"S",4,false));
								t_Boss4.m_Shoot=false;
							}else{
								if(t_Boss4.m_Position.m_y>this.m_player.m_Position.m_y+16.0 && t_Boss4.m_Shoot){
									bb_audio_PlaySound(this.m_EnemyShootFX,0,0);
									this.m_enemyProjectiles.p_AddLast(c_PlayerProjectile.m_new.call(new c_PlayerProjectile,t_Boss4.m_Position.m_x+32.0,t_Boss4.m_Position.m_y+32.0,"N",4,false));
									t_Boss4.m_Shoot=false;
								}else{
									if(t_Boss4.m_Position.m_x+32.0<this.m_player.m_Position.m_x-16.0 && t_Boss4.m_Shoot){
										bb_audio_PlaySound(this.m_EnemyShootFX,0,0);
										this.m_enemyProjectiles.p_AddLast(c_PlayerProjectile.m_new.call(new c_PlayerProjectile,t_Boss4.m_Position.m_x+32.0,t_Boss4.m_Position.m_y+32.0,"E",4,false));
										t_Boss4.m_Shoot=false;
									}else{
										if(t_Boss4.m_Position.m_x+32.0>this.m_player.m_Position.m_x-16.0 && t_Boss4.m_Shoot){
											bb_audio_PlaySound(this.m_EnemyShootFX,0,0);
											this.m_enemyProjectiles.p_AddLast(c_PlayerProjectile.m_new.call(new c_PlayerProjectile,t_Boss4.m_Position.m_x+32.0,t_Boss4.m_Position.m_y+32.0,"W",4,false));
											t_Boss4.m_Shoot=false;
										}
									}
								}
							}
						}else{
							if(t_Boss4.m_Shoot){
								bb_audio_PlaySound(this.m_EnemyShootFX,0,0);
								this.m_enemyProjectiles.p_AddLast(c_PlayerProjectile.m_new.call(new c_PlayerProjectile,t_Boss4.m_Position.m_x+32.0,t_Boss4.m_Position.m_y+32.0,"N",4,false));
								this.m_enemyProjectiles.p_AddLast(c_PlayerProjectile.m_new.call(new c_PlayerProjectile,t_Boss4.m_Position.m_x+32.0,t_Boss4.m_Position.m_y+32.0,"E",4,false));
								this.m_enemyProjectiles.p_AddLast(c_PlayerProjectile.m_new.call(new c_PlayerProjectile,t_Boss4.m_Position.m_x+32.0,t_Boss4.m_Position.m_y+32.0,"S",4,false));
								this.m_enemyProjectiles.p_AddLast(c_PlayerProjectile.m_new.call(new c_PlayerProjectile,t_Boss4.m_Position.m_x+32.0,t_Boss4.m_Position.m_y+32.0,"W",4,false));
								t_Boss4.m_Shoot=false;
							}
						}
						if(t_Boss4.m_Charge){
							t_Boss4.m_Speed=3.0;
							if(t_Boss4.m_Position.m_y+32.0<this.m_player.m_Position.m_y-16.0){
								t_Boss4.m_Direction="S";
							}else{
								if(t_Boss4.m_Position.m_y>this.m_player.m_Position.m_y+16.0){
									t_Boss4.m_Direction="N";
								}else{
									if(t_Boss4.m_Position.m_x+16.0<this.m_player.m_Position.m_x-16.0){
										t_Boss4.m_Direction="E";
									}else{
										if(t_Boss4.m_Position.m_x+16.0>this.m_player.m_Position.m_x-16.0){
											t_Boss4.m_Direction="W";
										}
									}
								}
							}
						}else{
							if(t_Boss4.m_Charge==false){
								t_Boss4.m_Speed=1.0;
							}
						}
						if(t_Boss4.m_bossCurHealth<=0.0){
							this.m_boss.p_Remove7(t_Boss4);
						}
						t_Boss4.p_Update();
					}
					var t_23=this.m_enemyProjectiles.p_ObjectEnumerator();
					while(t_23.p_HasNext()){
						var t_EnemyProjectile3=t_23.p_NextObject();
						t_EnemyProjectile3.p_Update();
						if(t_EnemyProjectile3.m_TileCollision==true){
							this.m_enemyProjectiles.p_Remove(t_EnemyProjectile3);
						}
						if(this.p_RectangleOverlap(((t_EnemyProjectile3.m_Position.m_x)|0),((t_EnemyProjectile3.m_Position.m_y)|0),8,8,((this.m_player.m_Position.m_x-16.0)|0),((this.m_player.m_Position.m_y-16.0)|0),32,32)){
							this.m_enemyProjectiles.p_Remove(t_EnemyProjectile3);
							this.m_player.m_playerCurHealth=this.m_player.m_playerCurHealth-1.0;
						}
					}
					var t_24=this.m_playerProjectiles.p_ObjectEnumerator();
					while(t_24.p_HasNext()){
						var t_PlayerProjectile3=t_24.p_NextObject();
						t_PlayerProjectile3.p_Update();
						if(t_PlayerProjectile3.m_TileCollision==true){
							this.m_playerProjectiles.p_Remove(t_PlayerProjectile3);
						}
						var t_25=this.m_boss.p_ObjectEnumerator();
						while(t_25.p_HasNext()){
							var t_Boss5=t_25.p_NextObject();
							if(this.p_RectangleOverlap(((t_Boss5.m_Position.m_x)|0),((t_Boss5.m_Position.m_y)|0),32,32,((t_PlayerProjectile3.m_Position.m_x)|0),((t_PlayerProjectile3.m_Position.m_y)|0),8,8) || this.p_RectangleOverlap(((t_Boss5.m_Position.m_x+32.0)|0),((t_Boss5.m_Position.m_y)|0),32,32,((t_PlayerProjectile3.m_Position.m_x)|0),((t_PlayerProjectile3.m_Position.m_y)|0),8,8) || this.p_RectangleOverlap(((t_Boss5.m_Position.m_x)|0),((t_Boss5.m_Position.m_y+32.0)|0),32,32,((t_PlayerProjectile3.m_Position.m_x)|0),((t_PlayerProjectile3.m_Position.m_y)|0),8,8) || this.p_RectangleOverlap(((t_Boss5.m_Position.m_x+32.0)|0),((t_Boss5.m_Position.m_y+32.0)|0),32,32,((t_PlayerProjectile3.m_Position.m_x)|0),((t_PlayerProjectile3.m_Position.m_y)|0),8,8)){
								this.m_playerProjectiles.p_Remove(t_PlayerProjectile3);
								t_Boss5.m_bossCurHealth=t_Boss5.m_bossCurHealth-10.0;
							}
						}
					}
					if(this.m_player.m_playerCurHealth<=0.0){
						bb_Main_GameState=5;
					}
					if(this.m_boss.p_Count()==0){
						bb_Main_GameState=4;
					}
					if((bb_input_KeyHit(27))!=0){
						this.p_Reset();
					}
				}else{
					if(t_1==4){
						if((bb_input_KeyHit(1))!=0){
							this.m_EndCutsceneCounter=this.m_EndCutsceneCounter+1;
						}
						if(this.m_EndCutsceneCounter>=this.m_EndFrames.length){
							this.m_EndCutsceneCounter=this.m_EndFrames.length;
							this.p_Reset();
						}
					}else{
						if(t_1==5){
							var t_26=this.m_boss.p_ObjectEnumerator();
							while(t_26.p_HasNext()){
								var t_Boss6=t_26.p_NextObject();
								this.m_boss.p_Remove7(t_Boss6);
							}
							var t_27=this.m_enemies.p_ObjectEnumerator();
							while(t_27.p_HasNext()){
								var t_Enemy6=t_27.p_NextObject();
								this.m_enemies.p_Remove3(t_Enemy6);
							}
							var t_28=this.m_enemies2.p_ObjectEnumerator();
							while(t_28.p_HasNext()){
								var t_Enemy25=t_28.p_NextObject();
								this.m_enemies2.p_Remove4(t_Enemy25);
							}
							if((bb_input_KeyHit(1))!=0){
								this.p_Reset();
							}
						}
					}
				}
			}
		}
	}
	return 0;
}
c_DarkDungeon.prototype.p_OnRender=function(){
	bb_graphics_Cls(0.0,0.0,0.0);
	var t_2=bb_Main_GameState;
	if(t_2==0){
		bb_graphics_DrawText("Menu",320.0,100.0,0.5,0.0);
		bb_Main_menu.p_Draw();
	}else{
		if(t_2==1){
			var t_LMB=bb_graphics_LoadImage2("LMB.png",32,32,1,c_Image.m_DefaultFlags);
			bb_graphics_DrawImage(t_LMB,0.0,0.0,0);
			bb_graphics_DrawText(String(this.m_IntroCutsceneCounter)+" "+this.m_IntroFrames[this.m_IntroCutsceneCounter],320.0,100.0,0.5,0.0);
		}else{
			if(t_2==2){
				bb_graphics_Cls(64.0,32.0,32.0);
				var t_=this.m_blocks.p_ObjectEnumerator();
				while(t_.p_HasNext()){
					var t_Block=t_.p_NextObject();
					t_Block.p_Draw();
				}
				var t_3=this.m_doors.p_ObjectEnumerator();
				while(t_3.p_HasNext()){
					var t_Door=t_3.p_NextObject();
					t_Door.p_Draw();
				}
				var t_4=this.m_enemies.p_ObjectEnumerator();
				while(t_4.p_HasNext()){
					var t_Enemy=t_4.p_NextObject();
					t_Enemy.p_Draw();
				}
				var t_5=this.m_enemies2.p_ObjectEnumerator();
				while(t_5.p_HasNext()){
					var t_Enemy2=t_5.p_NextObject();
					t_Enemy2.p_Draw();
				}
				var t_6=this.m_enemyProjectiles.p_ObjectEnumerator();
				while(t_6.p_HasNext()){
					var t_EnemyProjectile=t_6.p_NextObject();
					t_EnemyProjectile.p_Draw();
				}
				var t_7=this.m_playerProjectiles.p_ObjectEnumerator();
				while(t_7.p_HasNext()){
					var t_PlayerProjectile=t_7.p_NextObject();
					t_PlayerProjectile.p_Draw();
				}
				if(this.m_Death==false){
					this.m_player.p_Draw();
					bb_graphics_SetColor(255.0,255.0,255.0);
				}else{
					if(this.m_Death==true){
						bb_graphics_SetColor(255.0,0.0,0.0);
						bb_graphics_DrawText("YOU DIED",320.0,240.0,1.0,0.0);
						bb_graphics_SetColor(255.0,255.0,255.0);
					}
				}
			}else{
				if(t_2==3){
					var t_8=this.m_blocks.p_ObjectEnumerator();
					while(t_8.p_HasNext()){
						var t_Block2=t_8.p_NextObject();
						t_Block2.p_Draw();
					}
					var t_9=this.m_enemyProjectiles.p_ObjectEnumerator();
					while(t_9.p_HasNext()){
						var t_EnemyProjectile2=t_9.p_NextObject();
						t_EnemyProjectile2.p_Draw();
					}
					var t_10=this.m_playerProjectiles.p_ObjectEnumerator();
					while(t_10.p_HasNext()){
						var t_PlayerProjectile2=t_10.p_NextObject();
						t_PlayerProjectile2.p_Draw();
					}
					var t_11=this.m_boss.p_ObjectEnumerator();
					while(t_11.p_HasNext()){
						var t_Boss=t_11.p_NextObject();
						t_Boss.p_Draw();
					}
					if(this.m_Death==false){
						this.m_player.p_Draw();
					}else{
						if(this.m_Death==true){
							bb_graphics_SetColor(255.0,0.0,0.0);
							bb_graphics_DrawText("YOU DIED",320.0,240.0,1.0,0.0);
							bb_graphics_SetColor(255.0,255.0,255.0);
						}
					}
				}else{
					if(t_2==4){
						var t_LMB2=bb_graphics_LoadImage2("LMB.png",32,32,1,c_Image.m_DefaultFlags);
						bb_graphics_DrawImage(t_LMB2,0.0,0.0,0);
						bb_graphics_DrawText(String(this.m_EndCutsceneCounter)+" "+this.m_EndFrames[this.m_EndCutsceneCounter],320.0,100.0,0.5,0.0);
					}else{
						if(t_2==5){
							var t_LMB3=bb_graphics_LoadImage2("LMB.png",32,32,1,c_Image.m_DefaultFlags);
							bb_graphics_DrawImage(t_LMB3,0.0,0.0,0);
							bb_graphics_DrawText("Game Over",320.0,100.0,0.5,0.0);
						}
					}
				}
			}
		}
	}
	return 0;
}
var bb_app__app=null;
function c_GameDelegate(){
	BBGameDelegate.call(this);
	this.m__graphics=null;
	this.m__audio=null;
	this.m__input=null;
}
c_GameDelegate.prototype=extend_class(BBGameDelegate);
c_GameDelegate.m_new=function(){
	return this;
}
c_GameDelegate.prototype.StartGame=function(){
	this.m__graphics=(new gxtkGraphics);
	bb_graphics_SetGraphicsDevice(this.m__graphics);
	bb_graphics_SetFont(null,32);
	this.m__audio=(new gxtkAudio);
	bb_audio_SetAudioDevice(this.m__audio);
	this.m__input=c_InputDevice.m_new.call(new c_InputDevice);
	bb_input_SetInputDevice(this.m__input);
	bb_app_ValidateDeviceWindow(false);
	bb_app_EnumDisplayModes();
	bb_app__app.p_OnCreate();
}
c_GameDelegate.prototype.SuspendGame=function(){
	bb_app__app.p_OnSuspend();
	this.m__audio.Suspend();
}
c_GameDelegate.prototype.ResumeGame=function(){
	this.m__audio.Resume();
	bb_app__app.p_OnResume();
}
c_GameDelegate.prototype.UpdateGame=function(){
	bb_app_ValidateDeviceWindow(true);
	this.m__input.p_BeginUpdate();
	bb_app__app.p_OnUpdate();
	this.m__input.p_EndUpdate();
}
c_GameDelegate.prototype.RenderGame=function(){
	bb_app_ValidateDeviceWindow(true);
	var t_mode=this.m__graphics.BeginRender();
	if((t_mode)!=0){
		bb_graphics_BeginRender();
	}
	if(t_mode==2){
		bb_app__app.p_OnLoading();
	}else{
		bb_app__app.p_OnRender();
	}
	if((t_mode)!=0){
		bb_graphics_EndRender();
	}
	this.m__graphics.EndRender();
}
c_GameDelegate.prototype.KeyEvent=function(t_event,t_data){
	this.m__input.p_KeyEvent(t_event,t_data);
	if(t_event!=1){
		return;
	}
	var t_1=t_data;
	if(t_1==432){
		bb_app__app.p_OnClose();
	}else{
		if(t_1==416){
			bb_app__app.p_OnBack();
		}
	}
}
c_GameDelegate.prototype.MouseEvent=function(t_event,t_data,t_x,t_y){
	this.m__input.p_MouseEvent(t_event,t_data,t_x,t_y);
}
c_GameDelegate.prototype.TouchEvent=function(t_event,t_data,t_x,t_y){
	this.m__input.p_TouchEvent(t_event,t_data,t_x,t_y);
}
c_GameDelegate.prototype.MotionEvent=function(t_event,t_data,t_x,t_y,t_z){
	this.m__input.p_MotionEvent(t_event,t_data,t_x,t_y,t_z);
}
c_GameDelegate.prototype.DiscardGraphics=function(){
	this.m__graphics.DiscardGraphics();
}
var bb_app__delegate=null;
var bb_app__game=null;
function bbMain(){
	c_DarkDungeon.m_new.call(new c_DarkDungeon);
	return 0;
}
var bb_graphics_device=null;
function bb_graphics_SetGraphicsDevice(t_dev){
	bb_graphics_device=t_dev;
	return 0;
}
function c_Image(){
	Object.call(this);
	this.m_surface=null;
	this.m_width=0;
	this.m_height=0;
	this.m_frames=[];
	this.m_flags=0;
	this.m_tx=.0;
	this.m_ty=.0;
	this.m_source=null;
}
c_Image.m_DefaultFlags=0;
c_Image.m_new=function(){
	return this;
}
c_Image.prototype.p_SetHandle=function(t_tx,t_ty){
	this.m_tx=t_tx;
	this.m_ty=t_ty;
	this.m_flags=this.m_flags&-2;
	return 0;
}
c_Image.prototype.p_ApplyFlags=function(t_iflags){
	this.m_flags=t_iflags;
	if((this.m_flags&2)!=0){
		var t_=this.m_frames;
		var t_2=0;
		while(t_2<t_.length){
			var t_f=t_[t_2];
			t_2=t_2+1;
			t_f.m_x+=1;
		}
		this.m_width-=2;
	}
	if((this.m_flags&4)!=0){
		var t_3=this.m_frames;
		var t_4=0;
		while(t_4<t_3.length){
			var t_f2=t_3[t_4];
			t_4=t_4+1;
			t_f2.m_y+=1;
		}
		this.m_height-=2;
	}
	if((this.m_flags&1)!=0){
		this.p_SetHandle((this.m_width)/2.0,(this.m_height)/2.0);
	}
	if(this.m_frames.length==1 && this.m_frames[0].m_x==0 && this.m_frames[0].m_y==0 && this.m_width==this.m_surface.Width() && this.m_height==this.m_surface.Height()){
		this.m_flags|=65536;
	}
	return 0;
}
c_Image.prototype.p_Init=function(t_surf,t_nframes,t_iflags){
	if((this.m_surface)!=null){
		error("Image already initialized");
	}
	this.m_surface=t_surf;
	this.m_width=((this.m_surface.Width()/t_nframes)|0);
	this.m_height=this.m_surface.Height();
	this.m_frames=new_object_array(t_nframes);
	for(var t_i=0;t_i<t_nframes;t_i=t_i+1){
		this.m_frames[t_i]=c_Frame.m_new.call(new c_Frame,t_i*this.m_width,0);
	}
	this.p_ApplyFlags(t_iflags);
	return this;
}
c_Image.prototype.p_Init2=function(t_surf,t_x,t_y,t_iwidth,t_iheight,t_nframes,t_iflags,t_src,t_srcx,t_srcy,t_srcw,t_srch){
	if((this.m_surface)!=null){
		error("Image already initialized");
	}
	this.m_surface=t_surf;
	this.m_source=t_src;
	this.m_width=t_iwidth;
	this.m_height=t_iheight;
	this.m_frames=new_object_array(t_nframes);
	var t_ix=t_x;
	var t_iy=t_y;
	for(var t_i=0;t_i<t_nframes;t_i=t_i+1){
		if(t_ix+this.m_width>t_srcw){
			t_ix=0;
			t_iy+=this.m_height;
		}
		if(t_ix+this.m_width>t_srcw || t_iy+this.m_height>t_srch){
			error("Image frame outside surface");
		}
		this.m_frames[t_i]=c_Frame.m_new.call(new c_Frame,t_ix+t_srcx,t_iy+t_srcy);
		t_ix+=this.m_width;
	}
	this.p_ApplyFlags(t_iflags);
	return this;
}
c_Image.prototype.p_Width=function(){
	return this.m_width;
}
c_Image.prototype.p_Height=function(){
	return this.m_height;
}
c_Image.prototype.p_Frames=function(){
	return this.m_frames.length;
}
function c_GraphicsContext(){
	Object.call(this);
	this.m_defaultFont=null;
	this.m_font=null;
	this.m_firstChar=0;
	this.m_matrixSp=0;
	this.m_ix=1.0;
	this.m_iy=.0;
	this.m_jx=.0;
	this.m_jy=1.0;
	this.m_tx=.0;
	this.m_ty=.0;
	this.m_tformed=0;
	this.m_matDirty=0;
	this.m_color_r=.0;
	this.m_color_g=.0;
	this.m_color_b=.0;
	this.m_alpha=.0;
	this.m_blend=0;
	this.m_scissor_x=.0;
	this.m_scissor_y=.0;
	this.m_scissor_width=.0;
	this.m_scissor_height=.0;
	this.m_matrixStack=new_number_array(192);
}
c_GraphicsContext.m_new=function(){
	return this;
}
c_GraphicsContext.prototype.p_Validate=function(){
	if((this.m_matDirty)!=0){
		bb_graphics_renderDevice.SetMatrix(bb_graphics_context.m_ix,bb_graphics_context.m_iy,bb_graphics_context.m_jx,bb_graphics_context.m_jy,bb_graphics_context.m_tx,bb_graphics_context.m_ty);
		this.m_matDirty=0;
	}
	return 0;
}
var bb_graphics_context=null;
function bb_data_FixDataPath(t_path){
	var t_i=t_path.indexOf(":/",0);
	if(t_i!=-1 && t_path.indexOf("/",0)==t_i+1){
		return t_path;
	}
	if(string_startswith(t_path,"./") || string_startswith(t_path,"/")){
		return t_path;
	}
	return "monkey://data/"+t_path;
}
function c_Frame(){
	Object.call(this);
	this.m_x=0;
	this.m_y=0;
}
c_Frame.m_new=function(t_x,t_y){
	this.m_x=t_x;
	this.m_y=t_y;
	return this;
}
c_Frame.m_new2=function(){
	return this;
}
function bb_graphics_LoadImage(t_path,t_frameCount,t_flags){
	var t_surf=bb_graphics_device.LoadSurface(bb_data_FixDataPath(t_path));
	if((t_surf)!=null){
		return (c_Image.m_new.call(new c_Image)).p_Init(t_surf,t_frameCount,t_flags);
	}
	return null;
}
function bb_graphics_LoadImage2(t_path,t_frameWidth,t_frameHeight,t_frameCount,t_flags){
	var t_surf=bb_graphics_device.LoadSurface(bb_data_FixDataPath(t_path));
	if((t_surf)!=null){
		return (c_Image.m_new.call(new c_Image)).p_Init2(t_surf,0,0,t_frameWidth,t_frameHeight,t_frameCount,t_flags,null,0,0,t_surf.Width(),t_surf.Height());
	}
	return null;
}
function bb_graphics_SetFont(t_font,t_firstChar){
	if(!((t_font)!=null)){
		if(!((bb_graphics_context.m_defaultFont)!=null)){
			bb_graphics_context.m_defaultFont=bb_graphics_LoadImage("mojo_font.png",96,2);
		}
		t_font=bb_graphics_context.m_defaultFont;
		t_firstChar=32;
	}
	bb_graphics_context.m_font=t_font;
	bb_graphics_context.m_firstChar=t_firstChar;
	return 0;
}
var bb_audio_device=null;
function bb_audio_SetAudioDevice(t_dev){
	bb_audio_device=t_dev;
	return 0;
}
function c_InputDevice(){
	Object.call(this);
	this.m__joyStates=new_object_array(4);
	this.m__keyDown=new_bool_array(512);
	this.m__keyHitPut=0;
	this.m__keyHitQueue=new_number_array(33);
	this.m__keyHit=new_number_array(512);
	this.m__charGet=0;
	this.m__charPut=0;
	this.m__charQueue=new_number_array(32);
	this.m__mouseX=.0;
	this.m__mouseY=.0;
	this.m__touchX=new_number_array(32);
	this.m__touchY=new_number_array(32);
	this.m__accelX=.0;
	this.m__accelY=.0;
	this.m__accelZ=.0;
}
c_InputDevice.m_new=function(){
	for(var t_i=0;t_i<4;t_i=t_i+1){
		this.m__joyStates[t_i]=c_JoyState.m_new.call(new c_JoyState);
	}
	return this;
}
c_InputDevice.prototype.p_PutKeyHit=function(t_key){
	if(this.m__keyHitPut==this.m__keyHitQueue.length){
		return;
	}
	this.m__keyHit[t_key]+=1;
	this.m__keyHitQueue[this.m__keyHitPut]=t_key;
	this.m__keyHitPut+=1;
}
c_InputDevice.prototype.p_BeginUpdate=function(){
	for(var t_i=0;t_i<4;t_i=t_i+1){
		var t_state=this.m__joyStates[t_i];
		if(!BBGame.Game().PollJoystick(t_i,t_state.m_joyx,t_state.m_joyy,t_state.m_joyz,t_state.m_buttons)){
			break;
		}
		for(var t_j=0;t_j<32;t_j=t_j+1){
			var t_key=256+t_i*32+t_j;
			if(t_state.m_buttons[t_j]){
				if(!this.m__keyDown[t_key]){
					this.m__keyDown[t_key]=true;
					this.p_PutKeyHit(t_key);
				}
			}else{
				this.m__keyDown[t_key]=false;
			}
		}
	}
}
c_InputDevice.prototype.p_EndUpdate=function(){
	for(var t_i=0;t_i<this.m__keyHitPut;t_i=t_i+1){
		this.m__keyHit[this.m__keyHitQueue[t_i]]=0;
	}
	this.m__keyHitPut=0;
	this.m__charGet=0;
	this.m__charPut=0;
}
c_InputDevice.prototype.p_KeyEvent=function(t_event,t_data){
	var t_1=t_event;
	if(t_1==1){
		if(!this.m__keyDown[t_data]){
			this.m__keyDown[t_data]=true;
			this.p_PutKeyHit(t_data);
			if(t_data==1){
				this.m__keyDown[384]=true;
				this.p_PutKeyHit(384);
			}else{
				if(t_data==384){
					this.m__keyDown[1]=true;
					this.p_PutKeyHit(1);
				}
			}
		}
	}else{
		if(t_1==2){
			if(this.m__keyDown[t_data]){
				this.m__keyDown[t_data]=false;
				if(t_data==1){
					this.m__keyDown[384]=false;
				}else{
					if(t_data==384){
						this.m__keyDown[1]=false;
					}
				}
			}
		}else{
			if(t_1==3){
				if(this.m__charPut<this.m__charQueue.length){
					this.m__charQueue[this.m__charPut]=t_data;
					this.m__charPut+=1;
				}
			}
		}
	}
}
c_InputDevice.prototype.p_MouseEvent=function(t_event,t_data,t_x,t_y){
	var t_2=t_event;
	if(t_2==4){
		this.p_KeyEvent(1,1+t_data);
	}else{
		if(t_2==5){
			this.p_KeyEvent(2,1+t_data);
			return;
		}else{
			if(t_2==6){
			}else{
				return;
			}
		}
	}
	this.m__mouseX=t_x;
	this.m__mouseY=t_y;
	this.m__touchX[0]=t_x;
	this.m__touchY[0]=t_y;
}
c_InputDevice.prototype.p_TouchEvent=function(t_event,t_data,t_x,t_y){
	var t_3=t_event;
	if(t_3==7){
		this.p_KeyEvent(1,384+t_data);
	}else{
		if(t_3==8){
			this.p_KeyEvent(2,384+t_data);
			return;
		}else{
			if(t_3==9){
			}else{
				return;
			}
		}
	}
	this.m__touchX[t_data]=t_x;
	this.m__touchY[t_data]=t_y;
	if(t_data==0){
		this.m__mouseX=t_x;
		this.m__mouseY=t_y;
	}
}
c_InputDevice.prototype.p_MotionEvent=function(t_event,t_data,t_x,t_y,t_z){
	var t_4=t_event;
	if(t_4==10){
	}else{
		return;
	}
	this.m__accelX=t_x;
	this.m__accelY=t_y;
	this.m__accelZ=t_z;
}
c_InputDevice.prototype.p_KeyHit=function(t_key){
	if(t_key>0 && t_key<512){
		return this.m__keyHit[t_key];
	}
	return 0;
}
c_InputDevice.prototype.p_MouseX=function(){
	return this.m__mouseX;
}
c_InputDevice.prototype.p_MouseY=function(){
	return this.m__mouseY;
}
c_InputDevice.prototype.p_KeyDown=function(t_key){
	if(t_key>0 && t_key<512){
		return this.m__keyDown[t_key];
	}
	return false;
}
function c_JoyState(){
	Object.call(this);
	this.m_joyx=new_number_array(2);
	this.m_joyy=new_number_array(2);
	this.m_joyz=new_number_array(2);
	this.m_buttons=new_bool_array(32);
}
c_JoyState.m_new=function(){
	return this;
}
var bb_input_device=null;
function bb_input_SetInputDevice(t_dev){
	bb_input_device=t_dev;
	return 0;
}
var bb_app__devWidth=0;
var bb_app__devHeight=0;
function bb_app_ValidateDeviceWindow(t_notifyApp){
	var t_w=bb_app__game.GetDeviceWidth();
	var t_h=bb_app__game.GetDeviceHeight();
	if(t_w==bb_app__devWidth && t_h==bb_app__devHeight){
		return;
	}
	bb_app__devWidth=t_w;
	bb_app__devHeight=t_h;
	if(t_notifyApp){
		bb_app__app.p_OnResize();
	}
}
function c_DisplayMode(){
	Object.call(this);
	this.m__width=0;
	this.m__height=0;
}
c_DisplayMode.m_new=function(t_width,t_height){
	this.m__width=t_width;
	this.m__height=t_height;
	return this;
}
c_DisplayMode.m_new2=function(){
	return this;
}
function c_Map(){
	Object.call(this);
	this.m_root=null;
}
c_Map.m_new=function(){
	return this;
}
c_Map.prototype.p_Compare=function(t_lhs,t_rhs){
}
c_Map.prototype.p_FindNode=function(t_key){
	var t_node=this.m_root;
	while((t_node)!=null){
		var t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				return t_node;
			}
		}
	}
	return t_node;
}
c_Map.prototype.p_Contains=function(t_key){
	return this.p_FindNode(t_key)!=null;
}
c_Map.prototype.p_RotateLeft=function(t_node){
	var t_child=t_node.m_right;
	t_node.m_right=t_child.m_left;
	if((t_child.m_left)!=null){
		t_child.m_left.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_left){
			t_node.m_parent.m_left=t_child;
		}else{
			t_node.m_parent.m_right=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_left=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map.prototype.p_RotateRight=function(t_node){
	var t_child=t_node.m_left;
	t_node.m_left=t_child.m_right;
	if((t_child.m_right)!=null){
		t_child.m_right.m_parent=t_node;
	}
	t_child.m_parent=t_node.m_parent;
	if((t_node.m_parent)!=null){
		if(t_node==t_node.m_parent.m_right){
			t_node.m_parent.m_right=t_child;
		}else{
			t_node.m_parent.m_left=t_child;
		}
	}else{
		this.m_root=t_child;
	}
	t_child.m_right=t_node;
	t_node.m_parent=t_child;
	return 0;
}
c_Map.prototype.p_InsertFixup=function(t_node){
	while(((t_node.m_parent)!=null) && t_node.m_parent.m_color==-1 && ((t_node.m_parent.m_parent)!=null)){
		if(t_node.m_parent==t_node.m_parent.m_parent.m_left){
			var t_uncle=t_node.m_parent.m_parent.m_right;
			if(((t_uncle)!=null) && t_uncle.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle.m_color=1;
				t_uncle.m_parent.m_color=-1;
				t_node=t_uncle.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_right){
					t_node=t_node.m_parent;
					this.p_RotateLeft(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateRight(t_node.m_parent.m_parent);
			}
		}else{
			var t_uncle2=t_node.m_parent.m_parent.m_left;
			if(((t_uncle2)!=null) && t_uncle2.m_color==-1){
				t_node.m_parent.m_color=1;
				t_uncle2.m_color=1;
				t_uncle2.m_parent.m_color=-1;
				t_node=t_uncle2.m_parent;
			}else{
				if(t_node==t_node.m_parent.m_left){
					t_node=t_node.m_parent;
					this.p_RotateRight(t_node);
				}
				t_node.m_parent.m_color=1;
				t_node.m_parent.m_parent.m_color=-1;
				this.p_RotateLeft(t_node.m_parent.m_parent);
			}
		}
	}
	this.m_root.m_color=1;
	return 0;
}
c_Map.prototype.p_Set=function(t_key,t_value){
	var t_node=this.m_root;
	var t_parent=null;
	var t_cmp=0;
	while((t_node)!=null){
		t_parent=t_node;
		t_cmp=this.p_Compare(t_key,t_node.m_key);
		if(t_cmp>0){
			t_node=t_node.m_right;
		}else{
			if(t_cmp<0){
				t_node=t_node.m_left;
			}else{
				t_node.m_value=t_value;
				return false;
			}
		}
	}
	t_node=c_Node.m_new.call(new c_Node,t_key,t_value,-1,t_parent);
	if((t_parent)!=null){
		if(t_cmp>0){
			t_parent.m_right=t_node;
		}else{
			t_parent.m_left=t_node;
		}
		this.p_InsertFixup(t_node);
	}else{
		this.m_root=t_node;
	}
	return true;
}
c_Map.prototype.p_Insert=function(t_key,t_value){
	return this.p_Set(t_key,t_value);
}
function c_IntMap(){
	c_Map.call(this);
}
c_IntMap.prototype=extend_class(c_Map);
c_IntMap.m_new=function(){
	c_Map.m_new.call(this);
	return this;
}
c_IntMap.prototype.p_Compare=function(t_lhs,t_rhs){
	return t_lhs-t_rhs;
}
function c_Stack(){
	Object.call(this);
	this.m_data=[];
	this.m_length=0;
}
c_Stack.m_new=function(){
	return this;
}
c_Stack.m_new2=function(t_data){
	this.m_data=t_data.slice(0);
	this.m_length=t_data.length;
	return this;
}
c_Stack.prototype.p_Push=function(t_value){
	if(this.m_length==this.m_data.length){
		this.m_data=resize_object_array(this.m_data,this.m_length*2+10);
	}
	this.m_data[this.m_length]=t_value;
	this.m_length+=1;
}
c_Stack.prototype.p_Push2=function(t_values,t_offset,t_count){
	for(var t_i=0;t_i<t_count;t_i=t_i+1){
		this.p_Push(t_values[t_offset+t_i]);
	}
}
c_Stack.prototype.p_Push3=function(t_values,t_offset){
	this.p_Push2(t_values,t_offset,t_values.length-t_offset);
}
c_Stack.prototype.p_ToArray=function(){
	var t_t=new_object_array(this.m_length);
	for(var t_i=0;t_i<this.m_length;t_i=t_i+1){
		t_t[t_i]=this.m_data[t_i];
	}
	return t_t;
}
function c_Node(){
	Object.call(this);
	this.m_key=0;
	this.m_right=null;
	this.m_left=null;
	this.m_value=null;
	this.m_color=0;
	this.m_parent=null;
}
c_Node.m_new=function(t_key,t_value,t_color,t_parent){
	this.m_key=t_key;
	this.m_value=t_value;
	this.m_color=t_color;
	this.m_parent=t_parent;
	return this;
}
c_Node.m_new2=function(){
	return this;
}
var bb_app__displayModes=[];
var bb_app__desktopMode=null;
function bb_app_DeviceWidth(){
	return bb_app__devWidth;
}
function bb_app_DeviceHeight(){
	return bb_app__devHeight;
}
function bb_app_EnumDisplayModes(){
	var t_modes=bb_app__game.GetDisplayModes();
	var t_mmap=c_IntMap.m_new.call(new c_IntMap);
	var t_mstack=c_Stack.m_new.call(new c_Stack);
	for(var t_i=0;t_i<t_modes.length;t_i=t_i+1){
		var t_w=t_modes[t_i].width;
		var t_h=t_modes[t_i].height;
		var t_size=t_w<<16|t_h;
		if(t_mmap.p_Contains(t_size)){
		}else{
			var t_mode=c_DisplayMode.m_new.call(new c_DisplayMode,t_modes[t_i].width,t_modes[t_i].height);
			t_mmap.p_Insert(t_size,t_mode);
			t_mstack.p_Push(t_mode);
		}
	}
	bb_app__displayModes=t_mstack.p_ToArray();
	var t_mode2=bb_app__game.GetDesktopMode();
	if((t_mode2)!=null){
		bb_app__desktopMode=c_DisplayMode.m_new.call(new c_DisplayMode,t_mode2.width,t_mode2.height);
	}else{
		bb_app__desktopMode=c_DisplayMode.m_new.call(new c_DisplayMode,bb_app_DeviceWidth(),bb_app_DeviceHeight());
	}
}
var bb_graphics_renderDevice=null;
function bb_graphics_SetMatrix(t_ix,t_iy,t_jx,t_jy,t_tx,t_ty){
	bb_graphics_context.m_ix=t_ix;
	bb_graphics_context.m_iy=t_iy;
	bb_graphics_context.m_jx=t_jx;
	bb_graphics_context.m_jy=t_jy;
	bb_graphics_context.m_tx=t_tx;
	bb_graphics_context.m_ty=t_ty;
	bb_graphics_context.m_tformed=((t_ix!=1.0 || t_iy!=0.0 || t_jx!=0.0 || t_jy!=1.0 || t_tx!=0.0 || t_ty!=0.0)?1:0);
	bb_graphics_context.m_matDirty=1;
	return 0;
}
function bb_graphics_SetMatrix2(t_m){
	bb_graphics_SetMatrix(t_m[0],t_m[1],t_m[2],t_m[3],t_m[4],t_m[5]);
	return 0;
}
function bb_graphics_SetColor(t_r,t_g,t_b){
	bb_graphics_context.m_color_r=t_r;
	bb_graphics_context.m_color_g=t_g;
	bb_graphics_context.m_color_b=t_b;
	bb_graphics_renderDevice.SetColor(t_r,t_g,t_b);
	return 0;
}
function bb_graphics_SetAlpha(t_alpha){
	bb_graphics_context.m_alpha=t_alpha;
	bb_graphics_renderDevice.SetAlpha(t_alpha);
	return 0;
}
function bb_graphics_SetBlend(t_blend){
	bb_graphics_context.m_blend=t_blend;
	bb_graphics_renderDevice.SetBlend(t_blend);
	return 0;
}
function bb_graphics_SetScissor(t_x,t_y,t_width,t_height){
	bb_graphics_context.m_scissor_x=t_x;
	bb_graphics_context.m_scissor_y=t_y;
	bb_graphics_context.m_scissor_width=t_width;
	bb_graphics_context.m_scissor_height=t_height;
	bb_graphics_renderDevice.SetScissor(((t_x)|0),((t_y)|0),((t_width)|0),((t_height)|0));
	return 0;
}
function bb_graphics_BeginRender(){
	bb_graphics_renderDevice=bb_graphics_device;
	bb_graphics_context.m_matrixSp=0;
	bb_graphics_SetMatrix(1.0,0.0,0.0,1.0,0.0,0.0);
	bb_graphics_SetColor(255.0,255.0,255.0);
	bb_graphics_SetAlpha(1.0);
	bb_graphics_SetBlend(0);
	bb_graphics_SetScissor(0.0,0.0,(bb_app_DeviceWidth()),(bb_app_DeviceHeight()));
	return 0;
}
function bb_graphics_EndRender(){
	bb_graphics_renderDevice=null;
	return 0;
}
function c_BBGameEvent(){
	Object.call(this);
}
function bb_app_EndApp(){
	error("");
}
var bb_app__updateRate=0;
function bb_app_SetUpdateRate(t_hertz){
	bb_app__updateRate=t_hertz;
	bb_app__game.SetUpdateRate(t_hertz);
}
var bb_Main_GameState=0;
function c_MenuClass(){
	Object.call(this);
	this.m_mouseX=.0;
	this.m_mouseY=.0;
	this.m_Controls=false;
	this.m_SplashScreenImage=bb_graphics_LoadImage2("SplashScreen.png",960,640,1,c_Image.m_DefaultFlags);
	this.m_Cursor=bb_graphics_LoadImage2("Cursor.png",8,8,1,c_Image.m_DefaultFlags);
	this.m_ControlsImg=bb_graphics_LoadImage("Controls.png",1,c_Image.m_DefaultFlags);
}
c_MenuClass.m_Selected=0;
c_MenuClass.m_SplashScreen=false;
c_MenuClass.m_new=function(){
	c_MenuClass.m_Selected=0;
	c_MenuClass.m_SplashScreen=true;
	return this;
}
c_MenuClass.prototype.p_Update=function(){
	if((bb_input_KeyHit(13))!=0){
		c_MenuClass.m_SplashScreen=false;
	}
	if(c_MenuClass.m_SplashScreen==false){
		this.m_mouseX=bb_input_MouseX();
		this.m_mouseY=bb_input_MouseY();
		if(this.m_mouseX>200.0 && this.m_mouseX<760.0){
			if(this.m_mouseY>200.0 && this.m_mouseY<230.0){
				c_MenuClass.m_Selected=1;
			}
			if(this.m_mouseY>231.0 && this.m_mouseY<280.0){
				c_MenuClass.m_Selected=2;
			}
			if(this.m_mouseY>281.0 && this.m_mouseY<330.0){
				c_MenuClass.m_Selected=3;
			}
			if(this.m_mouseY>331.0 && this.m_mouseY<360.0){
				c_MenuClass.m_Selected=4;
			}
		}else{
			c_MenuClass.m_Selected=0;
		}
		if((bb_input_KeyHit(1))!=0){
			if(c_MenuClass.m_Selected==1){
				bb_Main_GameState=1;
			}else{
				if(c_MenuClass.m_Selected==2){
					if(this.m_Controls==true){
						this.m_Controls=false;
					}else{
						if(this.m_Controls==false){
							this.m_Controls=true;
						}
					}
				}else{
					if(c_MenuClass.m_Selected==4){
						c_MenuClass.m_SplashScreen=true;
						this.m_Controls=false;
					}
				}
			}
		}
	}
	return 0;
}
c_MenuClass.m_Menu=[];
c_MenuClass.prototype.p_Draw=function(){
	bb_graphics_SetColor(255.0,255.0,255.0);
	if(c_MenuClass.m_SplashScreen){
		bb_graphics_DrawImage(this.m_SplashScreenImage,-160.0,-80.0,0);
	}
	if(c_MenuClass.m_SplashScreen==false){
		if(c_MenuClass.m_Selected>0){
			bb_graphics_DrawText("Selected: "+c_MenuClass.m_Menu[c_MenuClass.m_Selected],320.0,400.0,0.5,0.0);
		}
		bb_graphics_DrawText("1 NewGame",320.0,210.0,0.5,0.0);
		bb_graphics_DrawText("2 Options",320.0,260.0,0.5,0.0);
		bb_graphics_SetColor(100.0,100.0,100.0);
		bb_graphics_DrawText("3 HighScores",320.0,310.0,0.5,0.0);
		bb_graphics_SetColor(255.0,255.0,255.0);
		bb_graphics_DrawText("4 Quit",320.0,360.0,0.5,0.0);
		bb_graphics_DrawImage(this.m_Cursor,this.m_mouseX,this.m_mouseY,0);
		bb_graphics_SetColor(250.0,0.0,0.0);
		if(c_MenuClass.m_Selected>0){
			bb_graphics_DrawRect(200.0,(160+c_MenuClass.m_Selected*50),8.0,8.0);
		}
		if(this.m_Controls){
			bb_graphics_DrawImage(this.m_ControlsImg,160.0,0.0,0);
		}
	}
	return 0;
}
var bb_Main_menu=null;
function c_Player(){
	Object.call(this);
	this.m_OriginalPos=null;
	this.m_Position=null;
	this.m_Velocity=null;
	this.m_playerMaxHealth=0;
	this.m_playerCurHealth=.0;
	this.m_playerMaxSP=0;
	this.m_playerCurSP=.0;
	this.m_Direction="";
	this.m_NewProjectile=0.0;
	this.m_MeleeCoolDown=0.0;
	this.m_MeleeAttack=false;
	this.m_Speed=1.0;
	this.m_Frame=bb_graphics_LoadImage2("UI Frame.png",96,32,1,c_Image.m_DefaultFlags);
	this.m_Sprite=bb_graphics_LoadImage2("PlayerSouth.png",32,32,1,c_Image.m_DefaultFlags);
	this.m_MeleeSprite=bb_graphics_LoadImage2("Strike.png",32,32,1,c_Image.m_DefaultFlags);
}
c_Player.m_new=function(t_x,t_y,t_Health,t_SkillPoints){
	this.m_OriginalPos=c_Vec2D.m_new.call(new c_Vec2D,t_x,t_y);
	this.m_Position=c_Vec2D.m_new.call(new c_Vec2D,t_x,t_y);
	this.m_Velocity=c_Vec2D.m_new.call(new c_Vec2D,0.0,0.0);
	this.m_playerMaxHealth=t_Health;
	this.m_playerCurHealth=(this.m_playerMaxHealth);
	this.m_playerMaxSP=t_SkillPoints;
	this.m_playerCurSP=(this.m_playerMaxSP);
	this.m_Direction="N";
	return this;
}
c_Player.m_new2=function(){
	return this;
}
c_Player.prototype.p_Ability1=function(){
	if(this.m_NewProjectile>0.0){
		this.m_NewProjectile=this.m_NewProjectile-1.0;
	}
	if(((bb_input_KeyHit(49))!=0) && this.m_NewProjectile<=0.0 && this.m_playerCurSP>=15.0){
		bb_audio_PlaySound(bb_Main_ShootFX,0,0);
		this.m_NewProjectile=60.0;
		this.m_playerCurSP=this.m_playerCurSP-15.0;
	}
	return 0;
}
c_Player.prototype.p_Melee=function(){
	if(this.m_MeleeCoolDown>0.0){
		this.m_MeleeCoolDown=this.m_MeleeCoolDown-0.2;
	}
	if(((bb_input_KeyHit(50))!=0) && this.m_MeleeCoolDown<=0.0){
		bb_audio_PlaySound(bb_Main_MeleeFX,0,0);
		this.m_MeleeCoolDown=10.0;
		this.m_MeleeAttack=true;
	}
	if(this.m_MeleeCoolDown<=8.0){
		this.m_MeleeAttack=false;
	}
	return 0;
}
c_Player.prototype.p_PlayerTileOverlap=function(t_x1,t_y1,t_width,t_height,t_x2,t_y2,t_width2,t_height2){
	if(t_x1>=t_x2+t_width2 || t_x1+t_width<=t_x2){
		return false;
	}
	if(t_y1>=t_y2+t_height2 || t_y1+t_height<=t_y2){
		return false;
	}
	return true;
}
c_Player.prototype.p_PlayerTileCollision=function(t_x1,t_y1){
	var t_colx=(((this.m_Position.m_x-16.0+(t_x1))/32.0)|0);
	var t_coly=(((this.m_Position.m_y-16.0+(t_y1))/32.0)|0);
	for(var t_y2=t_coly-1;t_y2<t_coly+2;t_y2=t_y2+1){
		for(var t_x2=t_colx-1;t_x2<t_colx+2;t_x2=t_x2+1){
			if(t_x2>=0 && t_x2<20 && t_y2>=0 && t_y2<15){
				if(c_Map2.m_Layout[t_y2][t_x2]==1){
					if(this.p_PlayerTileOverlap(((this.m_Position.m_x-16.0+(t_x1))|0),((this.m_Position.m_y-16.0+(t_y1))|0),32,32,t_x2*32,t_y2*32,32,32)==true){
						return true;
					}
				}
			}
		}
	}
	return false;
}
c_Player.prototype.p_SetPosition=function(t_x,t_y){
	this.m_Position.p_Set2(t_x,t_y);
	return 0;
}
c_Player.prototype.p_Update=function(){
	this.p_Ability1();
	this.p_Melee();
	this.m_Velocity.m_x=0.0;
	this.m_Velocity.m_y=0.0;
	if(((bb_input_KeyDown(65))!=0) && this.p_PlayerTileCollision(-1,0)==false){
		this.m_Direction="W";
		this.m_Velocity.m_x=-this.m_Speed;
	}
	if(((bb_input_KeyDown(68))!=0) && this.p_PlayerTileCollision(1,0)==false){
		this.m_Direction="E";
		this.m_Velocity.m_x=this.m_Speed;
	}
	if(((bb_input_KeyDown(87))!=0) && this.p_PlayerTileCollision(0,-1)==false){
		this.m_Direction="N";
		this.m_Velocity.m_y=-this.m_Speed;
	}
	if(((bb_input_KeyDown(83))!=0) && this.p_PlayerTileCollision(0,1)==false){
		this.m_Direction="S";
		this.m_Velocity.m_y=this.m_Speed;
	}
	if(this.m_playerCurSP<0.0){
		this.m_playerCurSP=0.0;
	}
	if(this.m_playerCurSP<100.0){
		this.m_playerCurSP=this.m_playerCurSP+0.05;
	}
	this.p_SetPosition(this.m_Position.m_x+this.m_Velocity.m_x,this.m_Position.m_y+this.m_Velocity.m_y);
	return 0;
}
c_Player.prototype.p_Bars=function(){
	bb_graphics_SetColor(0.0,0.0,0.0);
	bb_graphics_DrawRect(32.0,7.0,54.0,16.0);
	var t_HealthBarSize=((53.0*(this.m_playerCurHealth/(this.m_playerMaxHealth)))|0);
	var t_SPBarSize=((53.0*(this.m_playerCurSP/(this.m_playerMaxSP)))|0);
	bb_graphics_SetColor(200.0,15.0,15.0);
	bb_graphics_DrawRect(32.0,7.0,(t_HealthBarSize),6.0);
	bb_graphics_SetColor(15.0,15.0,255.0);
	bb_graphics_DrawRect(32.0,16.0,(t_SPBarSize),8.0);
	bb_graphics_SetColor(255.0,255.0,255.0);
	bb_graphics_DrawImage(this.m_Frame,0.0,0.0,0);
	return 0;
}
c_Player.prototype.p_Draw=function(){
	this.p_Bars();
	bb_graphics_SetColor(255.0,255.0,255.0);
	if(this.m_Direction=="N"){
		var t_Rotation=180;
		bb_graphics_DrawImage2(this.m_Sprite,this.m_Position.m_x+16.0,this.m_Position.m_y+16.0,(t_Rotation),1.0,1.0,0);
		if(this.m_MeleeAttack){
			bb_graphics_DrawImage2(this.m_MeleeSprite,this.m_Position.m_x+16.0,this.m_Position.m_y+16.0-16.0,(t_Rotation),1.0,1.0,0);
		}
	}else{
		if(this.m_Direction=="S"){
			var t_Rotation2=0;
			bb_graphics_DrawImage2(this.m_Sprite,this.m_Position.m_x-16.0,this.m_Position.m_y-16.0,(t_Rotation2),1.0,1.0,0);
			if(this.m_MeleeAttack){
				bb_graphics_DrawImage2(this.m_MeleeSprite,this.m_Position.m_x-16.0,this.m_Position.m_y-16.0+16.0,(t_Rotation2),1.0,1.0,0);
			}
		}else{
			if(this.m_Direction=="E"){
				var t_Rotation3=90;
				bb_graphics_DrawImage2(this.m_Sprite,this.m_Position.m_x-16.0,this.m_Position.m_y+16.0,(t_Rotation3),1.0,1.0,0);
				if(this.m_MeleeAttack){
					bb_graphics_DrawImage2(this.m_MeleeSprite,this.m_Position.m_x-16.0+16.0,this.m_Position.m_y+16.0,(t_Rotation3),1.0,1.0,0);
				}
			}else{
				if(this.m_Direction=="W"){
					var t_Rotation4=270;
					bb_graphics_DrawImage2(this.m_Sprite,this.m_Position.m_x+16.0,this.m_Position.m_y-16.0,(t_Rotation4),1.0,1.0,0);
					if(this.m_MeleeAttack){
						bb_graphics_DrawImage2(this.m_MeleeSprite,this.m_Position.m_x+16.0-16.0,this.m_Position.m_y-16.0,(t_Rotation4),1.0,1.0,0);
					}
				}
			}
		}
	}
	return 0;
}
function c_Vec2D(){
	Object.call(this);
	this.m_x=.0;
	this.m_y=.0;
}
c_Vec2D.prototype.p_Set2=function(t_x,t_y){
	this.m_x=t_x;
	this.m_y=t_y;
	return 0;
}
c_Vec2D.m_new=function(t_x,t_y){
	this.p_Set2(t_x,t_y);
	return this;
}
function c_Map2(){
	Object.call(this);
	this.m_LoadNew=false;
	this.m_RoomCounter=0;
}
c_Map2.m_new=function(){
	this.m_LoadNew=true;
	this.m_RoomCounter=1;
	return this;
}
c_Map2.m_Layout=[];
c_Map2.prototype.p_CreateMap=function(){
	c_Map2.m_Layout=new_array_array(15);
	c_Map2.m_Layout=new_array_array(15);
	for(var t_i=0;t_i<15;t_i=t_i+1){
		c_Map2.m_Layout[t_i]=new_number_array(20);
	}
	var t_Room1=[[1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,3,0,3,0,0,0,1,0,0,0,0,1],[1,0,0,1,1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,1],[1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1],[1,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1],[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,1],[1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
	var t_Room2=[[1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],[1,4,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,4,1],[1,0,0,0,0,4,1,1,1,1,1,1,1,1,4,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,1],[1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],[1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],[1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],[1,1,0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,1],[1,0,0,0,0,1,1,1,1,0,0,1,1,1,1,0,0,0,0,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
	var t_Room3=[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1],[1,0,0,3,0,3,0,3,0,3,0,3,0,3,1,0,1,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,3,0,3,0,3,0,3,0,3,0,0,1],[1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,5,1,0,0,0,0,1],[1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],[1,5,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
	var t_Room4=[[1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,3,0,5,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,1],[1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,1],[1,5,0,3,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1],[1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
	var t_Room5=[[1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1],[1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1],[1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1],[1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1],[1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1],[1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1],[1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
	var t_Room6=[[1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1],[1,4,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,1],[1,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,4,1],[1,4,0,0,0,0,1,4,0,0,0,0,0,1,0,0,0,0,0,1],[1,0,0,0,0,0,1,0,0,0,0,0,4,1,0,0,0,0,4,1],[1,4,0,0,0,0,1,4,0,0,0,0,0,1,0,0,0,0,0,1],[1,0,0,0,0,0,1,0,0,0,0,0,4,1,0,0,0,0,4,1],[1,4,0,0,0,0,1,4,0,0,0,0,0,1,0,0,0,0,0,1],[1,0,0,0,0,0,1,0,0,0,0,0,4,1,0,0,0,0,4,1],[1,4,0,0,0,0,1,4,0,0,0,0,0,1,0,0,0,0,0,1],[1,0,0,0,0,0,1,0,0,0,0,0,4,1,0,0,0,0,4,1],[1,4,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
	var t_Room7=[[1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,5,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,1],[1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,0,1],[1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1,1,1,0,1],[1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,0,0,0,1],[1,0,0,0,1,0,0,0,0,0,0,0,5,1,0,1,0,1,0,1],[1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,0,1,0,1],[1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1],[1,1,1,0,1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,5,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
	var t_Room8=[[1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1],[1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1],[1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],[1,0,0,0,1,3,0,0,0,0,0,0,0,0,3,1,0,0,0,1],[1,0,1,0,1,0,1,1,1,0,0,1,1,1,0,1,0,1,0,1],[1,0,1,0,1,0,1,3,0,0,0,0,3,1,0,1,0,1,0,1],[1,0,1,0,1,0,1,0,1,1,1,1,0,1,0,1,0,1,0,1],[1,0,1,0,1,0,1,0,0,0,0,0,0,1,0,1,0,1,0,1],[1,0,1,0,1,0,1,1,1,0,0,1,1,1,0,1,0,1,0,1],[1,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,0,1],[1,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,0,1],[1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
	var t_Room9=[[1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,5,5,0,0,0,0,0,0,0,0,1],[1,4,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,4,1],[1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],[1,0,0,0,0,0,0,0,4,1,1,0,0,0,0,0,0,0,4,1],[1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1],[1,4,0,0,0,0,0,0,0,1,1,4,0,0,0,0,0,0,0,1],[1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
	var t_Room10=[[1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
	var t_BOSSROOM=[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];
	if(this.m_RoomCounter==1){
		for(var t_y1=0;t_y1<15;t_y1=t_y1+1){
			for(var t_x1=0;t_x1<20;t_x1=t_x1+1){
				c_Map2.m_Layout[t_y1][t_x1]=t_Room1[t_y1][t_x1];
			}
		}
	}else{
		if(this.m_RoomCounter==2){
			for(var t_y12=0;t_y12<15;t_y12=t_y12+1){
				for(var t_x12=0;t_x12<20;t_x12=t_x12+1){
					c_Map2.m_Layout[t_y12][t_x12]=t_Room2[t_y12][t_x12];
				}
			}
		}else{
			if(this.m_RoomCounter==3){
				for(var t_y13=0;t_y13<15;t_y13=t_y13+1){
					for(var t_x13=0;t_x13<20;t_x13=t_x13+1){
						c_Map2.m_Layout[t_y13][t_x13]=t_Room3[t_y13][t_x13];
					}
				}
			}else{
				if(this.m_RoomCounter==4){
					for(var t_y14=0;t_y14<15;t_y14=t_y14+1){
						for(var t_x14=0;t_x14<20;t_x14=t_x14+1){
							c_Map2.m_Layout[t_y14][t_x14]=t_Room4[t_y14][t_x14];
						}
					}
				}else{
					if(this.m_RoomCounter==5){
						for(var t_y15=0;t_y15<15;t_y15=t_y15+1){
							for(var t_x15=0;t_x15<20;t_x15=t_x15+1){
								c_Map2.m_Layout[t_y15][t_x15]=t_Room5[t_y15][t_x15];
							}
						}
					}else{
						if(this.m_RoomCounter==6){
							for(var t_y16=0;t_y16<15;t_y16=t_y16+1){
								for(var t_x16=0;t_x16<20;t_x16=t_x16+1){
									c_Map2.m_Layout[t_y16][t_x16]=t_Room6[t_y16][t_x16];
								}
							}
						}else{
							if(this.m_RoomCounter==7){
								for(var t_y17=0;t_y17<15;t_y17=t_y17+1){
									for(var t_x17=0;t_x17<20;t_x17=t_x17+1){
										c_Map2.m_Layout[t_y17][t_x17]=t_Room7[t_y17][t_x17];
									}
								}
							}else{
								if(this.m_RoomCounter==8){
									for(var t_y18=0;t_y18<15;t_y18=t_y18+1){
										for(var t_x18=0;t_x18<20;t_x18=t_x18+1){
											c_Map2.m_Layout[t_y18][t_x18]=t_Room8[t_y18][t_x18];
										}
									}
								}else{
									if(this.m_RoomCounter==9){
										for(var t_y19=0;t_y19<15;t_y19=t_y19+1){
											for(var t_x19=0;t_x19<20;t_x19=t_x19+1){
												c_Map2.m_Layout[t_y19][t_x19]=t_Room9[t_y19][t_x19];
											}
										}
									}else{
										if(this.m_RoomCounter==10){
											for(var t_y110=0;t_y110<15;t_y110=t_y110+1){
												for(var t_x110=0;t_x110<20;t_x110=t_x110+1){
													c_Map2.m_Layout[t_y110][t_x110]=t_Room10[t_y110][t_x110];
												}
											}
										}else{
											if(this.m_RoomCounter==11){
												for(var t_y111=0;t_y111<15;t_y111=t_y111+1){
													for(var t_x111=0;t_x111<20;t_x111=t_x111+1){
														c_Map2.m_Layout[t_y111][t_x111]=t_BOSSROOM[t_y111][t_x111];
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return 0;
}
function bb_audio_PlayMusic(t_path,t_flags){
	return bb_audio_device.PlayMusic(bb_data_FixDataPath(t_path),t_flags);
}
function c_Sound(){
	Object.call(this);
	this.m_sample=null;
}
c_Sound.m_new=function(t_sample){
	this.m_sample=t_sample;
	return this;
}
c_Sound.m_new2=function(){
	return this;
}
function bb_audio_LoadSound(t_path){
	var t_sample=bb_audio_device.LoadSample(bb_data_FixDataPath(t_path));
	if((t_sample)!=null){
		return c_Sound.m_new.call(new c_Sound,t_sample);
	}
	return null;
}
var bb_Main_MeleeFX=null;
var bb_Main_ShootFX=null;
function bb_input_KeyHit(t_key){
	return bb_input_device.p_KeyHit(t_key);
}
function bb_input_MouseX(){
	return bb_input_device.p_MouseX();
}
function bb_input_MouseY(){
	return bb_input_device.p_MouseY();
}
function bb_audio_PlaySound(t_sound,t_channel,t_flags){
	if(((t_sound)!=null) && ((t_sound.m_sample)!=null)){
		bb_audio_device.PlaySample(t_sound.m_sample,t_channel,t_flags);
	}
	return 0;
}
function bb_input_KeyDown(t_key){
	return ((bb_input_device.p_KeyDown(t_key))?1:0);
}
function c_PlayerProjectile(){
	Object.call(this);
	this.m_OriginalPos=null;
	this.m_Position=null;
	this.m_Velocity=null;
	this.m_Direction="";
	this.m_Speed=3;
	this.m_Friendly=false;
	this.m_ProjectileSize=8;
	this.m_TileCollision=false;
	this.m_Player=bb_graphics_LoadImage2("PlayerProjectile.png",8,8,1,c_Image.m_DefaultFlags);
	this.m_Enemy=bb_graphics_LoadImage2("EnemyProjectile.png",8,8,1,c_Image.m_DefaultFlags);
}
c_PlayerProjectile.m_new=function(t_x,t_y,t_direction,t_speed,t_playerProjectile){
	this.m_OriginalPos=c_Vec2D.m_new.call(new c_Vec2D,t_x,t_y);
	this.m_Position=c_Vec2D.m_new.call(new c_Vec2D,t_x,t_y);
	this.m_Velocity=c_Vec2D.m_new.call(new c_Vec2D,0.0,0.0);
	this.m_Direction=t_direction;
	this.m_Speed=t_speed;
	this.m_Friendly=t_playerProjectile;
	return this;
}
c_PlayerProjectile.m_new2=function(){
	return this;
}
c_PlayerProjectile.prototype.p_ProjectileTileOverlap=function(t_x1,t_y1,t_width,t_height,t_x2,t_y2,t_width2,t_height2){
	if(t_x1>=t_x2+t_width2 || t_x1+t_width<=t_x2){
		return false;
	}
	if(t_y1>=t_y2+t_height2 || t_y1+t_height<=t_y2){
		return false;
	}
	return true;
}
c_PlayerProjectile.prototype.p_ProjectileTileCollision=function(t_x1,t_y1){
	var t_colx=(((this.m_Position.m_x-4.0+(t_x1))/32.0)|0);
	var t_coly=(((this.m_Position.m_y-4.0+(t_y1))/32.0)|0);
	for(var t_y2=t_coly-1;t_y2<t_coly+2;t_y2=t_y2+1){
		for(var t_x2=t_colx-1;t_x2<t_colx+2;t_x2=t_x2+1){
			if(t_x2>=0 && t_x2<20 && t_y2>=0 && t_y2<15){
				if(c_Map2.m_Layout[t_y2][t_x2]==1){
					if(this.p_ProjectileTileOverlap(((this.m_Position.m_x-4.0+(t_x1))|0),((this.m_Position.m_y-4.0+(t_y1))|0),this.m_ProjectileSize,this.m_ProjectileSize,t_x2*32,t_y2*32,32,32)==true){
						return true;
					}
				}
			}
		}
	}
	return false;
}
c_PlayerProjectile.prototype.p_SetPosition=function(t_x,t_y){
	this.m_Position.p_Set2(t_x,t_y);
	return 0;
}
c_PlayerProjectile.prototype.p_Update=function(){
	this.m_Velocity.m_x=0.0;
	this.m_Velocity.m_y=0.0;
	if(this.m_Direction=="W" && this.p_ProjectileTileCollision(-1,0)==false){
		this.m_Velocity.m_x=(-this.m_Speed);
	}
	if(this.m_Direction=="E" && this.p_ProjectileTileCollision(1,0)==false){
		this.m_Velocity.m_x=(this.m_Speed);
	}
	if(this.m_Direction=="N" && this.p_ProjectileTileCollision(0,-1)==false){
		this.m_Velocity.m_y=(-this.m_Speed);
	}
	if(this.m_Direction=="S" && this.p_ProjectileTileCollision(0,1)==false){
		this.m_Velocity.m_y=(this.m_Speed);
	}
	if(this.p_ProjectileTileCollision(0,1) || this.p_ProjectileTileCollision(0,-1) || this.p_ProjectileTileCollision(1,0) || this.p_ProjectileTileCollision(-1,0)){
		this.m_TileCollision=true;
	}
	this.p_SetPosition(this.m_Position.m_x+this.m_Velocity.m_x,this.m_Position.m_y+this.m_Velocity.m_y);
	return 0;
}
c_PlayerProjectile.prototype.p_Draw=function(){
	bb_graphics_SetColor(255.0,255.0,255.0);
	if(this.m_Friendly==true){
		bb_graphics_DrawImage(this.m_Player,this.m_Position.m_x-4.0,this.m_Position.m_y-4.0,0);
	}else{
		this.m_Friendly=false;
		bb_graphics_DrawImage(this.m_Enemy,this.m_Position.m_x-4.0,this.m_Position.m_y-4.0,0);
	}
	return 0;
}
function c_List(){
	Object.call(this);
	this.m__head=(c_HeadNode.m_new.call(new c_HeadNode));
}
c_List.m_new=function(){
	return this;
}
c_List.prototype.p_AddLast=function(t_data){
	return c_Node2.m_new.call(new c_Node2,this.m__head,this.m__head.m__pred,t_data);
}
c_List.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast(t_t);
	}
	return this;
}
c_List.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator.m_new.call(new c_Enumerator,this);
}
c_List.prototype.p_Equals=function(t_lhs,t_rhs){
	return t_lhs==t_rhs;
}
c_List.prototype.p_RemoveEach=function(t_value){
	var t_node=this.m__head.m__succ;
	while(t_node!=this.m__head){
		var t_succ=t_node.m__succ;
		if(this.p_Equals(t_node.m__data,t_value)){
			t_node.p_Remove2();
		}
		t_node=t_succ;
	}
	return 0;
}
c_List.prototype.p_Remove=function(t_value){
	this.p_RemoveEach(t_value);
}
function c_Node2(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node2.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node2.m_new2=function(){
	return this;
}
c_Node2.prototype.p_Remove2=function(){
	this.m__succ.m__pred=this.m__pred;
	this.m__pred.m__succ=this.m__succ;
	return 0;
}
function c_HeadNode(){
	c_Node2.call(this);
}
c_HeadNode.prototype=extend_class(c_Node2);
c_HeadNode.m_new=function(){
	c_Node2.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_Enumerator(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__succ;
	return this;
}
c_Enumerator.m_new2=function(){
	return this;
}
c_Enumerator.prototype.p_HasNext=function(){
	while(this.m__curr.m__succ.m__pred!=this.m__curr){
		this.m__curr=this.m__curr.m__succ;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_Enumerator.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__succ;
	return t_data;
}
function c_Enemy(){
	Object.call(this);
	this.m_Position=null;
	this.m_Velocity=null;
	this.m_Direction="";
	this.m_Speed=2.0;
	this.m_OriginalPos=null;
	this.m_Sprite=bb_graphics_LoadImage2("ChargerWest.png",32,32,2,c_Image.m_DefaultFlags);
}
c_Enemy.prototype.p_EnemyTileOverlap=function(t_x1,t_y1,t_width,t_height,t_x2,t_y2,t_width2,t_height2){
	if(t_x1>=t_x2+t_width2 || t_x1+t_width<=t_x2){
		return false;
	}
	if(t_y1>=t_y2+t_height2 || t_y1+t_height<=t_y2){
		return false;
	}
	return true;
}
c_Enemy.prototype.p_EnemyTileCollision=function(t_x1,t_y1){
	var t_colx=(((this.m_Position.m_x+(t_x1))/32.0)|0);
	var t_coly=(((this.m_Position.m_y+(t_y1))/32.0)|0);
	for(var t_y2=t_coly-1;t_y2<t_coly+2;t_y2=t_y2+1){
		for(var t_x2=t_colx-1;t_x2<t_colx+2;t_x2=t_x2+1){
			if(t_x2>=0 && t_x2<20 && t_y2>=0 && t_y2<15){
				if(c_Map2.m_Layout[t_y2][t_x2]==1){
					if(this.p_EnemyTileOverlap(((this.m_Position.m_x+(t_x1))|0),((this.m_Position.m_y+(t_y1))|0),32,32,t_x2*32,t_y2*32,32,32)==true){
						return true;
					}
				}
			}
		}
	}
	return false;
}
c_Enemy.prototype.p_SetPosition=function(t_x,t_y){
	this.m_Position.p_Set2(t_x,t_y);
	return 0;
}
c_Enemy.prototype.p_Update=function(){
	this.m_Velocity.m_x=0.0;
	this.m_Velocity.m_y=0.0;
	if(this.m_Direction=="W" && this.p_EnemyTileCollision(-1,0)==false){
		this.m_Velocity.m_x=this.m_Velocity.m_x-this.m_Speed;
	}else{
		if(this.m_Direction=="E" && this.p_EnemyTileCollision(1,0)==false){
			this.m_Velocity.m_x=this.m_Velocity.m_x+this.m_Speed;
		}else{
			if(this.m_Direction=="N" && this.p_EnemyTileCollision(0,-1)==false){
				this.m_Velocity.m_y=this.m_Velocity.m_y-this.m_Speed;
			}else{
				if(this.m_Direction=="S" && this.p_EnemyTileCollision(0,1)==false){
					this.m_Velocity.m_y=this.m_Velocity.m_y+this.m_Speed;
				}
			}
		}
	}
	if(this.p_EnemyTileCollision(-1,0) && this.m_Direction=="W"){
		this.m_Direction="E";
	}
	if(this.p_EnemyTileCollision(1,0) && this.m_Direction=="E"){
		this.m_Direction="W";
	}
	if(this.p_EnemyTileCollision(0,1) && this.m_Direction=="S"){
		this.m_Direction="N";
	}
	if(this.p_EnemyTileCollision(0,-1) && this.m_Direction=="N"){
		this.m_Direction="S";
	}
	this.p_SetPosition(this.m_Position.m_x+this.m_Velocity.m_x,this.m_Position.m_y+this.m_Velocity.m_y);
	return 0;
}
c_Enemy.m_new=function(t_x,t_y,t_direction){
	this.m_OriginalPos=c_Vec2D.m_new.call(new c_Vec2D,t_x,t_y);
	this.m_Position=c_Vec2D.m_new.call(new c_Vec2D,t_x,t_y);
	this.m_Velocity=c_Vec2D.m_new.call(new c_Vec2D,0.0,0.0);
	this.m_Direction=t_direction;
	return this;
}
c_Enemy.m_new2=function(){
	return this;
}
c_Enemy.prototype.p_Draw=function(){
	bb_graphics_SetColor(255.0,255.0,255.0);
	if(this.m_Direction=="S"){
		var t_Rotation=90;
		bb_graphics_DrawImage2(this.m_Sprite,this.m_Position.m_x,this.m_Position.m_y+32.0,(t_Rotation),1.0,1.0,0);
	}else{
		if(this.m_Direction=="N"){
			var t_Rotation2=270;
			bb_graphics_DrawImage2(this.m_Sprite,this.m_Position.m_x+32.0,this.m_Position.m_y,(t_Rotation2),1.0,1.0,0);
		}else{
			if(this.m_Direction=="W"){
				var t_Rotation3=0;
				bb_graphics_DrawImage2(this.m_Sprite,this.m_Position.m_x,this.m_Position.m_y,(t_Rotation3),1.0,1.0,0);
			}else{
				if(this.m_Direction=="E"){
					var t_Rotation4=180;
					bb_graphics_DrawImage2(this.m_Sprite,this.m_Position.m_x+32.0,this.m_Position.m_y+32.0,(t_Rotation4),1.0,1.0,0);
				}
			}
		}
	}
	return 0;
}
function c_List2(){
	Object.call(this);
	this.m__head=(c_HeadNode2.m_new.call(new c_HeadNode2));
}
c_List2.m_new=function(){
	return this;
}
c_List2.prototype.p_AddLast2=function(t_data){
	return c_Node3.m_new.call(new c_Node3,this.m__head,this.m__head.m__pred,t_data);
}
c_List2.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast2(t_t);
	}
	return this;
}
c_List2.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator2.m_new.call(new c_Enumerator2,this);
}
c_List2.prototype.p_Equals2=function(t_lhs,t_rhs){
	return t_lhs==t_rhs;
}
c_List2.prototype.p_RemoveEach2=function(t_value){
	var t_node=this.m__head.m__succ;
	while(t_node!=this.m__head){
		var t_succ=t_node.m__succ;
		if(this.p_Equals2(t_node.m__data,t_value)){
			t_node.p_Remove2();
		}
		t_node=t_succ;
	}
	return 0;
}
c_List2.prototype.p_Remove3=function(t_value){
	this.p_RemoveEach2(t_value);
}
c_List2.prototype.p_Count=function(){
	var t_n=0;
	var t_node=this.m__head.m__succ;
	while(t_node!=this.m__head){
		t_node=t_node.m__succ;
		t_n+=1;
	}
	return t_n;
}
function c_Node3(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node3.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node3.m_new2=function(){
	return this;
}
c_Node3.prototype.p_Remove2=function(){
	this.m__succ.m__pred=this.m__pred;
	this.m__pred.m__succ=this.m__succ;
	return 0;
}
function c_HeadNode2(){
	c_Node3.call(this);
}
c_HeadNode2.prototype=extend_class(c_Node3);
c_HeadNode2.m_new=function(){
	c_Node3.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_Enumerator2(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator2.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__succ;
	return this;
}
c_Enumerator2.m_new2=function(){
	return this;
}
c_Enumerator2.prototype.p_HasNext=function(){
	while(this.m__curr.m__succ.m__pred!=this.m__curr){
		this.m__curr=this.m__curr.m__succ;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_Enumerator2.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__succ;
	return t_data;
}
function c_Enemy2(){
	Object.call(this);
	this.m_Position=null;
	this.m_Direction="";
	this.m_Cooldown=.0;
	this.m_Shoot=false;
	this.m_OriginalPos=null;
	this.m_Velocity=null;
	this.m_SpriteNS=bb_graphics_LoadImage2("ShooterVertical.png",32,32,1,c_Image.m_DefaultFlags);
	this.m_SpriteEW=bb_graphics_LoadImage2("ShooterSideWays.png",32,32,1,c_Image.m_DefaultFlags);
}
c_Enemy2.prototype.p_Update=function(){
	if(this.m_Cooldown>0.0){
		this.m_Cooldown=this.m_Cooldown-0.75;
	}
	if(this.m_Cooldown==0.0){
		this.m_Cooldown=60.0;
	}
	if(this.m_Cooldown==60.0){
		this.m_Shoot=true;
	}else{
		if(this.m_Cooldown<60.0){
			this.m_Shoot=false;
		}
	}
	return 0;
}
c_Enemy2.m_new=function(t_x,t_y,t_direction){
	this.m_OriginalPos=c_Vec2D.m_new.call(new c_Vec2D,t_x,t_y);
	this.m_Position=c_Vec2D.m_new.call(new c_Vec2D,t_x,t_y);
	this.m_Velocity=c_Vec2D.m_new.call(new c_Vec2D,0.0,0.0);
	this.m_Direction=t_direction;
	return this;
}
c_Enemy2.m_new2=function(){
	return this;
}
c_Enemy2.prototype.p_Draw=function(){
	bb_graphics_SetColor(255.0,255.0,255.0);
	if(this.m_Direction=="N"){
		var t_Rotation=0;
		bb_graphics_DrawImage2(this.m_SpriteNS,this.m_Position.m_x,this.m_Position.m_y,(t_Rotation),1.0,1.0,0);
	}else{
		if(this.m_Direction=="S"){
			var t_Rotation2=180;
			bb_graphics_DrawImage2(this.m_SpriteNS,this.m_Position.m_x+32.0,this.m_Position.m_y+32.0,(t_Rotation2),1.0,1.0,0);
		}else{
			if(this.m_Direction=="W"){
				var t_Rotation3=180;
				bb_graphics_DrawImage2(this.m_SpriteEW,this.m_Position.m_x+32.0,this.m_Position.m_y+32.0,(t_Rotation3),1.0,1.0,0);
			}else{
				if(this.m_Direction=="E"){
					var t_Rotation4=0;
					bb_graphics_DrawImage2(this.m_SpriteEW,this.m_Position.m_x,this.m_Position.m_y,(t_Rotation4),1.0,1.0,0);
				}
			}
		}
	}
	return 0;
}
function c_List3(){
	Object.call(this);
	this.m__head=(c_HeadNode3.m_new.call(new c_HeadNode3));
}
c_List3.m_new=function(){
	return this;
}
c_List3.prototype.p_AddLast3=function(t_data){
	return c_Node4.m_new.call(new c_Node4,this.m__head,this.m__head.m__pred,t_data);
}
c_List3.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast3(t_t);
	}
	return this;
}
c_List3.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator3.m_new.call(new c_Enumerator3,this);
}
c_List3.prototype.p_Equals3=function(t_lhs,t_rhs){
	return t_lhs==t_rhs;
}
c_List3.prototype.p_RemoveEach3=function(t_value){
	var t_node=this.m__head.m__succ;
	while(t_node!=this.m__head){
		var t_succ=t_node.m__succ;
		if(this.p_Equals3(t_node.m__data,t_value)){
			t_node.p_Remove2();
		}
		t_node=t_succ;
	}
	return 0;
}
c_List3.prototype.p_Remove4=function(t_value){
	this.p_RemoveEach3(t_value);
}
c_List3.prototype.p_Count=function(){
	var t_n=0;
	var t_node=this.m__head.m__succ;
	while(t_node!=this.m__head){
		t_node=t_node.m__succ;
		t_n+=1;
	}
	return t_n;
}
function c_Node4(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node4.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node4.m_new2=function(){
	return this;
}
c_Node4.prototype.p_Remove2=function(){
	this.m__succ.m__pred=this.m__pred;
	this.m__pred.m__succ=this.m__succ;
	return 0;
}
function c_HeadNode3(){
	c_Node4.call(this);
}
c_HeadNode3.prototype=extend_class(c_Node4);
c_HeadNode3.m_new=function(){
	c_Node4.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_Enumerator3(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator3.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__succ;
	return this;
}
c_Enumerator3.m_new2=function(){
	return this;
}
c_Enumerator3.prototype.p_HasNext=function(){
	while(this.m__curr.m__succ.m__pred!=this.m__curr){
		this.m__curr=this.m__curr.m__succ;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_Enumerator3.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__succ;
	return t_data;
}
function c_Door(){
	Object.call(this);
	this.m_Position=null;
	this.m_Lock=false;
	this.m_Open=bb_graphics_LoadImage2("2.5-Open_Door.png",32,32,1,c_Image.m_DefaultFlags);
	this.m_Close=bb_graphics_LoadImage2("2.0-Closed_Door.png",32,32,1,c_Image.m_DefaultFlags);
}
c_Door.m_new=function(t_x,t_y,t_Status){
	this.m_Position=c_Vec2D.m_new.call(new c_Vec2D,(t_x),(t_y));
	this.m_Lock=t_Status;
	return this;
}
c_Door.m_new2=function(){
	return this;
}
c_Door.prototype.p_Draw=function(){
	if(this.m_Lock==false){
		bb_graphics_DrawImage(this.m_Open,this.m_Position.m_x,this.m_Position.m_y,0);
	}else{
		if(this.m_Lock){
			bb_graphics_DrawImage(this.m_Close,this.m_Position.m_x,this.m_Position.m_y,0);
		}
	}
	return 0;
}
function c_List4(){
	Object.call(this);
	this.m__head=(c_HeadNode4.m_new.call(new c_HeadNode4));
}
c_List4.m_new=function(){
	return this;
}
c_List4.prototype.p_AddLast4=function(t_data){
	return c_Node5.m_new.call(new c_Node5,this.m__head,this.m__head.m__pred,t_data);
}
c_List4.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast4(t_t);
	}
	return this;
}
c_List4.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator4.m_new.call(new c_Enumerator4,this);
}
c_List4.prototype.p_Equals4=function(t_lhs,t_rhs){
	return t_lhs==t_rhs;
}
c_List4.prototype.p_RemoveEach4=function(t_value){
	var t_node=this.m__head.m__succ;
	while(t_node!=this.m__head){
		var t_succ=t_node.m__succ;
		if(this.p_Equals4(t_node.m__data,t_value)){
			t_node.p_Remove2();
		}
		t_node=t_succ;
	}
	return 0;
}
c_List4.prototype.p_Remove5=function(t_value){
	this.p_RemoveEach4(t_value);
}
function c_Node5(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node5.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node5.m_new2=function(){
	return this;
}
c_Node5.prototype.p_Remove2=function(){
	this.m__succ.m__pred=this.m__pred;
	this.m__pred.m__succ=this.m__succ;
	return 0;
}
function c_HeadNode4(){
	c_Node5.call(this);
}
c_HeadNode4.prototype=extend_class(c_Node5);
c_HeadNode4.m_new=function(){
	c_Node5.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_Enumerator4(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator4.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__succ;
	return this;
}
c_Enumerator4.m_new2=function(){
	return this;
}
c_Enumerator4.prototype.p_HasNext=function(){
	while(this.m__curr.m__succ.m__pred!=this.m__curr){
		this.m__curr=this.m__curr.m__succ;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_Enumerator4.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__succ;
	return t_data;
}
function c_Block(){
	Object.call(this);
	this.m_Position=null;
	this.m_Wall=bb_graphics_LoadImage2("1.0-Wall_Middle.png",32,32,1,c_Image.m_DefaultFlags);
}
c_Block.m_new=function(t_x,t_y){
	this.m_Position=c_Vec2D.m_new.call(new c_Vec2D,(t_x),(t_y));
	return this;
}
c_Block.m_new2=function(){
	return this;
}
c_Block.prototype.p_Draw=function(){
	bb_graphics_DrawImage(this.m_Wall,this.m_Position.m_x,this.m_Position.m_y,0);
	return 0;
}
function c_List5(){
	Object.call(this);
	this.m__head=(c_HeadNode5.m_new.call(new c_HeadNode5));
}
c_List5.m_new=function(){
	return this;
}
c_List5.prototype.p_AddLast5=function(t_data){
	return c_Node6.m_new.call(new c_Node6,this.m__head,this.m__head.m__pred,t_data);
}
c_List5.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast5(t_t);
	}
	return this;
}
c_List5.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator5.m_new.call(new c_Enumerator5,this);
}
c_List5.prototype.p_Equals5=function(t_lhs,t_rhs){
	return t_lhs==t_rhs;
}
c_List5.prototype.p_RemoveEach5=function(t_value){
	var t_node=this.m__head.m__succ;
	while(t_node!=this.m__head){
		var t_succ=t_node.m__succ;
		if(this.p_Equals5(t_node.m__data,t_value)){
			t_node.p_Remove2();
		}
		t_node=t_succ;
	}
	return 0;
}
c_List5.prototype.p_Remove6=function(t_value){
	this.p_RemoveEach5(t_value);
}
function c_Node6(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node6.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node6.m_new2=function(){
	return this;
}
c_Node6.prototype.p_Remove2=function(){
	this.m__succ.m__pred=this.m__pred;
	this.m__pred.m__succ=this.m__succ;
	return 0;
}
function c_HeadNode5(){
	c_Node6.call(this);
}
c_HeadNode5.prototype=extend_class(c_Node6);
c_HeadNode5.m_new=function(){
	c_Node6.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_Enumerator5(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator5.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__succ;
	return this;
}
c_Enumerator5.m_new2=function(){
	return this;
}
c_Enumerator5.prototype.p_HasNext=function(){
	while(this.m__curr.m__succ.m__pred!=this.m__curr){
		this.m__curr=this.m__curr.m__succ;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_Enumerator5.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__succ;
	return t_data;
}
function c_Boss(){
	Object.call(this);
	this.m_OriginalPos=null;
	this.m_Position=null;
	this.m_Velocity=null;
	this.m_bossMaxHealth=0;
	this.m_bossCurHealth=.0;
	this.m_Direction="";
	this.m_Speed=1.0;
	this.m_Charge=false;
	this.m_Ability1CoolDown=0.0;
	this.m_Ability2CoolDown=0.0;
	this.m_Shoot=false;
	this.m_Sprite=bb_graphics_LoadImage2("Boss.png",64,64,4,c_Image.m_DefaultFlags);
}
c_Boss.m_new=function(t_x,t_y,t_Health,t_direction){
	this.m_OriginalPos=c_Vec2D.m_new.call(new c_Vec2D,t_x,t_y);
	this.m_Position=c_Vec2D.m_new.call(new c_Vec2D,t_x,t_y);
	this.m_Velocity=c_Vec2D.m_new.call(new c_Vec2D,0.0,0.0);
	this.m_bossMaxHealth=t_Health;
	this.m_bossCurHealth=(this.m_bossMaxHealth);
	this.m_Direction=t_direction;
	return this;
}
c_Boss.m_new2=function(){
	return this;
}
c_Boss.prototype.p_EnemyTileOverlap=function(t_x1,t_y1,t_width,t_height,t_x2,t_y2,t_width2,t_height2){
	if(t_x1>=t_x2+t_width2 || t_x1+t_width<=t_x2){
		return false;
	}
	if(t_y1>=t_y2+t_height2 || t_y1+t_height<=t_y2){
		return false;
	}
	return true;
}
c_Boss.prototype.p_EnemyTileCollision=function(t_x1,t_y1){
	var t_colx=(((this.m_Position.m_x+(t_x1))/32.0)|0);
	var t_coly=(((this.m_Position.m_y+(t_y1))/32.0)|0);
	for(var t_y2=t_coly-1;t_y2<t_coly+2;t_y2=t_y2+1){
		for(var t_x2=t_colx-1;t_x2<t_colx+2;t_x2=t_x2+1){
			if(t_x2>=0 && t_x2<20 && t_y2>=0 && t_y2<15){
				if(c_Map2.m_Layout[t_y2][t_x2]==1){
					if(this.p_EnemyTileOverlap(((this.m_Position.m_x+(t_x1))|0),((this.m_Position.m_y+(t_y1))|0),64,64,t_x2*32,t_y2*32,32,32)==true){
						return true;
					}
				}
			}
		}
	}
	return false;
}
c_Boss.prototype.p_SetPosition=function(t_x,t_y){
	this.m_Position.p_Set2(t_x,t_y);
	return 0;
}
c_Boss.prototype.p_ChargeAttack=function(){
	if(this.m_bossCurHealth>=50.0){
		if(this.m_Ability1CoolDown>0.0){
			this.m_Ability1CoolDown=this.m_Ability1CoolDown-1.0;
		}
		if(this.m_Ability1CoolDown==0.0){
			this.m_Ability1CoolDown=300.0;
			this.m_Charge=true;
		}else{
			if(this.m_Ability1CoolDown<=290.0){
				this.m_Charge=false;
			}
		}
	}else{
		if(this.m_Ability1CoolDown>0.0){
			this.m_Ability1CoolDown=this.m_Ability1CoolDown-1.0;
		}
		if(this.m_Ability1CoolDown==0.0){
			this.m_Ability1CoolDown=215.0;
			this.m_Charge=true;
		}else{
			if(this.m_Ability1CoolDown<=190.0){
				this.m_Charge=false;
			}
		}
	}
	return 0;
}
c_Boss.prototype.p_Projectile=function(){
	if(this.m_bossCurHealth>=50.0){
		if(this.m_Ability2CoolDown>0.0){
			this.m_Ability2CoolDown=this.m_Ability2CoolDown-1.0;
		}
		if(this.m_Ability2CoolDown<=0.0){
			this.m_Ability2CoolDown=40.0;
			this.m_Shoot=true;
		}else{
			if(this.m_Ability1CoolDown<40.0){
				this.m_Shoot=false;
			}
		}
	}else{
		if(this.m_Ability2CoolDown>0.0){
			this.m_Ability2CoolDown=this.m_Ability2CoolDown-1.0;
		}
		if(this.m_Ability2CoolDown<=0.0){
			this.m_Ability2CoolDown=40.0;
			this.m_Shoot=true;
		}else{
			if(this.m_Ability1CoolDown<30.0){
				this.m_Shoot=false;
			}
		}
	}
	return 0;
}
c_Boss.prototype.p_Update=function(){
	this.m_Velocity.m_x=0.0;
	this.m_Velocity.m_y=0.0;
	if(this.m_Direction=="W" && this.p_EnemyTileCollision(-1,0)==false){
		this.m_Velocity.m_x=this.m_Velocity.m_x-this.m_Speed;
	}else{
		if(this.m_Direction=="E" && this.p_EnemyTileCollision(1,0)==false){
			this.m_Velocity.m_x=this.m_Velocity.m_x+this.m_Speed;
		}else{
			if(this.m_Direction=="N" && this.p_EnemyTileCollision(0,-1)==false){
				this.m_Velocity.m_y=this.m_Velocity.m_y-this.m_Speed;
			}else{
				if(this.m_Direction=="S" && this.p_EnemyTileCollision(0,1)==false){
					this.m_Velocity.m_y=this.m_Velocity.m_y+this.m_Speed;
				}
			}
		}
	}
	this.p_SetPosition(this.m_Position.m_x+this.m_Velocity.m_x,this.m_Position.m_y+this.m_Velocity.m_y);
	if(this.m_Charge==false){
		if(this.p_EnemyTileCollision(-1,0) && this.m_Direction=="W"){
			this.m_Direction="E";
		}
		if(this.p_EnemyTileCollision(1,0) && this.m_Direction=="E"){
			this.m_Direction="W";
		}
		if(this.p_EnemyTileCollision(0,1) && this.m_Direction=="S"){
			this.m_Direction="N";
		}
		if(this.p_EnemyTileCollision(0,-1) && this.m_Direction=="N"){
			this.m_Direction="S";
		}
	}
	this.p_ChargeAttack();
	this.p_Projectile();
	return 0;
}
c_Boss.prototype.p_DrawHealthBar=function(){
	var t_HealthBarSize=this.m_bossCurHealth/(this.m_bossMaxHealth);
	bb_graphics_SetColor(200.0,0.0,0.0);
	bb_graphics_DrawRect((640.0-300.0*t_HealthBarSize)/2.0,384.0,300.0*t_HealthBarSize,3.0);
	return 0;
}
c_Boss.prototype.p_Draw=function(){
	if(this.m_Direction=="N"){
		var t_Rotation=180;
		bb_graphics_DrawImage2(this.m_Sprite,this.m_Position.m_x+64.0,this.m_Position.m_y+64.0,(t_Rotation),1.0,1.0,0);
	}else{
		if(this.m_Direction=="S"){
			var t_Rotation2=0;
			bb_graphics_DrawImage2(this.m_Sprite,this.m_Position.m_x,this.m_Position.m_y,(t_Rotation2),1.0,1.0,0);
		}else{
			if(this.m_Direction=="W"){
				var t_Rotation3=270;
				bb_graphics_DrawImage2(this.m_Sprite,this.m_Position.m_x+64.0,this.m_Position.m_y,(t_Rotation3),1.0,1.0,0);
			}else{
				if(this.m_Direction=="E"){
					var t_Rotation4=90;
					bb_graphics_DrawImage2(this.m_Sprite,this.m_Position.m_x,this.m_Position.m_y+64.0,(t_Rotation4),1.0,1.0,0);
				}
			}
		}
	}
	this.p_DrawHealthBar();
	return 0;
}
function c_List6(){
	Object.call(this);
	this.m__head=(c_HeadNode6.m_new.call(new c_HeadNode6));
}
c_List6.m_new=function(){
	return this;
}
c_List6.prototype.p_AddLast6=function(t_data){
	return c_Node7.m_new.call(new c_Node7,this.m__head,this.m__head.m__pred,t_data);
}
c_List6.m_new2=function(t_data){
	var t_=t_data;
	var t_2=0;
	while(t_2<t_.length){
		var t_t=t_[t_2];
		t_2=t_2+1;
		this.p_AddLast6(t_t);
	}
	return this;
}
c_List6.prototype.p_ObjectEnumerator=function(){
	return c_Enumerator6.m_new.call(new c_Enumerator6,this);
}
c_List6.prototype.p_Equals6=function(t_lhs,t_rhs){
	return t_lhs==t_rhs;
}
c_List6.prototype.p_RemoveEach6=function(t_value){
	var t_node=this.m__head.m__succ;
	while(t_node!=this.m__head){
		var t_succ=t_node.m__succ;
		if(this.p_Equals6(t_node.m__data,t_value)){
			t_node.p_Remove2();
		}
		t_node=t_succ;
	}
	return 0;
}
c_List6.prototype.p_Remove7=function(t_value){
	this.p_RemoveEach6(t_value);
}
c_List6.prototype.p_Count=function(){
	var t_n=0;
	var t_node=this.m__head.m__succ;
	while(t_node!=this.m__head){
		t_node=t_node.m__succ;
		t_n+=1;
	}
	return t_n;
}
function c_Node7(){
	Object.call(this);
	this.m__succ=null;
	this.m__pred=null;
	this.m__data=null;
}
c_Node7.m_new=function(t_succ,t_pred,t_data){
	this.m__succ=t_succ;
	this.m__pred=t_pred;
	this.m__succ.m__pred=this;
	this.m__pred.m__succ=this;
	this.m__data=t_data;
	return this;
}
c_Node7.m_new2=function(){
	return this;
}
c_Node7.prototype.p_Remove2=function(){
	this.m__succ.m__pred=this.m__pred;
	this.m__pred.m__succ=this.m__succ;
	return 0;
}
function c_HeadNode6(){
	c_Node7.call(this);
}
c_HeadNode6.prototype=extend_class(c_Node7);
c_HeadNode6.m_new=function(){
	c_Node7.m_new2.call(this);
	this.m__succ=(this);
	this.m__pred=(this);
	return this;
}
function c_Enumerator6(){
	Object.call(this);
	this.m__list=null;
	this.m__curr=null;
}
c_Enumerator6.m_new=function(t_list){
	this.m__list=t_list;
	this.m__curr=t_list.m__head.m__succ;
	return this;
}
c_Enumerator6.m_new2=function(){
	return this;
}
c_Enumerator6.prototype.p_HasNext=function(){
	while(this.m__curr.m__succ.m__pred!=this.m__curr){
		this.m__curr=this.m__curr.m__succ;
	}
	return this.m__curr!=this.m__list.m__head;
}
c_Enumerator6.prototype.p_NextObject=function(){
	var t_data=this.m__curr.m__data;
	this.m__curr=this.m__curr.m__succ;
	return t_data;
}
function bb_graphics_Cls(t_r,t_g,t_b){
	bb_graphics_renderDevice.Cls(t_r,t_g,t_b);
	return 0;
}
function bb_graphics_DrawImage(t_image,t_x,t_y,t_frame){
	var t_f=t_image.m_frames[t_frame];
	bb_graphics_context.p_Validate();
	if((t_image.m_flags&65536)!=0){
		bb_graphics_renderDevice.DrawSurface(t_image.m_surface,t_x-t_image.m_tx,t_y-t_image.m_ty);
	}else{
		bb_graphics_renderDevice.DrawSurface2(t_image.m_surface,t_x-t_image.m_tx,t_y-t_image.m_ty,t_f.m_x,t_f.m_y,t_image.m_width,t_image.m_height);
	}
	return 0;
}
function bb_graphics_PushMatrix(){
	var t_sp=bb_graphics_context.m_matrixSp;
	if(t_sp==bb_graphics_context.m_matrixStack.length){
		bb_graphics_context.m_matrixStack=resize_number_array(bb_graphics_context.m_matrixStack,t_sp*2);
	}
	bb_graphics_context.m_matrixStack[t_sp+0]=bb_graphics_context.m_ix;
	bb_graphics_context.m_matrixStack[t_sp+1]=bb_graphics_context.m_iy;
	bb_graphics_context.m_matrixStack[t_sp+2]=bb_graphics_context.m_jx;
	bb_graphics_context.m_matrixStack[t_sp+3]=bb_graphics_context.m_jy;
	bb_graphics_context.m_matrixStack[t_sp+4]=bb_graphics_context.m_tx;
	bb_graphics_context.m_matrixStack[t_sp+5]=bb_graphics_context.m_ty;
	bb_graphics_context.m_matrixSp=t_sp+6;
	return 0;
}
function bb_graphics_Transform(t_ix,t_iy,t_jx,t_jy,t_tx,t_ty){
	var t_ix2=t_ix*bb_graphics_context.m_ix+t_iy*bb_graphics_context.m_jx;
	var t_iy2=t_ix*bb_graphics_context.m_iy+t_iy*bb_graphics_context.m_jy;
	var t_jx2=t_jx*bb_graphics_context.m_ix+t_jy*bb_graphics_context.m_jx;
	var t_jy2=t_jx*bb_graphics_context.m_iy+t_jy*bb_graphics_context.m_jy;
	var t_tx2=t_tx*bb_graphics_context.m_ix+t_ty*bb_graphics_context.m_jx+bb_graphics_context.m_tx;
	var t_ty2=t_tx*bb_graphics_context.m_iy+t_ty*bb_graphics_context.m_jy+bb_graphics_context.m_ty;
	bb_graphics_SetMatrix(t_ix2,t_iy2,t_jx2,t_jy2,t_tx2,t_ty2);
	return 0;
}
function bb_graphics_Transform2(t_m){
	bb_graphics_Transform(t_m[0],t_m[1],t_m[2],t_m[3],t_m[4],t_m[5]);
	return 0;
}
function bb_graphics_Translate(t_x,t_y){
	bb_graphics_Transform(1.0,0.0,0.0,1.0,t_x,t_y);
	return 0;
}
function bb_graphics_Rotate(t_angle){
	bb_graphics_Transform(Math.cos((t_angle)*D2R),-Math.sin((t_angle)*D2R),Math.sin((t_angle)*D2R),Math.cos((t_angle)*D2R),0.0,0.0);
	return 0;
}
function bb_graphics_Scale(t_x,t_y){
	bb_graphics_Transform(t_x,0.0,0.0,t_y,0.0,0.0);
	return 0;
}
function bb_graphics_PopMatrix(){
	var t_sp=bb_graphics_context.m_matrixSp-6;
	bb_graphics_SetMatrix(bb_graphics_context.m_matrixStack[t_sp+0],bb_graphics_context.m_matrixStack[t_sp+1],bb_graphics_context.m_matrixStack[t_sp+2],bb_graphics_context.m_matrixStack[t_sp+3],bb_graphics_context.m_matrixStack[t_sp+4],bb_graphics_context.m_matrixStack[t_sp+5]);
	bb_graphics_context.m_matrixSp=t_sp;
	return 0;
}
function bb_graphics_DrawImage2(t_image,t_x,t_y,t_rotation,t_scaleX,t_scaleY,t_frame){
	var t_f=t_image.m_frames[t_frame];
	bb_graphics_PushMatrix();
	bb_graphics_Translate(t_x,t_y);
	bb_graphics_Rotate(t_rotation);
	bb_graphics_Scale(t_scaleX,t_scaleY);
	bb_graphics_Translate(-t_image.m_tx,-t_image.m_ty);
	bb_graphics_context.p_Validate();
	if((t_image.m_flags&65536)!=0){
		bb_graphics_renderDevice.DrawSurface(t_image.m_surface,0.0,0.0);
	}else{
		bb_graphics_renderDevice.DrawSurface2(t_image.m_surface,0.0,0.0,t_f.m_x,t_f.m_y,t_image.m_width,t_image.m_height);
	}
	bb_graphics_PopMatrix();
	return 0;
}
function bb_graphics_DrawText(t_text,t_x,t_y,t_xalign,t_yalign){
	if(!((bb_graphics_context.m_font)!=null)){
		return 0;
	}
	var t_w=bb_graphics_context.m_font.p_Width();
	var t_h=bb_graphics_context.m_font.p_Height();
	t_x-=Math.floor((t_w*t_text.length)*t_xalign);
	t_y-=Math.floor((t_h)*t_yalign);
	for(var t_i=0;t_i<t_text.length;t_i=t_i+1){
		var t_ch=t_text.charCodeAt(t_i)-bb_graphics_context.m_firstChar;
		if(t_ch>=0 && t_ch<bb_graphics_context.m_font.p_Frames()){
			bb_graphics_DrawImage(bb_graphics_context.m_font,t_x+(t_i*t_w),t_y,t_ch);
		}
	}
	return 0;
}
function bb_graphics_DrawRect(t_x,t_y,t_w,t_h){
	bb_graphics_context.p_Validate();
	bb_graphics_renderDevice.DrawRect(t_x,t_y,t_w,t_h);
	return 0;
}
function bbInit(){
	bb_app__app=null;
	bb_app__delegate=null;
	bb_app__game=BBGame.Game();
	bb_graphics_device=null;
	bb_graphics_context=c_GraphicsContext.m_new.call(new c_GraphicsContext);
	c_Image.m_DefaultFlags=0;
	bb_audio_device=null;
	bb_input_device=null;
	bb_app__devWidth=0;
	bb_app__devHeight=0;
	bb_app__displayModes=[];
	bb_app__desktopMode=null;
	bb_graphics_renderDevice=null;
	bb_app__updateRate=0;
	bb_Main_GameState=0;
	c_MenuClass.m_Selected=0;
	c_MenuClass.m_SplashScreen=false;
	bb_Main_menu=null;
	bb_Main_MeleeFX=null;
	bb_Main_ShootFX=null;
	c_Map2.m_Layout=[];
	c_MenuClass.m_Menu=["[0]","[1] New Game","[2] Options","[3] Highscores","[4]Quit"];
}
//${TRANSCODE_END}
