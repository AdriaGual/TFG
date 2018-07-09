/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function restoreUnity(action)
{
    $.ajax({
    type: "POST",
    url: './PHP/recovery.php',
    async: false,
    timeout: 3000,
    data: {},
    success: function(data)
    {
        action(data);
    }
    });
}

function getExerciseDatabase(id, action)
{
    $.ajax({
        type: "POST",
        url: './PHP/load.php',
        timeout: 3000,
        data: {id: id},
        success: function(exInfo)
        {
            if (action !== null)
                action(exInfo);
        }
        });
}

function reloadExercise(action)
{
    $.ajax({
    type: "POST",
    url: './PHP/reload.php',
    timeout: 3000,
    success: function(data)
    {
        if (action !== null)
            action(data);
    }
    });
}

function setExerciseDatabase(dataInput, action)
{
    $.ajax({
    type: "POST",
    url: './PHP/setExercise.php',
    timeout: 3000,
    data: dataInput,
    success: function()
    {
        if (action !== null)
            action();
    }
    });
}
