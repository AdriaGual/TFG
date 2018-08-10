<?php
	require '../PHPMailer/PHPMailerAutoload.php';
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
			$row = $stmt->fetchObject();
			$total = $stmt->rowCount();
			if ($total == 1){
				$mail = new PHPMailer;
				$mail->isSMTP();
				$mail->Host = 'smtp.gmail.com';
				$mail->Port = 587;
				$mail->SMTPSecure = 'tls';
				$mail->SMTPAuth = true;
				$mail->Username = "norespondre43210@gmail.com";
				$mail->Password = "norespondremai";

				$alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
				$pass = array(); //remember to declare $pass as an array
				$alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
				for ($j = 0; $j < 8; $j++) {
					$n = rand(0, $alphaLength);
					$pass[] = $alphabet[$n];
				}
				
				$stmt = $conn->prepare("UPDATE user SET password=:password WHERE email = :email");
				$stmt->bindParam(':email', $myemail, PDO::PARAM_STR); 
				$newpassword = sha1(implode($pass));
				$stmt->bindParam(':password', $newpassword, PDO::PARAM_STR);
				$stmt->execute();
				
				$mail->IsHTML(true);
				$mail->setFrom('adriagual06@gmail.com', 'E-Learning');
				$mail->addAddress($myemail, $jsonexcel[$i][0]);
				$mail->Subject  = '[E-Learning Platform] - Password Reset';
				$mail->Body     = 'Hi! <br><br>Your password has been reset: <br>Username: '.$row->username.' '.'<br>Password: '.implode($pass);
				$mail->send();
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