<?php
/* 
 * Author: Antonio Rodriguez Benitez (c)
 * Date: 19/01/2018 (revised: 23/01/2018)
 * Summary: Obtain JSON exercise (PHP file)
 */
session_start();

class Ret 
{
    public $typeExercise = "";
    public $exerciseDefinition  = "";
}

$return = new Ret();

switch ($_SESSION['TYPE'])
{
    case 0:
        include "./text2ModelDefinitions.php";
        $return->exerciseDefinition = ReloadT2M();
        break;
    case 1:
        include "./model2TextDefinitions.php";
        $return->exerciseDefinition = ReloadM2T();
        break;
    case 2:
        include "./animationsDefinitions.php";
        $return->exerciseDefinition = ReloadAnimation();
        break;
}

$return->typeExercise = (string)$_SESSION['TYPE'];
echo json_encode($return);

?>