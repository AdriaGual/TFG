<?php
	session_start(); 

	$image= $_POST["img"];
	$original_img= $_POST["original_img"];
	$title= $_POST["title"];
	$description= $_POST["description"];
	$question= $_POST["question"];
	$help= $_POST["help"];
	$points = $_POST["points"];
	$topics[] = $_POST["topics"];
	$username = "root";
	$password = "";

	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$b = 6;
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$stmt = $conn->prepare("INSERT INTO exercice_content (statement,description,question,help,original_img,img,type_component) VALUES (:title,:description,:question,:help,:original_img,:img,:type_component)");
		$stmt->bindParam(':title', $title, PDO::PARAM_STR);
		$stmt->bindParam(':description', $description, PDO::PARAM_STR);
		$stmt->bindParam(':question', $question, PDO::PARAM_STR);
		$stmt->bindParam(':help', $help, PDO::PARAM_STR);
		$stmt->bindParam(':original_img', $original_img, PDO::PARAM_STR);
		$stmt->bindParam(':img', $image, PDO::PARAM_STR);
		$stmt->bindParam(':type_component', $b, PDO::PARAM_STR);
		$stmt->execute();
		$exerciseid = $conn->lastInsertId();
		
		
		for ($i = 0; $i <count($points); $i++) {
			$x= $points[$i]["x"];
			$y = $points[$i]["y"];
			$radius = $points[$i]["radius"];

			$stmt = $conn->prepare("INSERT INTO location2d_exercise_answers (id_exercise,x,y,radius) VALUES (:exerciseid,:x,:y,:radius)");
			$stmt->bindParam(':exerciseid', $exerciseid, PDO::PARAM_STR);
			$stmt->bindParam(':x', $x, PDO::PARAM_STR);
			$stmt->bindParam(':y', $y, PDO::PARAM_STR);
			$stmt->bindParam(':radius', $radius, PDO::PARAM_STR);
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