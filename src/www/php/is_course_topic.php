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
			$stmt = $conn->prepare("SELECT * FROM course WHERE name = :name");
			$stmt->bindParam('name', $name, PDO::PARAM_STR);
			$stmt->execute();
			
			$total = $stmt->rowCount();
			if ($total > 0){
				$row = $stmt->fetchObject();
				$_SESSION['course'] = $row->name;
				echo "course";
			}
			else{
				$stmt2 = $conn->prepare("SELECT * FROM topic WHERE name = :name");
				$stmt2->bindParam('name', $name, PDO::PARAM_STR);
				$stmt2->execute();
			
				$total = $stmt2->rowCount();
				if ($total > 0){
					$row = $stmt2->fetchObject();
					echo "topic";
				}
				else{
					$stmt2 = $conn->prepare("SELECT * FROM theory_content WHERE title = :name");
					$stmt2->bindParam('name', $name, PDO::PARAM_STR);
					$stmt2->execute();
				
					$total = $stmt2->rowCount();
					if ($total > 0){
						$row = $stmt2->fetchObject();
						echo "theory";
					}
					else{
						$stmt2 = $conn->prepare("SELECT * FROM exercice_content WHERE statement = :name");
						$stmt2->bindParam('name', $name, PDO::PARAM_STR);
						$stmt2->execute();
					
						$total = $stmt2->rowCount();
						if ($total > 0){
							$row = $stmt2->fetchObject();
							echo "exercice";
						}
						else{
							echo "bad_login";
						}
					}
				}
			}
		}
		$conn = null;
	}
	catch(PDOException $e)
	{
		 echo "Error: " . $e->getMessage();
	}
?>