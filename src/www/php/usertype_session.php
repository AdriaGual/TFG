<?php
	session_start(); 
	$myid = $_SESSION['userid'];
	$_SESSION['is_teacher']= $_POST["is_teacher"];
	$_SESSION['is_student'] = $_POST["is_student"];
	
	$username = "root";
	$password = "";
	
	$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	$stmt = $conn->prepare("SELECT * FROM user WHERE id = :userid");
	$stmt->bindParam(':userid', $myid, PDO::PARAM_STR);
	$stmt->execute();
	$row = $stmt->fetchObject();
	
	if ($row->user_type==1){
		echo "is_teacher";
	}
	else if ($row->user_type==0){
		echo "is_student";
	}
	else if ($row->user_type==2){
		echo "is_admin";
	}
?>