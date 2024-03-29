﻿<?php
	session_start(); 

	$idcourse = $_SESSION["courseid"];
	
	$username = "root";
	$password = "";

	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		$stmt = $conn->prepare("SELECT * FROM course WHERE id = :idcourse");
		$stmt->bindParam(':idcourse', $idcourse, PDO::PARAM_STR);
		$stmt->execute();
		
		$total = $stmt->rowCount();
		if ($total > 0){
			$miscursos = array();
			$row = $stmt->fetchObject();
			$miscursos['name']=$row->name;
			$miscursos['description']=$row->description;
			$miscursos['prerequisits']=$row->prerequisits;
			echo json_encode($miscursos);
		}
		else{
			echo "course_not_found";
		}
		
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>