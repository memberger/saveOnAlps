<?php
require_once('config.inc.php');

try{
		
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASSWORD);
			
		} catch (PDOException $e){
		echo "Verbindung fehlgeschlagen";
		die();
		}





		$sql = "SELECT longitude, latitude, accu FROM locations WHERE route_id = '".$_GET['routeID']."'";

		$result = $db->query($sql);
		$db_result = $result->fetchAll();
		$zeile = $result->rowCount();
		
		if($zeile > 0){
		
			$count = 0;
			foreach($db_result as $i){
			
				$locations[] = array('long' => $i['longitude'],
										  'lat'  => $i['latitude'],
										  'accu' => $i['accu'] );
				//$count ++;
				

			}
			
				
			
		}

		
echo json_encode($locations);


?>