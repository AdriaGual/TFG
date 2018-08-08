<?php
	session_start(); 

	$image= $_POST["img"];
	$title= $_POST["title"];
	$description= $_POST["description"];
	$question= $_POST["question"];
	$help= $_POST["help"];
	$answers = $_POST["answers"];
	$topics[] = $_POST["topics"];
	$username = "root";
	$password = "";

	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$b = 5;
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$stmt = $conn->prepare("INSERT INTO exercice_content (statement,description,question,help,img,type_component) VALUES (:title,:description,:question,:help,:img,:type_component)");
		$stmt->bindParam(':title', $title, PDO::PARAM_STR);
		$stmt->bindParam(':description', $description, PDO::PARAM_STR);
		$stmt->bindParam(':question', $question, PDO::PARAM_STR);
		$stmt->bindParam(':help', $help, PDO::PARAM_STR);
		$stmt->bindParam(':img', $image, PDO::PARAM_STR);
		$stmt->bindParam(':type_component', $b, PDO::PARAM_STR);
		$stmt->execute();
		$exerciseid = $conn->lastInsertId();
		
		
		for ($i = 0; $i <count($answers); $i++) {
			$text = $answers[$i]["text"];
			$isvalid = $answers[$i]["solution"];
			$c = 0;
			if ($isvalid=="true"){
				$c = 1;
			}
			$stmt = $conn->prepare("INSERT INTO test_answers_exercise (id_exercise,answer_text,is_valid) VALUES (:exerciseid,:text,:solution)");
			$stmt->bindParam(':exerciseid', $exerciseid, PDO::PARAM_STR);
			$stmt->bindParam(':text', $text, PDO::PARAM_STR);
			$stmt->bindParam(':solution', $c, PDO::PARAM_STR);
			$stmt->execute();
		}
		
		$explodedtopics = explode('&',$topics[0]);
		//echo substr($explodedtopics[0],6);
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