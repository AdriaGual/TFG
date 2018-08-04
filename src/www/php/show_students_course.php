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
		
		$stmt = $conn->prepare("SELECT user.id,user.username,user.name,user.surname  FROM user INNER JOIN enrollment AS en ON en.id_user=user.id WHERE id_course = :idcurs AND user.user_type=0");
		$stmt->bindParam(':idcurs', $idcurs, PDO::PARAM_STR);
		$stmt->execute();
		
		$result = array();
		$punter = 0;
		while ($row = $stmt->fetchObject()) {
			$result[$punter]['id']=$row->id;
			$result[$punter]['username']=$row->username;
			$result[$punter]['name']=$row->name;
			$result[$punter]['surname']=$row->surname;
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