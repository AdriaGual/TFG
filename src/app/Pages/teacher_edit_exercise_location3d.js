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
class TeacherEditExerciceLocation3d extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			hasTextSolution:false,
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

	handleChange = name => event => {
		this.setState({ [name]: event.target.checked });
	};

	/**
	 * Renders the register page.
	 */
	render(){
		return (
			<div style={{ height: 1500}}>
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
					<Grid item xs={6} > 
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
									<Button type="button" id="btn-delete-model" style={{marginLeft:31}} className="btn btn-5 white down_15">Eliminar</Button>
								</div>
								
								<div id="displayed_models_input_group" style={{width:700}} className="down_15">
									<span id="displayed_models_select_label" >Models</span>
									<Select native  id="displayed_models_select" aria-describedby="displayed_models_select_label"  style={{width:200,marginLeft:71}}></Select>
									
									<span class="input-group-btn">
										<Button type="button" id="btn-add-model-solution" style={{marginLeft:14}} className="btn btn-4 white">Afegir a solució</Button>
									</span>
								</div>
								
								<div id="list_models_solution_input_group" style={{width:700}} className="down_15">
									<span id="list_models_solution_select_label" >Models solució</span>
									<select id="list_models_solution_select" aria-describedby="list_models_solution_select_label" size="3" style={{width:200}} className="left_15" ></select>
									
									<span class="input-group-btn">
										<Button type="button" id="btn-remove-selected-model" className="btn btn-5 white left_15">Eliminar</Button>
									</span>
								</div>
							</div>
						</div>
					</Grid>
					
					<Grid item xs={1} > 
						<Button
							className="btn btn-1 white left_15"
							onClick={() => 	this.clicktheory(node.name)}
						>
							Preview
						</Button>
					</Grid>

				</Grid>
				<Grid container className="down_30 left_30">
					<Grid item xs={2}> 
						<Card>
							<a className="orange size_30 left_30">Categories</a>
							<hr/>
							<List>
								<ListItem>
									<Checkbox/>
									<ListItemText>Magnetic Resonance</ListItemText>
								</ListItem>
								<ListItem>
									<Checkbox/>
									<ListItemText>Clinical Cases</ListItemText>
								</ListItem>
								<ListItem>
									<Checkbox/>
									<ListItemText>Evolution</ListItemText>
								</ListItem>
								<ListItem>
									<Checkbox/>
									<ListItemText>Plate in PA or AP</ListItemText>
								</ListItem>
								<ListItem>
									<Checkbox/>
									<ListItemText>Diafragmes</ListItemText>
								</ListItem>
							</List>
						</Card>
						<Grid item xs={1}>
							<p></p>
						</Grid>
					</Grid>
					<Grid item xs={1}> 
					</Grid>
					<Grid item xs={2}> 
						<Card>
							<a className="orange size_30 left_30">User Type</a>
							<hr/>
							<List>
								<ListItem>
									<Checkbox/>
									<ListItemText>Student</ListItemText>
								</ListItem>
								<ListItem>
									<Checkbox/>
									<ListItemText>Radiologist</ListItemText>
								</ListItem>
								<ListItem>
									<Checkbox/>
									<ListItemText>Doctor</ListItemText>
								</ListItem>
							</List>
						</Card>
						<Grid item xs={1}> 
							<p></p>
						</Grid>
						<Card>
							<a className="orange size_30 left_30">Topics</a>
							<hr/>
							<List>
								<ListItem>
									<Checkbox/>
									<ListItemText>Topic 1</ListItemText>
								</ListItem>
								<ListItem>
									<Checkbox/>
									<ListItemText>Topic 2</ListItemText>
								</ListItem>
								<ListItem>
									<Checkbox/>
									<ListItemText>Topic 3</ListItemText>
								</ListItem>
							
							</List>
						</Card>
					</Grid>
				</Grid>
			</div>
		
		);
	}
}


TeacherEditExerciceLocation3d = withRouter(TeacherEditExerciceLocation3d);

export default TeacherEditExerciceLocation3d;