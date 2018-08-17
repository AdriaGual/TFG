<?php
	session_start(); 

	$title= $_POST["title"];
	$description= $_POST["description"];
	$question= $_POST["question"];
	$help= $_POST["help"];
	$new_models = $_POST["new_models"];
	$topics[] = $_POST["topics"];
	
	$username = "root";
	$password = "";

	try {
		$conn = new PDO("mysql:host=localhost;dbname=elearning", $username, $password);
		// set the PDO error mode to exception
		$b = 7;
		$cleanData = json_decode( html_entity_decode( stripslashes ($new_models ) ),true );
		//echo implode("|",$cleanData[0]["matrix"]["elements"])," \n",implode("|",$cleanData[0]["material"]["metadata"])," \n",implode("|",$cleanData[0]["material"]),"\n",$cleanData[0]["name"],"\n",$cleanData[0]["path"],"\n",$cleanData[0]["solution"];
		
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		$stmt = $conn->prepare("INSERT INTO exercice_content (statement,description,question,help,type_component) VALUES (:title,:description,:question,:help,:type_component)");
		$stmt->bindParam(':title', $title, PDO::PARAM_STR);
		$stmt->bindParam(':description', $description, PDO::PARAM_STR);
		$stmt->bindParam(':question', $question, PDO::PARAM_STR);
		$stmt->bindParam(':help', $help, PDO::PARAM_STR);
		$stmt->bindParam(':type_component', $b, PDO::PARAM_STR);
		$stmt->execute();
		$exerciseid = $conn->lastInsertId();
		
		
		for ($i = 0; $i <count($cleanData); $i++) {
			//var_dump($cleanData[$i]["materials"][0]["object"]["uuid"]);
			$metadatamesh = implode("|",$cleanData[$i]["mesh"]["metadata"]);
			$geometriesuuid = "|".$cleanData[$i]["mesh"]["geometries"][0]['uuid'];
			$geometriestype = "|".$cleanData[$i]["mesh"]["geometries"][0]['type'];
			$geometriesvertices = implode("|",$cleanData[$i]["mesh"]["geometries"][0]['data']['vertices']);
			$geometriesfaces = implode("|",$cleanData[$i]["mesh"]["geometries"][0]['data']['faces']);
			$geometriesnormals = implode("|",$cleanData[$i]["mesh"]["geometries"][0]['data']['normals']);
			$mesh = $metadatamesh.$geometriesuuid.$geometriestype;
			/*$objectuuid = $cleanData[$i]["object"]["uuid"];
			$objectuuid = $cleanData[$i]["object"]["type"];
			$objectuuid =  implode("|",$cleanData[$i]["matrix"]);
			$objectuuid = $cleanData[$i]["object"]["geometry"];
			$objectuuid = $cleanData[$i]["object"]["material"];*/
			
			$metadata = implode("|",$cleanData[$i]["material"]["metadata"]);
			$material = "|".$cleanData[$i]["material"]["uuid"];
			$material2 = "|".$cleanData[$i]["material"]["type"];
			$material3= "|".$cleanData[$i]["material"]["color"];
			$material4= "|".$cleanData[$i]["material"]["emissive"];
			$material5= "|".$cleanData[$i]["material"]["specular"];
			$material6= "|".$cleanData[$i]["material"]["shininess"];
			$material7= "|".$cleanData[$i]["material"]["depthFunc"];
			$material8= "|".$cleanData[$i]["material"]["depthTest"];
			$material9= "|".$cleanData[$i]["material"]["depthWrite"];
			$matmeta = $metadata.$material.$material2.$material3.$material4.$material5.$material6.$material7.$material8.$material9;
			
			$elements= implode("|",$cleanData[$i]["matrix"]["elements"]);
			$name = $cleanData[$i]["name"];
			$path = $cleanData[$i]["path"];
			$solution = $cleanData[$i]["solution"];
			
			$stmt = $conn->prepare("INSERT INTO location3d_exercise_answers (id_exercise,matrix,material,path,name,solution,mesh,vertices,normals,faces) VALUES (:exerciseid,:matrix,:material,:path,:name,:solution,:mesh,:vertices,:normals,:faces)");
			$stmt->bindParam(':exerciseid', $exerciseid, PDO::PARAM_STR);
			$stmt->bindParam(':matrix', $elements, PDO::PARAM_STR);
			$stmt->bindParam(':material', $matmeta, PDO::PARAM_STR);
			$stmt->bindParam(':mesh', $mesh, PDO::PARAM_STR);
			$stmt->bindParam(':vertices', $geometriesvertices, PDO::PARAM_STR);
			$stmt->bindParam(':normals', $geometriesnormals, PDO::PARAM_STR);
			$stmt->bindParam(':faces', $geometriesfaces, PDO::PARAM_STR);
			$stmt->bindParam(':name', $name, PDO::PARAM_STR);
			$stmt->bindParam(':path', $path, PDO::PARAM_STR);
			$stmt->bindParam(':solution', $solution, PDO::PARAM_STR);
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