var polyline;
var rect;


var route = { "type":"gpx",
			  "name":null,
			  "coords":[],
			  "latmin": null,
			  "latmax": null,
			  "lonmin": null,
			  "lonmax": null };

var lat=51;
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
	
	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET","temp_xml_files/"+filename,false);
	xmlhttp.send();
	var xmlDoc=xmlhttp.responseXML;

	var pointsAll = xmlDoc.getElementsByTagName("trkpt");

	var counter = 0;
	var point = null;
	var pointLat = null;
	var pointLon = null;

	

	route.coords = [];

	for (var i = 0; i < pointsAll.length ; i++){

		pointLat = parseFloat(pointsAll[i].getAttribute("lat"));
		pointLon = parseFloat(pointsAll[i].getAttribute("lon"));		

			if(i == 0){
				route.latmin = pointLat;
				route.latmax = pointLat;
				route.lonmin = pointLon;
				route.lonmax = pointLon;
		}else{

			if(pointLat < route.latmin){route.latmin = pointLat;}
			if(pointLat > route.latmax){route.latmax = pointLat;}

			if(pointLon < route.lonmin){route.lonmin = pointLon;}
			if(pointLon > route.lonmax){route.lonmax = pointLon;}	
		}


		point = new L.LatLng(pointsAll[i].getAttribute("lat"),pointsAll[i].getAttribute("lon"));

		route.coords.push(point);



	}

	var ueberweite = 0.008;

	route.latmin -= ueberweite;
	route.latmax += ueberweite;
	route.lonmin -= ueberweite;
	route.lonmax += ueberweite;	

	
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
	tn   = document.createTextNode("Anzahl von Koordinaten : "+route.coords.length);
	ptag.appendChild(tn);
	div.appendChild(ptag);

	ptag = document.createElement("p");
	tn   = document.createTextNode("min-Latitude : "+route.latmin);
	ptag.appendChild(tn);
	div.appendChild(ptag);

	ptag = document.createElement("p");
	tn   = document.createTextNode("max-Latitude : "+route.latmax);
	ptag.appendChild(tn);
	div.appendChild(ptag);

	ptag = document.createElement("p");
	tn   = document.createTextNode("min-Longitude : "+route.lonmin);
	ptag.appendChild(tn);
	div.appendChild(ptag);

	ptag = document.createElement("p");
	tn   = document.createTextNode("max-Longitude : "+route.lonmax);
	ptag.appendChild(tn);
	div.appendChild(ptag);

	var button = document.createElement("button");
	button.textContent = "Track in Datenbank speichern";
	button.addEventListener('mousedown', saveTrack );
	button.style.height = "50px";
	button.style.width  = "250px";
	div.appendChild(button);



	drawMap();
	


	}

function drawMap(){


	if(polyline == undefined){
		polyline = L.polyline(route.coords, {color: 'blue'}).addTo(map);
	}else{
		polyline.setLatLngs(route.coords);
		
	}

	if(rect == undefined){
		var bounds = [[route.latmin, route.lonmax], [route.latmax, route.lonmin]];
		rect = L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(map);
	}else{

		rect.setBounds([[route.latmin, route.lonmax], [route.latmax, route.lonmin]] );
	}
	
	
	
	map.fitBounds(rect.getBounds());

	var mapel = document.getElementById("map");
	mapel.style.visibility = "visible";


}

var saveTrack = function(){

	//console.log("drin");
	


var json = {  "type":"gpx",
			  "name": route.name,
			  "coords":[],
			  "latmin": route.latmin,
			  "latmax": route.latmax,
			  "lonmin": route.lonmin,
			  "lonmax": route.lonmax };

			  
	for( var i = 0; i < route.coords.length; i++)
	{
		var point = {"lat" : route.coords[i].lat, "lon" : route.coords[i].lng };
		
		json.coords[i] = point;

	}
	

	var jsonString = JSON.stringify(json);		  
		console.log(jsonString);
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange=function()
	{
		
		
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			console.log(xmlhttp.responseText);
			var obj = JSON.parse(xmlhttp.responseText);
			
			if(obj.success == true){
				
				alert("Speichern erfolgreich");

			}else{

				alert("Speichern fehlgeschlagen");
			}

			
		}
	}
	
	
	xmlhttp.open("POST", "../../server/communicator.php", true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	//xmlhttp.send("json="+jsonString);
	xmlhttp.send("json="+jsonString);

}

