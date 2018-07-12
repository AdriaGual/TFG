<?php
	session_start(); 

	$_SESSION['is_teacher']= $_POST["is_teacher"];
	$_SESSION['is_student'] = $_POST["is_student"];
	if ($_SESSION['is_teacher']){
		echo "is_teacher";
	}
	else{
		echo "is_student";
	}
?>