<?php
	session_start(); 

	$coursename = $_POST["coursename"];
	$topics = $_POST["topics"];
	
	if (!isset($coursename) || empty($coursename)){
		echo "EMPTYTITLE";
		return;
	}
	
	$username = "root";
	$password = "";

	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		//Insert Course
		$stmt = $conn->prepare("INSERT INTO course (name) VALUES (:name)");
		$stmt->bindParam(':name', $coursename, PDO::PARAM_STR);
		$stmt->execute();
		
		$last_course_id = $conn->lastInsertId();
		
		//Insert Topic
		$thetopics = array();
		
		foreach($topics as $topic){
			
			if (empty($topic["parent"])){
				$inserttopic = 0;
			}
			else{
				//There should be a registry in our tables.
				if (isset($thetopics[$topic['parent']])){
					$inserttopic = $thetopics[$topic['parent']];
				}
				else{
					//error!
					$inserttopic = 0;
				}
			}
			
			$stmt = $conn->prepare("INSERT INTO topic (name,subtopic) VALUES (:name, :subtopic)");
			$stmt->bindParam(':name', $topic['name'], PDO::PARAM_STR);
			$stmt->bindParam(':subtopic', $inserttopic, PDO::PARAM_STR);
			$stmt->execute();
			$last_topic_id = $conn->lastInsertId();

			//Insert into our table
			$thetopics[$topic['id']] = $last_topic_id;
		
			//Insert course_topic		
			$stmt = $conn->prepare("INSERT INTO course_topic (id_course,id_topic) VALUES (:id_course, :id_topic)");
			$stmt->bindParam(':id_course', $last_course_id, PDO::PARAM_STR);
			$stmt->bindParam(':id_topic', $last_topic_id, PDO::PARAM_STR);
			$stmt->execute();
		}	
		$stmt = $conn->prepare("INSERT INTO enrollment (id_user,id_course) VALUES (:iduser, :idcourse)");
		$stmt->bindParam(':iduser', $_SESSION['userid'], PDO::PARAM_STR);
		$stmt->bindParam(':idcourse', $last_course_id, PDO::PARAM_STR);
		$stmt->execute();
		
		echo "OK"; 
		
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>