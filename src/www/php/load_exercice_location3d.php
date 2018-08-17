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
			$row = $stmt->fetchObject();
			$idexercise = $row->id;
			
			$stmt2 = $conn->prepare("SELECT * FROM location3d_exercise_answers WHERE id_exercise = :idexercise");
			$stmt2->bindParam(':idexercise', $idexercise, PDO::PARAM_STR);
			$stmt2->execute();
			
			$total = $stmt2->rowCount();
			$punter = 0;
			if ($total > 0){
				$miscursos = array();
				/*while ($row2 = $stmt2->fetchObject()) {
					$material = explode("|",$row2->material);
					$elements = explode("|",$row2->matrix);
					$vertices = explode("|",$row2->vertices);
					$normals = explode("|",$row2->normals);
					$faces = explode("|",$row2->faces);
					$mesh = explode("|",$row2->mesh);
					
					$miscursos[$punter]['mesh']['geometries'][0]['uuid'] = $mesh[0];
					$miscursos[$punter]['mesh']['geometries'][0]['type'] = $mesh[1];

					$miscursos[$punter]['mesh']['geometries'][0]['data']['vertices']=$vertices;
					$miscursos[$punter]['mesh']['geometries'][0]['data']['normals']=$normals;
					$miscursos[$punter]['mesh']['geometries'][0]['data']['faces']=$faces;
					
					$miscursos[$punter]['material']['metadata']['version']=$material[0];
					$miscursos[$punter]['material']['metadata']['type']=$material[1];
					$miscursos[$punter]['material']['metadata']['generator']=$material[2];
					$miscursos[$punter]['material']['uuid'] = $material[3];
					$miscursos[$punter]['material']['type'] = $material[4];
					$miscursos[$punter]['material']['color'] = $material[5];
					$miscursos[$punter]['material']['emissive'] = $material[6];
					$miscursos[$punter]['material']['specular'] = $material[7];
					$miscursos[$punter]['material']['shininess'] = $material[8];
					$miscursos[$punter]['material']['depthFunc'] = $material[9];
					$miscursos[$punter]['material']['depthTest'] = $material[10];
					$miscursos[$punter]['material']['depthWrite'] = $material[11];
					$miscursos[$punter]['matrix']['elements']= $elements;
					$punter++;
				}*/
				$row2 = $stmt2->fetchObject();
				$js = $row2->matrix;
				$miscursos[0]['matrix'] = $js;
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