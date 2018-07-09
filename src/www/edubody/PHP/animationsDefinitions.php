<?php
    /* 
     * Author: Antonio Rodriguez Benitez (c)
     * Date: 21/01/2018 (revised: 21/01/2018)
     * Summary: Obtain JSON exercise (PHP file)
     */

class AnimationDef
{
    public $correctionEnd = false;
    public $moreHelp = 1;
    public $list = array();
}

class WebDefAnim
{
    public $question = "";
    public $answerA = "";
    public $answerB = "";
}

class ReturnM2T
{
    public $values = array();
}

function LoadAnimation()
{
    $def = new AnimationDef();
    $def->list = $_SESSION['MULTIMEDIA']['MULTIMEDIA']->list;
    return $def; 
}

function WebContentAnimation()
{
    $def = new WebDefAnim();
    $def->question = $_SESSION['MULTIMEDIA']['QUESTION'];
    $def->answerA = $_SESSION['MULTIMEDIA']['A'];
    $def->answerB = $_SESSION['MULTIMEDIA']['B'];
    return $def; 
}

function SetTryAnimation()
{
    $_SESSION['TYPE'] = 2;
    $_SESSION['MULTIMEDIA'] = array();
    $_SESSION['MULTIMEDIA']['QUESTION'] = $_POST['question'];
    $_SESSION['MULTIMEDIA']['A'] = $_POST['a'];
    $_SESSION['MULTIMEDIA']['B'] = $_POST['b'];
    $_SESSION['MULTIMEDIA']['CORRECTED'] = $_POST['corrected'];
    $_SESSION['MULTIMEDIA']['MULTIMEDIA'] = json_decode($_POST['multimedia']);
}

?>

