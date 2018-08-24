<?php 

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['files'])) {
        $errors = [];
		if (!is_dir('C:/Users/walie/Desktop/web-app/build/models')){
			mkdir('C:/Users/walie/Desktop/web-app/build/models',0777);
		}
        $path = 'C:/Users/walie/Desktop/web-app/build/models/';
        $extensions = ['json'];

        $all_files = count($_FILES['files']['tmp_name']);

        for ($i = 0; $i < $all_files; $i++) {  
            $file_name = $_FILES['files']['name'][$i];
            $file_tmp = $_FILES['files']['tmp_name'][$i];
            $file_type = $_FILES['files']['type'][$i];
            $file_size = $_FILES['files']['size'][$i];
			$exploded = explode('.', $_FILES['files']['name'][$i]);
			$endexploded = end($exploded);
            $file_ext = strtolower($endexploded);

            $file = $path . $file_name;

            if (!in_array($file_ext, $extensions)) {
                $errors[] = 'Extension not allowed: ' . $file_name . ' ' . $file_type;
            }

            if ($file_size > 2097152) {
                $errors[] = 'File size exceeds limit: ' . $file_name . ' ' . $file_type;
            }

            if (empty($errors)) {
				echo $file_tmp," ",$file;
                move_uploaded_file($file_tmp, $file);
            }
        }

        if ($errors) print_r($errors);
    }
}