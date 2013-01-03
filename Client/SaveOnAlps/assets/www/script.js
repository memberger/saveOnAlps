//DEBUG!!!
//var route_id=94;
//window.localStorage.setItem("route_id",94);
//var route_id=0;

var user_id=0;
var last_update="00:00:00";
var long=0;
var lat=0;
var accu=0;
var deviceready=false;
var updateInterval;
var battery = 100;
var indikator = 100;
var connection = 3;
var lastEntry  = 500;
var intervalIndikator = 30000; 

var telNotfall = "06769108657";




function HandleRouteResponse(response)
{
	console.log(response);
	route_id=response;
	
	if(window.localStorage.getItem("route_id")!=null&&window.localStorage.getItem("route_running")!=null)
	{
	document.location.href="main.html";
	}
	else
	{
		window.localStorage.setItem("route_id",route_id);	
		document.location.href="index.html"; 
	}
}

function HandleLocationResponse(response)
{
	
	/*document.getElementById('ResponseDiv').innerHTML = "";
	document.getElementById('ResponseDiv').innerHTML = response;*/
	
	lastEntry = 0;
	document.getElementById('info_long').innerHTML=long.toString().substring(0,7);
    document.getElementById('info_lat').innerHTML=lat.toString().substring(0,7);
    document.getElementById('info_accu').innerHTML=accu;
	document.getElementById('info_long').style="color:#999999";
	document.getElementById('info_time').innerHTML=0+" '";
	
							
}
function HandleNotfallResponse (response)
{
	console.log(response);
	//alert(response);
}

function HandleLoginResponse(response)
{
	//2012 to do
	//Daten vom Login kommen mit folgendem index zurück: user_id,user_name,user_pwd,vorname,nachname,tel,email,strasse,hausnummer,plz,ort,land
}

// Wait for Cordova to load
//
document.addEventListener("deviceready", onDeviceReady, false);
// This is your app's init method. Here's an example of how to use it


// Cordova is ready
//
function onDeviceReady() {
     deviceready=true;
	 //Bei der index soll vorm beenden der app noch der localstorage gelöscht werden!
	 if(document.URL.split('/')[document.URL.split('/').length-1]=="index.html")
	 {
	  //WS2012: getUserbyId if localstorage userid is set
	  if(window.localStorage.getItem("user_id")!=null)
	  {
		  loginRequest({"user_id":window.localStorage.getItem("user_id")});
		  //Hole User by userid aus Datenbank und überspringe loginmaske
	  }
	  
	  
	 document.addEventListener("backbutton", backKeyDown_index, false);
	 
	 //alert("device ready!");
	 }
	 else
	 {
		 document.addEventListener("backbutton", backKeyDown_else, false);
	 }
	     
	 updateIndikator();
	 startLocationdingens();
	  
	  //alert("device ready");
     console.log("****Device Ready ****");
    window.addEventListener("batterystatus", onBatteryStatus, false);
    var interval = self.setInterval("updateIndikator()", intervalIndikator);// Interval anschließend erst wenn route begonnen hat
     //Hier kommt der intervallstart hin. 
     
    }

function backKeyDown_else()
{
	navigator.app.backHistory();
}
	
function backKeyDown_index() { 

    // do something here if you wish
	
	navigator.notification.confirm(
        'Wollen Sie SaveOnAlps beenden?',  // message
        onBeendenAntwort,              // callback to invoke with index of button pressed
        'Wirklich beenden?',            // title
        'JA,NEIN'          // buttonLabels
    );
    
}


function onBeendenAntwort(buttonIndex) {
    if(buttonIndex == 1){
		//username passwort aus localstorage auslesen, in variable speichern und dann neu in den local storage geben
		var user_id=window.localStorage.getItem("user_id");
		window.localStorage.clear();
		window.localStorage.setItem("user_id",user_id);
		
    	console.log("Wird beendet");
    	navigator.app.exitApp();
	
    }else if(buttonIndex == 2){
    
    	
    
    }
}

function login(username,password)
{
	if(username!=""&&username!=null&&password!=""&&password!=null)
	{
	loginRequest({"user_name":username, "password":password});
	}
	else
	{
		alert("Username/Password überprüfen");
	}
}
function register(user_name,user_pwd,vorname,nachname,tel,email,strasse,hausnummer,plz,ort,land)
{ //user_id,user_name,user_pwd,vorname,nachname,tel,email,strasse,hausnummer,plz,ort,land
	registerRequest({"user_name":user_name,"user_pwd":user_pwd,"vorname":vorname,"nachname":nachname,"tel":tel,"email":email,"strasse":strasse,"hausnummer":hausnummer,"plz":plz,"ort":ort,"land":land});
}
	
function startLocationdingens()
{
	//alert("start locationdingens"+deviceready);
	if(deviceready)
	{ 
		console.log("****Location dingens wird gestartet***");
		navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 30000,enableHighAccuracy: true });
		
		updateInterval=window.setInterval("navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 30000,enableHighAccuracy: true })",120000);
	}
	else
	{
	//ka angst, da kommt noch was anderes hin. 
	//alert("Device not ready, try again!");
	}
}

// onSuccess Geolocation
//
function onSuccess(position) {
		console.log("****** Location wurde gefunden****"); 
			//document.getElementById("insertloc").disabled=false;
                            long=position.coords.longitude;
                            lat=position.coords.latitude;
                            accu=position.coords.accuracy;
							//alert("hier");
							insertLocationRequest();
							
    }

function insertPositionManually()
{
	console.log("**attempting manual localisation**");
	navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 30000,enableHighAccuracy: true });
	
}

function getXMLHttp()
{
  var xmlHttp

  try
  {
    //Firefox, Opera 8.0+, Safari
    xmlHttp = new XMLHttpRequest();
  }
  catch(e)
  {
    //Internet Explorer
    try
    {
      xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch(e)
    {
      try
      {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      catch(e)
      {
        alert("Your browser does not support AJAX!")
        return false;
      }
    }
  }
  return xmlHttp;
}

function loginRequest(json)
{
	var xmlhttp=new XMLHttpRequest();
        xmlhttp.open("POST","http://mt102002.students.fhstp.ac.at/saveOnAlps/login.php",true);
        xmlhttp.onreadystatechange=function(){
                if(xmlhttp.readyState==4){
                        HandleLoginResponse(xmlhttp.responseText);
                }
        }
		//console.log(drumkitArray);
		console.log("login wurde gesendet");
		xmlhttp.send(JSON.stringify(json));
}
function registerRequest(json)
{
	var xmlhttp=new XMLHttpRequest();
        xmlhttp.open("POST","http://mt102002.students.fhstp.ac.at/saveOnAlps/register.php",true);
        xmlhttp.onreadystatechange=function(){
                if(xmlhttp.readyState==4){
                        HandleLoginResponse(xmlhttp.responseText);
                }
        }
		//console.log(drumkitArray);
		console.log("register wurde gesendet");
		xmlhttp.send(JSON.stringify(json));
}

function insertRouteRequest()
{
	if(document.getElementsByName('start')[0].value!=""&&document.getElementsByName('verlauf')[0].value!=""||document.getElementsByName('ziel')[0].value)
	{
 		var xmlHttp = getXMLHttp();
 
  		xmlHttp.onreadystatechange = function()
  		{
    		if(xmlHttp.readyState == 4)
    		{
      			HandleRouteResponse(xmlHttp.responseText);
    		}
  		}
		
		var start=document.getElementsByName('start')[0].value;
		var ueber=document.getElementsByName('verlauf')[0].value;
		var ziel=document.getElementsByName('ziel')[0].value;
		window.localStorage.setItem("route_start",start);
		window.localStorage.setItem("route_verlauf",ueber);
		window.localStorage.setItem("route_ziel",ziel);
		
		console.log(start+" "+ueber+" "+ziel);
	
	//alert("http://mt102002.students.fhstp.ac.at/saveOnAlps/insertRoute.php?start="+start+"&ueber="+ueber+"&ziel="+ziel);
		if(window.localStorage.getItem("route_id")!=null)
		{
 			xmlHttp.open("GET", "http://mt102002.students.fhstp.ac.at/saveOnAlps/insertRoute.php?start="+start+"&ueber="+ueber+"&ziel="+ziel+"&user_id="+user_id+"&route_id="+window.localStorage.getItem("route_id"), true);
  			xmlHttp.send(null);
		}
		else
		{
			xmlHttp.open("GET", "http://mt102002.students.fhstp.ac.at/saveOnAlps/insertRoute.php?start="+start+"&ueber="+ueber+"&ziel="+ziel+"&user_id="+user_id, true);
  			xmlHttp.send(null);
		}
	}
	else
	{
		console.log("nicht alles ausgefüllt");
	}
}


	

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        //alert('code: '    + error.code    + '\n' +
              //'message: ' + error.message + '\n');
    }




function insertLocationRequest()
{
	var xmlHttp = getXMLHttp();
 
  xmlHttp.onreadystatechange = function()
  {
    if(xmlHttp.readyState == 4)
    {
      HandleLocationResponse(xmlHttp.responseText);
      lastEntry  = 0;
	  updateIndikator();
    }
  }
  // hier sollen dann noch netzstärke (0..3) und der Akkuladezustand eingetragen werden. 
	//alert("insertLocation.php?long="+long+"&lat="+lat+"&accu="+accu+"&user_id="+user_id+"&route_id="+route_id+"&battery=0&signal=0");
 	xmlHttp.open("GET", "http://mt102002.students.fhstp.ac.at/saveOnAlps/insertLocation.php?long="+long+"&lat="+lat+"&accu="+accu+"&user_id="+user_id+"&route_id="+window.localStorage.getItem("route_id")+"&battery="+battery+"&signalStrength="+connection, true);
  	xmlHttp.send(null);
}

function insertNotfallRequest()
{
	console.log("eig. sollt jetzt der notfall abgesetzt werden");
	var xmlHttp = getXMLHttp();

  xmlHttp.onreadystatechange = function()
  {
    if(xmlHttp.readyState == 4)
    {
      HandleNotfallResponse(xmlHttp.responseText);
    }
  }
	console.log("http://mt102002.students.fhstp.ac.at/saveOnAlps/insertNotfall.php?user_id="+user_id+"&route_id="+window.localStorage.getItem("route_id")+"&long="+long+"&lat="+lat+"&accu="+accu);
 	xmlHttp.open("GET", "http://mt102002.students.fhstp.ac.at/saveOnAlps/insertNotfall.php?user_id="+user_id+"&route_id="+window.localStorage.getItem("route_id")+"&long="+long+"&lat="+lat+"&accu="+accu, true);
  	xmlHttp.send(null);
  	
}


function onBatteryStatus(info) {
    
    battery = info.level;


}

function checkConnection() {
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.CELL_2G]  = 1;
    states[Connection.CELL_3G]  = 2;
    states[Connection.CELL_4G]  = 3;
    states[Connection.NONE]     = 0;
    states[Connection.UNKNOWN]  = 0;
    states[Connection.ETHERNET] = 3;
    states[Connection.WIFI]     = 3;
    
    connection = states[networkState];
  
}


function updateIndikator(){

	checkConnection();
	
    indikator = battery;
    if(indikator <= 20){ // wenn akku unter 20% befindet sich tel in res mode damit indikator aussagekrŠftig *3
    
    indikator = indikator*3;
    
    }
    // connection
    var indikatorConn;
    
    if(connection == 1)indikatorConn = 0.8;
    else if(connection == 2 || connection == 3)indikatorConn = 1;
    else indikatorConn = 0.2;
    
    indikator = indikator*indikatorConn;
    // last entry bis 5min 100% ab 20min 0%
    
    var indikatorTime;
   	lastEntry ++;
   	var minutes = lastEntry*intervalIndikator/60000;
   	if( minutes < 5)indikatorTime = 1;
   	else if(minutes > 20)indikatorTime = 0;
   	else indikatorTime = 1-(minutes/20);
   	
   	indikator = indikator * indikatorTime;
    
    
    // accuracy
    
    var indikatorAccu = accu;
    if (indikatorAccu >= 200)indikatorAccu = 200;
    else if (indikatorAccu <= 20)indikatorAccu = 0;
    var faktor = Math.round(indikatorAccu / 20)*0.05;
    indikator = Math.round(indikator - ( indikator * faktor));
	
	if(minutes>60)
	{
		 document.getElementById('info_time').innerHTML="---";
	}
	else
	{
    document.getElementById('info_time').innerHTML=minutes+"'";
	}
	//den Indikatorpfeil verschieben!
	if(indikator>=94)
	{
	indikator-=6;
	}
	if(indikator<5)
	{
	indikator=5;
	}
	document.getElementById('indikatorpfeil').style.left=indikator+"% !important"; 
	
	console.log("**indikator accu done, indikator ready ");
    
    //var element = document.getElementById('indikator');
    //element.innerHTML = "Indikator: "+indikator+"%";
    
    //alert("Akku: "+battery+", Connection: "+connection+", Accuracy: "+accu+", LastEntry(minutes): "+minutes+"");
    
}

// Notfall button

function sendNotfall() {
    navigator.notification.confirm(
        'Notfall abgeben?',  // message
        onNotfallAntwort,              // callback to invoke with index of button pressed
        'NOTFALL',            // title
        'JA,NEIN'          // buttonLabels
    );
    
}


function onNotfallAntwort(buttonIndex) {
    if(buttonIndex == 1){
    console.log("notfall abgesetzt");
    	insertNotfallRequest();
		callContact();
		
    
    
    }else if(buttonIndex == 2){
    
    	alert("KEIN Notruf abgegeben");
    
    }
}
function callContact()
{
	console.log("jetzt sollte der notfallkontakt angerufen werden")
	window.location.href="tel:"+telNotfall+"";
}

function checkLocalStorage_Route()
{
	if(window.localStorage.getItem("route_start")!=null)
	{
		console.log("route wird ausgelesen vom localstorage");
		document.getElementsByName('start')[0].value=window.localStorage.getItem("route_start");
		document.getElementsByName('verlauf')[0].value=window.localStorage.getItem("route_verlauf");
		document.getElementsByName('ziel')[0].value=window.localStorage.getItem("route_ziel");
	}
		
}

function stopRoute()
{
	var xmlHttp = getXMLHttp();
 
	xmlHttp.onreadystatechange = function()
	{
		if(xmlHttp.readyState == 4)
		{
		HandleStopRouteResponse(xmlHttp.responseText);
		}
	}
	//alert("insertLocation.php?long="+long+"&lat="+lat+"&accu="+accu+"&user_id="+user_id+"&route_id="+route_id+"&battery=0&signal=0");
 	xmlHttp.open("GET", "http://mt102002.students.fhstp.ac.at/saveOnAlps/stopRoute.php?long=&route_id="+window.localStorage.getItem("route_id"), true);
  	xmlHttp.send(null);
}

function openmain()
{
	
	 window.localStorage.setItem("route_running","1");
	 window.location="index.html";
}
function openChangeRoute()
{
	document.location.href="route_eintrag.html";

}
function showPosition()
{
	document.location.href="position.html";
}
function HandleStopRouteResponse(response)
{
	window.localStorage.clear();
	document.location.href="index.html";
}

