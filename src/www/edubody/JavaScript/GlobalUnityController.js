/* 
 * Author: Antonio Rodriguez Benitez (c)
 * Date: 28/12/2017 (revised: 21/01/2018)
 * Summary: All definitions
 */

$("head").append('<script src="./JavaScript/KeyboardController.js"></script>');
$("head").append('<script src="./JavaScript/TranslationManager.js"></script>');
$("head").append('<script src="./JavaScript/ExerciseManager.js"></script>');
$("head").append('<script src="./JavaScript/Communication/InputOutput.js"></script>');
$("head").append('<script src="./JavaScript/Communication/UnityAdapter.js"></script>');
$("head").append('<script src="./JavaScript/WebManager.js"></script>');
$("head").append('<script src="./Build/UnityLoader.js"></script>');

const UNITY_ID = "unity";
const UNITY_BUILD = "Build/prova.json";

var actionToDo = null;
var backUnityFunction = null;
var finishedLoading = false;
var unityTrad = "";
var gameInstance;
var sceneToLoad = -1;
var finishExercise = false;

var finishedLoadingScene = false;