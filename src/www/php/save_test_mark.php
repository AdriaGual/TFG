<?php
	session_start(); 

	$name= $_POST["name"];
	$tries= $_POST["tries"];
	$puntuation= $_POST["puntuation"];
	$myid = $_SESSION["userid"];
	$username = "root";
	$password = "";

	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$stmt = $conn->prepare("SELECT * FROM exercice_content WHERE statement = :name");
		$stmt->bindParam(':name', $name, PDO::PARAM_STR);
		$stmt->execute();

		$row = $stmt->fetchObject();
		
		$idexercise = $row->id;
		
		$finished = 1;
		$stmt = $conn->prepare("UPDATE user_exercise SET finished=:finished, tries = :tries, puntuation = :puntuation WHERE id_user = :iduser AND id_exercise = :idexercise");
		$stmt->bindParam(':finished', $finished, PDO::PARAM_STR);
		$stmt->bindParam(':tries', $tries, PDO::PARAM_STR);
		$stmt->bindParam(':puntuation', $puntuation, PDO::PARAM_STR);
		$stmt->bindParam(':iduser', $myid, PDO::PARAM_STR);
		$stmt->bindParam(':idexercise', $idexercise, PDO::PARAM_STR);
		$stmt->execute();
		
		echo "OK";
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>