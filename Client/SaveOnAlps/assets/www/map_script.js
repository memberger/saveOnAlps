//für google-maps
var geo, map, marker, latlng, gps, circle;

//für openstreet-map
var latitude = 10;
var longitude = 10;
var getPosition;
var json;
var url;
var textBox = document.getElementById("objekt");
var karte = document.getElementById("map");

var markers = new Array();
var markercounter = 0;
var oldmarkercounter = 0;
var startpunktgeloescht=false;
var endpunktgeloescht=false;




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

function init_osm(){
 getPosition = navigator.geolocation.getCurrentPosition(GetLocation);
 // Größe der Karte setzen
	document.getElementById('map_canvas').style.height="100%";
	document.getElementById('map_canvas').style.width="100%"; // 100% damit bei OrientationChange automatische Anpassung	
}

function GetLocation(location){
map = L.map('map_canvas',{zoomControl:true}).setView([latitude, longitude], 13);
    map.zoomControl=true;
    L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',{
         maxZoom: 18,
    }).addTo(map);

	map.on('click', mapTap);
latitude = location.coords.latitude;
longitude  = location.coords.longitude;
map.panTo([latitude, longitude]);
}

function mapTap(event){
	var marker;
	var icon;
	var punkteBox= document.getElementById("punkte");
    /*var marker = L.marker(event.latlng, {
		draggable: true
          
	}).addTo(map);*/
	if(startpunktgeloescht){
	icon = L.icon({
	iconUrl: 'Images/start.png',
	iconSize: [30, 37],
	iconAnchor: [15, 37]
	
	});
	marker = L.marker(event.latlng, {
		draggable: true,
		icon: icon
	});
	var bild = document.createElement("img");
	if(markercounter <= 1){
	var text = document.createTextNode(' Setzen Sie den Endpunkt');
	bild.setAttribute("src","Images/end.png");
	}
	else{ 
	var text = document.createTextNode(' Setzen Sie beliebig viele Zwischenpunkte');
	bild.setAttribute("src","Images/over.png");
	}
	while(punkteBox.firstChild){
		punkteBox.removeChild(punkteBox.firstChild);
	}	
	punkteBox.appendChild(bild);
	punkteBox.appendChild(text);
	startpunktgeloescht = false;
	map.addLayer(marker);
	markers[0] = marker;
	for(var i=0; i<markers.length;i++){
		if(markers[i]!= null){
		markers[i].bindPopup("<div ontouchstart = 'markerLöschen("+i+");'>Löschen X</div>");
		}
	}
	//marker.bindPopup("<div onclick = 'markerLöschen(0);'>Löschen X</div>");
	}
	
	else if(endpunktgeloescht){
	icon = L.icon({
    iconUrl: 'Images/end.png',
	iconSize: [30, 37],
	iconAnchor: [15, 37]
	});
	marker = L.marker(event.latlng, {
		draggable: true,
		icon: icon
	});
	var text = document.createTextNode(' Setzen Sie beliebig viele Zwischenpunkte');
	var bild = document.createElement("img");
	bild.setAttribute("src","Images/over.png")
	while(punkteBox.firstChild){
		punkteBox.removeChild(punkteBox.firstChild);
	}	
	punkteBox.appendChild(bild);
	punkteBox.appendChild(text);
	endpunktgeloescht = false;
	map.addLayer(marker);
	markers[1] = marker;
	//marker.bindPopup("<div onclick = 'markerLöschen(1);'>Löschen X</div>");
	for(var i=0; i<markers.length;i++){
		if(markers[i]!= null){
		markers[i].bindPopup("<div ontouchstart = 'markerLöschen("+i+");'>Löschen X</div>");
		}
	}
	}
	else{
	if(markercounter == 0){
	icon = L.icon({
	iconUrl: 'Images/start.png',
	iconSize: [30, 37],
	iconAnchor: [15, 37]
	
	});
	marker = L.marker(event.latlng, {
		draggable: true,
		icon: icon
	});
	var text = document.createTextNode(' Setzen Sie den Endpunkt');
	var bild = document.createElement("img");
	bild.setAttribute("src","Images/end.png")
	while(punkteBox.firstChild){
		punkteBox.removeChild(punkteBox.firstChild);
	}	
	punkteBox.appendChild(bild);
	punkteBox.appendChild(text);
	/*else{
		markers[markercounter].setLatLng(event.latlng);
	}*/
	}
	if(markercounter == 1){

	icon = L.icon({
    iconUrl: 'Images/end.png',
	iconSize: [30, 37],
	iconAnchor: [15, 37]
	});
	marker = L.marker(event.latlng, {
		draggable: true,
		icon: icon
	});
	var text = document.createTextNode(' Setzen Sie beliebig viele Zwischenpunkte');
	var bild = document.createElement("img");
	bild.setAttribute("src","Images/over.png")
	while(punkteBox.firstChild){
		punkteBox.removeChild(punkteBox.firstChild);
	}	
	punkteBox.appendChild(bild);
	punkteBox.appendChild(text);

	}
	if(markercounter > 1){
	
	icon = L.divIcon({
	iconSize: [30, 37],
	iconAnchor: [15, 37],
	className: 'mapicon',
	html: "<img src='Images/over.png' /> <div>"+(markercounter-1)+"</div>"
	});
	marker = L.marker(event.latlng, {
		draggable: true,
		icon: icon
	});
	
	}
	
	map.addLayer(marker);
	markers[markercounter] = marker;
	//marker.bindPopup(marker._latlng.lat + " " + marker._latlng.lng);
	marker.bindPopup("<div ontouchstart = 'markerLöschen("+markercounter+");'>Löschen X</div>");
	markercounter++;
	}
}

function ergebnisse(){
 //var json = document.open("http://nominatim.openstreetmap.org/search?q=135+pilkington+avenue,+birmingham&format=json&polygon=1&addressdetails=1");
 var suchbegriff = document.getElementById("suchfeld").value;
 suchbegriff = encodeURI(suchbegriff);
 url= "http://nominatim.openstreetmap.org/search?q="+suchbegriff+"&format=json";
 var xmlhttp=new XMLHttpRequest();

	xmlhttp.onreadystatechange = function() {
    if(xmlhttp.readyState==4){
        json=JSON.parse(xmlhttp.responseText);

        render(json)  //daten an die funktion render übergeben (render muss man selbst programmieren)

    }
 };

xmlhttp.open("GET",url,true);

xmlhttp.send(null);
}

function render(jsonstring){
	var section_karte = document.getElementById("karte");
	var section_suchergebnisse = document.getElementById("suchergebnisse");
	while(section_suchergebnisse.firstChild){
		section_suchergebnisse.removeChild(section_suchergebnisse.firstChild);
	}
	if(json[0]){
	if(json.length > 1){

	section_karte.style.display = "none";
	section_suchergebnisse.style.display = "block";
	for(var i=0; i<json.length;i++){
	var text = document.createTextNode(json[i].display_name);
	var textP = document.createElement("p");
	var unterstrich = document.createElement("u");
	textP.appendChild(text);
	textP.setAttribute("ontouchstart", "trefferAnzeigen("+json[i].lat+","+json[i].lon+")");
	unterstrich.appendChild(textP);
	section_suchergebnisse.appendChild(unterstrich);
	section_suchergebnisse.appendChild(document.createElement("br"));
	}
	
	}
	else{
	latitude = json[0].lat;
	longitude = json[0].lon;
	map.panTo([latitude, longitude]);
	}
	}
	else alert("Kein Treffer");
}

function trefferAnzeigen(lat, lng){
var section_karte = document.getElementById("karte");
var section_suchergebnisse = document.getElementById("suchergebnisse");
map.panTo([lat,lng]);

section_karte.style.display = "block";
section_suchergebnisse.style.display = "none";
}

function markerLöschen(markercounter){
	
	map.removeLayer(markers[markercounter]);
	markers[markercounter] = null;
	if(markercounter == 0){
	var punkteBox= document.getElementById("punkte");
	startpunktgeloescht=true;
	var text = document.createTextNode(' Setzen Sie den Startpunkt');
	var bild = document.createElement("img");
	bild.setAttribute("src","Images/start.png")
	while(punkteBox.firstChild){
		punkteBox.removeChild(punkteBox.firstChild);
	}	
	punkteBox.appendChild(bild);
	punkteBox.appendChild(text);
	for(var i=0; i<markers.length;i++){
		if(markers[i]!= null){
		markers[i].unbindPopup();
		}
	}
	}
	if(markercounter == 1){
	var punkteBox= document.getElementById("punkte");
	endpunktgeloescht=true;
	var text = document.createTextNode(' Setzen Sie den Endpunkt');
	var bild = document.createElement("img");
	bild.setAttribute("src","Images/end.png")
	while(punkteBox.firstChild){
		punkteBox.removeChild(punkteBox.firstChild);
	}	
	punkteBox.appendChild(bild);
	punkteBox.appendChild(text);
	for(var i=0; i<markers.length;i++){
		if(markers[i]!= null){
		markers[i].unbindPopup();
		}
	}
	}
}
