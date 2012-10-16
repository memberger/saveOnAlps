var route_id=0;
var user_id=0;
var last_update="00:00:00";

function getXMLHttp()
{
  var xmlHttp

  try
  {
    //Firefox, Opera 8.0+, Safari
    xmlHttp = new XMLHttpRequest();
  }
  catch(e)
  {
    //Internet Explorer
    try
    {
      xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch(e)
    {
      try
      {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      catch(e)
      {
        alert("Your browser does not support AJAX!")
        return false;
      }
    }
  }
  return xmlHttp;
}

function insertRouteRequest()
{
  var xmlHttp = getXMLHttp();
 
  xmlHttp.onreadystatechange = function()
  {
    if(xmlHttp.readyState == 4)
    {
      HandleRouteResponse(xmlHttp.responseText);
    }
  }
	var start=document.getElementById('start').value;
	var ueber=document.getElementById('ueber').value;
	var ziel=document.getElementById('ziel').value;
	//alert("insertRoute.php?start='"+start+"'&ueber='"+ueber+"'&ziel='"+ziel+"'");
 	xmlHttp.open("GET", "mt102002.students.fhstp.ac.at/saveOnAlps/insertRoute.php?start="+start+"&ueber="+ueber+"&ziel="+ziel, true);
  	xmlHttp.send(null);
}
function insertLocationRequest()
{
	var xmlHttp = getXMLHttp();
 
  xmlHttp.onreadystatechange = function()
  {
    if(xmlHttp.readyState == 4)
    {
      HandleLocationResponse(xmlHttp.responseText);
    }
  }
	var long=document.getElementById('long').value;
	var lat=document.getElementById('lat').value;
	var accu=document.getElementById('accu').value;
	//alert("insertLocation.php?long="+long+"&lat="+lat+"&accu="+accu+"&user_id="+user_id+"&route_id="+route_id);
 	xmlHttp.open("GET", "mt102002.students.fhstp.ac.at/saveOnAlps/insertLocation.php?long="+long+"&lat="+lat+"&accu="+accu+"&user_id="+user_id+"&route_id="+route_id, true);
  	xmlHttp.send(null);
}