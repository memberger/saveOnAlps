<? 
include("function.inc.php");
include("config.inc.php");

if(isset($_GET['route_id']))
{
	$newRouteId=updateRoute($_GET['start'],$_GET['ueber'],$_GET['ziel'],$_GET['user_id'],$_GET['route_id']);
}
else
{
	$newRouteId=insertRoute($_GET['start'],$_GET['ueber'],$_GET['ziel'],$_GET['user_id']);
}
echo $newRouteId;
//echo "Sie haben eingegeben: Start: ".$_GET['start'].", Über: ".$_GET['ueber'].", Ziel: ".$_GET['ziel'].";   neue Route_id: ".$newRouteId; ?>