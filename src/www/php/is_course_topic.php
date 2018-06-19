<?php
	session_start(); 

	$name = $_POST["name"];
	
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
			$stmt = $conn->prepare("SELECT * FROM course WHERE name = :name");
			$stmt->bindParam('name', $name, PDO::PARAM_STR);
			$stmt->execute();
			
			$total = $stmt->rowCount();
			if ($total > 0){
				$row = $stmt->fetchObject();
				echo "course";
			}
			else{
				$stmt2 = $conn->prepare("SELECT * FROM topic WHERE name = :name");
				$stmt2->bindParam('name', $name, PDO::PARAM_STR);
				$stmt2->execute();
			
				$total = $stmt->rowCount();
				if ($total > 0){
					$row = $stmt2->fetchObject();
					echo "topic";
				}
				else{
					echo "bad_login";
				}
			}
		}
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>