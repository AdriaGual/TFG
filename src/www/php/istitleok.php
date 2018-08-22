<?php
	session_start(); 
	$name= $_POST["name"];

	$username = "root";
	$password = "";

	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		if(!isset($name) || trim($name) == ''){
		   echo "empty_name";
		}
		else{
			$stmt = $conn->prepare("SELECT * FROM exercice_content WHERE statement = :name");
			$stmt->bindParam(':name', $name, PDO::PARAM_STR);
			$stmt->execute();
			
			$total = $stmt->rowCount();
			if ($total > 0){
				echo "NO_OK";
			}
			else{
				echo "OK";
			}
		}
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>