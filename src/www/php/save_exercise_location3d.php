<?php
	session_start(); 

	$title= $_POST["title"];
	$description= $_POST["description"];
	$question= $_POST["question"];
	$help= $_POST["help"];
	$new_models = $_POST["new_models"];
	$topics[] = $_POST["topics"];
	$difficulty = $_POST["difficulty"];
	$n_tries = $_POST["max_tries"];
	$solution = $_POST["solution"];
	
	$username = "root";
	$password = "";

	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$b = 7;
				
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$stmt = $conn->prepare("INSERT INTO exercice_content (statement,description,question,help,type_component,difficulty,n_tries,answer) VALUES (:title,:description,:question,:help,:type_component,:difficulty,:n_tries,:solution)");
		$stmt->bindParam(':title', $title, PDO::PARAM_STR);
		$stmt->bindParam(':description', $description, PDO::PARAM_STR);
		$stmt->bindParam(':question', $question, PDO::PARAM_STR);
		$stmt->bindParam(':help', $help, PDO::PARAM_STR);
		$stmt->bindParam(':type_component', $b, PDO::PARAM_STR);
		$stmt->bindParam(':solution', $solution, PDO::PARAM_STR);
		$stmt->bindParam(':difficulty', $difficulty, PDO::PARAM_STR);
		$stmt->bindParam(':n_tries', $n_tries, PDO::PARAM_STR);
		$stmt->execute();
		$exerciseid = $conn->lastInsertId();
		
		$stmt = $conn->prepare("INSERT INTO location3d_exercise_answers (id_exercise,matrix) VALUES (:exerciseid,:matrix)");
		$stmt->bindParam(':exerciseid', $exerciseid, PDO::PARAM_STR);
		$stmt->bindParam(':matrix', $new_models, PDO::PARAM_STR);

		$stmt->execute();
		
		$explodedtopics = explode('&',$topics[0]);
		
		for ($i = 0; $i <count($explodedtopics); $i++) {
			$topicid = substr($explodedtopics[$i],6);
			$stmt = $conn->prepare("INSERT INTO topic_exercice (id_topic,id_exercice_content) VALUES (:topicid,:exerciseid)");
			$stmt->bindParam(':exerciseid', $exerciseid, PDO::PARAM_STR);
			$stmt->bindParam(':topicid', $topicid, PDO::PARAM_STR);
			$stmt->execute();
		}
		
		echo "OK";
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>