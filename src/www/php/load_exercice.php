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
			
			
			
			
			$total = $stmt->rowCount();
			if ($total > 0){
				$miscursos = array();
				$row = $stmt->fetchObject();
				$miscursos['idsql']=$row->id;
				$miscursos['statement']=$row->statement;
				$miscursos['description']=$row->description;
				$miscursos['question']=$row->question;
				$miscursos['help']=$row->help;
				$miscursos['ntries']=$row->n_tries;
				$miscursos['type_component']=$row->type_component;
				$miscursos['img']=$row->img;
				
				$idsql = $row->id;
				$stmt2 = $conn->prepare("SELECT * FROM user_exercise WHERE id_user = :myid AND id_exercise = :idexercise");
				$stmt2->bindParam(':myid', $myid, PDO::PARAM_STR);
				$stmt2->bindParam(':idexercise', $idsql, PDO::PARAM_STR);
				$stmt2->execute();
				$row2 = $stmt2->fetchObject();
				$miscursos['tries']=$row2->tries;
				
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