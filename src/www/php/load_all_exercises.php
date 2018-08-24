<?php
	session_start(); 
	$myid = $_SESSION["userid"];
	$username = "root";
	$password = "";

	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$miscursos = array();
		$punter = 0;
		$id = 1;
		$stmt2 = $conn->prepare("SELECT statement FROM exercice_content");
		$stmt2->execute();
		$total2 = $stmt2->rowCount();
		if ($total2 > 0){
			while ($row2 = $stmt2->fetchObject()) {
				$miscursos[$punter]['id'] = $id;
				$miscursos[$punter]['name'] = $row2->statement;
				$miscursos[$punter]['parent'] =null;
				$miscursos[$punter]['expanded'] = true;
				$punter++;//2
				$id++;//3	
			}
			echo json_encode($miscursos); 
		}
		else {
			echo "noexercises";
		}
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>