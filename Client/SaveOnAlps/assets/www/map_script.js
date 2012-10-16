var geo, map, marker, latlng, gps, circle;

function init(){
	// Aktuelle Position abfragen (CallbackFunction Erfolg, CallbackFunction Error, Parameter)
	gps = navigator.geolocation.getCurrentPosition(startMap, errorPosition, {timeout: 10000, enableHighAccuracy : true});
	
	// Größe der Karte setzen
	document.getElementById('map_canvas').style.height="100%";
	document.getElementById('map_canvas').style.width="100%"; // 100% damit bei OrientationChange automatische Anpassung	
}

// Callback-Funktion im Erfolgsfall getCurrentPosition
function startMap(pos){
	//alert("lat: "+ pos.coords.latitude + " lon: " + pos.coords.longitude + " acc: " + pos.coords.accuracy);
	// Position für GoogleMaps formatieren
	latlng = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
	// Div wo Karte hin soll
	mapDiv = document.getElementById('map_canvas');
	
	// Optionen setzen
	var myOptions = {
		zoom: 15,
		center: latlng,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	
	// map in den DOM einfügen
	map = new google.maps.Map(mapDiv, myOptions);
	// Marker erzeugen
	marker = new google.maps.Marker({
		position: latlng,
		map: map
	});
	circle = new google.maps.Circle({
 	map: map,
  	radius: pos.coords.accuracy,    
	fillColor: '#AA0000'
	});
	circle.bindTo('center', marker, 'position');

	
}

// Callback-Funktion im Fehlerfall
function errorPosition(msg){
	alert(msg);
}