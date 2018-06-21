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
			$miscursos = array();
			$punter = 0;
			$id = 1;
			$stmt = $conn->prepare("SELECT * FROM course WHERE name = :name");
			$stmt->bindParam(':name', $name, PDO::PARAM_STR);
			$stmt->execute();
			
			$total = $stmt->rowCount();
			if ($total > 0){
				$row = $stmt->fetchObject();
				$idcourse = $row -> id;
			}
			else{
				echo "course_not_found";
			}

			$stmt2 = $conn->prepare("SELECT t.id,t.name FROM course_topic AS ct INNER JOIN topic AS t ON ct.id_topic = t.id WHERE id_course = :idcourse");
			$stmt2->bindParam(':idcourse', $idcourse, PDO::PARAM_STR);
			$stmt2->execute();
			$total2 = $stmt2->rowCount();
			if ($total2 > 0){
				while ($row2 = $stmt2->fetchObject()) {
					$miscursos[$punter]['id'] = $id;
					$miscursos[$punter]['name'] = $row2->name;
					$miscursos[$punter]['parent'] = null;
					$miscursos[$punter]['expanded'] = true;
					$punter++;//2
					$idtopic = $id;//2
					$idtopicSQL = $row2->id;//1
					$id++;//3	
					//Buscar les teories d'un topic
					$stmt4 = $conn->prepare("SELECT tc.title FROM theory_content AS tc INNER JOIN theory_topic AS t ON tc.id = t.id_theory_content WHERE t.id_topic = :idtopic");
					$stmt4->bindParam(':idtopic', $row2->id, PDO::PARAM_STR);
					$stmt4->execute();
					$total4 = $stmt4->rowCount();
					if ($total4 > 0){
						while ($row4 = $stmt4->fetchObject()) {
							$miscursos[$punter]['id'] = $id;
							$miscursos[$punter]['name'] = $row4->title;
							$miscursos[$punter]['parent'] = $idtopic;
							$punter++;//3
							$id++;//4
						}
					}
					//Buscar els exercicis d'un topic
					$stmt4 = $conn->prepare("SELECT tc.statement FROM exercice_content AS tc INNER JOIN topic_exercice AS t ON tc.id = t.id_exercice_content WHERE t.id_topic = :idtopic");
					$stmt4->bindParam(':idtopic', $row2->id, PDO::PARAM_STR);
					$stmt4->execute();
					$total4 = $stmt4->rowCount();
					if ($total4 > 0){
						while ($row4 = $stmt4->fetchObject()) {
							$miscursos[$punter]['id'] = $id;
							$miscursos[$punter]['name'] = $row4->statement;
							$miscursos[$punter]['parent'] = $idtopic;
							$punter++;//3
							$id++;//4
						}
					}
					//Mirar si hi ha algun subtopic que tingui aquest topic de pare
					$stmt3 = $conn->prepare("SELECT id,name FROM topic WHERE subtopic = :idtopic");			
					$stmt3->bindParam(':idtopic', $row2->id, PDO::PARAM_STR);
					$stmt3->execute();
					$total3 = $stmt3->rowCount();
					if ($total3 > 0){
						while ($row3 = $stmt3->fetchObject()) {
							$miscursos[$punter]['id'] = $id;
							$miscursos[$punter]['name'] = $row3->name;
							$miscursos[$punter]['parent'] = $idtopic;
							$punter++;//4
							$idtopic2 = $id;//2
							$id++;//5
							$stmt4 = $conn->prepare("SELECT tc.title FROM theory_content AS tc INNER JOIN theory_topic AS t ON tc.id = t.id_theory_content WHERE t.id_topic = :idtopic");
							$stmt4->bindParam(':idtopic', $row3->id, PDO::PARAM_STR);
							$stmt4->execute();
							$total4 = $stmt4->rowCount();
							if ($total4 > 0){
								while ($row4 = $stmt4->fetchObject()) {
									$miscursos[$punter]['id'] = $id;
									$miscursos[$punter]['name'] = $row4->title;
									$miscursos[$punter]['parent'] = $idtopic2;
									$punter++;//3
									$id++;//4
								}
							}
							
						}
					}
				}
				echo json_encode($miscursos); 
			}
		}
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>