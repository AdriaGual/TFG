<?php
	session_start(); 
	$myid = $_SESSION["userid"];
	$answers = $_POST["answers"];
	$name = $_POST["name"];
	$username = "root";
	$password = "";
	
	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
		//Buscar els cursos als que esta matriculat lusuari.
		$stmt = $conn->prepare("SELECT * FROM exercice_content WHERE statement = :name");
		$stmt->bindParam(':name', $name, PDO::PARAM_STR);
		$stmt->execute();
		$row = $stmt->fetchObject();
		
		$idexercise = $row->id;
		$stmt2 = $conn->prepare("SELECT * FROM test_answers_exercise WHERE id_exercise = :idexercise");
		$stmt2->bindParam(':idexercise', $idexercise, PDO::PARAM_STR);
		$stmt2->execute();
		$total = $stmt2->rowCount();
		$correcte = 1;
		if ($total > 0){
			$i =0;
			while ($row2 = $stmt2->fetchObject()) {
				if ($answers[$i]["solution"]=="true"){
					$answervalid = 1;
				}
				else{
					$answervalid = 0;
				}

				if ($answervalid!=$row2->is_valid){
					$correcte = 0;
				}
				$i++;
			}
			if ($correcte){
				echo "match";
			}
			else{
				echo "no_match";
			}
		}
		else{
			echo "0_answers";
		}
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>