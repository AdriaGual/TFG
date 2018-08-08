<?php
	session_start(); 
	$myid = $_SESSION["userid"];
	$curs = $_POST["curs"];
	$username = "root";
	$password = "";
	
	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
		//Buscar els topics del curs.
		$stmt = $conn->prepare("SELECT ct.id_topic, topic.name FROM course_topic AS ct INNER JOIN topic ON ct.id_topic = topic.id WHERE ct.id_course=:idcourse");
		$stmt->bindParam(':idcourse', $curs, PDO::PARAM_STR);
		$stmt->execute();
		$total = $stmt->rowCount();
		if ($total > 0){
			$miscursos = array();
			$punter = 0;
			while ($row = $stmt->fetchObject()) {
				$miscursos[$punter]['id'] = $row->id_topic;
				$miscursos[$punter]['name'] =  $row->name;
				$punter++;//1
			}
			echo json_encode($miscursos);
		}
		else{
			echo "0_topics";
		}
			
			
	
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>