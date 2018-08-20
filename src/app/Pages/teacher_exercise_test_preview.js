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
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import DoneIcon from 'material-ui-icons/Done';
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
			answer:"",
			showsnack: false,
			snacktext: "",
			showcorrectanswer: false,
			showwronganswer: false,
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
			url: 'php/load_exercice_teacher.php',
			success: function(response) {
				var jsonData = JSON.parse(response);
				that.setState({exercice_statement: jsonData.statement});
				that.setState({exercice_description: jsonData.description});
				that.setState({exercice_question: jsonData.question});
				that.setState({exercice_help: jsonData.help});
				that.setState({exercice_ntries: jsonData.ntries});
				that.setState({tries: jsonData.tries});
				that.setState({id: jsonData.isql});
				that.setState({answer: jsonData.answer});
				img = jsonData.img;
				n = jsonData.type_component;
				if (n==5){
					setImage(img);
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
	
	handleClose = (event, reason) => {
		if (reason === 'clickaway') {
		  return;
		}
		this.setState({ showsnack: false });
	};
	
	clickcorregir  =()=>{
		
		var answers = [];
		var a = 0;
		var onetrue=false;
		$('input[name=answer]').each(function(index, item) {
			var id = a;
			var text = $(item).attr('value');
			var solution = $(item).is(":checked");
			if (solution){
				onetrue=true;
			}
			answers[id] = {"text": text, "solution": solution};
			a++;
		});
		
		if (!onetrue){
			document.getElementById('formulari').style.border='solid';
			document.getElementById('formulari').style.borderColor='#e52213';
			this.setState({ showsnack: true ,snacktext: "No answers set!"});
		}
		else{
			var that = this;
			var settings = {
				type: 'POST',
				data: { 
					'name': STORAGE.getLocalStorageItem("exercise_name") || that.appState("exercice_name"), 
					'answers': answers,
				},
				url: 'php/verify_answers_test.php',
				success: function(response) {
					if (response=="match"){
						that.setState({ showcorrectanswer: true ,showwronganswer: false});
					}
					else if (response=="no_match"){
						that.setState({ showcorrectanswer: false ,showwronganswer: true});
					}
				}
			};
			$.ajax(settings);
		}
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
				<Link to={"/teacher_courses"} className="blue" style={{marginLeft:20}}>Courses</Link>
				<Grid container>
					
					<Grid item xs={4}  className="padding2"> 
						<hr/>
						<div className="margin1 big_text">{this.state.exercice_description}</div>
						<hr/><br/><br/><hr/>
						<div className="left_30 down_20 black size_20 big_text">{this.state.exercice_question}</div>
						<hr/><br/><br/><hr/>
						<div className="margin1 big_text">{this.state.exercice_help}</div>
						<hr/><br/><br/>
						<div className="left_30 down_20 black size_20">Tries: N/{this.state.exercice_ntries}</div>
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
						
						<Button
							id="btn-save"
							className="btn btn-1 white left_30"
							onClick={() => 	this.clickcorregir()}
						> Corregir</Button>
						{this.state.showcorrectanswer ? 
								this.state.answer!="" ?
								<div>
								<p>Correcte!</p>
								<br/>
								<hr/>
								<p>{this.state.answer}</p>
								</div> 
								: 
								<div>
								<p>Correcte!</p>
								<br/>
								</div> 
								: null
						}
						{this.state.showwronganswer ? 
							<div>
							<p>Incorrecte!</p>
							</div> : null
						}	
						
					</Grid>
					<Grid item xs={1}>
					</Grid>
					<Snackbar
					  anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					  }}
					  open={this.state.showsnack}
					  autoHideDuration={4000}
					  onClose={this.handleClose}
					  message={<span id="message-id">{this.state.snacktext}</span>}
					  action={[
						<IconButton
						  key="close"
						  aria-label="Close"
						  color="inherit"
						  onClick={this.handleClose}
						>
						<CloseIcon />
						</IconButton>,
					  ]}
					/>
				</Grid>

			</div>
		
		);
	}
}


UserExercice = withRouter(UserExercice);

export default UserExercice;