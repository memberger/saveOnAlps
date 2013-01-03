<?php
//AUTOR: BIBI
//database connection

//connect to mysql and selects database
function db_connect()
{	try{
		$db = new PDO('mysql:host=mysql5;dbname=db_flock-0312_1', "flock-0312", "tnWKKt8s");
		return $db;
	} 
	catch(PDOException $e) {
		return "Could not Connect to Server!";
	}
}

?>