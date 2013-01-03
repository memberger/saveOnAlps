<?php

require_once('database.php');

class Main 
{	//Attributes
	

	private static $loggedInUser; //instance of User - the currently logged in user
	
	//AUTOR: BIBI
	//proves if the LogIn data is valid and if so
	//returns every info about the user + his/her achieved trophies AND
	//an gerneral trophy list (for the client to know when a trophy is achieved during a game)
	//RETURN VALUE: JSON OBJECT
	public static function login($email,$password)
	{	$con = db_connect();
	
		$statement = $con->prepare("Select password, user_id from user where email = ?");
		$statement->execute(array($email));
		$result = $statement;
	
	
		if($result->rowCount()==1) //user mail was correct
		{	$row = $result->fetch(PDO::FETCH_ASSOC);

			if($row['password']==hash('sha256',$password))
				return $row['user_id']; //valid logIn
			else
				return "e103"; //Wrong password
		}
		else //user mail was not correct!!
			return "e102";
	}
	
	//AUTOR: BIBI
	//registers a new user
	//RETURN VALUE: string - error code or OK
	public static function register($email, $password, $username)
	{	$con = db_connect();
	
		if(!is_string($con))
		{	//Step 1 see if mail adress is not already registered
			$statement = $con->prepare("Select * from user where email= ?");
			$statement->execute(array($email));
			$result = $statement;
			
			if($result->rowCount()!=0)//if a result was found --> mail already registered!!
				return "e101";
			else
			{	//if everything is ok then insert
				$query = "Insert into user (email,username,password) values (?,?,?)";
				$statement = $con->prepare($query);
				$statement->execute(array($email,$username,hash('sha256',$password)));
				$id = $con->lastInsertId();
				return "OK";
			}
		}
		else
			return "e100";
	}
	
	
	//This function parses the Request JSON oject and depending on which type of Request
	//calls the necessary mehtods, functions.... and finally returns a appropriate response JSON object
	//PARAMETERS: string $type - type of request
	//            object $obj - the request JSON object
	//RETURN VALUE: JSON OBJECT
	public static function allocateJSON($type,$obj)
	{	switch($type)
			{
			case 'register':
				$registerobj=$obj['object'];
					$ret = Main::register($registerobj['email'],$registerobj['password'],$registerobj['username']); //call register function
					if($ret != "OK")
						$data = array('type'=>'User','loggedInUser'=>array('error'=>$ret));
					else
						$data = Main::allocateJSON('login',$registerobj);
					break;
			case 'login':
			$loginobj=$obj['object'];
					$ret = Main::login($loginobj['email'],$loginobj['password']);
					if(!is_numeric($ret))
						$data = array('type'=>'User','loggedInUser'=>array('error'=>$ret));
					else
						$data = array('type'=>'User','loggedInUser'=>array('password'=>$loginobj['password']),'userID'=>$ret);				
					break;
			//Autor:tom
			case 'gpx':
					$ret=Main::insertGPX($obj);
					if(!is_numeric($ret))
					{
						$data = array('success'=>'false','loc'=>array('error'=>$ret));
					}
					else
					{
						$obj['id']=$ret;
						$obj['success']=true;
						$data=$obj;
					}
					//$data=$obj;
					break;
			case 'requestGpx':
					{
						$ret=Main::getGPX($obj['coords']);
						if(!is_numeric($ret))
						{
						  $data = array('success'=>false);
					  	}
					  	else
					  	{
						  
						  $data=$ret;
					 	}
					}
			case 'eigeneRoute':
					$ret=Main::insertOwnRoute($obj);
					if(!is_numeric($ret))
						{
						  $data = array('success'=>false);
					  	}
					  	else
					  	{
						  
						  $data=$ret;
						  $data['success']=true;
					 	}
					break;
			default: 
					$data=array('success'=>false, 'data'=>$obj);
					break;
			
			
		}
		
		return $data;
	}

	
	//creates a new Log Entry out of the relevant data
	public static function createNewLogEntry()
	{
	}
	
	public static function insertGPX($obj)
	{
		$con = db_connect();
		
		if(!is_string($con))
		{	//Step 1 see if mail adress is not already registered
			$statement = $con->prepare("Select * from predefinedRoute where predefinedName= ?");
			$statement->execute(array($obj['name']));
			$result = $statement;
			$routeid=0;
			
			if($result->rowCount()!=0)//if a result was found --> mail already registered!!
				return "e101";
			else
			{	
				
				//if everything is ok then insert
				$query = "Insert into predefinedRoute (predefinedName,maxLatitude,maxLongitude,minLatitude,minLongitude) values (?,?,?,?,?)";
				$statement = $con->prepare($query);
				$statement->execute(array($obj['name'],$obj['latmax'],$obj['lonmax'],$obj['latmin'],$obj['lonmin']));
				$routeid = $con->lastInsertId();
				
				$coords=$obj['coords'];
				for($i=0; $i<count($coords); $i++)
				{
					$locCoords=$coords[$i];
					$query = "Insert into location (latitude,longitude) values (?,?)";
					$statement = $con->prepare($query);
					$statement->execute(array($locCoords['lat'],$locCoords['lon']));
					$locid = $con->lastInsertId();
					
					$query = "Insert into predefinedPoint (location_idlocation,predefinedRoute_idpredefinedRoute, pointNr) values (?,?,?)";
					$statement = $con->prepare($query);
					$statement->execute(array($locid,$routeid,$i));
					
				}
				
				
				return $routeid;
				
				
			}
		}
		else
			return "e100";
	}
	
	public static function insertOwnRoute($obj)
	{
		$con = db_connect();
		
		if(!is_string($con))
		{	//Step 1
			//checkCode
			
			$code=rand();
			$foundCode=false;
			while(!$foundCode)
			{
			  $statement = $con->prepare("Select * from route where routeCode= ?");
			  $statement->execute(array($obj['name']));
			  $result = $statement;
			  if($result->rowCount()==0)
			  {
				  $foundCode=true;
			  }
			}
		
			$statement = $con->prepare("insert into route (user_iduser, routeInfo,routeCode,predefinedRoute_idpredefineRoute,richtigeRichtung values(?,?,?,?,?,?)");
			$statement->execute(array($obj['userID'],$obj['info'],$code,$obj['gpxID'],$obj['richtigeRichtung']));
			$result = $statement;
			$routeid = $con->lastInsertId();	
			
				//if everything is ok then insert
				$query = "Insert into route_has_status (route_idroute,routesStatus_idrouteStatus,user_iduser) values (?,?,?)";
				$statement = $con->prepare($query);
				$statement->execute(array($routeid,0,$obj['userID']));
				
				$coords=$obj['coords'];
				for($i=0; $i<count($coords); $i++)
				{
					$locCoords=$coords[$i];
					$query = "Insert into location (latitude,longitude) values (?,?)";
					$statement = $con->prepare($query);
					$statement->execute(array($locCoords['lat'],$locCoords['long']));
					$locid = $con->lastInsertId();
					
					$query = "Insert into registeredRoute (idlocatin,idroute,pointNr) values (?,?,?)";
					$statement = $con->prepare($query);
					$statement->execute(array($locid,$routeid,$i));
					
				}
				
				
				return array('routeID'=>$routeid,'success'=>true,'code'=>$code);
				
				
			
		}
		else
			return "e100";
	}
	
	
	
	public static function getGPX($obj)
	{
		$con = db_connect();
		
		if(!is_string($con))
		{	//
				$query = $con->prepare("Select * from predefinedRoute where maxLatitude>= ? AND maxLongitude>=? AND minLatitude<=? AND min Longitude<=?");
			
				$statement = $con->prepare($query);
				$statement->execute(array($obj['lat'],$obj['lon'],$obj['lat'],$obj['lon']));
				$result = $statement;
				$data=array(success=>true,'routes'=>array());
				$i=0;
				while($row = $result->fetch(PDO::FETCH_ASSOC))
				{	
					$pRouteID=$row['idpredefinedRoute'];
					$pRouteName=$row['predefinedName'];
					$pmaxLat=$row['maxLatitude'];
					$pmaxLon=$row['maxLongitude'];
					$pminLat=$row['minLatitude'];
					$pminLon=$row['minLongitude'];
					$data['routes'][$i]=array('id'=>$pRouteID,'name'=>$pRouteName);
					
					
					$newquery = $con->prepare("Select latitude,longitude from location join predefinedPoint on idlocation=location_idlocation where predefinedRoute_idpredefineRoute=? ORDER BY pointNr ASC");
					
					$newstatement = $con->prepare($newquery);
					$newstatement->execute(array($pRouteID));
					$result = $statement;
		
					while($locrow = $result->fetch(PDO::FETCH_ASSOC))
					{	
							
							array_push($data['routes'][$i]['coords'],array('lat'=>$locrow['latitude'],'long'=>$locrow['longitude']));	
							//$locrow['latitude'].$locrow['longitude'];
					}
					
					
					$i++;
				}
				
				return $data;
				
				
			
		}
	}
	
	 	
}



?>