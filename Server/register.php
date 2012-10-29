<? 
include("function.inc.php");
include("config.inc.php");


echo insertUser(json_decode(file_get_contents("php://input")));

?>