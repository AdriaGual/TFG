/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function getTranslationsPHP(type, action)
{
    $.ajax({
    type: "POST",
    url: './edubody/PHP/translations.php',
    timeout: 3000,
    data: {type: type},
    success: function(data)
    {
        unityTrad = data;
        action();
    },
    error: function (result)
    {
        alert("ERROR: Error getting translations. " + result);
    }
    });
}

