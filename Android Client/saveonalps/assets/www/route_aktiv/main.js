var ajax = {
communicatorURL : "http://flock-0312.students.fhstp.ac.at/server/communicator.php?callback=meins",
currentName : null,
connectCommunicator : function(pname,json){

	this.currentName = pname;
	
	var xmlhttp=new XMLHttpRequest();
	var that = this;
	
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState==4){
			console.log(that.currentName);
			json=JSON.parse(xmlhttp.responseText);
			that.render(that.currentName,json);
	
			//renderGetRouteAtResponse(json)  //daten an die funktion render übergeben (render muss man selbst programmieren)
		}
	 };
	var jsonString = JSON.stringify(json);	
	xmlhttp.open("POST", this.communicatorURL, true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send("json="+jsonString);



},
render : function(name,json){


	if(name == "RouteNotfall"){
		
		console.log(json);

	}

	if(name == "insertLoc"){

		console.log(json);
		if(json.succes){
			console.log("coords eingetragen");
			myMap.minutes = 0;
			myMap.savedCoords += myMap.coords.length;
			mayMap.coords = [];
		}else{
			alert("coords konnten nicht eingetragen werden")
		}

	}


	} 

}


// EventListener
var myEvents ={
"event": "click",
"init": function(){
	var d = document;
	d.getElementById("position").addEventListener(this.event,function(){ myMap.showMap() },false);
	d.getElementById("route-header-btn-back").addEventListener(this.event,function(){ myMap.hideMap() },false);
	d.getElementById("add").addEventListener(this.event,function(){ stopInterval();
																	myMap.getCurrentPos();
																	startInterval();},false);
	d.getElementById("notruf").addEventListener(this.event,function(){ notrufAbgeben() },false);
		
}

}

var ls = {
	"ls" : localStorage,
	"loadMyRoute" : function(){
			
			return JSON.parse(this.ls["myRoute"]);

	}

}




var myRoute = ls.loadMyRoute();
var myMap = new Map();
var myPGap = new myPhoneGap();

myMap.getCurrentPos();


var intervalID;

function startInterval(){

	intervalID = window.setInterval(function(){

	myMap.interval();
	updateIndikator();


}, 30000);// jede halbe Minute
}

function stopInterval(){

	intervalID = window.clearInterval(intervalID);

}

startInterval();

myEvents.init();




function updateIndikator(){

	//checkConnection();
	
    var indikator = myPGap.battery;
    if(indikator <= 20){ // wenn akku unter 20% befindet sich tel in res mode damit indikator aussagekrŠftig *3
    
    indikator = indikator*3;
    
    }
    // connection

    
    var connection = myPGap.checkConnection();
    var indikatorConn;
    
    if(connection == 1)indikatorConn = 1;
    else indikatorConn = 0.2;
    
    indikator = indikator*indikatorConn;
    // last entry bis 5min 100% ab 20min 0%
    
    var indikatorTime;
   	
   	var minutes = myMap.minutes*2;
   	if( minutes < 5)indikatorTime = 1;
   	else if(minutes > 20)indikatorTime = 0;
   	else indikatorTime = 1-(minutes/20);
   	
   	indikator = indikator * indikatorTime;
    
    
    // accuracy
    
    var indikatorAccu = myMap.coords[myMap.coords.length-1].accuracy;
    if (indikatorAccu >= 200)indikatorAccu = 200;
    else if (indikatorAccu <= 20)indikatorAccu = 0;
    var faktor = Math.round(indikatorAccu / 20)*0.05;
    indikator = Math.round(indikator - ( indikator * faktor));
	

	//den Indikatorpfeil verschieben!
	if(indikator>=94)
	{
	indikator-=6;
	}
	if(indikator<5)
	{
	indikator=5;
	}
	document.getElementById('indikatorpfeil').style.left=indikator+"%"; 

	
	//console.log("**indikator accu done, indikator ready ");
    
    //var element = document.getElementById('indikator');
    //element.innerHTML = "Indikator: "+indikator+"%";
    
    //alert("Akku: "+battery+", Connection: "+connection+", Accuracy: "+accu+", LastEntry(minutes): "+minutes+"");
    
}


function notrufAbgeben(){

	
		
var json =	{	"type":"RouteNotfall",
				"object":{
					"routeID":myRoute.object.routeID,
					"userID":myRoute.object.userID,
					"coords":myMap.notfallCoord,
					"battery":myPGap.battery,
					"signalStrength":myPGap.checkConnection()
				}
			}

console.log(json);
	
ajax.connectCommunicator(json.type,json);
	myPGap.notrufAbsetzen();

}


window.addEventListener('load', function(){onLoad();}, false);

    function onLoad() {
    	
        document.addEventListener("deviceready", onDeviceReady, false);
    }

    // Cordova is loaded and it is now safe to make calls Cordova methods
    //
    function onDeviceReady() {
        window.addEventListener("batterystatus", onBatteryStatus, false);
    }

    // Handle the batterystatus event
    //
    function onBatteryStatus(info) {
    
    	
        console.log("Level: " + info.level + " isPlugged: " + info.isPlugged); 
        myPGap.battery = info.level;
    }


