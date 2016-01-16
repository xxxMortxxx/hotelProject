<?php

function getAllRows(){
	$pdo = new PDO("mysql:host=localhost;dbname=hotel","root","");
	$stmt = $pdo->prepare("select * from rooms");
	$stmt->execute();
	$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
	$json = json_encode($results);
	return $json;
}

header('Content-Type: application/json');
echo getAllRows();

?>