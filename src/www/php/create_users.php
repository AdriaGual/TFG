<?php
	session_start(); 

	$curs = $_POST["curs"];
	$jsonexcel = json_decode($_POST["jsonexcel"]);
	
	$username = "root";
	$password = "";
	
	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		for ($i = 1; $i < sizeof($jsonexcel); $i++){
			
			$stmt = $conn->prepare("SELECT email FROM user WHERE email = :email");
			$stmt->bindParam(':email', $jsonexcel[$i][2], PDO::PARAM_STR);
			$stmt->execute();
			
			$total = $stmt->rowCount();
			if ($total == 0){
				//Create users
				$stmt = $conn->prepare("INSERT INTO user (username,email,password,user_type,dni) VALUES (:username,:email,:password,:user_type,:dni)");
				$stmt->bindParam(':username', $jsonexcel[$i][1], PDO::PARAM_STR);
				$stmt->bindParam(':email', $jsonexcel[$i][2], PDO::PARAM_STR);
				$newpassword = sha1("123");
				$stmt->bindParam(':password', $newpassword, PDO::PARAM_STR);
				$usertype = "0";
				$stmt->bindParam(':user_type', $usertype, PDO::PARAM_STR);
				$stmt->bindParam(':dni', $jsonexcel[$i][0], PDO::PARAM_STR);
				$stmt->execute();
				
				$userid = $conn->lastInsertId();
			}
			else{
				$row = $stmt->fetchObject();
				$userid = $row->id;
			}
			
			//Insert user into course
			$stmt = $conn->prepare("INSERT INTO enrollment (id_user,id_course) VALUES (:id_user,:id_course)");
			$stmt->bindParam(':id_user', $userid, PDO::PARAM_STR);
			$stmt->bindParam(':id_course', $curs, PDO::PARAM_STR);
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