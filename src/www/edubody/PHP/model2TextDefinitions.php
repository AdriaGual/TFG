<?php
    /* 
     * Author: Antonio Rodriguez Benitez (c)
     * Date: 21/01/2018 (revised: 21/01/2018)
     * Summary: Obtain JSON exercise (PHP file)
     */

class StateModel2Text 
{
    public $id = 0;
    public $is_correct = false;
    public $other_solution = array();
    
    function __construct($id,$is_correct,$other)
    { 
        $this->id=$id; 
        $this->is_correct=$is_correct;
        $this->other_solution=$other;
    } 
}

class WebDefM2T
{
    public $statement = "";
    public $correctionEnd = false;
}

class Model2Text
{
    public $correctionEnd = false;
    public $moreHelp = 1;
    public $ids = array();
}

class AnswerM2T 
{
    public $id = -1;
    public $name  = "";
    public $correcte = false;
    
    function __construct($id,$name,$correcte)
    { 
        $this->id=$id; 
        $this->correcte=$correcte;
        $this->name=$name;
    } 
}

class ReturnM2T
{
    public $values = array();
}

function ReloadM2T()
{
    return $_SESSION['LOAD'];
}

function WebContentM2T()
{
    $def = new WebDefM2T();
    $def->statement = $_SESSION['MULTIMEDIA']['STATEMENT'];
    $def->correctionEnd = $_SESSION['MULTIMEDIA']['CORRECTION'];
    return $def; 
}

function LoadM2T()
{
    $def = new Model2Text();
    $def->correctionEnd = $_SESSION['MULTIMEDIA']['CORRECTION'];
    $def->moreHelp = $_SESSION['MULTIMEDIA']['HELP'];
    
    $ids = array();
    $others = array();
        
    for ($i = 1; $i <= 130; $i++) // 130 es el numero d'ossos.
    {
        if (in_array($i, $_SESSION['MULTIMEDIA']['MULTIMEDIA']->include, true))
        {
            $ids[] = $i;
        }
        else if (in_array($i, $_SESSION['MULTIMEDIA']['MULTIMEDIA']->exclude,true) === false)
        {
            $others[] = $i;
        }
    }

    if ($_SESSION['MULTIMEDIA']['RANDOM'] > 0)
    {
        if (count($others) > $_SESSION['MULTIMEDIA']['RANDOM'])
        {
            $randIDS = array_rand($others, $_SESSION['MULTIMEDIA']['RANDOM']);
            
            if ($randIDS > 1)
            {
                foreach ($randIDS as $randValue)
                {
                    $ids[] = $others[$randValue];
                }    
            }
            else
            {
                $ids[] = $others[$randValue];
            }
        }
        else
        {
            $ids = array_merge($ids, $others);
        }
    }

    
    foreach ($ids as $value)
    {
        $stateRareRare = new StateModel2Text($value,false,array());
        $def->ids[] = $stateRareRare;
        $_SESSION['DATA'][] = $value; // Em guardo el ID a part per facilitar la correcció
    }
    
    $_SESSION['LOAD'] = json_encode($def);
    return $def; 
}

function SetTryM2T()
{
    $_SESSION['TYPE'] = 1;
    $_SESSION['MULTIMEDIA'] = array();
    $_SESSION['MULTIMEDIA']['HELP'] = $_POST['help'];
    $_SESSION['MULTIMEDIA']['STATEMENT'] = $_POST['statement'];
    $_SESSION['MULTIMEDIA']['RANDOM'] = intval($_POST['random']);
    $_SESSION['MULTIMEDIA']['ERRORS'] = intval($_POST['errors']);
    $_SESSION['MULTIMEDIA']['CORRECTION'] = ($_POST['correction'] === "atTheEnd");
    $_SESSION['MULTIMEDIA']['MULTIMEDIA'] = json_decode($_POST['multimedia']);
}


?>