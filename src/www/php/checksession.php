<?php
	session_start(); 
	
	if (!isset($_SESSION["user"])){
		echo "NO_SESSION";
	}
	else{
		echo $_SESSION["user"];
	}

?>