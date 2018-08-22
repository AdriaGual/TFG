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
import Input from 'material-ui/Input';
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
class TeacherEditExerciceMPR extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			hasTextSolution:false,
		};
	}
	
	componentWillMount(){
		
		var loadjs = require('loadjs');
		loadjs('js/Three.js',function (){
		});
		loadjs('js/OrbitControls.js',function (){
		});
	
		loadjs('js/canvas_viewer_mpr.js',function (){
		});
		loadjs('js/adm_problem_mpr.js',function (){
		});
	}
	
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
	}

	clickSave  =()=>{
		var topics = $("input[name=topic]:checked").serialize();
		
		var difficulty = $("#difficulty").val();
		var max_tries = $("#max_tries").val();
		var solution = "";
		if (this.state.hasTextSolution){
			solution = $("#problem_solution").val();
		}				
		
		if (difficulty > 0 && difficulty <= 10 && max_tries > 0 && max_tries <= 100 && topics.length > 0 && topics.length > 0 && $("#newtitle").val()!="" && $("#problem_description").val()!="" && $("#problem_question").val()!="" && $("#help").val()!=""){
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
								'topics':topics,
								'title': $("#newtitle").val(), 
								'description': $("#problem_description").val(), 
								'question': $("#problem_question").val(), 
								'help': $("#help").val(), 
								'points': new_circles,
								'difficulty': difficulty,
								'max_tries': max_tries,
								'solution':solution,
							},
							url: 'php/save_exercise_mpr.php',
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
				this.setState({ showsnack: true ,snacktext:language[lng].helpnotset});
			}
		}
	}	
	
	handleClose = (event, reason) => {
		if (reason === 'clickaway') {
		  return;
		}
		this.setState({ showsnack: false });
	};
	
	
	appState = this.props.appState;

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
						<textarea value={this.state.value} onChange={this.handleChange} style={{height:200,width:400}}/>
						<p>{language[lng].question}:</p>
						<textarea value={this.state.value} onChange={this.handleChange} style={{height:100,width:400}}/>
						
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
								<textarea value={this.state.value} onChange={this.handleChange} style={{height:50,width:400}}/>
							:null}
						</Grid>
						
						<p>Help Text:</p>
						<textarea value={this.state.value} onChange={this.handleChange} style={{height:100,width:400}}/>
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
						<Grid container>
							<Grid item xs={1}>
							</Grid>
							<Grid item>
								<div class="tab-content">
									<div id="mpr" class="tab-pane fade in active">
										<div id="canvas_div">
											<span id="canvas" class="canvas">
											</span>
											<div id="canvas_button_group" class="part">
												<button type="button" id="btn-fullscreen" title="Pantalla completa"></button>
											</div>
										</div>
									
										<div id="select_set_input_group" className="down_10">
											<span class="input-group-btn">
												<Button type="button" id="btn-choose-set" className="btn btn-1 right_15 white">{language[lng].selectfromlibrary}</Button>
											</span>
											<Input type="text" id="set-input-text" className="left_15 border_grey" value="" disabled=""/>
										
											<div id="library_div" style={{display:'none'}} className="border_black down_10">
												<div id="library_content">
													<Grid container>
														<Grid item xs={6}>
														<div id="library_title" className="orange size_30 left_15">{language[lng].library}</div>
														</Grid>
														<Grid item xs={4}>
															<div id="library_button_group">
																<Button type="button" id="btn-open-library-item" className="btn btn-4 white down_10" disabled="">{language[lng].openset}</Button>
															</div>
														</Grid>
														<Grid item xs={2}>
															<Button type="button" id="btn-close-library" className="btn btn-5 white down_10"><Icon className="fa fa-times" style={{ fontSize: 15 }}></Icon></Button>
														</Grid>	
													</Grid>
												
													<div id="library_items" className="left_15">
														<div class="library_item" data-id="1" title="PIG_AGG061" >
															<img src="img/IMG0093.jpg" style={{width:100,height:100}}/>
															<div>PIG_AGG061</div>
														</div>
													</div>
												
												
												</div>
											</div>
										</div>
									
										<div id="anatomical_planes_group" className="down_10">
											<div id="axial_input_group">
												<span id="axial_label" >Axial</span>
												<input type="number" id="axial-number" style={{width:100,marginLeft:34}} className="border_grey" aria-describedby="axial_label" value="0" min="0" max="0" disabled=""/>
											</div>
										
											<div id="sagittal_input_group" className="down_10">
												<span id="sagittal_label" >{language[lng].sagital}</span>
												<input type="number" id="sagittal-number" style={{width:100,marginLeft:20}} className="border_grey" aria-describedby="sagittal_label" value="0" min="0" max="0" disabled=""/>
											</div>
										
											<div id="coronal_input_group" className="down_10">
												<span id="coronal_label" >Coronal</span>
												<input type="number" id="coronal-number" style={{width:100,marginLeft:14}} className="border_grey" aria-describedby="coronal_label" value="0" min="0" max="0" disabled=""/>
											</div>
										</div>
									
										<div id="centre_radius_group" style={{width:700}} className="down_10">
											<div id="centre_input_group">
												<span id="centre_label" >{language[lng].center}</span>
												<input type="text" className="border_grey" aria-describedby="centre_label" style={{width:160,marginLeft:22}} value="" readonly=""/>
											</div>
											<div id="radius_input_group" className="down_10" style={{width:200}}>
												<span id="radius_label" >{language[lng].radius}</span>
												<input type="number" className="border_grey" id="radius-number" style={{width:100,marginLeft:38}} aria-describedby="radius_label" value="0" min="1" disabled=""/>
											</div>
										</div>
										<br/><br/>
									</div>
								</div>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={2}> 
						<div id = "topics">
							<div className="left_50 down_20 orange size_20"  >
								<p>{language[lng].topics}</p>
							</div>
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


TeacherEditExerciceMPR= withRouter(TeacherEditExerciceMPR);

export default TeacherEditExerciceMPR;