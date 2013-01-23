var routes=null;
var chosenRoute=null;

var ajax = {
communicatorURL : "http://flock-0312.students.fhstp.ac.at/server/communicator.php?callback=meins",
currentName : null,
connectCommunicator : function(pname,json){

	this.currentName = pname;
	
	var xmlhttp=new XMLHttpRequest();
	var that = this;
	
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState==4){
			//console.log(that.currentName);
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


	  if(name == "getAllRoutes"){
	  	if(json.success==true)
		{
			console.log("juhu");
			routes=json.routes;
			document.getElementById('routeCount').innerHTML=routes.length;
			document.getElementById('routeNumber').value=routes.length;
			chosenRoute=routes.length;
			updateMapMarkers();
		}
	  
	  }
	}
};
Array.prototype.foreach = function( callback ) {
  for( var k=0; k<this .length; k++ ) {
    callback( k, this[ k ] );
  }
}




var lat=48.204867;
var lng=15.626733;

var map = L.map('map',{zoomControl:false}).setView([lat, lng], 16);
var markers=new Array();

map.zoomControl=false;
L.tileLayer('http://a.tile.openstreetmap.org/{z}/{x}/{y}.png',{
	maxZoom: 18,
}).addTo(map);




function reLoad()
{
	var send_obj = {
	"type":"getAllRoutes",
	"object": {
		"hihi":"hoho"
	}

	}
	//getAllRoutes
	ajax.connectCommunicator("getAllRoutes", send_obj);
	
	
}

function updateID()
{
	
	chosenRoute=document.getElementById('routeNumber').value;
	
	while(document.getElementById('info-box').hasChildNodes())
	{
		document.getElementById('info-box').removeChild(document.getElementById('info-box').firstChild);
	}
	
	updateMapMarkers();
}

reLoad();

function updateMapMarkers()
{
	for(var marker in markers)
	{
		map.removeLayer(markers[marker]);
	}
	
	routes.foreach(function( rk, routeValue ) {
  		//console.log( rk + ' ' + routeValue );
		if(rk==chosenRoute)
		{
			var para=document.createElement('p');
			para.innerHTML="RouteID: "+routeValue.id+" | "+routeValue.name+" Ersteller: "+routeValue.ersteller+" | RouteInfo: "+routeValue.routeInfo+" | Code: "+routeValue.routeCode+" | GPX:"+routeValue.predefinedRouteId;
			document.getElementById('info-box').appendChild(para);
			
			
				for(var status in routeValue.status)
				{
					if(typeof routeValue.status[status].description!='undefined')
		  			{
					  var div=document.createElement('div');
					  div.innerHTML="Routestatus: "+routeValue.status[status].description+" | User: "+routeValue.status[status].user;
					  document.getElementById('info-box').appendChild(div);	
					}
			}
			
			if(typeof routeValue.coords!='undefined')
			{
			routeValue.coords.foreach(function( ck, coordsValue ) {
			//console.log(coordsValue.lat+" "+coordsValue.long);
			markers.push(L.circle([coordsValue.lat,coordsValue.long], coordsValue.accu/4, {
				color: 'red',
				fillColor: '#f03',
				fillOpacity: 0.1}));
				markers[markers.length-1].addTo(map).bindPopup("User: "+coordsValue.user+" |Akku: "+coordsValue.battery+" |Empfang: "+coordsValue.signalStrength);
				
			
			});
			}
			  
				
				//linien!
				
			  
			
			if(typeof routeValue.coords!='undefined')
			{
				console.log(routeValue.coords.length+" markers drawn");
			}
			else
			{
				console.log("keine Koordinaten vorhanden");
			}
		}
	});

}




