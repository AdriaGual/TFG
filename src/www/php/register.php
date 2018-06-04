<?php
	$myuser = $_POST["username"];
	$mypass = $_POST["password"];
	$sha1pass = sha1($mypass);
	
	$username = "root";
	$password = "";

	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		$stmt = $conn->prepare("SELECT * FROM user WHERE username = :username AND password = :password");
		$stmt->bindParam(':username', $myuser, PDO::PARAM_STR);
		$stmt->bindParam(':password', $sha1pass, PDO::PARAM_STR); 
		$stmt->execute();
		
		$total = $stmt->rowCount();
		if ($total == 1){
			session_start(); 
			$_SESSION['user'] = $myuser;
			
			echo "OK";
		}
		else{
			
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