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
class TeacherEditExerciceTest2d extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			hasTextSolution:false,
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
						<textarea value={this.state.value} onChange={this.handleChange} id="problem_description" style={{height:200,width:400}}/>
						<p>Question:</p>
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
								<p>Text Solution:</p>
							 </Grid>
							{this.state.hasTextSolution ?
								<textarea value={this.state.value} onChange={this.handleChange} id="problem_solution" style={{height:50,width:400}}/>
							:null}
						</Grid>
						
						<p>Help Text:</p>
						<textarea value={this.state.value} onChange={this.handleChange} style={{height:100,width:400}}/>
						<Grid container>
							<Grid item xs={6} > 
								<Select native className="down_30 " id="problem_difficulty_level"> 
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
								<button type="button" id="btn-delete-image">Eliminar imatge</button>
							</div>
							
						</div>
					</Grid>
					<Grid item xs={2} >
						<div id="items_box">
						</div>
						<Button type="button" id="btn-new-item" className="btn btn-4 white" >Afegir resposta</Button>
					</Grid>
					<Grid item xs={2} > 
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


TeacherEditExerciceTest2d = withRouter(TeacherEditExerciceTest2d);

export default TeacherEditExerciceTest2d;