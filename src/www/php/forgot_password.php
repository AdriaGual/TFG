<?php
	$myemail = $_POST["email"];
	
	$username = "root";
	$password = "";

	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		if((!isset($myemail) || trim($myemail) == '')){
		   echo "empty_inputfields";
		}
		else{
			$stmt = $conn->prepare("SELECT * FROM user WHERE email = :email");
			$stmt->bindParam(':email', $myemail, PDO::PARAM_STR); 
			$stmt->execute();
			
			$total = $stmt->rowCount();
			if ($total == 1){
				$subject= "E-learning Recovery Password";
				$token = bin2hex(random_bytes(8));
				$message = "Here's your password: {$token}"; 
				mail($myemail,$subject,$message);
				echo "OK";
			}
			else{
				echo "bad_email";
			}
		}
	//	while ($row = $stmt->fetchObject()) {
	//		echo $row->username;
	//	}
	
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>