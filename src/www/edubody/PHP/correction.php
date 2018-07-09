<?php
    /* 
     * Author: Antonio Rodriguez Benitez (c)
     * Date: 21/01/2018 (revised: 22/01/2018)
     * Summary: Obtain JSON exercise (PHP file)
     */

session_start();

include("../Language/lang.en.php");

class correctionReturn
{
    public $unityReturn;
    public $webReturn;

    public function __construct(){
        $this->unityReturn = new UnityReturn();
        $this->webReturn = new WebReturn();
    }
}

class UnityReturn
{
    public $values = array();
}

class WebReturn
{
    public $endExercise = 0;
    public $correctionValue = 0;
    public $errors = 0;
    public $missing = 0;
}

//Obtenim la llista de les respostes.
if (isset($_POST['ids']))
{
    $auxList = json_decode($_POST['ids'], true);
    if(array_key_exists("values", $auxList))
    {
        $llistaResp = $auxList["values"];
    }
    else
    {
       $llistaResp = array(); 
    }
}
else
{
    $llistaResp = array();
}

$return = new correctionReturn();

$return->webReturn->correctionValue = 1;
$return->webReturn->missing = 0;

if (isset($_SESSION['TYPE']))
{
    switch ($_SESSION['TYPE'])
    {
        case 0:
            include "./text2ModelDefinitions.php";
            
            foreach ($llistaResp as $item_pair) 
            {
                if ($_SESSION['DATA'][$item_pair["name"]] == $item_pair["idMesh"])
                {
                    // TODO: Falta guardar-lo com a correcte a la BDD ( Aixó en el moment de la implementació final ) 
                    $return->unityReturn->values[] = new AnswerT2M($item_pair["idMesh"],$item_pair["name"],true);
                    
                    $sesiLoad = json_decode($_SESSION['LOAD']);
                    foreach ($sesiLoad->names as $def)
                    {
                        if ($def->name == $item_pair["name"])
                        {
                            $def->other_solution[] = $item_pair["idMesh"];
                            $def->is_correct = true;
                        }
                    }
                    $_SESSION['LOAD'] = json_encode($sesiLoad);
                    
                    unset($_SESSION['DATA'][$item_pair["name"]]); 
                }
                else
                {
                    // TODO: Falta guardar-lo com a incorrecte a la BDD ( Aixó en el moment de la implementació final ) 
                    $return->unityReturn->values[] = new AnswerT2M($item_pair["idMesh"],$item_pair["name"],false);
                    
                    $sesiLoad = json_decode($_SESSION['LOAD']);
                    foreach ($sesiLoad->names as $def)
                    {
                        if ($def->name == $item_pair["name"])
                        {
                            $def->other_solution[] = $item_pair["idMesh"];
                            $def->is_correct = false;
                        }
                    }
                    $_SESSION['LOAD'] = json_encode($sesiLoad);
                    
                    $_SESSION['MULTIMEDIA']['CURRENT_ERRORS']++;
                    $return->webReturn->correctionValue = 0;
                }
            }
            
            foreach (json_decode($_SESSION['LOAD'])->names as $def)
            {
                if (count($def->other_solution) < 1)
                {
                    $return->webReturn->missing++;
                }
            }
            
            if (($_SESSION['MULTIMEDIA']['ERRORS'] - $_SESSION['MULTIMEDIA']['CURRENT_ERRORS']) < 0)
            {
                $return->webReturn->endExercise = 1;
                $return->webReturn->errors = $_SESSION['MULTIMEDIA']['CURRENT_ERRORS'];
            }

            if (count($_SESSION['DATA']) < 1)
            {
                // TODO: Indicar que s'ha acabat l'exercici  
                $return->webReturn->endExercise = 1;
                $return->webReturn->errors = $_SESSION['MULTIMEDIA']['CURRENT_ERRORS'];
                $_SESSION['ID'] = null;
                $_SESSION['TYPE'] = null;
                $_SESSION['DATA'] = null;
                $_SESSION['LOAD'] = null;
            }
            break;
        case 1:
            include "./model2TextDefinitions.php";
            
            foreach ($llistaResp as $item_pair) 
            {
                if(strcasecmp($SKELETON[$item_pair["idMesh"]], $item_pair["name"]) == 0)
                //if ($SKELETON[$item_pair["idMesh"]] == $item_pair["name"])
                {
                    // TODO: Falta guardar-lo com a correcte a la BDD ( Aixó en el moment de la implementació final ) 
                    $return->unityReturn->values[] = new AnswerM2T($item_pair["idMesh"],$item_pair["name"],true);
                    
                    $index_array = array_search($item_pair["idMesh"], $_SESSION['DATA']);
                    unset($_SESSION['DATA'][$index_array]); 
                    
                    $sesiLoad = json_decode($_SESSION['LOAD']);
                    foreach ($sesiLoad->ids as $def)
                    {
                        if ($def->id == $item_pair["idMesh"])
                        {
                            $def->other_solution[] = $item_pair["name"];
                            $def->is_correct = true;
                        }
                    }
                    $_SESSION['LOAD'] = json_encode($sesiLoad);
                }
                else
                {
                    // TODO: Falta guardar-lo com a incorrecte a la BDD ( Aixó en el moment de la implementació final ) 
                    $return->unityReturn->values[] = new AnswerM2T($item_pair["idMesh"],$item_pair["name"],false);
                        
                    $sesiLoad = json_decode($_SESSION['LOAD']);
                    foreach ($sesiLoad->ids as $def)
                    {
                        if ($def->id == $item_pair["idMesh"])
                        {
                            $def->other_solution[] = $item_pair["name"];
                            $def->is_correct = false;
                        }
                    }
                    $_SESSION['LOAD'] = json_encode($sesiLoad);
                    $return->webReturn->correctionValue = 0;
                    $_SESSION['MULTIMEDIA']['CURRENT_ERRORS']++;
                }
            }
            
            foreach (json_decode($_SESSION['LOAD'])->ids as $def)
            {
                if (count($def->other_solution) < 1)
                {
                    $return->webReturn->missing++;
                }
            }
            
            if (($_SESSION['MULTIMEDIA']['ERRORS'] - $_SESSION['MULTIMEDIA']['CURRENT_ERRORS']) < 0)
            {
                $return->webReturn->endExercise = 1;
                $return->webReturn->errors = $_SESSION['MULTIMEDIA']['CURRENT_ERRORS'];
            }

            if (count($_SESSION['DATA']) < 1)
            {
                // TODO: Indicar que s'ha acabat l'exercici  
                $return->webReturn->endExercise = 1;
                $return->webReturn->errors = $_SESSION['MULTIMEDIA']['CURRENT_ERRORS'];
                $_SESSION['ID'] = null;
                $_SESSION['TYPE'] = null;
                $_SESSION['DATA'] = null;
                $_SESSION['LOAD'] = null;
            }
            break;
        case 2:
            if ($_SESSION['MULTIMEDIA']['CORRECTED'] !== $_POST['valueAnswer'])
            {
                $return->webReturn->correctionValue = 0;
                $return->webReturn->errors = 1;
            }
            else
            {
                $return->webReturn->correctionValue = 1;
                $return->webReturn->errors = 0;
            }
            
            $return->webReturn->endExercise = 1;
            $_SESSION['ID'] = null;
            $_SESSION['TYPE'] = null;
            $_SESSION['DATA'] = null;
            break;
    }
}

echo json_encode($return);
?>