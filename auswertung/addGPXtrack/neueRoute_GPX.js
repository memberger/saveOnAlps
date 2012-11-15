var polyline;
var rect;


var route = { "name":null,
			  "text":null,
			  "points":[],
			  "latMin": null,
			  "latMax": null,
			  "lonMin": null,
			  "lonMax": null };

var lat=0;
var lng=0;

var positionOptions = {enableHighAccuracy:true};

var map = L.map('map',{zoomControl:false}).setView([lat, lng], 13);
map.zoomControl=false;
L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',{
     maxZoom: 18,
}).addTo(map);


function saveXML(){

	var elFile = document.getElementById("gpx-file");
	var file = elFile.files[0];

	var elName = document.getElementById("route-name");

	if(elName.value != "" && elFile != "")
	{
	
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=function()
		{
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				if(xmlhttp.responseText != "error")
				{
					createJSON(xmlhttp.responseText);
				}
				
			}
		}
	
	
	    var fd = new FormData;
	    
	    fd.append("File", file);
	    xmlhttp.open("POST", "saveXML.php", true);
	    xmlhttp.send(fd);
	
	
	}else{

		var div = document.getElementById("info-box");
	
		while(div.firstChild){
			div.removeChild(div.firstChild);
		}
		
		
		var ptag = document.createElement("p");
		var tn   = document.createTextNode("Kein Name oder Kein File");
		ptag.appendChild(tn);
		div.appendChild(ptag);
				
	}
}




function createJSON(filename){
	

	route.name = document.getElementById("route-name").value;
	route.text = document.getElementById("route-text").value;
	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET","temp_xml_files/"+filename,false);
	xmlhttp.send();
	var xmlDoc=xmlhttp.responseXML;

	var pointsAll = xmlDoc.getElementsByTagName("trkpt");

	var counter = 0;
	var point = null;
	var pointLat = null;
	var pointLon = null;

	

	route.points = [];

	for (var i = 0; i < pointsAll.length ; i++){

		pointLat = parseFloat(pointsAll[i].getAttribute("lat"));
		pointLon = parseFloat(pointsAll[i].getAttribute("lon"));		

			if(i == 0){
				route.latMin = pointLat;
				route.latMax = pointLat;
				route.lonMin = pointLon;
				route.lonMax = pointLon;
		}else{

			if(pointLat < route.latMin){route.latMin = pointLat;}
			if(pointLat > route.latMax){route.latMax = pointLat;}

			if(pointLon < route.lonMin){route.lonMin = pointLon;}
			if(pointLon > route.lonMax){route.lonMax = pointLon;}	
		}


		point = new L.LatLng(pointsAll[i].getAttribute("lat"),pointsAll[i].getAttribute("lon"));

		route.points[counter] = point;
		counter++;

	}

	var ueberweite = 0.008;

	route.latMin -= ueberweite;
	route.latMax += ueberweite;
	route.lonMin -= ueberweite;
	route.lonMax += ueberweite;	

	
	console.log(route);

	var div = document.getElementById("info-box");

	while(div.firstChild){
		div.removeChild(div.firstChild);
	}
	
	
	var ptag = document.createElement("p");
	var tn   = document.createTextNode("Routen Name : "+route.name);
	ptag.appendChild(tn);
	div.appendChild(ptag);

	ptag = document.createElement("p");
	tn   = document.createTextNode("Anzahl von Koordinaten : "+route.points.length);
	ptag.appendChild(tn);
	div.appendChild(ptag);

	ptag = document.createElement("p");
	tn   = document.createTextNode("min-Latitude : "+route.latMin);
	ptag.appendChild(tn);
	div.appendChild(ptag);

	ptag = document.createElement("p");
	tn   = document.createTextNode("max-Latitude : "+route.latMax);
	ptag.appendChild(tn);
	div.appendChild(ptag);

	ptag = document.createElement("p");
	tn   = document.createTextNode("min-Longitude : "+route.lonMin);
	ptag.appendChild(tn);
	div.appendChild(ptag);

	ptag = document.createElement("p");
	tn   = document.createTextNode("max-Longitude : "+route.lonMax);
	ptag.appendChild(tn);
	div.appendChild(ptag);

	ptag = document.createElement("p");
	tn   = document.createTextNode("Text zur Route : "+route.text);
	ptag.appendChild(tn);
	div.appendChild(ptag);



	drawMap();
	


	}

function drawMap(){


	if(polyline == undefined){
		polyline = L.polyline(route.points, {color: 'blue'}).addTo(map);
	}else{
		polyline.setLatLngs(route.points);
		
	}

	if(rect == undefined){
		var bounds = [[route.latMin, route.lonMax], [route.latMax, route.lonMin]];
		rect = L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(map);
	}else{

		rect.setBounds([[route.latMin, route.lonMax], [route.latMax, route.lonMin]] );
	}
	
	
	
	map.fitBounds(rect.getBounds());

	var mapel = document.getElementById("map");
	mapel.style.visibility = "visible";




}

