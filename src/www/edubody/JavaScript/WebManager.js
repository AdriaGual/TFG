/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var loadingCount = 0;
var backFunction = null;

function showResume(correct, errors)
{
    if (correct)
    {
        $('#resume').show();
        $("#numberErrors").text(errors);
        $('#correct').show();
        $('#incorrect').hide();
    }
    else
    {
        $('#resume').show();
        $("#numberErrors").text(errors);
        $('#correct').hide();
        $('#incorrect').show();
    }
    
}

function hideResume()
{
    $('#resume').hide();
    $('#correct').hide();
    $('#incorrect').hide();
}

function showUnity()
{
    $('#unity').show();
}

function hideUnity()
{
    $('#unity').hide();
}

function showLoading()
{
    if (loadingCount === 0)
    {
        $('#loading').show();
        $('#contentID').hide();
        $('#unity').hide();
    }
    
    loadingCount++;
}

function hideLoading()
{
    if (loadingCount === 0)
        return;
    
    loadingCount--;
    
    if (loadingCount === 0)
    {
        $('#loading').hide();
        $('#contentID').show();
        $('#unity').show();
    }
}

function waitEngine(action)
{
    if (!finishedLoading)
    {
        UnityLoader.goLoaded();
        actionToDo = action;
    }
    else
    {
        action();
    }
}

function LoadPageWithoutHistory(str, action, back)
{
    if (back !== null)
    {
        backFunction = back;

    }
    else
    {
        backFunction = null;
    }

    if ($('#unityContent').length) // Si existia el guardem
    {
        $('#unity').appendTo("#unityHide");
    }
    
    
    $("#contentID").load(str, function()
    {
        if ($('#unityContent').length) // Si existeix
        {
            $('#unity').appendTo("#unityContent");
        }
        
        if (action !== null)
        {
            action();
        }
    });
}

function LoadPage(str, action, back)
{
    history.pushState (str,str,"#"+str);
    LoadPageWithoutHistory(str, action, back);

}

$(document).ready( function() 
{
    showLoading();
    
    window.addEventListener("popstate", function(e)
    {
        if(e.state === null)
            return;
        showLoading();
        
        
        LoadPageWithoutHistory(e.state, hideLoading, null);
        
        
        
        
    } , false);
    
    history.replaceState ("./mainPage.html","./mainPage.html","#"+"./mainPage.html"); // Primer pas del tirar enrera
    LoadPageWithoutHistory("./mainPage.html", hideLoading);
    
    var upURL = "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_keyboard_arrow_up_48px-32.png";
    var downURL = "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_keyboard_arrow_down_48px-32.png";

});