<?php
	$myuser = $_POST["register_username"];
	$mypass = $_POST["register_password"];
	$mypass2 = $_POST["register_repeatpassword"];
	$email = $_POST["register_email"];
	$sha1pass = sha1($mypass);
	
	$username = "root";
	$password = "";

	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		if((!isset($myuser) || trim($myuser) == '')||(!isset($mypass) || trim($mypass) == '')||(!isset($mypass2) || trim($mypass2) == '')||(!isset($email) || trim($email) == '')){
		   echo "empty_inputfields";
		}
		else{
			//Usuaris amb el nom de $myuser (register_username)
			$stmt = $conn->prepare("SELECT * FROM user WHERE username = :username");
			$stmt->bindParam(':username', $myuser, PDO::PARAM_STR);

			$stmt->execute();
			//Comptar el nombre de registres donada la query anterior.
			$total = $stmt->rowCount();
			if ($total > 0){
				echo "user_already_exists";
			}
			else if ($mypass != $mypass2){
					echo "password_not_equal";
			}
			else{
				$stmt = $conn->prepare("SELECT * FROM user WHERE email = :email");
				$stmt->bindParam(':email', $email, PDO::PARAM_STR);

				$stmt->execute();
				
				$total = $stmt->rowCount();
				if ($total > 0){
					echo "email_already_exists";
				}
				else{
					$sql = "INSERT INTO user (username, password,email) VALUES (:username, :password,:email)";
					$stmt = $conn->prepare($sql);
					
					$stmt->bindValue(':username', $myuser);
					$stmt->bindValue(':password', $sha1pass);
					$stmt->bindValue(':email', $email);
					$result = $stmt->execute();
					
					if($result){
						echo 'OK';
					}
				}
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