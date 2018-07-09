/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function unityChangeScene(str)
{
    gameInstance.SendMessage("Loader", "ChangeScene", str);
}

function unityTransferExercise()
{
    gameInstance.SendMessage("Main Camera", "TranferLabelExerciseJSON", "");
}

function unityUpdateExercise(data)
{
    gameInstance.SendMessage("Loader", "UpdateExercise",data);
}

function unityUpdateLanguage()
{
    gameInstance.SendMessage("Main Camera", "UpdateLanguage", unityTrad);
}

function unityEndExercise()
{
    gameInstance.SendMessage("SkeletonTexturePreview", "EndExercise", "");
}

$(document).ready(function()
{
    setTimeout(function()
    {
        sceneToLoad = -1;
        gameInstance = UnityLoader.instantiate(UNITY_ID, UNITY_BUILD);
    },0);
});
