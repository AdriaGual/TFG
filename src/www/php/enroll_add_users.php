<?php
	session_start(); 

	$idcurs = $_SESSION["idcurs"];
	$selected_students = $_POST["student"];
	
	$username = "root";
	$password = "";
	
	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		for ($i = 0; $i < sizeof($selected_students); $i++){
			
			//Create users
			$stmt = $conn->prepare("INSERT INTO enrollment (id_user,id_course) VALUES (:iduser,:idcourse)");
			$stmt->bindParam(':iduser', $selected_students[$i], PDO::PARAM_STR);
			$stmt->bindParam(':idcourse', $idcurs, PDO::PARAM_STR);
			$stmt->execute();	
		}
						
		echo "OK"; 
		
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>