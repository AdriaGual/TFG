<?php
/* 
 * Author: Antonio Rodriguez Benitez (c)
 * Date: 22/01/2018 (revised: 23/01/2018)
 * Summary: Obtain JSON exercise (PHP file)
 */

class StateText2Model
{
    public $name = 0;
    public $is_correct = false;
    public $other_solution = array();
    
    function __construct($name,$is_correct,$other_solution)
    { 
        $this->name=$name; 
        $this->is_correct=$is_correct;
        $this->other_solution=$other_solution;
    } 
}

class WebDefT2M
{
    public $statement = "";
    public $correctionEnd = false;
}

class Text2Model
{
    public $correctionEnd = false;
    public $moreHelp = 1;
    public $names = array();
    public $ids = array();
}

class AnswerT2M
{
    public $id = -1;
    public $name = "";
    public $correcte = false;
    
    function __construct($id,$name,$correct)
    { 
        $this->id=$id;
        $this->name=$name;
        $this->correcte=$correct;
    } 
}

function WebContentT2M()
{
    $def = new WebDefT2M();
    $def->statement = $_SESSION['MULTIMEDIA']['STATEMENT'];
    $def->correctionEnd = $_SESSION['MULTIMEDIA']['CORRECTION'];
    return $def; 
}

function LoadT2M()
{
    include("../Language/lang.en.php");
    
    $def = new Text2Model();
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
        $sendName = $SKELETON[$value];
        if ($_SESSION['MULTIMEDIA']['LETTERS'] === true)
        {
            $sendName = removeLetters($SKELETON[$value],3,$SKELETON);
        }
        $def->names[] = new StateText2Model($sendName,false,null);
        $_SESSION['DATA'][$sendName] = $value;
    }
    
    $_SESSION['LOAD'] = json_encode($def);
    
    return $def;
}

/**
* Donat un nom, la llista de posicions dels caràcters que es poden eliminar del nom, la mida de la llista anterior, el número de lletres que com a màxim pot tenir el nom i una llista dels noms anteriorment generats;
*  retorna un nom amb només "numRomain" caràcters de la llista "$listPos" que no s'hagi generat anteriorment (els noms han de ser únics).
* @param type $name Nom ha modificar.
* @param type $listPos Llista de la posició del "$name" que es poden eliminar. 
* @param type $sizeList Mida de la llista "$listPos".
* @param type $numRomain Número màxim de lletres del vector "$listPos" que es poden mantenir (no eliminar) ($numRomain>=0).
* @param type $otherNames Llista de noms generats anteriorment.
* @return type Retorna null si no s'ha pogut generar cap nom o el nom amb només "$numRomain" de la llista "$listPos" mantinguts.
*/
function generateAndVerifyCombinations($name, $listPos, $sizeList, $numRomain, $otherNames) {

   //Comprovem si hem eliminat suficients caràcters.
   if($numRomain >= $sizeList)
   {
       //Comprovem si ja s'ha generat un nom igual anteriorment.
       if(in_array($name, $otherNames))
       {
           return null;
       }
       //En cas contrari, retornem el nom generat.
       else
       {
           return $name;
       }
   }

   //Mentres puguem generar un nou nom amb els elements de la llista de posicions.
   while($sizeList - $numRomain > 0)
   {
       //Treiem el primer element.
       $posList = array_shift($listPos);

       //Decrementem en 1 la mida de la llista.
       $sizeList = $sizeList - 1;

       //Creem una còpia del nom.
       $auxN = $name;

       //Eliminem el caràcter actual.
       $auxN[$posList]='_';

       //Obtenim el nom eliminant els altres n caràcters.
       $auxN = generateAndVerifyCombinations($auxN, $listPos, $sizeList, $numRomain, $otherNames);

       //Si hem obtingut una solució, ja hem acabat.
       if($auxN !== null)
       {
           return $auxN;
       }
   }

   //Si no obtenim cap solució, retornem null.
   return null;
}

/**
* Funció que donat una cadena eliminar x lletres de forma aleatòria.
* @param string $text Text ha eliminar n lletres aleatòries.
* @param type $numMaxLetters Número màxim de lletres que ha de tenir una paraula.
* @param type $others Noms d'elements ja utilitzats (els noms han de ser únics).
* @return string Cadena sense algunes lletres.
*/
function removeLetters($text, $numMaxLetters, $others) {

   //Obtenim la longitud del nom.
   $strLen = strlen($text);

   //Comprovem que el nom tingui una longitud superior al número màxim de lletres.
   if($numMaxLetters >= $strLen)
   {
       return $text;
   }

   //Llista amb totes les posicions de la cadena que no siguin un espai en blanc o un número.
   $validLetters = array();

   //Recorrem totes les posicions del text.
   for($pos = 0 ; $pos < $strLen; $pos++)
   {
       //Si és un espai en blanc no l'incloem a la llista ni en el número de lletres ha treure.
       if($text[$pos] != ' ' && $text[$pos] != '_' && $text[$pos] != '-' && $text[$pos] != '\"' && $text[$pos] != '\'')
       {
           //Comprovem si és un número, en cas afirmatiu el mantenim i decrementem el número d'elements ha terure.
           if($text[$pos] >= '0' && $text[$pos] <= '9')
           {
               $numMaxLetters--; 
           }
           //En cas contrari, afeguim la posició en la llista de posicions.
           else
           {
               array_push($validLetters,$pos);
           }
       }
   }

   //Obtenim el número de posicions disponibles.
   $numValidLetters = count($validLetters);

   //Desordenem la llista de posicions.
   shuffle($validLetters);

   $numMaxLetters = max($numMaxLetters, 0);

   /**
    * Bucle que es repeteix fins que no hem obtingut un nom vàlid.
    * Perquè el nom sigui vàlid, és necessari que no estigui associat a un altre element, degut a que els dos noms serien iguals (indistingibles).
    * 
    * Aquest primer bucle, s'executa mentres el número de lletres que mantenim no superi el número màxim de lletres que es poden treure.
    */
   while($numMaxLetters < $numValidLetters)
   {
       //Generem un nom mantenint "$numMaxLetters" lletres.
       $res = generateAndVerifyCombinations($text, $validLetters, $numValidLetters, $numMaxLetters, $others);

       //Si el resultat és diferent a null, ja tenim el nom.
       if($res !== null)
       {
           return $res;
       }

       //Incrementem el número de lletres ha mantenir.
       $numMaxLetters++;
   }

   //Si no hem pogut generat cap nom sense x caràcters, retornem el nom complert.
   return $text;
}

function SetTryT2M()
{
    $_SESSION['TYPE'] = 0;
    $_SESSION['MULTIMEDIA'] = array();
    $_SESSION['MULTIMEDIA']['HELP'] = $_POST['help'];
    $_SESSION['MULTIMEDIA']['STATEMENT'] = $_POST['statement'];
    $_SESSION['MULTIMEDIA']['RANDOM'] = intval($_POST['random']);
    $_SESSION['MULTIMEDIA']['ERRORS'] = intval($_POST['errors']);
    $_SESSION['MULTIMEDIA']['CORRECTION'] = ($_POST['correction'] === "atTheEnd");
    $_SESSION['MULTIMEDIA']['LETTERS'] = ($_POST['letters'] == 1);
    $_SESSION['MULTIMEDIA']['MULTIMEDIA'] = json_decode($_POST['multimedia']);
}

?>