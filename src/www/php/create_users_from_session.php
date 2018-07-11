<?php
	require '../PHPMailer/PHPMailerAutoload.php';

	session_start(); 

	$curs = $_SESSION["idcurs"];
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
				$lowersurname = strtolower($jsonexcel[$i][1]);
				$generated_username = strtoupper($jsonexcel[$i][0][0]).$lowersurname;
				
				$stmt = $conn->prepare("SELECT * FROM user WHERE username = :generated_username");
				$stmt->bindParam(':generated_username', $generated_username, PDO::PARAM_STR);
				$stmt->execute();
				$total = $stmt->rowCount();
				if ($total > 0){
					$newgenerated_username = $generated_username."1";
					$stmt = $conn->prepare("SELECT * FROM user WHERE username = :generated_username");
					$stmt->bindParam(':generated_username', $newgenerated_username, PDO::PARAM_STR);
					$stmt->execute();
					$total = $stmt->rowCount();
					if ($total > 0){
						$newgenerated_username = $generated_username."2";
						$stmt = $conn->prepare("SELECT * FROM user WHERE username = :generated_username");
						$stmt->bindParam(':generated_username', $newgenerated_username, PDO::PARAM_STR);
						$stmt->execute();
						$total = $stmt->rowCount();
						if ($total > 0){
							$newgenerated_username = $generated_username."3";
							$stmt = $conn->prepare("SELECT * FROM user WHERE username = :generated_username");
							$stmt->bindParam(':generated_username', $newgenerated_username, PDO::PARAM_STR);
							$stmt->execute();
							$total = $stmt->rowCount();
							if ($total > 0){
								$newgenerated_username = $generated_username."4";
								$stmt = $conn->prepare("SELECT * FROM user WHERE username = :generated_username");
								$stmt->bindParam(':generated_username', $newgenerated_username, PDO::PARAM_STR);
								$stmt->execute();
								$total = $stmt->rowCount();
							}
							else{
								$generated_username = $newgenerated_username;
							}
						}
						else{
							$generated_username = $newgenerated_username;
						}
					}
					else{
						$generated_username = $newgenerated_username;
					}
				}
				$alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
				$pass = array(); //remember to declare $pass as an array
				$alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
				for ($j = 0; $j < 8; $j++) {
					$n = rand(0, $alphaLength);
					$pass[] = $alphabet[$n];
				}

				$stmt = $conn->prepare("INSERT INTO user (username,email,password,user_type,name,surname) VALUES (:username,:email,:password,:user_type,:name,:surname)");
				$stmt->bindParam(':username', $generated_username, PDO::PARAM_STR);
				$stmt->bindParam(':email', $jsonexcel[$i][4], PDO::PARAM_STR);
				$newpassword = sha1(implode($pass));
				$stmt->bindParam(':password', $newpassword, PDO::PARAM_STR);
				$usertype = "0";
				$stmt->bindParam(':user_type', $usertype, PDO::PARAM_STR);
				$stmt->bindParam(':name', $jsonexcel[$i][0], PDO::PARAM_STR);
				$stmt->bindParam(':surname', $jsonexcel[$i][1], PDO::PARAM_STR);
				$stmt->execute();
				
				$mail = new PHPMailer;
				$mail->isSMTP();
				$mail->Host = 'smtp.gmail.com';
				$mail->Port = 587;
				$mail->SMTPSecure = 'tls';
				$mail->SMTPAuth = true;
				$mail->Username = "norespondre43210@gmail.com";
				$mail->Password = "norespondremai";

				$mail->IsHTML(true);
				$mail->setFrom('adriagual06@gmail.com', 'E-Learning');
				$mail->addAddress($jsonexcel[$i][4], $jsonexcel[$i][0]);
				$mail->Subject  = '[E-Learning Platform] - User Created';
				$mail->Body     = 'Hi! <br><br>Your account has been created with:<br><br>Username: '.$generated_username.' '.'<br>Password: '.implode($pass);
				$mail->send();

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