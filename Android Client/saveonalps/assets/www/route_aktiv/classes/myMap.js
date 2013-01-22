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
this.updateTime = 2;
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
navigator.geolocation.getCurrentPosition(currentPosSuccess, currentPosError, {enableHighAccuracy : true, maximumAge: 30000, timeout:6000});



function currentPosSuccess(pos){
	
	console.log(pos);
	
	var obj = {
		"lat" : pos.coords.latitude,
		"lon" : pos.coords.longitude,
		"accuracy" : pos.coords.accuracy,
	};

	that.coords.push(obj);
	that.notfallCoord = { "lat" : obj.lat , "lon" : obj.lon };
	
	if(myPGap.checkConnection()!=0){	
		console.log("coords speichern");
		that.saveCoords();
	}

	//coords in ls speichern
	that.saveCoordsInLocalStorage();
	that.updateAnzeige();
	if(that.mapViewActive){
		that.updateMap();
	}
	updateIndikator();
}

function currentPosError(){
	
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
	var lat = coords[coords.length-1].lat;
	var lon = coords[coords.length-1].lon;

	var point = new L.LatLng(lat,lon);

	if(circle == undefined){
		circle = L.circle(point, Math.round(coords[coords.length-1].accuracy/2), {
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
	if(this.coords[this.coords.length-1] != undefined){
	var coord = this.coords[this.coords.length-1];
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
