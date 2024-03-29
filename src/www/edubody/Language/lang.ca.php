<?php
/* 
 * Author: Antonio Rodriguez Benitez (c)
 * Date: 20/01/2018 (revised: 23/01/2018)
 * Summary: Obtain JSON exercise (PHP file)
 */

$SKELETON = array(
    "1"=>"Costella 1",
    "2"=>"Costella 2",
    "3"=>"Costella 3",
    "4"=>"Costella 4",
    "5"=>"Costella 5",
    "6"=>"Costella 6",
    "7"=>"Costella 7",
    "8"=>"Costella 8",
    "9"=>"Costella 9",
    "10"=>"Costella 10",
    "11"=>"Costella 11",
    "12"=>"Costella 12",
    "13"=>"Esternum",
    "14"=>"Calavera",
    "15"=>"Mandibula",
    "16"=>"Molar",
    "17"=>"Molar 1",
    "18"=>"Molar 2",
    "19"=>"Molar 3",
    "20"=>"Molar 4",
    "21"=>"Molar 5",
    "22"=>"Molar 6",
    "23"=>"Molar 7",
    "24"=>"Molar 8",
    "25"=>"Molar 9",
    "26"=>"Molar 10",
    "27"=>"Premolar",
    "28"=>"Premolar 1",
    "29"=>"Premolar 2",
    "30"=>"Premolar 3",
    "31"=>"Premolar 4",
    "32"=>"Premolar 5",
    "33"=>"Premolar 6",
    "34"=>"Canino",
    "35"=>"Canino 1",
    "36"=>"Canino 2",
    "37"=>"Canino 3",
    "38"=>"Incisiu central",
    "39"=>"Incisiu central 1",
    "40"=>"Incisiu central 2",
    "41"=>"Incisiu central 3",
    "42"=>"Incisiu central 4",
    "43"=>"Incisiu central 5",
    "44"=>"Incisiu central 6",
    "45"=>"Incisiu lateral",
    "46"=>"C1",
    "47"=>"C2",
    "48"=>"C3",
    "49"=>"C4",
    "50"=>"C5",
    "51"=>"Omoplat",
    "52"=>"Clavícula",
    "53"=>"Humer",
    "54"=>"Radi",
    "55"=>"Cubit",
    "56"=>"Trapezoide",
    "57"=>"Grande",
    "58"=>"Ganchoso",
    "59"=>"Trapeci",
    "60"=>"Pisiforme",
    "61"=>"Semilunar",
    "62"=>"Escaifode",
    "63"=>"Metacarpià",
    "64"=>"Metacarpià 2",
    "65"=>"Metacarpià 3",
    "66"=>"Metacarpià 4",
    "67"=>"Metacarpià 5",
    "68"=>"Falanges proximales",
    "69"=>"Falanges proximales 1",
    "70"=>"Falanges proximales 2",
    "71"=>"Falanges proximales 3",
    "72"=>"Falanges proximales 4",
    "73"=>"Falanges media",
    "74"=>"Falanges media 1",
    "75"=>"Falanges media 2",
    "76"=>"Falanges media 3",
    "77"=>"Falanges distales",
    "78"=>"Falanges distales 1",
    "79"=>"Falanges distales 2",
    "80"=>"Falanges distales 3",
    "81"=>"Falanges distales 4",
    "82"=>"D1",
    "83"=>"D2",
    "84"=>"D3",
    "85"=>"D4",
    "86"=>"D5",
    "87"=>"D6",
    "88"=>"D7",
    "89"=>"D8",
    "90"=>"D9",
    "91"=>"D10",
    "92"=>"D11",
    "93"=>"D12",
    "94"=>"L1",
    "95"=>"L2",
    "96"=>"L3",
    "97"=>"L4",
    "98"=>"L5",
    "99"=>"Pelvis",
    "100"=>"Sacre",
    "101"=>"Femur",
    "102"=>"Rotula",
    "103"=>"Tibia",
    "104"=>"Peroné",
    "105"=>"Calcaneo",
    "106"=>"Astragalo",
    "107"=>"Cuboide",
    "108"=>"Navicular",
    "109"=>"Primer coneiforme",
    "110"=>"Segon coneiforme",
    "111"=>"Tercer coneiforme",
    "112"=>"Metatarsia",
    "113"=>"Metatarsia 1",
    "114"=>"Metatarsia 2",
    "115"=>"Metatarsia 3",
    "116"=>"Metatarsia 4",
    "117"=>"Falange proximal",
    "118"=>"Falange proximal 1",
    "119"=>"Falange proximal 2",
    "120"=>"Falange proximal 3",
    "121"=>"Falange proximal 4",
    "122"=>"Falange media",
    "123"=>"Falange media 1",
    "124"=>"Falange media 2",
    "125"=>"Falange media 3",
    "126"=>"Falange distal",
    "127"=>"Falange distal 1",
    "128"=>"Falange distal 2",
    "129"=>"Falange distal 3",
    "130"=>"Falange distal 4"
);
 
$GUI_SELECTION_EDITOR = array (
    "AddElementsButText"=>"Incloure",
    "AddGrupElementsButText"=>"Incloure grup",
    "RemoveElementsButText"=>"Excloure",
    "RemoveGrupElementsButText"=>"Excloure grup",
    "CloseText"=>"Tancar",
    "MainMenuLayerTitle"=>"Capes",
    "MainMenuRegionTitle"=>"Regions",
    "SearchByNamePlaceholder"=>"Introdueix text..."
);

$GUI_SELECTION_EXERCISE = array (
    "TextTextToImage"=>"Seleccionar os",
    "TextTitleInputName"=>"Nom de l'os",
    "HistoryNameText"=>"Historial",
    "AdvertimentNameText"=>"Advertències",
    "SearchByNamePlaceholder"=>"Introdueix text...",
    "CloseText"=>"Tancar",
    "MainMenuLayerTitle"=>"Capes"
);

$ADVERTIMENTS_SELECTION_EXERCISE = array (
    "repeatName"=>"El nom indicat ja s'ha comprovat anteriorment",
    "assOtherCor"=>"El nom indicat està associat a un altre os i és correcte",
    "assOtherIncor"=>"El nom indicat està associat a un altre os i no és correcte",
    "titleMessage"=>"Nom de l'element",
    "okMessage"=>"ok"
);

$GUI_ANIMATION_EDITOR = array (
    "RotationText"=>"Rotar articulació",
    "TItleJointAvaiable"=>"Articulacions",
    "RestoreDefault"=>"Restaurar valors per defecte",
    "CloseText"=>"Tancar",
    "MainMenuLayerTitle"=>"Capes"
);

?>