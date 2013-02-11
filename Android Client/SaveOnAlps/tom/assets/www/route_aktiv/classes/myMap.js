Map = function(){

var d = document, w = window;

var mapDiv = d.getElementById("map");
mapDiv.style.height = "400px";
mapDiv.style.width  = "100%"; 

var map = L.map('map',{zoomControl:true}).setView([51, -0], 13);
    map.zoomControl=true;
    L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',{
         maxZoom: 18,
    }).addTo(map);

this.map = map;
this.minutes = 0;
this.coords = [];
this.notfallCoord;
this.mapViewActive = false;
this.circle;
this.updateTime = 1;
this.savedCoords = 0;

this.hideMap();


}
Map.prototype.showMap = function(){

	window.scrollTo(0,0);
	var d = document;
	d.getElementById("map-screen").style.display = "block";
	d.getElementById("info-screen").style.display = "none";
	d.getElementById("route-header-btn-back").style.display = "block";
	this.mapViewActive = true;
	this.updateMap();

}

Map.prototype.hideMap = function(){
	window.scrollTo(0,0);
	var d = document;
	d.getElementById("map-screen").style.display = "none";
	d.getElementById("info-screen").style.display = "block";
	d.getElementById("route-header-btn-back").style.display = "none";
	this.mapViewActive = false;

}


Map.prototype.getCurrentPos = function(){

	var that = this;
	
	var tempPositions=[];
	
	var watchId =null;
	var watching=false;
	//startWatch aufrufen
	startWatch();
	//nach bestimmter Zeit watchId löschen und den besten Eintrag raussuchen
	var timeout1=window.setTimeout(function(){stopWatch()},65000);
	
	function startWatch()
	{	
		watching=true;
		watchId=navigator.geolocation.watchPosition(tempPosSuccess,tempPosError, {enableHighAccuracy : true, maximumAge: 10000, timeout:14000});
	}
	function stopWatch()
	{
		if(watching)
		{
			window.clearTimeout(timeout1);
			navigator.geolocation.clearWatch(watchId);
			
			if(tempPositions!=null)
			{
				var sendPos=tempPositions[0];
				
				for(var pos in tempPositions)
				{
					if(sendPos.accuracy>tempPositions[pos].accuracy)
					{
						sendPos=tempPositions[pos];
					}
				}
				console.log(sendPos);
				
				
				that.coords.push(sendPos);
				that.notfallCoord = { "lat" : sendPos.lat , "lon" : sendPos.lon, "accuracy" : sendPos.accuracy };
				
				if(myPGap.checkConnection()!=0)
				{	
					console.log("coords speichern");
					that.saveCoords();
				}
				//coords in ls speichern
				that.saveCoordsInLocalStorage();
				that.updateAnzeige();
				if(that.mapViewActive)
				{
					that.updateMap();
				}
				updateIndikator();
			}
		}
	}

	function tempPosSuccess(pos)
	{
		var obj = {
			"lat" : pos.coords.latitude,
			"lon" : pos.coords.longitude,
			"accuracy" : pos.coords.accuracy,
		};
		
		tempPositions.push(obj);
		if(pos.coords.accuracy<100)
			stopWatch();
		
	}

	function tempPosError()
	{
		console.log("Location nicht eingetragen");
		that.updateAnzeige();
	}
}


Map.prototype.interval = function(){

	this.minutes += 0.5;
	if(this.minutes >= this.updateTime){
		this.getCurrentPos();
	}else{
		this.updateAnzeige();
	}

}

Map.prototype.saveCoordsInLocalStorage = function(){

	localStorage["coords"] = JSON.stringify(this.coords);

}

Map.prototype.updateMap = function(){

	var coords = this.coords;
	var map = this.map;
	var circle = this.circle;
	var lat = this.notfallCoord.lat;
	var lon = this.notfallCoord.lon;

	var point = new L.LatLng(lat,lon);

	if(circle == undefined){
		circle = L.circle(point, Math.round(this.notfallCoord.accuracy/2), {
	    color: 'red',
	    fillColor: '#f03',
	    fillOpacity: 0.1
	    }).addTo(map);

	}else{
		circle.setLatLng(point);
	}

    map.panTo(point);
   // map.fitBounds(circle.getBounds());
    this.circle = circle;

}

Map.prototype.updateAnzeige = function(){

	var d = document;
	if(this.notfallCoord != undefined){
	var coord = this.notfallCoord;
		d.getElementById("info_lat").textContent =  Math.round(coord.lat*1000000)/1000000;
		d.getElementById("info_long").textContent = Math.round(coord.lon*1000000)/1000000;
		d.getElementById("info_accu").textContent = Math.round(coord.accuracy)+"m";
	}
		d.getElementById("info_time").textContent = this.minutes+" min /"+this.savedCoords;

}

Map.prototype.saveCoords = function(){



	if(this.coords.length != 0){
		
		json = { "type":"insertLoc",
				 "object": {	
					 	"routeId":myRoute.object.routeID,
					 	"userID":localStorage.userId,
					 	"coords":myMap.coords,// lat:"11111", lon:"8344784", accuracy:"934"
					 	"battery":myPGap.battery,//0-100 
					 	"signalStrength":myPGap.checkConnection()//0 oder 1
				 }
		}

		console.log(json);
		ajax.connectCommunicator(json.type,json);		


	}else{

	}

}
