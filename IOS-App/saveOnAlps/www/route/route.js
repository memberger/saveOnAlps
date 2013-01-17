var polyline;
var pages = 4;
var currentPage = 1;
var currentZielgebiet = {
"lat":null,
"lon":null

};

var ls = {
"ls" : localStorage,
"saveMyRoute" : function(){

	this.ls["myRoute"] = JSON.stringify(myRoute);

},
"loadMyRoute" : function(){

	myRoute = JSON.parse(this.ls["myRoute"]);

}

}

var myRoute;

if (localStorage.myRoute == undefined){

	myRoute = {
	"type":"eigeneRoute",
	"object": {	
				"routename": "",
	       		"routeinfo": "",
		        "routecode": "",
		        "zielgebiet":"",
				"userID":1,
				"gpxID": "",
				"richtigeRichtung":true,
				"coords":[]
	
				}

	}
	
}else{

ls.loadMyRoute();


}


renderStartPage();


document.getElementById("footer_page1").addEventListener('click',function(){
	
	var d = document;

	myRoute.object.routeinfo = d.getElementById("page1-content-info-text").value;
	ajax.connectCommunicator(myRoute.type, myRoute);


});







function renderStartPage(){
	var d = document;
	var btn = d.getElementById("page1-btn-route-erstellen");
	var div = d.getElementById("page1-content-route-erstellen");
	

	if(myRoute.object.coords != ""){
		
		btn.style.display = "none";
		var ul = d.getElementById("ul-route-status");
		var li = d.createElement("li");
		li.textContent = "Zielgebiet: ";
		var span = d.createElement("span");
		span.textContent = myRoute.object.zielgebiet;

		li.appendChild(span);
		ul.appendChild(li);

		if(myRoute.object.gpxID != ""){

			li = d.createElement("li");
			li.textContent = "Route: ";
			span = d.createElement("span");
			span.textContent = myRoute.object.routename;
	
			li.appendChild(span);
			ul.appendChild(li);



		}

		if(myRoute.object.coords != ""){
			
			if(myRoute.object.coords.length >= 3){

			
			li = d.createElement("li");
			li.textContent = "Anzahl Punkte: ";
			span = d.createElement("span");
			span.textContent = myRoute.object.coords.length;
	
			li.appendChild(span);
			ul.appendChild(li);

			li = d.createElement("li");
			li.className = "route-erstellt-erfolgreich";
			li.textContent = "Route wurde erfolgreich erstellt!";
		
			
			ul.appendChild(li);

			var btnRouteLoeschen = d.getElementById("page1-btn-route-loeschen");
			btnRouteLoeschen.style.display = "block";

			btnRouteLoeschen.addEventListener('click', function(){
				
				var d = document;
				var ul = d.getElementById("ul-route-status");
				
				while(ul.firstChild){
					ul.removeChild(ul.firstChild);	
				}

				d.getElementById("page1-btn-route-loeschen").style.display = "none";
				d.getElementById("page1-btn-route-erstellen").style.display = "block";
				
				
			});
			
			
			


			}else{

				
				while(ul.firstChild){
					ul.removeChild(ul.firstChild);
					
				}

				btn.style.display = "block";
				li = d.createElement("li");
				li.className = "route-erstellt-fehler";
				li.textContent = "Beim Erstellen der Route ist ein Fehler aufgetreten!";
				
				ul.appendChild(li);
			

			}


		}


	}else{

		btn.style.display = "block";

	}




}




var map = document.getElementById('map');

//map.style.height = window.innerHeight+"px";
//map.style.width  = window.innerWidth+"px";





var rules = {

	"btnBack" : document.getElementById("route-header-btn-back"),
	"btnCheck": document.getElementById("route-header-btn-check"),
	"footer"  : document.getElementById("footer_page1"),

	"page1" : function(){
	
	this.btnBack.style.visibility = "visible";
	this.btnCheck.style.visibility = "hidden";
	this.footer.style.visibility = "visible";
	
	
	},
	"page2" : function(){
	
	this.btnBack.style.visibility = "visible";
	this.btnCheck.style.visibility = "hidden";	
	this.footer.style.visibility = "hidden";
	
	},
	"page3" : function(){
	
	this.btnBack.style.visibility = "visible";
	this.btnCheck.style.visibility = "hidden";		
	this.footer.style.visibility = "hidden";
	
	},
	"page4" : function(){
	
	this.btnBack.style.visibility = "visible";
	this.btnCheck.style.visibility = "visible";		
	this.footer.style.visibility = "hidden";
	} }; 


setHeight();
rules.page1();

var btnNext = document.getElementsByClassName('btn-next');
var btnPrev = document.getElementsByClassName('btn-prev');


var nextSlide = function(routeID){

	rules["page"+routeID]();

	if(currentPage < pages && scroll == false){
	
		console.log(routeID);

		currentPage = routeID;
		setHeight();
		window.scrollTo(0, 0);
		document.getElementById("page"+(currentPage-1)).style.left = "-100%";
		document.getElementById("page"+currentPage).style.left = "0";
	}
}

var prevSlide = function(){
	
	
	if(currentPage == 1){
		window.location = "../index.html"
	}

	if(currentPage > 1 && scroll == false){
		if(currentPage == 4 && allowmarker==true){
		deletemarkers();
		}	
		
		currentPage -= 1;
		setHeight();
		rules["page"+currentPage]();
		window.scrollTo(0, 0);
		document.getElementById("page"+(currentPage+1)).style.left = "100%";
		document.getElementById("page"+currentPage).style.left = "0";
		
		
		
	}
	
	
}


function setHeight(){

	var currentPageHeight = document.getElementById("page"+currentPage).offsetHeight;
	document.getElementById("wrapper").style.height = currentPageHeight+"px";

}

var btnRouteErstellen = document.getElementById('page1-btn-route-erstellen');	
var btnZurueck = document.getElementById('route-header-btn-back');

var zielgebietul = document.getElementById('zielgebiet-ul');
var zielgebietList = zielgebietul.children;

for(var i = 0; i < zielgebietList.length; i++)
{

	zielgebietList[i].addEventListener('mouseup',function(){nextSlide(3)});
	


}


var btnEigeneRoute = document.getElementById('page3-btn-eigene-route');

document.getElementById("overlaydiv").style.display = "block";
btnRouteErstellen.addEventListener('mouseup',function(){nextSlide(2)});
btnZurueck.addEventListener('mouseup',prevSlide);
btnEigeneRoute.addEventListener('mouseup',function(){
	nextSlide(4); 
	markersetzen();
	var point = new L.LatLng(currentZielgebiet.lat,currentZielgebiet.lon);
	if(polyline != undefined){
		maps.removeLayer(polyline);
		polyline = undefined;
	
	}

	maps.panTo(point);
	document.getElementById("overlaydiv").style.display = "block";
	myRoute.object.coords = [];
	myRoute.object.routename = "";
	myRoute.object.gpxID = "";
	
});

var touchYpos = 0;
var touchDifference = 0;
var scroll = false;

window.addEventListener('touchstart',function(evt){

	scroll = false;
	touchDifference = 0;
	touchYpos = evt.touches[0].clientY;
	

	


});


window.addEventListener('touchmove',function(evt){

	touchDifference = touchYpos - evt.touches[0].clientY;
	console.log(touchDifference);
	console.log(evt.screenY);

		if(Math.abs(touchDifference) > 10){
		
		scroll = true;

	}
	


});

window.addEventListener('touchend',function(evt){

	console.log(scroll);
});


function renderPage3(touchEvent){

	var el = touchEvent.target;
	var ort = el.getAttribute("ort");

	if(ort == null){

		el = el.parentNode;
		ort = el.getAttribute("ort");
		
	}

	document.getElementById("aktuelles_zeilgebiet").textContent = ort;

	currentZielgebiet.lat = el.getAttribute("lat");
	currentZielgebiet.lon = el.getAttribute("lon");

	// GPX Routen laden
	var json = {  "type":"requestGpx",
				  "coords":{
				  	"lat":el.getAttribute("lat"),
				  	"lon":el.getAttribute("lon")
			  }};

	console.log(json);

	ajax.connectCommunicator(json.type, json);

	
	


}

function renderMapGpx(route){

	myRoute.object.coords = route.coords;
	myRoute.object.routename = route.name;
	myRoute.object.gpxID = route.id;


	var coords = [];
	for(var i = 0; i <route.coords.length; i++){

		route.coords[i]
		point = new L.LatLng(route.coords[i].lat,route.coords[i].long);
		coords.push(point);

	}

	if(polyline == undefined){
		polyline = L.polyline(coords, {color: 'blue'}).addTo(maps);
	}else{
		polyline.setLatLngs(coords);
		
	}
	
	maps.fitBounds(polyline.getBounds());




}

document.getElementById('route-header-btn-check').addEventListener('click', function(){


	if( myRoute.object.gpxID == "" ){

		myRoute.object.coords = markerCoordsLesen();

	}

	if( myRoute.object.coords.length < 3 ){
		
		alert("Achtung! Es müssen mindestens 3 Punkte gesetzt werden");

	}else{

		myRoute.object.zielgebiet = document.getElementById("suchfeld").value;
		ls.saveMyRoute();
		window.location = 'route.html';
	}



});

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


if(name == "requestGpx"){

	var ul = document.getElementById("page3-db-routen");
	var header = document.getElementById("page3-gpx-routen-header");
	header.textContent = "";
	while(ul.firstChild){
		ul.removeChild(ul.firstChild);
	}	

	if(json.success){
		
		console.log(json);
		var ul = document.getElementById("page3-db-routen");
		for(var i = 0; i < json.routes.length;i++){
			
			var route = new Route(json.routes[i]);
			ul.appendChild(route.showLi());
			route.EventListener();
			
				
		}
		setHeight();
		header.textContent = "Es wurden "+json.routes.length+" Routen gefunden";



	}else{

		header.textContent = "Es wurde keine Route gefunden";
	}

	

}

if(name == "eigeneRoute"){

	console.log(json);

}



} 




}



//Funktionen von David aus map_script.js *********************************
function auswahl_Ziehlgebiet(bla){
console.log(bla);
maps.panTo([bla.jsonlatlong.lat, bla.jsonlatlong.lon]);

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
	/*var section_karte = document.getElementById("karte");*/
	var suchergebnisse = document.getElementById("zielgebiet-ul");
	while(suchergebnisse.firstChild){
		suchergebnisse.removeChild(suchergebnisse.firstChild);
	}
	if(json[0]){

	/*section_karte.style.display = "none";
	section_suchergebnisse.style.display = "block";*/
	for(var i=0; i<json.length;i++){
	var eintragP = document.createElement("p");
	var eintrag =  document.createTextNode("Eintrag "+(i+1));
	eintragP.appendChild(eintrag);
	var text = document.createTextNode(json[i].display_name);
	var textP = document.createElement("p");
	var unterstrich = document.createElement("li");
	textP.appendChild(text);
	//unterstrich.setAttribute("ontouchend", "trefferAnzeigen("+json[i].lat+","+json[i].lon+")");
	unterstrich.appendChild(eintragP);
	unterstrich.appendChild(textP);
	suchergebnisse.appendChild(unterstrich);
	jsonlatlong = {
		lat: json[i].lat,
		lon: json[i].lon
	};
	unterstrich.jsonlatlong = jsonlatlong;
	unterstrich.setAttribute("lat",json[i].lat );
	unterstrich.setAttribute("lon",json[i].lon );
	unterstrich.setAttribute("ort", json[i].display_name);
	unterstrich.addEventListener('click',function(evt){
	
	//auswahl_Ziehlgebiet(this);
	renderPage3(evt);
	nextSlide(3);
	},false);
	//suchergebnisse.appendChild(document.createElement("br"));
	}
	
	}
	else{
	var text = document.createTextNode("Es wurde kein Ort mit dieser Bezeichnung gefunden");
	var textP = document.createElement("p");
	var unterstrich = document.createElement("li");
	textP.appendChild(text);
	unterstrich.appendChild(textP);
	suchergebnisse.appendChild(unterstrich);
	}
	
	setHeight();
	console.log(window.innerHeight);
	
}



function getRouteAt(latitude, longitude)
{
	var json = {  "type":"requestGpx",
			  "coords":{
				  "lat":latitude,
				  "lon":longitude
			  }};
	
	var xmlhttp=new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState==4){
			json=JSON.parse(xmlhttp.responseText);
	
			renderGetRouteAtResponse(json)  //daten an die funktion render übergeben (render muss man selbst programmieren)
	
		}
	 };
	var jsonString = JSON.stringify(json);	
	xmlhttp.open("POST", "http://flock-0312.students.fhstp.ac.at/server/communicator.php?callback=meins", true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	//xmlhttp.send("json="+jsonString);
	console.log(jsonString);
	xmlhttp.send("json="+jsonString);
}

function renderGetRouteAtResponse(json)
{
	console.log(json);
}

function meins(json)
{
	console.log(json);
}


/*var lat=51;
var lng=0;

var positionOptions = {enableHighAccuracy:true};

var map = L.map('map',{zoomControl:false}).setView([lat, lng], 13);
map.zoomControl=false;
L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',{
     maxZoom: 18,
}).addTo(map);*/

/* Routen Class */



Route = function(json){

	this.name   = json.name;
	this.coords = json.coords;
	this.id 	= json.id; 
	this.el = null;


}

Route.prototype.showLi = function(){

	var el = document.createElement("li");
	el.textContent = this.name;
	el.setAttribute("routeID", this.id);
	this.el = el;
	return el;	

}

Route.prototype.EventListener = function(){

	var that = this;
	this.el.addEventListener("click",function(){
	document.getElementById("overlaydiv").style.display = "none";
		renderMapGpx(that);
		nextSlide(4);
		allowmarker = false;
			
	});
	

}