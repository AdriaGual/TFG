<?php
	session_start(); 
	$myid = $_SESSION["userid"];
	
	$username = "root";
	$password = "";
	
	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
		//Buscar els cursos als que esta matriculat lusuari.
		$stmt = $conn->prepare("SELECT c.id, c.name FROM course AS c INNER JOIN enrollment as en ON c.id = en.id_course WHERE en.id_user=:iduser");
		$stmt->bindParam(':iduser', $myid, PDO::PARAM_STR);
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