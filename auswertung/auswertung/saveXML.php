<?php 

$date = new DateTime();
$timestamp = $date->getTimestamp();



$_FILES['File']['type'] = "text/xml";
$_FILES['File']['name'] = $timestamp.".xml";

$type = $_FILES['File']['type'];    
$name = $_FILES['File']['name'];
//$tempname = $_FILES['File']['tmp_name'];



$target_path = "temp_xml_files/";

$target_path = $target_path . basename( $_FILES['File']['name']);



 
if(move_uploaded_file($_FILES['File']['tmp_name'], $target_path)) {
    echo $_FILES['File']['name'];
} else{
    echo "error";
}


?>