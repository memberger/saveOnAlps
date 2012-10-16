<? 
include("function.inc.php");
include("config.inc.php");
//$long,$lat,$accu,$user_id,$route_id,$battery,$signalStrength
$newlocID=insertLocation($_GET['long'],$_GET['lat'],$_GET['accu'],$_GET['user_id'],$_GET['route_id'],$_GET['battery'],$_GET['signalStrength']);
echo "Es wurde ermittelt: long ".$_GET['long'].", lat: ".$_GET['lat'].", accu: ".$_GET['accu'].";   neue LocationID: ".$newlocID; ?>