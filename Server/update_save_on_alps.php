<?php

require_once('config.inc.php');



$userID = 0;
$routeID = 0;

$route_start = "";
$route_ueber = "";
$route_ziel  = "";

$notfall_tel  = "";
$notfall_mail = "";
$notfall_vor  = "";
$notfall_nach = "";

$notfall_user = "";
$notfall_long = "";
$notfall_lat  = "";
$notfall_accu = "";
$notfall_time = "";

$location_long   	  = "";
$location_lat 		  = "";
$location_time 		  = "";
$location_accu 		  = "";
$location_battery     = "";
$location_connection  = "";

try{
		
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASSWORD);
			
		} catch (PDOException $e){
		echo "Verbindung fehlgeschlagen";
		die();
		}

			
		$sql = "SELECT route_id FROM route";
		
		$result = $db->query($sql);
		$db_result = $result->fetchAll();
		$zeile = $result->rowCount();
		
		if($zeile > 0){
		
			foreach($db_result as $i){
			
				$current_route_id = $i['route_id'];

			}
			
				
			
		}
		
		//Route auslesen
		
		$routeID = $current_route_id;
		
		$sql = "SELECT start, ueber, ziel FROM route WHERE route_id = '".$current_route_id."'";

		$result = $db->query($sql);
		$db_result = $result->fetchAll();
		$zeile = $result->rowCount();
		
		if($zeile > 0){
		
			foreach($db_result as $i){
			
				$route_start = $i['start'];
				$route_ueber = $i['ueber'];
				$route_ziel = $i['ziel'];

			}
			
				
			
		}
		
		//Notfall Kontakt auslesen
		
		
		$sql = "SELECT notfall_tel, notfall_mail, notfall_vor, notfall_nach FROM notfallkontakt WHERE user_id = '".$userID."'";

		$result = $db->query($sql);
		$db_result = $result->fetchAll();
		$zeile = $result->rowCount();
		
		if($zeile > 0){
		
			foreach($db_result as $i){
			
				$notfall_tel  = $i['notfall_tel'];
				$notfall_mail = $i['notfall_mail'];
				$notfall_vor  = $i['notfall_vor'];
				$notfall_nach = $i['notfall_nach'];

			}
			
				
			
		}
		
		//eventuell noch User auslesen
		
		
		
		//Notfall!
		
		
		$sql = "SELECT user_id, longitude, latitude, accu, timestamp FROM notfall WHERE user_id = '".$userID."'";

		$result = $db->query($sql);
		$db_result = $result->fetchAll();
		$zeile = $result->rowCount();
		
		if($zeile > 0){
		
			foreach($db_result as $i){
			
				$notfall_user = $i['user_id'];
				$notfall_long = $i['longitude'];
				$notfall_lat  = $i['latitude'];
				$notfall_accu = $i['accu'];
				$notfall_time = $i['timestamp'];

			}
			
				
			
		}	
		
		
		//Locations
		$sql = "SELECT location_id, longitude, latitude, timestamp, accu, battery, signalStrength FROM locations WHERE user_id = '".$userID."' AND route_id = '".$routeID."'";

		$result = $db->query($sql);
		$db_result = $result->fetchAll();
		$zeile = $result->rowCount();
		
		if($zeile > 0){
		
			$locID = 0;
		
			foreach($db_result as $i){
			
				if($i['location_id'] > $locID){
				$locID = $i['location_id'];
				
				$location_long   	  = $i['longitude'];
				$location_lat 		  = $i['latitude'];
				$location_time 		  = $i['timestamp'];
				$location_accu 		  = $i['accu'];
				$location_battery     = $i['battery'];
				$location_connection  = $i['signalStrength'];
				
				}

			}
			
				
			
		}
		


		
			
		
		$json = array (
		'userID'  => $userID,
		'routeID' => $routeID,

		'route_start' => $route_start,
		'route_ueber' =>$route_ueber,
		'route_ziel'  =>$route_ziel,

		'notfall_tel'     => $notfall_tel,
		'notfall_mail'    => $notfall_mail,
		'notfall_vorname' =>$notfall_vor,
		'notfall_nachname'=>$notfall_nach,

		'notfall_user' =>$notfall_user,
		'notfall_long' =>$notfall_long,
		'notfall_lat'  =>$notfall_lat,
		'notfall_accu' =>$notfall_accu,
		'notfall_time' =>$notfall_time,
		
		'location_long'       =>$location_long,
		'location_lat'        =>$location_lat,
		'location_time'       =>$location_time,
		'location_accu'       =>$location_accu,
		'location_battery'    =>$location_battery,
		'location_connection' =>$location_connection
			
		
		);
		
		echo json_encode($json);



?>