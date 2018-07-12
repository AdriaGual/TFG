<?php
	session_start(); 

	$myuser= $_POST["username"];
	$repeatusername = $_POST["repeatedusername"];
	
	
	$username = "root";
	$password = "";

	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		if((!isset($myuser) || trim($myuser) == '')||(!isset($repeatusername) || trim($repeatusername) == '')){
		   echo "empty_inputfields";
		}
		else{
			if(strcmp($myuser,$repeatusername)==0){
				$stmt = $conn->prepare("SELECT * FROM user WHERE username = :username");
				$stmt->bindParam(':username', $myuser, PDO::PARAM_STR);
				$stmt->execute();
				
				$total = $stmt->rowCount();
				if ($total == 1){
					echo "username_already_exists";
				}
				else{
					$stmt = $conn->prepare("UPDATE user SET username = :username WHERE id = ".$_SESSION['userid']);
					$stmt->bindParam(':username', $myuser, PDO::PARAM_STR);
					$stmt->execute();
					echo "OK";
				}
			}
			else{
				echo"fields_not_equal";
			}
		}
	
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>