<?php
	session_start(); 

	$idcurs = $_POST["idcurs"];
	$myid = $_POST["userid"];
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
		
		$stmt = $conn->prepare("SELECT ct.id_topic, t.name  FROM topic AS t INNER JOIN course_topic AS ct ON ct.id_topic=t.id WHERE id_course = :idcurs");
		$stmt->bindParam(':idcurs', $idcurs, PDO::PARAM_STR);
		$stmt->execute();
		
		$result = array();
		$punter = 0;
		while ($row = $stmt->fetchObject()) {
			$result[$punter]['topicname']=$row->name;
			$result[$punter]['idtopic']=$row->id_topic;
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