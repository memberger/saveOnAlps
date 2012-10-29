<? 
include("function.inc.php");
include("config.inc.php");

$decoded_json=json_decode(file_get_contents("php://input"));
if(isset($decoded_json->user_id))
{
	return getUserById($decoded_json);
}
else
{
return getUserByUsernamePassword($decoded_json);
}

 ?>