"use strict";

// React imports
import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Particles from "react-particles-js";
import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Icon from 'material-ui/Icon';
import SortableTree from 'react-sortable-tree';
import * as STORAGE from '../Utils/Storage.js';
/** 
 * Register Page
 * @extends React.Component
 */
 
var n;
var img;
var tries;

class UserExercice extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			exercice_statement:"",
			exercice_description:"",
			exercice_question:"",
			exercice_help:"",
			exercice_ntries:"",
			tries:"",
			component:"",
			id:"",
			img:"",
		}
	}
	
	appState = this.props.appState;
	componentWillMount(){
		var loadjs = require('loadjs');
		loadjs('js/canvas_viewer_loc.js',function (){
		});
		loadjs('js/viewer2d.js',function (){
		});
	}
	
	componentDidMount(){
		var that = this;
		
		console.log(STORAGE.getLocalStorageItem("exercise_name"));
		
		var settings = {
			type: 'POST',
			data: { 
				'name': STORAGE.getLocalStorageItem("exercise_name") || that.appState("exercice_name") , 
			},
			url: 'php/load_exercice.php',
			success: function(response) {
				var jsonData = JSON.parse(response);
				that.setState({exercice_statement: jsonData.statement});
				that.setState({exercice_description: jsonData.description});
				that.setState({exercice_question: jsonData.question});
				that.setState({exercice_help: jsonData.help});
				that.setState({exercice_ntries: jsonData.ntries});
				that.setState({tries: jsonData.tries});
				that.setState({id: jsonData.isql});
				img = jsonData.img;
				n = jsonData.type_component;
				if (n==5){
					var canvas = document.getElementById("canvas");
					var ctx = canvas.getContext("2d");

					function drawMap(imgdata) {
					  var image = new Image();
					  image.onload = function() {
						ctx.drawImage(image, 0, 0);
					  };
					  image.src = imgdata;
					}
					drawMap(img);
				}
			}
		};
		$.ajax(settings);
		
		var settings2 = {
			type: 'POST',
			data: { 
				'name': STORAGE.getLocalStorageItem("exercise_name") || that.appState("exercice_name"), 
			},
			url: 'php/load_questions.php',
			success: function(response2) {
				if (response2!="0_answers"){
					var jsonData2 = JSON.parse(response2);
					for (var b=0; b<jsonData2.length; b++){
						$("#formulari").append("<input type='checkbox' name='answer' value='"+jsonData2[b].answer_text+"''/>"+jsonData2[b].answer_text+"<br/>");
					}
					$("#formulari").append("<br/>");
				}
				else{
					$("#formulari").append("<p class='size15'>No hi han respostes per aquest test .___. </p><br/><br/>");
				}
			}
		};
		$.ajax(settings2);
		
	}

	click  =()=>{
		if ($('#unityContent').length) // Si existia el guardem
		{
			$('#unity').appendTo("#unityHide");
		}	
	}	
	
	clickcorregir  =()=>{
		
		var answers = [];
		var a = 0;
		$('input[name=answer]').each(function(index, item) {
			var id = a;
			var text = $(item).attr('value');
			var solution = $(item).is(":checked");
			answers[id] = {"text": text, "solution": solution};
			a++;
		});
		
		var that = this;
		var settings = {
			type: 'POST',
			data: { 
				'name': that.appState("exercice_name"), 
				'answers': answers,
			},
			url: 'php/verify_answers_test.php',
			success: function(response) {
				if (response=="match"){
					var settings2 = {
						type: 'POST',
						data: { 
							'name': that.appState("exercice_name"),
							'tries': that.state.tries,
							'puntuation': 10,
						},
						url: 'php/save_test_mark.php',
						success: function(response2) {

						}
					};
					$.ajax(settings2);
				}
				else if (response=="no_match"){
					var a = that.state.tries;
					if (that.state.tries>=that.state.exercice_ntries){
						var settings2 = {
							type: 'POST',
							data: { 
								'name': that.appState("exercice_name"),
								'tries': that.state.tries,
								'puntuation': 0,
							},
							url: 'php/save_test_mark.php',
							success: function(response2) {

							}
						};
						$.ajax(settings2);
					}
					else{
						a++;
					}
					
					that.setState({tries: a});
				}
			}
		};
		$.ajax(settings);
	}	
	/**
	 * Renders the register page.
	 */
	render(){
		const {
            treeData,
            searchString,
            searchFoundCount,
        } = this.state;
		
		return (
			<div>
				<br/>
				<div className="left_30 down_20 orange size_30"><p>{this.state.exercice_statement}</p></div>
				<hr/>
				<Link to={"/user_courses"} className="blue" style={{marginLeft:20}} onClick={() => this.click()}>Courses</Link>
				<Grid container>
					
					<Grid item xs={4}  className="padding2"> 
						<hr/>
						<div className="margin1 big_text">{this.state.exercice_description}</div>
						<hr/><br/><br/><hr/>
						<div className="left_30 down_20 black size_20 big_text">{this.state.exercice_question}</div>
						<hr/><br/><br/><hr/>
						<div className="margin1 big_text">{this.state.exercice_help}</div>
						<hr/><br/><br/>
						<div className="left_30 down_20 black size_20">Tries: {this.state.tries}/{this.state.exercice_ntries}</div>
					</Grid>
					<Grid item xs={4}  className="padding2">
							<div id="image_div">
								<div id="canvas_div">
									<canvas id="canvas"></canvas>
								</div>
							</div>
						
					</Grid>
					<Grid item xs={3}  className="padding2">
						<div className="left_30 down_20 orange size_20"><p>Respostes</p></div>
						<hr/>
						<div id="formulari"></div>
						<hr/>
						<br/>
						{this.state.tries < this.state.exercice_ntries ?
							<Button
								id="btn-save"
								className="btn btn-1 white left_30"
								onClick={() => 	this.clickcorregir()}
							> Corregir</Button>: null
						
						
						}
							
						
					</Grid>
					<Grid item xs={1}>
					</Grid>
				</Grid>

			</div>
		
		);
	}
}


UserExercice = withRouter(UserExercice);

export default UserExercice;