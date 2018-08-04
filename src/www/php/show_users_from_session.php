<?php
	session_start(); 

	$curs = $_SESSION["idcurs"];
	$jsonexcel = json_decode($_POST["jsonexcel"]);
	$_SESSION['excel'] = $jsonexcel;

	$username = "root";
	$password = "";
	
	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$result = array();
		$punter = 0;
		for ($i = 1; $i < sizeof($jsonexcel); $i++){
			
			$stmt = $conn->prepare("SELECT * FROM user WHERE email = :email");
			$stmt->bindParam(':email', $jsonexcel[$i][4], PDO::PARAM_STR);
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
				
				$result[$punter]['username'] = $generated_username;
				$result[$punter]['name'] =$jsonexcel[$i][0];
				$result[$punter]['surname'] = $jsonexcel[$i][1];
				$result[$punter]['email'] = $jsonexcel[$i][4];
				$result[$punter]['isnew'] = true;
				$punter++;
				
			}
			else{
				$row = $stmt->fetchObject();
				
				$result[$punter]['username'] = $row->username;
				$result[$punter]['name'] =$jsonexcel[$i][0];
				$result[$punter]['surname'] = $jsonexcel[$i][1];
				$result[$punter]['email'] = $jsonexcel[$i][4];
				$result[$punter]['isnew'] = false;
				$punter++;
			}
		}
						
		echo json_encode($result); 
		
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>