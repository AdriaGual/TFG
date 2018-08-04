<?php
	session_start(); 

	$idtopic = $_POST["idtopic"];
	$myid = $_SESSION["userid"];
	
	$username = "root";
	$password = "";
	
	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		$stmt = $conn->prepare("SELECT tc.id,tc.statement,ue.tries,ue.puntuation,ue.finished FROM exercice_content AS tc INNER JOIN topic_exercice AS t ON tc.id = t.id_exercice_content INNER JOIN user_exercise AS ue ON tc.id = ue.id_exercise WHERE t.id_topic = :idtopic AND ue.id_user=:iduser");
		$stmt->bindParam(':idtopic', $idtopic, PDO::PARAM_STR);
		$stmt->bindParam(':iduser', $myid, PDO::PARAM_STR);
		$stmt->execute();
		
		$result = array();
		$punter = 0;
		while ($row = $stmt->fetchObject()) {
			$result[$punter]['statement']=$row->statement;
			$result[$punter]['tries']=$row->tries;
			$result[$punter]['puntuation']=$row->puntuation;
			$result[$punter]['finished']=$row->finished;
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