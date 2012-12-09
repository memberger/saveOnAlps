<?php
//AUTOR: BIBI
//database connection

//connect to mysql and selects database
function db_connect()
{	try{
		$db = new PDO('mysql:host=mysql5;dbname=db_flock-0312_1', "flock-0312", "7wH4FWxL");
		return $db;
	} 
	catch(PDOException $e) {
		return "Could not Connect to Server!";
	}
}

?>