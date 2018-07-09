<?php
/* 
 * Author: Antonio Rodriguez Benitez (c)
 * Date: 19/01/2018 (revised: 23/01/2018)
 * Summary: Obtain JSON exercise (PHP file)
 */

session_start();

include("../Language/lang.en.php");

$return = -1;

switch ($_POST['type']) 
{
    case "selection":
        include "./text2ModelDefinitions.php";
        $return = SetTryT2M();
        break;
    case "named":
        include "./model2TextDefinitions.php";
        $return = SetTryM2T();
        break;
    case "animated":
        include "./animationsDefinitions.php";
        $return = SetTryAnimation();
        break;
}

echo json_encode($return);

?>