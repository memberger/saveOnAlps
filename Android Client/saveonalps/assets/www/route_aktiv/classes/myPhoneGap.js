


myPhoneGap = function(){


var myContact = JSON.parse(localStorage.myContact);


this.telNotfall = myContact.object.Telefonnummer;

this.battery = 100;

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


// Sobald Phone wieder online wird die currentPosition eingetragen
myPhoneGap.prototype.phoneOnline = function(){

	document.addEventListener("online", onOnline, false);

	function onOnline() {
		
    	myMap.getCurrentPos();
    }




}
