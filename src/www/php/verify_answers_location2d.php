<?php
	session_start(); 
	$myid = $_SESSION["userid"];
	$points = $_POST["points"];
	$name = $_POST["name"];
	$username = "root";
	$password = "";
	
	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	
		$stmt = $conn->prepare("SELECT * FROM exercice_content WHERE statement = :name");
		$stmt->bindParam(':name', $name, PDO::PARAM_STR);
		$stmt->execute();
		$row = $stmt->fetchObject();
		
		$idexercise = $row->id;
		$stmt2 = $conn->prepare("SELECT * FROM location2d_exercise_answers WHERE id_exercise = :idexercise");
		$stmt2->bindParam(':idexercise', $idexercise, PDO::PARAM_STR);
		$stmt2->execute();
		$total = $stmt2->rowCount();
		$correcte = 1;
		if ($total > 0){
			if (count($points)==$total){
				while ($row2 = $stmt2->fetchObject()) {
					$trobat = false;
					for ($i = 0; $i <count($points); $i++) {
						$x = $points[$i]["x"] * 1.8;
						$y = $points[$i]["y"] * 1.2;
						$d = sqrt( pow(abs(($x-$row2->x)),2)+pow(abs(($y-$row2->y)),2));
						
						/*echo "points[i][x]: ",$points[$i]["x"], "\n";
						echo "points[i][y]: ",$points[$i]["y"], "\n";
						echo "row2->x: ",$row2->x, "\n";
						echo "row2->y: ",$row2->y, "\n";
						echo "d: ",$d, "\n";
						echo "radius: ",$row2->radius, "\n";
						echo "\n","\n";*/
						
						if ($d < $row2->radius){
							$trobat=true;
						}
						
						
					}
					if (!$trobat){
						$correcte = 0;
					}
					//echo $trobat,"\n","\n";
				}
				
			}
			else {
				$correcte=0;
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