<?php
	session_start(); 

	$name = $_POST["name"];
	
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
			$stmt2 = $conn->prepare("SELECT * FROM test_answers_exercise WHERE id_exercise = :idexercise");
			$stmt2->bindParam(':idexercise', $idexercise, PDO::PARAM_STR);
			$stmt2->execute();
			$total = $stmt2->rowCount();
			if ($total > 0){
				$miscursos = array();	
				$punter = 0;
				while ($row2 = $stmt2->fetchObject()) {
					$miscursos[$punter]['answer_text'] = $row2->answer_text;
					$miscursos[$punter]['is_valid'] =  $row2->is_valid;
					$punter++;//1
					
				}
				echo json_encode($miscursos);
			}
			else{
				echo "0_answers";
			}
		}
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>