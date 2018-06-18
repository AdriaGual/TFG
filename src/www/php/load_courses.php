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
		$stmt = $conn->prepare("SELECT c.id, c.name, c.parentid FROM enrollment AS e INNER JOIN course AS c ON e.id_course = c.id WHERE id_user = :iduser");
		$stmt->bindParam(':iduser', $myid, PDO::PARAM_STR);
		$stmt->execute();
		$total = $stmt->rowCount();
		if ($total > 0){
			$miscursos = array();
			$punter = 0;
			while ($row = $stmt->fetchObject()) {
				$miscursos[$punter]['id'] = $row->id;
				$miscursos[$punter]['name'] = $row->name;
				$miscursos[$punter]['parent'] = $row->parentid;
				$punter++;

				if ($row->parentid != null){
					//Consultar topics
				}
				
			}
			echo json_encode($miscursos);
		}
		else{
			echo "0_courses_assigned";
		}
			
			
	
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>