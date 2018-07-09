<?php
    /* 
     * Author: Antonio Rodriguez Benitez (c)
     * Date: 20/01/2018 (revised: 20/01/2018)
     * Summary: Obtain JSON exercise (PHP file)
     */

class dictionary
{
    public $key = "";
    public $value = "";
    
    function __construct($key,$value)
    { 
        $this->key=$key; 
        $this->value=$value;
    } 
}

class translationsM2T
{
    public $gui = array();
    public $advertiments = array();
    
    public function JSON()    
    {
        include "../Language/lang.en.php";
        
        $this->gui = $this->advertiments = array();
        
        foreach ($GUI_SELECTION_EXERCISE as $k => $v) 
        {
            $this->gui[] = new dictionary($k,$v);
        }
        
        foreach ($ADVERTIMENTS_SELECTION_EXERCISE as $k => $v) 
        {
            $this->advertiments[] = new dictionary($k,$v);
        }
        
        return json_encode($this);
    }
}

class translationEditor
{
    public $gui = array();
    public $elems = array();
    
    public function JSON()
    {
        include "../Language/lang.en.php";
        
        $this->gui = $this->elems = array();
        
        foreach ($GUI_SELECTION_EDITOR as $k => $v) 
        {
            $this->gui[] = new dictionary($k,$v);
        }
        
        foreach ($SKELETON as $k => $v) 
        {
            $this->elems[] = new dictionary($k,$v);
        }
        
        return json_encode($this);
    }
}


session_start();

switch ($_POST['type'])
{
    case 0:
        $te = new translationEditor();
        echo $te->JSON();
        return;
    case 1:
        $te = new translationsM2T();
        echo $te->JSON();
        return;
    case 2:
        return null;
    case 3:
        return null;
    default:
        return "ERROR en la traduccio";
}

?>