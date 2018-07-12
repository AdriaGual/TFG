<?php
	session_start(); 

	$email= $_POST["email"];
	$repeatemail = $_POST["repeatemail"];
	
	
	$username = "root";
	$password = "";

	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		if((!isset($email) || trim($email) == '')||(!isset($repeatemail) || trim($repeatemail) == '')){
		   echo "empty_inputfields";
		}
		else{
			if(strcmp($email,$repeatemail)==0){
				$stmt = $conn->prepare("UPDATE user SET email = :email WHERE id = ".$_SESSION['userid']);
				$stmt->bindParam(':email', $email, PDO::PARAM_STR);
				$stmt->execute();
				echo "OK";
			}
			else{
				var_dump("parameters_not_equal");
			}
			return;
			
		}
	
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>