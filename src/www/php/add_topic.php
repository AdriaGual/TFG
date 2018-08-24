<?php
	session_start(); 

	$name= $_POST["name"];
	
	$username = "root";
	$password = "";
	
	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		$subtopic = 0;
		$stmt = $conn->prepare("INSERT INTO topic (name,subtopic) VALUES (:name,:subtopic)");
		$stmt->bindParam(':name', $name, PDO::PARAM_STR);
		$stmt->bindParam(':subtopic', $subtopic, PDO::PARAM_STR);
		$stmt->execute();	
	
			
		echo "OK"; 
		
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>