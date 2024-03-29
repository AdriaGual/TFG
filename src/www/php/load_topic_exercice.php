﻿<?php
	session_start(); 

	$name = $_POST["name"];
	$myid = $_SESSION["userid"];
	$username = "root";
	$password = "";

	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		if(!isset($name) || trim($name) == ''){
		   echo "empty_name";
		}
		else{
			$miscursos = array();
			$punter = 0;
			$id = 1;
			$stmt = $conn->prepare("SELECT * FROM topic WHERE name = :name");
			$stmt->bindParam(':name', $name, PDO::PARAM_STR);
			$stmt->execute();
			
			$total = $stmt->rowCount();
			if ($total > 0){
				$row = $stmt->fetchObject();
				$idtopic = $row -> id;
			}
			else{
				echo "topic_not_found";
			}

			$stmt2 = $conn->prepare("SELECT tc.statement,ue.finished,ue.puntuation FROM exercice_content AS tc INNER JOIN topic_exercice AS t ON tc.id = t.id_exercice_content INNER JOIN user_exercise AS ue ON tc.id = ue.id_exercise WHERE t.id_topic = :idtopic AND ue.id_user=:iduser");
			$stmt2->bindParam(':idtopic', $idtopic, PDO::PARAM_STR);
			$stmt2->bindParam(':iduser', $myid, PDO::PARAM_STR);
			$stmt2->execute();
			$total2 = $stmt2->rowCount();
			if ($total2 > 0){
				while ($row2 = $stmt2->fetchObject()) {
					$miscursos[$punter]['id'] = $id;
					$miscursos[$punter]['name'] = $row2->statement;
					$miscursos[$punter]['parent'] =null;
					$miscursos[$punter]['expanded'] = true;
					$miscursos[$punter]['finished'] = $row2->finished;
					$miscursos[$punter]['puntuation'] = $row2->puntuation;
					$punter++;//2
					$id++;//3	
				}
				echo json_encode($miscursos); 
			}
			else {
				echo "topichasnoexercice";
			}

		}
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>