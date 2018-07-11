/* 
 * Author: Antonio Rodriguez Benitez (c)
 * Date: 28/12/2017 (revised: 21/01/2018)
 * Summary: All definitions
 */

$("head").append('<script src="./edubody/JavaScript/KeyboardController.js"></script>');
$("head").append('<script src="./edubody/JavaScript/TranslationManager.js"></script>');
$("head").append('<script src="./edubody/JavaScript/ExerciseManager.js"></script>');
$("head").append('<script src="./edubody/JavaScript/Communication/InputOutput.js"></script>');
$("head").append('<script src="./edubody/JavaScript/Communication/UnityAdapter.js"></script>');
$("head").append('<script src="./edubody/JavaScript/WebManager.js"></script>');
$("head").append('<script src="./edubody/Build/UnityLoader.js"></script>');
$("head").append('<script src="./edubody/JavaScript/Integration/Integration.js"></script>');

const UNITY_ID = "unity";
const UNITY_BUILD = "edubody/Build/prova.json";

var actionToDo = null;
var backUnityFunction = null;
var finishedLoading = false;
var unityTrad = "";
var gameInstance;
var sceneToLoad = -1;
var finishExercise = false;

var finishedLoadingScene = false;