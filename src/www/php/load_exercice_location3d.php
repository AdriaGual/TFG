<?php
	session_start(); 

	$name = $_POST["name"];
	$myid = $_SESSION["userid"];
	$username = "root";
	$password = "";

	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		if(!isset($name) || trim($name) == ''){
		   echo "empty_name";
		}
		else{
			$stmt = $conn->prepare("SELECT * FROM exercice_content WHERE statement = :name");
			$stmt->bindParam(':name', $name, PDO::PARAM_STR);
			$stmt->execute();
			$row = $stmt->fetchObject();
			$idexercise = $row->id;
			
			$stmt2 = $conn->prepare("SELECT * FROM location3d_exercise_answers WHERE id_exercise = :idexercise");
			$stmt2->bindParam(':idexercise', $idexercise, PDO::PARAM_STR);
			$stmt2->execute();
			
			$total = $stmt2->rowCount();
			$punter = 0;
			if ($total > 0){
				$miscursos = array();
				$row2 = $stmt2->fetchObject();
				$js = $row2->matrix;
				$miscursos[0]['matrix'] = $js;
				echo json_encode($miscursos);
			}
			else{
				echo "course_not_found";
			}
		}
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>