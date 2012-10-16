<? 
include("function.inc.php");
include("config.inc.php");
$newRouteId=stopRoute($_GET['route_id']);
//es wird true zurückgegeben!!
echo $newRouteId;
//echo "Sie haben eingegeben: Start: ".$_GET['start'].", Über: ".$_GET['ueber'].", Ziel: ".$_GET['ziel'].";   neue Route_id: ".$newRouteId; ?>