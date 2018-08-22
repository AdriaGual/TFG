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
class TeacherEditExerciceLocation3d extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			hasTextSolution:false,
			showsnack: false,
			snacktext: "",
		};
	}
	
	componentWillMount(){
		var loadjs = require('loadjs');
		loadjs('js/OrbitControls.js',function (){
		});
		loadjs('js/canvas_viewer_loc3d.js',function (){
		});
		loadjs('js/adm_problem_loc3d.js',function (){
		});
	}
	
	appState = this.props.appState;

	componentDidMount(){
		var settings = {
			type: 'GET',
			url: 'php/load_only_courses_teacher.php',
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
		
		$('#model_input').change(function() {
			const files = document.querySelector('[type=file]').files;
			const formData = new FormData();

			for (let i = 0; i < files.length; i++) {
				let file = files[i];

				formData.append('files[]', file);
			}

			fetch('php/uploadfiles.php', {
				method: 'POST',
				body: formData
			}).then(response => {
				console.log(response);
			});
		});
		
	}
	
	clickSave  =()=>{
		var topics = $("input[name=topic]:checked").serialize();
		var new_models = [];
		
		$.each(models, function(index, model) {
			var id = parseInt(index);
			var path = "http://localhost/models/"+model.filename;
			console.log(path);
			var filename = model.filename;
			var name = model.name;
			var solution = model.solution;
			var matrix = model.matrix;
			var material = model.material;
			
			if (id < 0) new_models.push(Object.assign({}, model));
		});
		
		var difficulty = $("#difficulty").val();
		var max_tries = $("#max_tries").val();
		var solution = "";
		if (this.state.hasTextSolution){
			solution = $("#problem_solution").val();
		}
		
		if (document.getElementById("model_input").files.length != 0 && difficulty > 0 && difficulty <= 10 && max_tries > 0 && max_tries <= 100 && topics.length > 0 && topics.length > 0 && $("#newtitle").val()!="" && $("#problem_description").val()!="" && $("#problem_question").val()!="" && $("#help").val()!=""){
			var that = this;
			
			var titleok = false;
			var settings = {
				type: 'POST',
				data: { 
					'name': $("#newtitle").val(), 
				},
				url: 'php/istitleok.php',
				success: function(response) {
					if (response=="OK"){
						titleok = true;
					}
				}
			};
			$.ajax(settings);
			
			if (titleok){
			
				var settings2 = {
					type: 'POST',
					data: { 
						'topics':topics,
						'title': $("#newtitle").val(), 
						'description': $("#problem_description").val(), 
						'question': $("#problem_question").val(), 
						'help': $("#help").val(), 
						'new_models': JSON.stringify(new_models),
						'difficulty': difficulty,
						'max_tries': max_tries,
						'solution':solution,
					},
					url: 'php/save_exercise_location3d.php',
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
			else if (document.getElementById("model_input").files.length == 0){
				document.getElementById('btn-add-model').style.border='solid';
				document.getElementById('btn-add-model').style.borderColor='#e52213';
				this.setState({ showsnack: true ,snacktext: language[lng].modelnotset});
			}
		}
	}	
	
	handleClose = (event, reason) => {
		if (reason === 'clickaway') {
		  return;
		}
		this.setState({ showsnack: false });
	};
	
	handleChange = name => event => {
		this.setState({ [name]: event.target.checked });
	};

	/**
	 * Renders the register page.
	 */
	render(){
		lng = STORAGE.getLocalStorageItem("currentLanguage")|| this.appState("currentLanguage");
		return (
			<div>
				<div className="left_30" id = "title">	
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
				<Link to={"/teacher_courses"} className="blue" style={{marginLeft:20}}>{language[lng].courses}></Link><Link to={"/teacher_choose_exercise"} className="blue" >{language[lng].chooseexercise}</Link>
				<Grid container>
					<Grid item xs={12} >
						<p></p>				
					</Grid>
				</Grid>
				<Grid container>
					<Grid item xs={1} > 
					</Grid>
					<Grid item xs={3} > 
						<p>{language[lng].description}:</p>
						<textarea value={this.state.value} onChange={this.handleChange} id="problem_description" style={{height:200,width:400}}/>
						<p>{language[lng].question}:</p>
						<textarea value={this.state.value} onChange={this.handleChange} id="problem_question" style={{height:100,width:400}}/>
						
						<Grid container>
							<Grid item xs={1} > 
								<Checkbox
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
					<Grid item xs={1}>
					</Grid>
					<Grid item xs={4} > 
						<div id="image_div">
							<div id="image_div">
								<div id="3d" class="tab-pane fade in active">
									<div id="canvas_div">
										<span id="canvas" class="canvas">
											
										</span>
										<div id="canvas_button_group" class="part">
											<button type="button" id="btn-fullscreen" title="Pantalla completa"></button>
										</div>
									</div>
									
									<div id="models_button_group" style={{width:700}}>
										<span type="button" id="btn-add-model" >
											<input type="file" id="model_input" multiple=""/>
										</span>
										<Button type="button" id="btn-delete-model" style={{marginLeft:31}} className="btn btn-5 white down_15">{language[lng].deletee}</Button>
									</div>
									
									<div id="displayed_models_input_group" style={{width:700}} className="down_15">
										<span id="displayed_models_select_label" >{language[lng].models}</span>
										<Select native  id="displayed_models_select" aria-describedby="displayed_models_select_label"  style={{width:200,marginLeft:71}}></Select>
										
										<span class="input-group-btn">
											<Button type="button" id="btn-add-model-solution" style={{marginLeft:14}} className="btn btn-4 white">{language[lng].addtosolution}</Button>
										</span>
									</div>
									
									<div id="list_models_solution_input_group" style={{width:700}} className="down_15">
										<span id="list_models_solution_select_label" >{language[lng].solutionmodels}</span>
										<select id="list_models_solution_select" aria-describedby="list_models_solution_select_label" size="3" style={{width:200}} className="left_15" ></select>
										
										<span class="input-group-btn">
											<Button type="button" id="btn-remove-selected-model" className="btn btn-5 white left_15">{language[lng].deletee}</Button>
										</span>
									</div>
								</div>
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
						<div id = "topics">
							<div className="left_50 down_20 orange size_20"><p>{language[lng].topics}</p></div>
							<hr/>
							<div id="formulari"></div>
							<hr/>
						</div>
						<br/>
						<Button
							className="btn btn-1 white left_15"
							onClick={() => 	this.clickSave()}
						>
							<Icon className="fa fa-save" style={{ fontSize: 15 }}></Icon>
						</Button>
					</Grid>
					<Grid item xs={1} > 
					</Grid>
				</Grid>
			</div>
		
		);
	}
}


TeacherEditExerciceLocation3d = withRouter(TeacherEditExerciceLocation3d);

export default TeacherEditExerciceLocation3d;