/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function LoadEditorSelection()
{
    showLoading();
    //UnityLoader.tryNextStep(function(){
      //  UnityLoader.tryNextStep(function(){
            waitEngine(
                function(){
                    getTranslationsPHP(0,
                    function()
                    {
                        changeScene(0,
                        function()
                        {
                            LoadPageWithoutHistory("./edubody/selectionEditor.html",hideLoading);
                        });
                    });
            });
      //  });
    //});
}

function SaveUnity(){
	
		if ($('#unityContent').length) // Si existia el guardem
		{
			$('#unity').appendTo("#unityHide");
		}
}

function ReloadUnity(){
	
	if ($('#unityContent').length) // Si existeix
        {
            $('#unity').appendTo("#unityContent");
        }
}

function LoadEditorAnimation()
{
    showLoading();
   // UnityLoader.tryNextStep(function(){
        //UnityLoader.tryNextStep(function(){
            waitEngine(
                function(){
                    getTranslationsPHP(2,
                    function()
                    {
                        changeScene(1,
                        function()
                        {
                            LoadPageWithoutHistory("./edubody/animationEditor.html",hideLoading);
                        });
                    });
            });
      //  });
    //});
}

function LoadEditorLabelling()
{
    showLoading();
    //UnityLoader.tryNextStep(function(){
      //  UnityLoader.tryNextStep(function(){
            waitEngine(
                function(){
                    getTranslationsPHP(0,
                    function()
                    {
                        changeScene(0,
                        function()
                        {
                            LoadPageWithoutHistory("./edubody/namedEditor.html",hideLoading);
                        });
                    });
        //    });
        //});
    });
}

function LoadExercise(i)
{
    switch (i)
    {
        case 0:
            showLoading();
           // UnityLoader.tryNextStep(function(){
            //UnityLoader.tryNextStep(function(){
            waitEngine(function(){
            setExerciseDatabase({
                statement: 'Select a name from the list and then click on the corresponding bone of the 3D model.',
                type: "selection",
                correction: "onRealTime",
                help: 2,
                letters: 0,
                errors: 3,
                random: 0,
                multimedia: '{"include":[15,14,53,52,99,102],"exclude":[],"regions":[]}' // elemJSON el per on es retorna la informació de l'exercici del Unity
            }, 
            function()
            {
                getExerciseDatabase(-1, // Obtenim la informació de l'exercici de la base de dades
                function(data)
                {
                    getTranslationsPHP(1, // Obtenim la traducció per l'exercici i quan la tinguem executem la funció
                    function() 
                    { 
                        updateExercise(data , // Enviem la informació de l'exercici al Unity i esperem 
                        function() // El flux de codi continua per aqui despres de updateExercise.
                        {
                            LoadPageWithoutHistory("./exerciseSelection.html",
                            function()
                            {
                                $("#subjectTittle").html(JSON.parse(JSON.parse(data).webContent).statement);
                                $( "#back" ).hide();
                                if (JSON.parse(JSON.parse(data).webContent).correctionEnd)
                                {
                                    $( "#end" ).show();
                                }
                                else
                                {
                                    $( "#end" ).hide();
                                }
                                hideLoading();
                            }); // Cambiem de pàgina i al acabar treiem el loading
                        }); 
                 //   });
               // });
            });});});});
            break;
        case 1:
            showLoading();
           // UnityLoader.tryNextStep(function(){
            //UnityLoader.tryNextStep(function(){
            waitEngine(function(){
            setExerciseDatabase({
                statement: 'Click on an actived bone from the 3D model and then enter the name in the "name of the bone" box.',
                type: "named",
                correction: "onRealTime",
                help: 2,
                errors: 5,
                random: 0,
                multimedia: '{"include":[14,15,52,99,102],"exclude":[],"regions":[]}' // elemJSON el per on es retorna la informació de l'exercici del Unity
            }, 
            function()
            {
                getExerciseDatabase(-1, // Obtenim la informació de l'exercici de la base de dades
                function(data)
                {
                    getTranslationsPHP(1, // Obtenim la traducció per l'exercici i quan la tinguem executem la funció
                    function() 
                    { 
                        updateExercise(data , // Enviem la informació de l'exercici al Unity i esperem 
                        function() // El flux de codi continua per aqui despres de updateExercise.
                        {
                            LoadPageWithoutHistory("./exerciseNamed.html",
                            function()
                            {
                                $("#subjectTittle").html(JSON.parse(JSON.parse(data).webContent).statement);
                                $( "#back" ).hide();
                                if (JSON.parse(JSON.parse(data).webContent).correctionEnd)
                                {
                                    $( "#end" ).show();
                                }
                                else
                                {
                                    $( "#end" ).hide();
                                }
                                hideLoading();
                            }); // Cambiem de pàgina i al acabar treiem el loading
                   //     }); 
                 //   });
                });
            });});});});
            break;
        case 2:
            showLoading();
            //UnityLoader.tryNextStep(function(){
            //UnityLoader.tryNextStep(function(){
            waitEngine(function(){
            setExerciseDatabase({
                statement: 'Select a name from the list and then click on the corresponding bone of the 3D model.',
                type: "selection",
                correction: "atTheEnd",
                help: 2,
                letters: 1,
                errors: 0,
                random: 0,
                multimedia: '{"include":[14,51,101],"exclude":[],"regions":[]}' // elemJSON el per on es retorna la informació de l'exercici del Unity
            }, 
            function()
            {
                getExerciseDatabase(-1, // Obtenim la informació de l'exercici de la base de dades
                function(data)
                {
                    getTranslationsPHP(1, // Obtenim la traducció per l'exercici i quan la tinguem executem la funció
                    function() 
                    { 
                        updateExercise(data , // Enviem la informació de l'exercici al Unity i esperem 
                        function() // El flux de codi continua per aqui despres de updateExercise.
                        {
                            LoadPageWithoutHistory("./exerciseSelection.html",
                            function()
                            {
                                $("#subjectTittle").html(JSON.parse(JSON.parse(data).webContent).statement);
                                $( "#back" ).hide();
                                if (JSON.parse(JSON.parse(data).webContent).correctionEnd)
                                {
                                    $( "#end" ).show();
                                }
                                else
                                {
                                    $( "#end" ).hide();
                                }
                                hideLoading();
                            }); // Cambiem de pàgina i al acabar treiem el loading
                        }); 
                  //  });
                //});
            });});});});
            break;
        case 3:
            showLoading();
           // UnityLoader.tryNextStep(function(){
            //UnityLoader.tryNextStep(function(){
            waitEngine(function(){
            $multimediaElement = '{"list":[{"jointName":"ThighLeft","moviments":[{"time":0.0,"values":[-0.06871865689754486,-0.08604907989501953,0.6939983367919922,0.7115051746368408]}]},{"jointName":"ElbowLeftJoint","moviments":[{"time":0.0,"values":[0.0,-9.446010196256794e-9,0.0,1.0]}]},{"jointName":"FootLeft","moviments":[{"time":0.0,"values":[0.0,0.0,-0.7071068286895752,0.7071068286895752]}]},{"jointName":"WristRightJoint","moviments":[{"time":0.0,"values":[0.0,0.7071068286895752,0.0,0.7071068286895752]}]},{"jointName":"LegRight","moviments":[{"time":0.0,"values":[2.960939271545726e-10,2.3267027415840859e-8,3.153019512147637e-10,1.0]}]},{"jointName":"FootRight","moviments":[{"time":0.0,"values":[6.727326778902378e-16,-6.727326778902378e-16,-0.7071068286895752,0.7071068286895752]}]},{"jointName":"ElbowRightJoint","moviments":[{"time":0.0,"values":[0.0,0.07845903933048248,0.0,-0.9969173669815064]},{"time":2.0,"values":[0.0,0.760405957698822,0.0,-0.649448037147522]},{"time":4.0,"values":[0.0,0.13917317986488343,0.0,-0.9902680516242981]}]},{"jointName":"ThighRight","moviments":[{"time":0.0,"values":[0.503376305103302,0.5033761262893677,-0.49660080671310427,-0.4966009557247162]}]},{"jointName":"HeadJoint","moviments":[{"time":0.0,"values":[0.0,0.0,-0.7021450400352478,0.7120339274406433]}]},{"jointName":"LegLeft","moviments":[{"time":0.0,"values":[-8.861854358785306e-15,-1.8794624168094743e-7,-4.761531968711097e-8,1.0]}]},{"jointName":"ShoulderLeftJoint","moviments":[{"time":0.0,"values":[-0.7051085233688355,-0.692726731300354,-0.14192122220993043,-0.05301013961434364]}]},{"jointName":"ShoulderRightJoint","moviments":[{"time":0.0,"values":[0.6954023838043213,0.19648726284503938,0.4642012119293213,0.5121772289276123]}]},{"jointName":"WristLeftJoint","moviments":[{"time":0.0,"values":[1.5102477508355355e-18,0.7071068286895752,-1.5102477508355355e-18,0.7071068286895752]}]}]}';                    var dataAnt = {
                question: "This movement corresponds to",
                a:"Flexion and extension",
                b:"Abduction and adduction",
                type: "animated",
                corrected: "a",
                multimedia: $multimediaElement 
            };

            setExerciseDatabase(dataAnt, 
            function()
            {
                getExerciseDatabase(-1, // Obtenim la informació de l'exercici de la base de dades
                function(data)
                {
                    getTranslationsPHP(2, // Obtenim la traducció per l'exercici i quan la tinguem executem la funció
                    function() 
                    {
                        updateExercise(data , // Enviem la informació de l'exercici al Unity i esperem 
                        function() // El flux de codi continua per aqui despres de updateExercise.
                        {
                            LoadPageWithoutHistory("./exerciseAnimation.html",
                            function()
                            {
                                $("#questionTittle").html(JSON.parse(JSON.parse(data).webContent).question);
                                $("#answerA").html(JSON.parse(JSON.parse(data).webContent).answerA);
                                $("#answerB").html(JSON.parse(JSON.parse(data).webContent).answerB);
                                $( "#back" ).hide();
                                hideLoading();
                            }); // Cambiem de pàgina i al acabar treiem el loading
                        }); 
                  //  });
                //});
            });});});});
            break;
        case 4:
            showLoading();
           // UnityLoader.tryNextStep(function(){
            //UnityLoader.tryNextStep(function(){
            waitEngine(function(){
            setExerciseDatabase({
                statement: 'Click on an actived bone from the 3D model and then enter the name in the "name of the bone" box.',
                type: "named",
                correction: "atTheEnd",
                help: 2,
                errors: 0,
                random: 0,
                multimedia: '{"include":[14,15],"exclude":[],"regions":[]}' // elemJSON el per on es retorna la informació de l'exercici del Unity
            }, 
            function()
            {
                getExerciseDatabase(-1, // Obtenim la informació de l'exercici de la base de dades
                function(data)
                {
                    getTranslationsPHP(1, // Obtenim la traducció per l'exercici i quan la tinguem executem la funció
                    function() 
                    { 
                        updateExercise(data , // Enviem la informació de l'exercici al Unity i esperem 
                        function() // El flux de codi continua per aqui despres de updateExercise.
                        {
                            LoadPageWithoutHistory("./exerciseNamed.html",
                            function()
                            {
                                $("#subjectTittle").html(JSON.parse(JSON.parse(data).webContent).statement);
                                $( "#back" ).hide();
                                if (JSON.parse(JSON.parse(data).webContent).correctionEnd)
                                {
                                    $( "#end" ).show();
                                }
                                else
                                {
                                    $( "#end" ).hide();
                                }
                                hideLoading();
                            }); // Cambiem de pàgina i al acabar treiem el loading
                      //  }); 
                    //});
                });
            });});});});
            break;
    }
}