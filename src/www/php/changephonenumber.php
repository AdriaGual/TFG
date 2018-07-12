<?php
	session_start(); 

	$newphonenumber= $_POST["newphonenumber"];
	$repeatnewphonenumber = $_POST["repeatnewphonenumber"];
	
	
	$username = "root";
	$password = "";

	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		if((!isset($newphonenumber) || trim($newphonenumber) == '')||(!isset($repeatnewphonenumber) || trim($repeatnewphonenumber) == '')){
		   echo "empty_inputfields";
		}
		else{
			if(strcmp($newphonenumber,$repeatnewphonenumber)==0){
				$stmt = $conn->prepare("UPDATE user SET phone_number = :phone_number WHERE id = ".$_SESSION['userid']);
				$stmt->bindParam(':phone_number', $newphonenumber, PDO::PARAM_STR);
				$stmt->execute();
				echo "OK";
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