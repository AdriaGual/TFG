<?php
	session_start(); 

	$idcurs = $_POST["idcurs"];
	
	if ($idcurs != 0){
		$_SESSION["idcurs"] = $idcurs;
	}
	else{
		$idcurs = $_SESSION["idcurs"];
	}
	
	$username = "root";
	$password = "";
	
	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		$stmt = $conn->prepare("SELECT exercice_content.id, exercice_content.statement, t.name FROM course as C 
			INNER JOIN course_topic as ct ON c.id = ct.id_course 
			INNER JOIN topic AS t ON t.id = ct.id_topic
			INNER JOIN topic_exercice as te ON ct.id = te.id_topic
			INNER JOIN exercice_content ON te.id_exercice_content = exercice_content.id
			WHERE c.id = :idcurs 
			ORDER BY t.name"
		);
		$stmt->bindParam(':idcurs', $idcurs, PDO::PARAM_STR);
		$stmt->execute();
		
		$result = array();
		$punter = 0;
		while ($row = $stmt->fetchObject()) {
			$result[$punter]['id'] = $row->id;
			$result[$punter]['statement'] = $row->statement;
			$result[$punter]['name'] = $row->name;
			$punter++;
		}
		echo json_encode($result); 
		
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>