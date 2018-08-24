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
import SortableTree, { addNodeUnderParent, removeNodeAtPath,changeNodeAtPath } from 'react-sortable-tree';
import List,{ListItem,ListItemText} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Select from 'material-ui/Select';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import language from "../Utils/language.js"
import * as STORAGE from '../Utils/Storage.js';

/** 
 * Register Page
 * @extends React.Component
 */
 var lng;
class TeacherEditExerciceTest2d extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			hasTextSolution:false,
			showsnack: false,
			snacktext: "",
		};
	}
	
	appState = this.props.appState;

	componentWillMount(){
		var loadjs = require('loadjs');
		loadjs('js/test.js',function (){
		});
		loadjs('js/canvas_viewer_loc.js',function (){
		});
		loadjs('js/viewer2d.js',function (){
		});
	}
	
	componentDidMount(){
		var settings = {
			type: 'GET',
			url: 'php/load_only_courses_admin.php',
			async:false,
			success: function(response) {
				var jsonData = JSON.parse(response);
				for (var a=0; a<jsonData.length; a++){
					$("#formulari").append("<p value='"+jsonData[a].id+"'> "+jsonData[a].name+"</p>");
					
					var settings2 = {
						type: 'POST',
						data: { 
							'curs': jsonData[a].id,
						},
						url: 'php/load_only_topics.php',
						async:false,
						success: function(response2) {
							if (response2!="0_topics"){
								var jsonData2 = JSON.parse(response2);
								for (var b=0; b<jsonData2.length; b++){
									$("#formulari").append("<input type='checkbox' name='topic' value='"+jsonData2[b].id+"' />"+jsonData2[b].name+"<br/>");
								}
								$("#formulari").append("<br/>");
							}
							else{
								$("#formulari").append("<p class='size15'>"+language[lng].notopicsincourse+"</p><br/><br/>");
							}
						}
					};
					$.ajax(settings2);
				}
			}
		};
		$.ajax(settings);
	}
	
	handleChange = name => event => {
		this.setState({ [name]: event.target.checked });
	};
	
	click = () => {
		var canvas = document.getElementById('canvas');
		var dataURL = canvas.toDataURL("image/png");
		var topics = $("input[name=topic]:checked").serialize();
		var answers = [];
		var a = 0;
		$('.answer_item').each(function(index, item) {
			var id = a;
			var text = $(item).find("input[type=text]").val();
			var solution = $(item).find("span.input-group-addon > input[type=checkbox]").is(":checked");
			answers[id] = {"text": text, "solution": solution};
			a++;
		});
		var difficulty = $("#difficulty").val();
		var max_tries = $("#max_tries").val();
		var solution = "";
		if (this.state.hasTextSolution){
			solution = $("#problem_solution").val();
		}		
		if (answers.length != 0 && document.getElementById("problem_image_input").files.length != 0 && difficulty > 0 && difficulty <= 10 && max_tries > 0 && max_tries <= 100 && topics.length > 0 && topics.length > 0 && $("#newtitle").val()!="" && $("#problem_description").val()!="" && $("#problem_question").val()!="" && $("#help").val()!=""){
			var that = this;
			var settings = {
				type: 'POST',
				async:false,
				data: { 
					'name': $("#newtitle").val(), 
				},
				url: 'php/istitleok.php',
				success: function(response) {
					if (response=="OK"){
						var settings2 = {
							type: 'POST',
							async:false,
							data: { 
								'img': dataURL, 
								'topics':topics,
								'title': $("#newtitle").val(), 
								'description': $("#problem_description").val(), 
								'question': $("#problem_question").val(), 
								'help': $("#help").val(), 
								'answers': answers,
								'difficulty': difficulty,
								'max_tries': max_tries,
								'solution':solution,
							},
							url: 'php/save_exercise_test.php',
							success: function(response) {
								if (response=="OK"){
									that.props.history.push("/teacher_courses");
								}
							}
						};
						$.ajax(settings2);
					}
					else{
						document.getElementById('title').style.border='solid';
						document.getElementById('title').style.borderColor='#e52213';
						this.setState({ showsnack: true ,snacktext: language[lng].titlealreadyexists});
					}
				}
			};
			$.ajax(settings);
		}
		else{
			if (difficulty < 0 || difficulty > 10 || difficulty == ""){
				document.getElementById('difficulty').style.borderColor='#e52213';
				this.setState({ showsnack: true ,snacktext: language[lng].difficultynotvalid});
			}
			else if  (max_tries < 0 || max_tries > 100 || max_tries == ""){
				document.getElementById('max_tries').style.borderColor='#e52213';
				this.setState({ showsnack: true ,snacktext: language[lng].maximumtriesnotvalid});
			}
			else if (topics.length <= 0){
				document.getElementById('topics').style.border='solid';
				document.getElementById('topics').style.borderColor='#e52213';
				this.setState({ showsnack: true ,snacktext: language[lng].topicsnotselected});
			}
			else if ($("#newtitle").val()==""){
				document.getElementById('title').style.border='solid';
				document.getElementById('title').style.borderColor='#e52213';
				this.setState({ showsnack: true ,snacktext: language[lng].titlenotset});
			}
			else if ( $("#problem_description").val()==""){
				document.getElementById('problem_description').style.borderColor='#e52213';
				this.setState({ showsnack: true ,snacktext: language[lng].descriptionnotset});
			}
			else if ($("#problem_question").val()==""){
				document.getElementById('problem_question').style.borderColor='#e52213';
				this.setState({ showsnack: true ,snacktext: language[lng].questionnotset});
			}
			else if ($("#help").val()==""){
				document.getElementById('help').style.borderColor='#e52213';
				this.setState({ showsnack: true ,snacktext: language[lng].helpnotset});
			}
			else if (document.getElementById("problem_image_input").files.length == 0){
				document.getElementById('image_file_input_group').style.border='solid';
				document.getElementById('image_file_input_group').style.borderColor='#e52213';
				this.setState({ showsnack: true ,snacktext: language[lng].imagenotset});
			}
			else if (answers.length == 0){
				document.getElementById('ans').style.border='solid';
				document.getElementById('ans').style.borderColor='#e52213';
				this.setState({ showsnack: true ,snacktext: language[lng].answersnotset});
			}
		}
	}
	
	handleClose = (event, reason) => {
		if (reason === 'clickaway') {
		  return;
		}
		this.setState({ showsnack: false });
	};
	
	
	/**
	 * Renders the register page.
	 */
	render(){
		lng = STORAGE.getLocalStorageItem("currentLanguage")|| this.appState("currentLanguage");
		return (
			<div>
				<div className="left_30" id ="title">	
					<TextField
						id="newtitle"
						label={language[lng].enterexercisestatement}
						className="text_field "
						style = {{width: 1000}}
						onChange={(event, newValue) =>
							this.setState({
								newtitle: newValue
							})
						}
					/>
				</div>
				<hr/>
				<Link to={"/adm_params"} className="blue" style={{marginLeft:20}}>{language[lng].courses}></Link><Link to={"/admin_choose_exercise"} className="blue" >{language[lng].chooseexercise}</Link>
				<Grid container>
					<Grid item xs={12} >
						<p></p>				
					</Grid>
				</Grid>
				<Grid container>
					
					<Grid item xs={3} className="left_30" > 
						<p>{language[lng].description}:</p>
						<textarea value={this.state.value} onChange={this.handleChange} id="problem_description" style={{height:200,width:400}}/>
						<p>{language[lng].question}:</p>
						<textarea value={this.state.value} onChange={this.handleChange} id="problem_question" style={{height:100,width:400}}/>
						<Grid container>
							<Grid item xs={1} > 
								<Checkbox
								  id="has_text"
								  checked={this.state.hasTextSolution}
								  onChange={this.handleChange('hasTextSolution')}
								  value="checkedA"
								/>
							</Grid>
							<Grid item xs={3} > 
								<p>{language[lng].textsolution}:</p>
							 </Grid>
							{this.state.hasTextSolution ?
								<textarea value={this.state.value} onChange={this.handleChange} id="problem_solution" style={{height:50,width:400}}/>
							:null}
						</Grid>
						
						<p>{language[lng].helptext}:</p>
						<textarea value={this.state.value} id="help" onChange={this.handleChange} style={{height:100,width:400}}/>
						<br/><br/><br/>
						<Grid container>
							<Grid item xs={6} > 
								<label for="difficulty">{language[lng].difficulty}: </label>
								<input type="number" id="difficulty" min="1" max="10" step="1"/>
							</Grid>
							<Grid item xs={6} > 
								<label for="max_tries">{language[lng].maximumtries}: </label>
								<input type="number" id="max_tries" min="1" max="100" step="1"/>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={4} > 
						<div id="image_div">
							<div id="canvas_div">
								<canvas id="canvas" width="448" height="350"></canvas>
							</div>
							<div id="image_file_input_group" class="input-group">
								<input type="file" id="problem_image_input" />
							</div>
							<div id="current_image_input_group" class="input-group">
								<input type="hidden" id="problem_image_url" value="" disabled />
								<button type="button" id="btn-delete-image">{language[lng].deleteimage}</button>
							</div>
							
						</div>
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
					<Grid item xs={2} >
						<div id="items_box">
						</div>
						<div id="ans" style={{ width:152 }}>
							<Button type="button" id="btn-new-item" className="btn btn-4 white" >{language[lng].addanswer}</Button>
						</div>
					</Grid>
					<Grid item xs={2} className="left_30" > 
						<div id = "topics">
							<div className="left_50 down_20 orange size_20"><p>{language[lng].topics}</p></div>
							<hr/>
							<div id="formulari"></div>
							<hr/>
						</div>
						<br/>
						<Button
							className="btn btn-1 white left_15"
							onClick={() => 	this.click()}
						>
							<Icon className="fa fa-save" style={{ fontSize: 15 }}></Icon>
						</Button>
					</Grid>

				</Grid>
				
			</div>
		
		);
	}
}


TeacherEditExerciceTest2d = withRouter(TeacherEditExerciceTest2d);

export default TeacherEditExerciceTest2d;