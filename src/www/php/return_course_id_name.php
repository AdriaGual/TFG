<?php
	session_start(); 
	$idcourse = $_SESSION["courseid"];
	$username = "root";
	$password = "";
	
	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
		//Buscar els cursos als que esta matriculat lusuari.
		$stmt = $conn->prepare("SELECT c.id, c.name FROM course AS c WHERE c.id=:idcourse");
		$stmt->bindParam(':idcourse', $idcourse, PDO::PARAM_STR);
		$stmt->execute();
		$total = $stmt->rowCount();
		if ($total > 0){
			$miscursos = array();
			$punter = 0;
			while ($row = $stmt->fetchObject()) {
				$miscursos[$punter]['id'] = $row->id;
				$miscursos[$punter]['name'] =  $row->name;
				$punter++;//1
			}
			echo json_encode($miscursos);
		}
		else{
			echo "0_courses";
		}
			
			
	
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
	
	
	
?>