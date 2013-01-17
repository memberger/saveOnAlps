myPhoneGap = function(){

this.telNotfall = "06769108657";

this.battery = 100;

this.batteryListener();
this.phoneOnline();

}

myPhoneGap.prototype.notrufAbsetzen = function(){
	
	var that = this;    

	navigator.notification.confirm(
        'Notfall abgeben?',  // message
         callBackOnNotfallAntwort,  // callback to invoke with index of button pressed
        'NOTFALL',            // title
        'JA,NEIN'          // buttonLabels
    );

    function callBackOnNotfallAntwort(buttonIndex){
	    
		if(buttonIndex == 1){
    
			window.location.href="tel:"+that.telNotfall+"";
   
		/*}else if(buttonIndex == 2){
    
		}*/
		}
	}
}


myPhoneGap.prototype.checkConnection = function(){

    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.CELL_2G]  = 1;
    states[Connection.CELL_3G]  = 1;
    states[Connection.CELL_4G]  = 1;
    states[Connection.NONE]     = 0;
    states[Connection.UNKNOWN]  = 0;
    states[Connection.ETHERNET] = 1;
    states[Connection.WIFI]     = 1;
    
    var connection = states[networkState];

    console.log(connection);
    return connection;

}

myPhoneGap.prototype.checkBattery = function(){


	var battery = info.level;
	return battery;


}
// Updated Battery bei Änderung des Battery Levels
myPhoneGap.prototype.batteryListener = function(){

	var that = this;

	document.addEventListener("batterystatus", function(info){

		alert("Battery Changed");
		that.battery = info.level;

	}, false);


}
// Sobald Phone wieder online wird die currentPosition eingetragen
myPhoneGap.prototype.phoneOnline = function(){

	document.addEventListener("online", onOnline, false);

	function onOnline() {
		alert("wieder Online");
    	myMap.getCurrentPos();
    }




}







/*




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
*/