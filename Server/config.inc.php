<?php

/*define('DB_NAME','saveonalps');
define('DB_USER','root');
define('DB_PASSWORD','');
define('DB_HOST', 'localhost');*/
define('PASS_PATH', './passw.xml');
define('DB_NAME','db_mt102002_1');
define('DB_USER','mt102002');
define('DB_PASSWORD','HQe2KM4n');
define('DB_HOST', 'mysql5');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET");
header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Datum in der Vergangenheit

if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])){
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
}

?>