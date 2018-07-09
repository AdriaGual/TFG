/* 
 * Author: Antonio Rodriguez Benitez (c)
 * Date: 28/12/2017 (revised: 20/01/2018)
 * Summary: Control loading 
 */

/*
function finishLoadingWebGL() 
{
    unityReady = true;
    
    if (sceneToLoad !== -1)
    {
        getTranslations(0,loadEditor);
    }
    
    loadProblem(0); // TODO: Partxe per seguir probant 
}

function loadProblem(id)
{
    sceneToLoad = id;
    // TODO: Activar pantalla de carrega
    
    if (unityReady)
    {
        getTranslations(0, loadEditor);
    }
}

function loadEditor(id)
{
    switch (id)
    {
        case 0:
            setTimeout(function()
            {
                gameInstance.SendMessage("Loader", "ChangeScene", "Selection_PrincipalEditor");
            },0);
            break;
        case 1:
            break;
        default:
            break;
    }
}

function load()
{
    $.ajax({
    type: "POST",
    url: './PHP/load.php',
    timeout: 3000,
    data: {id: sceneToLoad},
    success: function(data)
    {
        setTimeout(function()
        {
            gameInstance.SendMessage("Loader", "UpdateExercise",data);
        },0);
    }
    });
}

function getTranslations(type, action)
{
    $.ajax({
    type: "POST",
    url: './PHP/translations.php',
    timeout: 3000,
    data: {type: type},
    success: function(data)
    {
        unityTrad = data;
        action(sceneToLoad);
    },
    error: function (result)
    {
        alert("ERROR: Error getting translations. " + result)
    }
    });
}

function pushProblem()
{
    gameInstance.SendMessage ("Main Camera", "TranferLabelExerciseJSON",""); // elemJSON definit
    
    
}


$(document).ready(function()
{
    setTimeout(function()
    {
        sceneToLoad = -1;
        gameInstance = UnityLoader.instantiate(UNITY_ID, UNITY_BUILD);
    },0);
    
    $('#' + UNITY_ID).hide();
});

$(document).ready(function()
{
    setTimeout(function()
    {
        sceneToLoad = -1;
        gameInstance = UnityLoader.instantiate(UNITY_ID, UNITY_BUILD);
    },0);
    
    $('#unityHide').hide();
});

*/
