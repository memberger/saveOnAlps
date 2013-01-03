
var pages = 4;
var currentPage = 1;

var map = document.getElementById('map');

//map.style.height = window.innerHeight+"px";
//map.style.width  = window.innerWidth+"px";


/*window.addEventListener('load', function(){
	window.scrollTo(0, 0);
	

});*/


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

var prevSlide = function(routeID){
	
	console.log(currentPage);


	if(currentPage > 1 && scroll == false){
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


btnRouteErstellen.addEventListener('mouseup',function(){nextSlide(2)});
btnZurueck.addEventListener('mouseup',prevSlide);
btnEigeneRoute.addEventListener('mouseup',function(){nextSlide(4); markersetzen();});


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

	console.log(ort);
	

	document.getElementById("aktuelles_zeilgebiet").textContent = ort;

	
	



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




/*var lat=51;
var lng=0;

var positionOptions = {enableHighAccuracy:true};

var map = L.map('map',{zoomControl:false}).setView([lat, lng], 13);
map.zoomControl=false;
L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',{
     maxZoom: 18,
}).addTo(map);*/