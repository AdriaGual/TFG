<?php
	session_start(); 
	$sql = $_POST["idsql"];
	$_SESSION["courseid"] = $sql;
?>