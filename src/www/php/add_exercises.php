<?php
	session_start(); 

	$selected_students = $_POST["students"];
	$selected_info = $_POST["info"];
	
	$username = "root";
	$password = "";
	
	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		for ($i = 0; $i < sizeof($selected_info); $i++){
			
			$item = explode("#",$selected_info[$i]);
			$stmt = $conn->prepare("INSERT INTO user_exercise (id_user,id_exercise) VALUES (:iduser,:idexercise)");
			$stmt->bindParam(':iduser', $item[0], PDO::PARAM_STR);
			$stmt->bindParam(':idexercise', $item[1], PDO::PARAM_STR);
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