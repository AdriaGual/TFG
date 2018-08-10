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

/** 
 * Register Page
 * @extends React.Component
 */
class TeacherEditExerciceLocation2d extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			hasTextSolution:false,
		};
	}
	
	componentWillMount(){
		var loadjs = require('loadjs');
		loadjs('js/canvas_viewer_loc.js',function (){
		});
		loadjs('js/viewer2d.js',function (){
		});
	}
	
	appState = this.props.appState;

	handleChange = name => event => {
		this.setState({ [name]: event.target.checked });
	};
	
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
								$("#formulari").append("<p class='size15'>No hi han topics en aquest curs </p><br/><br/>");
							}
						}
					};
					$.ajax(settings2);
				}
			}
		};
		$.ajax(settings);
	}

	/**
	 * Renders the register page.
	 */
	render(){
		return (
			<div>
				<div className="left_30">	
					<TextField
						id="newtitle"
						label="Enter Exercise Statement"
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
				<Link to={"/teacher_courses"} className="blue" style={{marginLeft:20}}>Courses></Link><Link to={"/teacher_choose_exercise"} className="blue" >Choose Exercise</Link>
				<br/>
				<Grid container>
					<Grid item xs={12} >
						<p></p>				
					</Grid>
				</Grid>
				<Grid container>
					<Grid item xs={1} > 
					</Grid>
					<Grid item xs={3} > 
						<p>Description:</p>
						<textarea value={this.state.value} onChange={this.handleChange} style={{height:200,width:400}}/>
						<p>Question:</p>
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
								<p>Text Solution:</p>
							 </Grid>
							{this.state.hasTextSolution ?
								<textarea value={this.state.value} onChange={this.handleChange} style={{height:50,width:400}}/>
							:null}
						</Grid>
						
						<p>Help Text:</p>
						<textarea value={this.state.value} onChange={this.handleChange} style={{height:100,width:400}}/>
						<Grid container>
							<Grid item xs={6} > 
								<Select native className="down_30 "> 
									<option value="">Difficulty</option>
									<option value={1}>1</option>
									<option value={2}>2</option>
									<option value={3}>3</option>
									<option value={4}>4</option>
								</Select>
							</Grid>
							<Grid item xs={6} > 
								<Select native className="down_30 "> 
									<option value="">Maximum Tries</option>
									<option value={1}>1</option>
									<option value={2}>2</option>
									<option value={3}>3</option>
									<option value={4}>4</option>
								</Select>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={1}>
					</Grid>
					<Grid item xs={4} > 
						<div id="image_div">
							<div id="canvas_div">
								<canvas id="canvas"></canvas>
								<div id="canvas_button_group" class="part">
									<div id="btn-group-location">
										<button type="button" id="btn-edit-circle" title="Afegir o editar punt" class="btn-location selected"></button>
										<button type="button" id="btn-delete-circle" title="Eliminar punt" class="btn-location"></button>
									</div>
									<div id="radius_div">
										<div id="radius_input_group" class="input-group">
											<span class="input-group-addon">Radi</span>
											<input type="text" id="radius_value" class="form-control" value="5" />
										</div>
										<input id="radius_slider" type="range" min="1" max="10" step="1" value="5" />
									</div>
									<button type="button" id="btn-fullscreen" title="Pantalla completa"></button>
								</div>
							</div>
							
							<div id="image_file_input_group" class="input-group">
								<input type="file" id="problem_image_input" />
							</div>
							<div id="current_image_input_group" class="input-group">
								<input type="hidden" id="problem_image_url" value="" disabled />
								<button type="button" id="btn-delete-image">Eliminar imatge</button>
							</div>
						</div>
					</Grid>
					
					<Grid item xs={2} > 
						<div className="left_50 down_20 orange size_20"><p>Topics</p></div>
						<hr/>
						<div id="formulari"></div>
						<hr/>
						<br/>
						<Button
							className="btn btn-1 white left_15"
							onClick={() => 	this.click()}
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


TeacherEditExerciceLocation2d = withRouter(TeacherEditExerciceLocation2d);

export default TeacherEditExerciceLocation2d;