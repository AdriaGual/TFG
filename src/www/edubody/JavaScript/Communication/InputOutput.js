/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// Input
function finishLoaded()
{
    finishedLoading = true;
    
    if (actionToDo !== null)
    {
        actionToDo();
        actionToDo = null;
    }
}

function exerciseLoaded()
{
    finishedLoadingScene = true;
    
    if (actionToDo !== null)
    {
        
        actionToDo();
        actionToDo = null;
    }
    
    if (returnUpdateExercise !== null)
        returnUpdateExercise();
    
    updateLanguage();
}

function getTranslations()
{
    return unityTrad;
}

function setExercise(str)
{
    elemJSON = str;
    
    if(returnTransfer !== null)
        returnTransfer();
    
    //setExerciseInformation();
}

function isFinished()
{
    return finishExercise;
}
    
function validateResponseOnlineCorrection(aux)
{
    ret = "";
    $.ajax({
    type: "POST",
    url: './edubody/PHP/correction.php',
    async: false,
    timeout: 3000,
    data: {ids: aux},
    dataType: 'json',
    success: function(data)
    {
        if (finishExercise || (data.webReturn.endExercise === 1))
        {
            $( "#end" ).hide();
            $( "#back" ).show();
            hideUnity();
            showResume((data.webReturn.correctionValue === 1) && (data.webReturn.endExercise === 1), data.webReturn.errors + data.webReturn.missing);
        }
        
        ret = JSON.stringify(data.unityReturn);
    },
    error: function (result)
    {
        
        ret = "ERROR: " + JSON.stringify(result);
    }
    });
    
    return ret;
}

// Output

var returnUpdateExercise = null;

function updateExercise(data, action)
{
    finishExercise = false;
    returnUpdateExercise = action;
    unityUpdateExercise(data);
}

function changeScene(id, action) // Carrega un editor. 0: selection; 1: animation
{
    console.log("Start load" + $.now());
    returnUpdateExercise = action;
    finishedLoadingScene = false;
    
    switch(id)
    {
        case 0:
            unityChangeScene("Selection_PrincipalEditor");
            break;
        case 1:
            unityChangeScene("Animation_PrincipalEditorAnim");
            break;
    }
}

function isFocused()
{
    unityIsFocused();
}

var returnTransfer = null;

function transferExercise(action)
{
    console.log("Start load" + $.now());
    returnTransfer = action;
    finishedLoadingScene = false;
    finishExercise = false;
    unityTransferExercise();
}

function endExercise()
{
    finishExercise = true;
    unityEndExercise();
}

function updateLanguage()
{
    unityUpdateLanguage();
}