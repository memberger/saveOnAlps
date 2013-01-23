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
	
		$statement = $con->prepare("Select userPwd, iduser from user where userName = ?");
		$statement->execute(array($email));
		$result = $statement;
		//echo $email." ".$password;
	
		if($result->rowCount()==1) //user mail was correct
		{	$row = $result->fetch(PDO::FETCH_ASSOC);
			if($row['userPwd']==hash('sha256',$password))
				return $row['iduser']; //valid logIn
			else
				return "e103"; //Wrong password
		}
		else //user mail was not correct!!
			return "e102";
	}
	
	//AUTOR: BIBI
	//registers a new user
	//RETURN VALUE: string - error code or OK
	public static function register($username, $password)
	{	$con = db_connect();
	
		if(!is_string($con))
		{	//Step 1 see if mail adress is not already registered
			$statement = $con->prepare("Select * from user where userName= ?");
			$statement->execute(array($username));
			$result = $statement;
			
			if($result->rowCount()!=0)//if a result was found --> mail already registered!!
				return "e101";
			else
			{	//if everything is ok then insert
				$query = "Insert into user (userName, userPwd, vorname, nachname, tel, strasse, hausnummer, plz, ort, land) values (?,?,?,?,?,?,?,?,?,?)";
				$statement = $con->prepare($query);
				$statement->execute(array($username,hash('sha256',$password),'','',0,'','',0,'',''));
				$id = $con->lastInsertId();
				//echo $username." ".$password;
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
						$data = Main::allocateJSON('login',$obj);
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
						$ret=Main::getGPX($obj['coords']['lat'],$obj['coords']['lon']);
						if(is_numeric($ret))
						{
						  $data = array('success'=>false, 'type'=>'requestGpx', 'ret'=>$ret);
					  	}
					  	else
					  	{
						  
						  $data=$ret;
					 	}
						break;
					}
			case 'eigeneRoute':
					$ret=Main::insertOwnRoute($obj['object']);
					if(is_numeric($ret))
						{
						  $data = array('success'=>false, 'type'=>'ownRoute', 'error'=>$ret);
					  	}
					  	else
					  	{
						  
						  $data=$ret;
						  $data['success']=true;
					 	}
					break;
			case 'RouteStarten':
					$ret=Main::startRoute($obj['object']);
					$data=$ret;
					 	
					break;
			case 'RouteBeitreten':
					$ret=Main::routeBeitreten($obj['object']);
					$data=$ret;
					break;		
					
			case 'RouteNotfall':
					$ret=Main::routeNotfall($obj['object']);
					$data=$ret;
					break;
			case 'insertLoc':
					$ret=Main::routeLocation($obj['object']);
					$data=$ret;
					break;	
			case 'Notfallkontakt':
					$ret=Main::insertNotfallkontakt($obj['object']);
					$data=$ret;
					break;	
			case 'getNotfallkontakt':
					$ret=Main::getNotfallkontakt($obj['object']);
					$data=$ret;
					break;	
			case 'getAllRoutes':
					$ret=Main::getAllRoutes($obj['object']);
					$data=$ret;
					break;
			case 'getRouteById':
					break;							
			default: 
					$data=array('success'=>false,'type'=>$type, 'data'=>$obj);
					break;
			
			
		}
		
		return $data;
	}
	public static function getAllRoutes($obj)
	{
		$con = db_connect();
		
		if(!is_string($con))
		{	//
		
				$statement = $con->prepare("Select * from route join user on user_iduser=iduser");
				$statement->execute(array($lat,$lon,$lat,$lon));
				$result = $statement;
				$data=array('routes'=>array());
				$i=0;
				while($row = $result->fetch(PDO::FETCH_ASSOC))
				{	
					$pRouteID=$row['idroute'];
					$pRouteName=$row['routeName'];
					$pUserRoute=$row['userName'];
					$pRouteInfo=$row['routeInfo'];
					$pRouteCode=$row['routeCode'];
					$predefinedRouteId=$row['predefinedRoute_idpredefinedRoute'];
					$prichtigeRichtung=$row['richtigeRichtung'];
					$data['routes'][$i]=array('id'=>$pRouteID,'name'=>$pRouteName,'ersteller'=>$pUserRoute,'routeInfo'=>$pRouteInfo,'routeCode'=>$pRouteCode,'predefinedRouteId'=>$predefinedRouteId,'richtigeRichtung'=>$prichtigeRichtung);
					$data['success']=true;
					
					$newquery = "Select latitude,longitude,accuracy,userName,battery,signalStrength from location join routeLoc on idlocation=location_idlocation join user on user_iduser=iduser where route_idroute=? ORDER BY idlocation ASC";
					
					$newstatement = $con->prepare($newquery);
					$newstatement->execute(array($pRouteID));
					$newresult = $newstatement;
					
					$j=0;
					while($locrow = $newresult->fetch(PDO::FETCH_ASSOC))
					{	
							
							$data['routes'][$i]['coords'][$j]=array('lat'=>$locrow['latitude'],'long'=>$locrow['longitude'],'accu'=>$locrow['accuracy'],'user'=>$locrow['userName'],'battery'=>$locrow['battery'],'signalStrength'=>$locrow['signalStrength']);
							$j++;	
							//$locrow['latitude'].$locrow['longitude'];
					}
					
					$statusQuery="select * from route_has_routeStatus inner join routeStatus on idrouteStatus=routeStatus_idrouteStatus join user on user_iduser=iduser where route_idroute=?";
					$statusStatement = $con->prepare($statusQuery);
					$statusStatement->execute(array($pRouteID));
					$statusResult = $statusStatement;
		
					while($statusRow = $statusResult->fetch(PDO::FETCH_ASSOC))
					{	
							$data['routes'][$i]['status'][]=array('description'=>$statusRow['description'],'timestamp'=>$statusRow['timestamp'],'user'=>$statusRow['userName']);	
					}
					
					$i++;
				}
				if($i==0)
				{
					$data['success']=false;
				}
				
				return $data;
				
				
			
		}
	
	}
	public static function getNotfallkontakt($obj)
	{
		$con = db_connect();
		
		if(!is_string($con))
		{
			
			$statement = $con->prepare("Select * from notfallkontakt where user_iduser= ?");
			$statement->execute(array($obj['userID']));
			$result = $statement;
			if($result->rowCount()!=0)
			{
				//user_iduser, notfallTel, notfallMail, notfallVorname, notfallNachname
				while($row = $result->fetch(PDO::FETCH_ASSOC))
				{
					  $ret=array('success'=>true, 'Telefonnummer'=>$row['notfallTel'], 'Mail'=>$row['notfallMail'], 'Vorname'=>$row['notfallVorname'], 'Nachname'=>$row['notfallNachname']);	
				}
				
			}
			else
				$ret=array('success'=>false,'error'=>'no notfallkontakt eingetragen');	
		}
		return $ret;
		
	}
	public static function insertNotfallkontakt($obj)
	{
		$con = db_connect();
		
		if(!is_string($con))
		{
			
			$statement = $con->prepare("Select * from notfallkontakt where user_iduser= ?");
			$statement->execute(array($obj['userID']));
			$result = $statement;
			if($result->rowCount()==0)
			{
				$query="insert into notfallkontakt (user_iduser, notfallTel, notfallMail, notfallVorname, notfallNachname), values (?,?,?,?,?)";
				$statement = $con->prepare($query);
				$statement->execute(array($obj['userID'],$obj['Telefonnummer'],$obj['mail'],$obj['Vorname'],$obj['Nachname']));
			}
			else
			{
				$query="update notfallkontakt set notfallTel=?, notfallMail=?, notfallVorname=?, notfallNachname=? where user_iduser=?";
				$statement = $con->prepare($query);
				$statement->execute(array($obj['Telefonnummer'],$obj['mail'],$obj['Vorname'],$obj['Nachname'], $obj['userID']));
			}
			
			$ret=array('success'=>true);	
			return $ret;
		}
		$ret=array('success'=>false);	
		return $ret;
		
	}
	public static function routeNotfall($obj)
	{
		$con = db_connect();
		
		if(!is_string($con))
		{
			$date = new DateTime();
			$timestamp = date('Y-m-d H:i:s',$date->getTimestamp());
			$query="insert into route_has_routeStatus (route_idroute, routeStatus_idrouteStatus, user_iduser,timestamp) values (?,?,?,?)";
			$statement = $con->prepare($query);
			  $statement->execute(array($obj['routeId'], 4,$obj['userID'],$timestamp));
			  
			if(!$obj['coords'])
			{
				$locCoords=$obj['coords'][0];
				$query = "Insert into location (latitude,longitude, accuracy) values (?,?)";
				$statement = $con->prepare($query);
				$statement->execute(array($locCoords['lat'],$locCoords['lon'], $locCoords['accuracy']));
				$locid = $con->lastInsertId();

				$query="insert into routeLoc (user_iduser, route_idroute, location_idlocation, battery, signalStrength) values (?,?,?,?,?)";
				$statement = $con->prepare($query);
				$statement->execute(array($obj['userID'],$obj['routeId'],$locid,$obj['battery'],$obj['signalStrength']));
				
				$ret=array('success'=>true);	
				return $ret;
			}
			
			
		}
		$ret=array('success'=>false);	
		return $ret;
	}
	
	public static function routeLocation($obj)
	{
		$con = db_connect();
		
		if(!is_string($con))
		{
			$date = new DateTime();
			$timestamp = date('Y-m-d H:i:s',$date->getTimestamp());
			
				$coords=$obj['coords'];
				for($i=0; $i<count($coords); $i++)
				{
					$locCoords=$coords[$i];
					$query = "Insert into location (latitude,longitude, accuracy,timestamp) values (?,?,?,?)";
					$statement = $con->prepare($query);
					$statement->execute(array($locCoords['lat'],$locCoords['lon'],$locCoords['accuracy'],$timestamp));
					$locid = $con->lastInsertId();
					
					$query="insert into routeLoc (user_iduser, route_idroute, location_idlocation, battery, signalStrength) values (?,?,?,?,?)";
					$statement = $con->prepare($query);
					$statement->execute(array($obj['userID'],$obj['routeId'],$locid,$obj['battery'],$obj['signalStrength']));
			
					
				}			
			
			$ret=array('success'=>true);	
			return $ret;
		}
		$ret=array('success'=>false);	
		return $ret;
	}
	public static function routeBeitreten($obj)
	{
		$con = db_connect();
		
		if(!is_string($con))
		{
			$statement = $con->prepare("Select * from route inner join route_has_routeStatus on route.idroute=route_has_routeStatus.route_idroute where routeCode= ?");
			  $statement->execute(array($obj['code']));
			  $result = $statement;
			  if($result->rowCount()!=0)
   			  {
				 while($row = $result->fetch(PDO::FETCH_ASSOC))
				  {	  
					  $ret=array('routeID'=>$row['idroute'],'success'=>true,'routeStatus'=>$row['routeStatus_idrouteStatus']);
				  }
				  
			  }
			  else
			  	$ret=array('success'=>false, 'error'=>'keineRouteGefunden');
			  
		}
		else
			$ret=array('success'=>false, 'error'=>'Datenbankfehler');
				
		 return $ret;
	}
	
	public static function startRoute($obj)
	{
		$con = db_connect();
		
		if(!is_string($con))
		{
			$date = new DateTime();
			$timestamp = date('Y-m-d H:i:s',$date->getTimestamp());
			$query = "Insert into route_has_routeStatus (route_idroute,routeStatus_idrouteStatus,user_iduser,timestamp) values (?,?,?,?)";
				$statement = $con->prepare($query);
				$statement->execute(array($obj['routeID'],1,$obj['userID'],$timestamp));
				
				$ret=array('routeid'=>$obj['routeID'],'success'=>true);				
				$con=null;
				return $ret;
		}
		$ret=array('success'=>false);	
		return $ret;
	}
	
	public static function insertGPX($obj)
	{
		$con = db_connect();
		
		if(!is_string($con))
		{	
		
			$statement = $con->prepare("Select * from predefinedRoute where predefinedName= ?");
			$statement->execute(array($obj['name']));
			$result = $statement;
			$routeid=0;
			
			if($result->rowCount()!=0)//if a result was found --> there is already a gpx with this name in the db
				return "101";
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
			
			$code=rand()%100000;
			$foundCode=false;
			while(!$foundCode)
			{
			  $statement = $con->prepare("Select * from route where routeCode= ?");
			  $statement->execute(array($obj['userID']+''+$obj['routeName']));
			  $result = $statement;
			  
			  if($result->rowCount()==0)
			  {
				  $foundCode=true;
			  }
			  else
			  {
				$code=rand()%100000;	
			  }
			}
			if(!$obj['gpxID'])//||$obj['gpxID']=="")
				$obj['gpxID']=null;
			if(!$obj['richtigeRichtung'])
				$obj['richtigeRichtung']=false;
			// 	user_iduser 	routeName 	routeInfo 	routeCode 	predefinedRoute_idpredefinedRoute 	richtigeRichtung
			$query=	"insert into route (user_iduser,routeName, routeInfo,routeCode,predefinedRoute_idpredefinedRoute,richtigeRichtung) values(?,?,?,?,?,?)";
			$statement = $con->prepare($query);
			$statement->execute(array($obj['userID'],$obj['routename'],$obj['routeinfo'],$code,$obj['gpxID'],$obj['richtigeRichtung']));
			
			$routeid = $con->lastInsertId();	
			$date = new DateTime();
			$timestamp = date('Y-m-d H:i:s',$date->getTimestamp());
			
				//if everything is ok then insert
				$query = "Insert into route_has_routeStatus (route_idroute,routeStatus_idrouteStatus,user_iduser,timestamp) values (?,?,?,?)";
				$statement = $con->prepare($query);
				$statement->execute(array($routeid,2,$obj['userID'],$timestamp));
				
				$coords=$obj['coords'];
				for($i=0; $i<count($coords); $i++)
				{
					$locCoords=$coords[$i];
					$query = "Insert into location (latitude,longitude) values (?,?)";
					$statement = $con->prepare($query);
					$statement->execute(array($locCoords['lat'],$locCoords['lon']));
					$locid = $con->lastInsertId();
					
					$query = "Insert into registeredRoute (idlocation,idroute,pointNr) values (?,?,?)";
					$statement = $con->prepare($query);
					$statement->execute(array($locid,$routeid,$i));
					
				}
				
				
				return array('routeID'=>$routeid,'success'=>true,'code'=>$code,'locid'=>$locid,'number'=>count($coords),'i'=>$i);
				
				
			
		}
		else
			return "100";
	}
	
	
	
	public static function getGPX($lat, $lon)
	{
		$con = db_connect();
		
		if(!is_string($con))
		{	//
		
				$statement = $con->prepare("Select * from predefinedRoute where maxLatitude>= ? AND maxLongitude>=? AND minLatitude<=? AND minLongitude<=?");
				$statement->execute(array($lat,$lon,$lat,$lon));
				$result = $statement;
				$data=array('routes'=>array());
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
					$data['success']=true;
					
					$newquery = "Select latitude,longitude from location join predefinedPoint on idlocation=location_idlocation where predefinedRoute_idpredefinedRoute=? ORDER BY pointNr ASC";
					
					$newstatement = $con->prepare($newquery);
					$newstatement->execute(array($pRouteID));
					$newresult = $newstatement;
		
					while($locrow = $newresult->fetch(PDO::FETCH_ASSOC))
					{	
							
							$data['routes'][$i]['coords'][]=array('lat'=>$locrow['latitude'],'long'=>$locrow['longitude']);	
							//$locrow['latitude'].$locrow['longitude'];
					}
					
					
					$i++;
				}
				if($i==0)
				{
					$data['success']=false;
				}
				
				return $data;
				
				
			
		}
	}
	
	 	
}



?>