<?php

$tablesMap = array(
    "addRoom" => "rooms",
    "addUser" => "login"
);

$data =  $_POST['data'];
$tableName = $tablesMap[$data['functionName']];
$inputObject = $data['inputObject'];
$mysqlConnection = "mysql:host=localhost;dbname=hotel";
$login = "root";
$password="";


try {
    $dbh = new PDO($mysqlConnection,$login,$password);
    writeToDBTable($inputObject,$tableName,$dbh);
    $dbh = null;
} catch (Exception $e) {
    echo 'Exception: ',$e->getMessage();
}



function writeToDBTable($data,$tableName,$dbh){
    $columnNames = "(";
    $values = "(";

    foreach($data as $key=>$value){
        $columnNames.= '`'.$key.'`,';
        $values.= "'".$value."',";
    }
    $columnNames = substr($columnNames,0,-1).')';
    $values = substr($values,0,-1).')';

    $prepareInputString = "insert into ".$tableName." ".$columnNames." values ".$values;

    $stmt = $dbh->prepare($prepareInputString);
    $stmt->execute();
}
