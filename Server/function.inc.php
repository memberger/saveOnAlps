<?php
function checkLogin($user,$pw){
	
	try{
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASSWORD);	
	} catch (PDOException $e){
		echo "Verbindung fehlgeschlagen";
		die();
	}
	
	$user_exist=$db->query("SELECT * FROM user where screenname='".$user."' AND pwd='".$pw."';");
	//echo "SELECT * FROM user where screenname='".$user."' AND pwd='".$pw."';";
	if($user_exist)
	{
		$result = $user_exist -> fetchAll();
		foreach($result as $row){
			//echo $row['id'];
			$_SESSION['admin']=$row['admin'];
			$_SESSION['user_id']=$row['id'];
			if($row['disabled']==1)
			{
				return false;
			}
		}
		return true;
	}
	else
	{
		return false;
	}
}

function insertUser($user_object)
{
	try{
		
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASSWORD);
			
		} catch (PDOException $e){
		echo "Verbindung fehlgeschlagen";
		die();
		}
		$test=$db->query( "select MAX(user_id) from user" );
		$result = $test -> fetch();
		$new_user_id=$result['MAX(user_id)']+1;	
		
		$sql = "INSERT INTO `".DB_NAME."`.`user` (user_id,user_name,user_pwd,vorname,nachname,tel,email,strasse,hausnummer,plz,ort,land)
		VALUES (".$new_user_id.", '$user_object->user_name','$user_object->user_pwd','$user_object->vorname','$user_object->nachname','$user_object->tel','$user_object->email','$user_object->strasse','$user_object->hausnummer','$user_object->plz','$user_object->ort','$user_object->land');";
		
			$db->exec($sql);
		
		return $new_user_id;
}
function getUserById($user_object)
{
	try{
		
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASSWORD);
			
		} catch (PDOException $e){
		echo "Verbindung fehlgeschlagen";
		die();
		}
		$test=$db->query( "select user_id,user_name,user_pwd,vorname,nachname,tel,email,strasse,hausnummer,plz,ort,land from user where user_id='$user_object->user_id'" );
		$result = $test -> fetch();
		
		$read_user=array(
		'user_id'=>$result['user_id'],
		'user_name'=>$result['user_name'],
		'vorname'=>$result['nachname'],
		'tel'=>$result['tel'],
		'email'=>$result['email'],
		'strasse'=>$result['strasse'],
		'hausnummer'=>$result['hausnummer'],
		'plz'=>$result['plz'],
		'ort'=>$result['ort'],
		'land'=>$result['land']		
		);
		return json_encode($read_user);
}
function getUserByUsernamePassword($user_object)
{
	try{
		
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASSWORD);
			
		} catch (PDOException $e){
		echo "Verbindung fehlgeschlagen";
		die();
		}
		$test=$db->query( "select user_id,user_name,user_pwd,vorname,nachname,tel,email,strasse,hausnummer,plz,ort,land from user where user_name='$user_object->user_name' AND password='$user_object->password'" );
		$result = $test -> fetch();
		
		$read_user=array(
		'user_id'=>$result['user_id'],
		'user_name'=>$result['user_name'],
		'vorname'=>$result['nachname'],
		'tel'=>$result['tel'],
		'email'=>$result['email'],
		'strasse'=>$result['strasse'],
		'hausnummer'=>$result['hausnummer'],
		'plz'=>$result['plz'],
		'ort'=>$result['ort'],
		'land'=>$result['land']		
		);
		return json_encode($read_user);
}

function insertRoute($start,$ueber,$ziel,$user_id){
		try{
		
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASSWORD);
			
		} catch (PDOException $e){
		echo "Verbindung fehlgeschlagen";
		die();
		}
		
		$test=$db->query( "select MAX(route_id) from route" );
		$result = $test -> fetch();
		$new_route_id=$result['MAX(route_id)']+1;	
		
		$sql = "INSERT INTO `".DB_NAME."`.`route` (route_id, start, ueber, ziel)
		VALUES (".$new_route_id.", '$start','$ueber','$ziel');";
		
		$db->exec($sql);
		
		//route_join_status wird auf 0 gesetzt, d.h. started
		$sql = "INSERT INTO `".DB_NAME."`.`route_join_status` (route_id, route_status_id)
		VALUES (".$new_route_id.", '0');";
		
		$db->exec($sql);
		
		//in user_route muss noch die Verbindung hergestellt werden
		$sql = "INSERT INTO `".DB_NAME."`.`user_route` (user_id, route_id)
		VALUES ($user_id,".$new_route_id.");";
		
		$db->exec($sql);
		//Die neue route_id wird zurückgegeben!
		return $new_route_id;
}

function updateRoute($start,$ueber,$ziel,$user_id,$route_id){
		try{
		
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASSWORD);
			
		} catch (PDOException $e){
		echo "Verbindung fehlgeschlagen";
		die();
		}
		
		$sql="UPDATE `".DB_NAME."`.`route` SET start='$start', ueber='$ueber', ziel='$ziel' WHERE route_id='$route_id'";
		
		$db->exec($sql);
		
		//route_join_status wird auf 3 gesetzt, d.h. geändert
		$sql = "INSERT INTO `".DB_NAME."`.`route_join_status` (route_id, route_status_id)
		VALUES (".$route_id.", '3');";
		
		$db->exec($sql);
		//Die neue route_id wird zurückgegeben!
		return $route_id;
}


function stopRoute($route_id){
		try{
		
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASSWORD);
			
		} catch (PDOException $e){
		echo "Verbindung fehlgeschlagen";
		die();
		}
		//1 als route_status_id heißt: ended	
		$sql = "INSERT INTO `".DB_NAME."`.`route_join_status` (route_id, route_status_id)
		VALUES (".$route_id.", '1');";
		
		$db->exec($sql);
		//
		return true;
}

function insertLocation($long,$lat,$accu,$user_id,$route_id,$battery,$signalStrength){
		try{
		
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASSWORD);
			
		} catch (PDOException $e){
		echo "Verbindung fehlgeschlagen";
		die();
		}
		
		$test=$db->query( "select MAX(location_id) from locations" );
		$result = $test -> fetch();
		$new_loc_id=$result['MAX(location_id)']+1;	
		
		$sql = "INSERT INTO `".DB_NAME."`.`locations` (location_id, user_id, route_id, longitude, latitude, accu, battery, signalStrength)
		VALUES (".$new_loc_id.", $user_id,$route_id, $long, $lat, $accu,$battery,$signalStrength);";
		
		$db->exec($sql);
		//Derzeit wird noch der insert-string zurückgegeben
		//xxx muss geändert werden
		return $sql;
		//return $new_loc_id;
}
function insertNotfall($user_id,$route_id,$long,$lat,$accu)
{
	try{
		
		$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USER,DB_PASSWORD);
			
		} catch (PDOException $e){
		echo "Verbindung fehlgeschlagen";
		die();
		}
		
		$test=$db->query( "select MAX(notfall_id) from notfall" );
		$result = $test -> fetch();
		$new_notfall_id=$result['MAX(notfall_id)']+1;	
		
		
		$sql = "INSERT INTO `".DB_NAME."`.`notfall` (notfall_id, user_id, route_id, longitude, latitude, accu)
		VALUES (".$new_notfall_id.", $user_id,$route_id, $long, $lat, $accu);";
		
		$db->exec($sql);
		//Derzeit wird noch der insert-string zurückgegeben
		//xxx muss geändert werden
		//2 als route_status_id heißt: emergency	
		$sql = "INSERT INTO `".DB_NAME."`.`route_join_status` (route_id, route_status_id)
		VALUES (".$route_id.", '2');";
		
		$db->exec($sql);
		
		
		return $new_notfall_id;
		//return $new_loc_id;
}



//Diese Funktion benötigt eine userid als Parameter und wird von dem cronjob aufgerufen, der nachsieht, ob ein User
//eventuell in Gefahr wäre
//Rückgabe: true, wenn erfolgreich, false wenn nicht. 
function benachrichtigeNotfallKontakte($userid)
{
	
	
	return true;
}

//Gibt eine Liste (JSON xxx)der Routen zurück, die ein User in der DB gespeichert hat. 
//benötigt als Parameter die userid
//Wird für eine Schnittstelle benötigt, die für das WebInterface benötigt wird
function getRoutes($userid)
{
	
}

//Gibt eine Liste (JSON xxx) der Orte zu einer Route zurück. 
//benötigt wird die Routeid. 
//Wird für eine Schnittstelle benötigt, die für das Webinterface benötigt wird. 
function getLocations($routeid)
{
	
}

//Hier wird die zuletzt eingefügte Position ausgelesen (JSON xxx)
//benötigt userId
//wird eventuell für die Schnittstelle zu Rettungsdiensten benötigt. Kann auch während der
//Notfallkontaktbenachrichtigung sinnvoll sein. 
function getLastLocation($userid)
{
}
?>