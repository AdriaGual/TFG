<?php
/* 
 * Author: Antonio Rodriguez Benitez (c)
 * Date: 19/01/2018 (revised: 23/01/2018)
 * Summary: Obtain JSON exercise (PHP file)
 */
session_start();

include("../Language/lang.en.php");

class Ret 
{
    public $typeExercise = "";
    public $webContent = "";
    public $exerciseDefinition  = "";
}

$return = new Ret();

$_SESSION['ID'] = $_POST['id']; // Identificador de l'exercici

$_SESSION['DATA'] = array();



if ($_SESSION['ID'] != -1) // No es test, hem d'obtenir el tipus
{
    $_SESSION['TYPE'] = 1;
}

$_SESSION['MULTIMEDIA']['CURRENT_ERRORS'] = 0;

switch ($_SESSION['TYPE'])
{
    case 0:
        include "./text2ModelDefinitions.php";
        $return->exerciseDefinition = json_encode(LoadT2M());
        $return->webContent = json_encode(WebContentT2M());
        break;
    case 1:
        include "./model2TextDefinitions.php";
        $return->exerciseDefinition = json_encode(LoadM2T());
        $return->webContent = json_encode(WebContentM2T());
        break;
    case 2:
        include "./animationsDefinitions.php";
        $return->exerciseDefinition = json_encode(LoadAnimation());
        $return->webContent = json_encode(WebContentAnimation());
        break;
}

$return->typeExercise = (string)$_SESSION['TYPE'];
echo json_encode($return);

?>