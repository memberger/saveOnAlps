<? 
include("function.inc.php");
include("config.inc.php");
//$user_id, $route_id, long, lat, accu
$newlocID=insertNotfall($_GET['user_id'],$_GET['route_id'],$_GET['long'],$_GET['lat'],$_GET['accu']);

echo "Ein Notfall wurde eingetragen: user_id: ".$_GET['user_id'].", route_id: ".$_GET['route_id'].", long: ".$_GET['long'].", lat: ".$_GET['lat'].", accu: ".$_GET['accu']."return: ".$newlocID.""; ?>