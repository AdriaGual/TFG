<?php
	session_start(); 

	$oldpass= $_POST["oldpass"];
	$newpass = $_POST["newpass"];
	$repeatnewpass = $_POST["repeatnewpass"];
	
	$username = "root";
	$password = "";

	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		if((!isset($oldpass) || trim($oldpass) == '')||(!isset($newpass) || trim($newpass) == '')||(!isset($repeatnewpass) || trim($repeatnewpass) == '')){
		   echo "empty_inputfields";
		}
		else{
			if(strcmp($newpass,$repeatnewpass)==0){
				$oldpasssql = sha1($oldpass);
				$stmt = $conn->prepare("SELECT * FROM user WHERE id = ".$_SESSION['userid']." AND password=:password");
				$stmt->bindParam(':password', $oldpasssql, PDO::PARAM_STR);
				$stmt->execute();
				
				$total = $stmt->rowCount();
				if ($total == 1){
					$newpassword = sha1($newpass);
					$stmt = $conn->prepare("UPDATE user SET password = :password WHERE id = ".$_SESSION['userid']);
					$stmt->bindParam(':password', $newpassword, PDO::PARAM_STR);
					$stmt->execute();
					echo "OK";
				}
				else{
					echo "old_password_not_correct";
				}
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