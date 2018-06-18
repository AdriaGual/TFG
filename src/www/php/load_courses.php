<?php
	session_start(); 
	$myid = $_SESSION["userid"];
	
	$username = "root";
	$password = "";
	
	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
		//Buscar els cursos als que esta matriculat lusuari.
		$stmt = $conn->prepare("SELECT c.id, c.name, c.parentid FROM enrollment AS e INNER JOIN course AS c ON e.id_course = c.id WHERE id_user = :iduser");
		$stmt->bindParam(':iduser', $myid, PDO::PARAM_STR);
		$stmt->execute();
		$total = $stmt->rowCount();
		if ($total > 0){
			$miscursos = array();
			$punter = 0;
			$id = 1;
			while ($row = $stmt->fetchObject()) {
				$miscursos[$punter]['id'] = $id;
				$miscursos[$punter]['name'] = $row->name;
				$miscursos[$punter]['parent'] = $row->parentid;
				$punter++;
				$id++;
				$idcourse = $row->id;
				if ($row->parentid == null){
					//Consultar topics del curs
					$stmt2 = $conn->prepare("SELECT t.id,t.name FROM course_topic AS ct INNER JOIN topic AS t ON ct.id_topic = t.id WHERE id_course = :idcourse");
					$stmt2->bindParam(':idcourse', $idcourse, PDO::PARAM_STR);
					$stmt2->execute();
					$total2 = $stmt2->rowCount();
					if ($total2 > 0){
						while ($row2 = $stmt2->fetchObject()) {
							$miscursos[$punter]['id'] = $id;
							$miscursos[$punter]['name'] = $row2->name;
							$miscursos[$punter]['parent'] = $idcourse;
							$punter++;
							$idtopic = $id;
							$id++;	
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
									$punter++;
									$id++;
								}
							}
						}
					}
				}
				echo json_encode($miscursos);
			}
		}
		else{
			echo "0_courses_assigned";
		}
			
			
	
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>