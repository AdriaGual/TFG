<?php
	session_start(); 

	$myuser = $_POST["username"];
	$mypass = $_POST["password"];
	$sha1pass = sha1($mypass);
	
	$username = "root";
	$password = "";

	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		if((!isset($myuser) || trim($myuser) == '')||(!isset($mypass) || trim($mypass) == '')){
		   echo "empty_inputfields";
		}
		else{
			$stmt = $conn->prepare("SELECT * FROM user WHERE username = :username AND password = :password");
			$stmt->bindParam(':username', $myuser, PDO::PARAM_STR);
			$stmt->bindParam(':password', $sha1pass, PDO::PARAM_STR); 
			$stmt->execute();
			
			$total = $stmt->rowCount();
			if ($total == 1){
				$row = $stmt->fetchObject();
				$_SESSION['user'] = $myuser;
				$_SESSION['userid'] = $row->id;
				echo $row->user_type;
			}
			else{
				echo "bad_login";
			}
		}
	
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>