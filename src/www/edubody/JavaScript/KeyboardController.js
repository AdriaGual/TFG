/* 
 * Author: Antonio Rodriguez Benitez (c)
 * Date: 28/12/2017 (revised: 28/12/2017)
 * Summary: Keyboard control
 */


function FocusCanvas(focus) 
{
    if (finishedLoading) 
    {
        gameInstance.SendMessage("Loader", "IsFocused", focus);
    }
}

document.addEventListener('click', function(e) 
{
    
    if (($(e.target).parent()).attr('id') === UNITY_ID) {
        // Clicked on canvas
        FocusCanvas("1");
    } 
    else 
    {
        // Clicked outside of canvas
        FocusCanvas("0");
    }
    
    
});