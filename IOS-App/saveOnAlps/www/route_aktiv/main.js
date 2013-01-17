window.addEventListener("batterystatus", onBatteryStatus, false);

function onBatteryStatus(info) {
    // Handle the online event
    alert("Level: " + info.level + " isPlugged: " + info.isPlugged); 
}


// EventListener
var myEvents ={
"event": "click",
"init": function(){
	var d = document;
	d.getElementById("position").addEventListener(this.event,function(){ myMap.showMap() },false);
	d.getElementById("route-header-btn-back").addEventListener(this.event,function(){ myMap.hideMap() },false);
	d.getElementById("add").addEventListener(this.event,function(){ myMap.getCurrentPos() },false);
	d.getElementById("notruf").addEventListener(this.event,function(){ myPGap.notrufAbsetzen() },false);
		
}

}




var myMap = new Map();
var myPGap = new myPhoneGap();

myMap.getCurrentPos();
var intervalID = window.setInterval(function(){

	myMap.interval();
	updateIndikator();


}, 30000);// jede halbe Minute

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


