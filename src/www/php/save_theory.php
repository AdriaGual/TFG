<?php
	session_start(); 

	$image= $_POST["img"];
	$title= $_POST["title"];
	$subtitle= $_POST["subtitle"];
	$content= $_POST["content"];
	$url= $_POST["url"];
	$topics[] = $_POST["topics"];
	$username = "root";
	$password = "";

	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$stmt = $conn->prepare("INSERT INTO theory_content (title,subtitle,content,url,img) VALUES (:title,:subtitle,:content,:url,:img)");
		$stmt->bindParam(':title', $title, PDO::PARAM_STR);
		$stmt->bindParam(':subtitle', $subtitle, PDO::PARAM_STR);
		$stmt->bindParam(':content', $content, PDO::PARAM_STR);
		$stmt->bindParam(':url', $url, PDO::PARAM_STR);
		$stmt->bindParam(':img', $image, PDO::PARAM_STR);
		$stmt->execute();
		$theoryid = $conn->lastInsertId();
		
		$explodedtopics = explode('&',$topics[0]);
		//echo substr($explodedtopics[0],6);
		for ($i = 0; $i <count($explodedtopics); $i++) {
			$topicid = substr($explodedtopics[$i],6);
			$stmt = $conn->prepare("INSERT INTO theory_topic (id_theory_content,id_topic) VALUES (:theoryid,:topicid)");
			$stmt->bindParam(':theoryid', $theoryid, PDO::PARAM_STR);
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