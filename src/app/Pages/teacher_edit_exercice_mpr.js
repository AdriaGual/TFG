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
						label="Enter Exercice Statement"
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
						<div class="tab-content">
							<div id="mpr" class="tab-pane fade in active">
								<div id="canvas_div">
									<span id="canvas" class="canvas"><canvas></canvas></span>
									<div id="canvas_button_group" class="part">
										<button type="button" id="canvas-settings" title="Configuració"></button>
										<button type="button" id="btn-fullscreen" title="Pantalla completa"></button>
									</div>
								</div>
								
								<div id="select_set_input_group" class="input-group">
									<span class="input-group-btn">
										<button type="button" id="btn-choose-set" class="btn btn-default btn-interface">Escull de la biblioteca</button>
									</span>
									<input type="text" id="set-input-text" class="form-control" value="" disabled=""/>
									
									<div id="library_div" >
										<div id="library_content">
											<button type="button" id="btn-close-library"></button>
											
											<div id="library_title">Biblioteca</div>
											
											<div id="library_items">
														<div class="library_item" data-id="1" title="PIG_AGG061">
															<img src="img/IMG0093.jpg"/>
															<div>PIG_AGG061</div>
														</div>
											</div>
											
											<div id="library_button_group">
												<button type="button" id="btn-open-library-item" class="btn btn-default btn-interface" disabled="">Obrir conjunt</button>
											</div>
										</div>
									</div>
								</div>
								
								<div id="anatomical_planes_group">
									<div id="axial_input_group" class="input-group">
										<span id="axial_label" class="input-group-addon">Axial</span>
										<input type="number" id="axial-number" class="form-control" aria-describedby="axial_label" value="0" min="0" max="0" disabled=""/>
									</div>
									
									<div id="sagittal_input_group" class="input-group">
										<span id="sagittal_label" class="input-group-addon">Sagital</span>
										<input type="number" id="sagittal-number" class="form-control" aria-describedby="sagittal_label" value="0" min="0" max="0" disabled=""/>
									</div>
									
									<div id="coronal_input_group" class="input-group">
										<span id="coronal_label" class="input-group-addon">Coronal</span>
										<input type="number" id="coronal-number" class="form-control" aria-describedby="coronal_label" value="0" min="0" max="0" disabled=""/>
									</div>
								</div>
								
								
								
								<div id="centre_radius_group">
									<div id="centre_input_group" class="input-group">
										<span id="centre_label" class="input-group-addon">Centre</span>
										<input type="text" class="form-control" aria-describedby="centre_label" value="" readonly=""/>
									</div>
									
									<div id="radius_input_group" class="input-group">
										<span id="radius_label" class="input-group-addon">Radi</span>
										<input type="number" id="radius-number" class="form-control" aria-describedby="radius_label" value="0" min="1" disabled=""/>
									</div>
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


TeacherEditExerciceMPR= withRouter(TeacherEditExerciceMPR);

export default TeacherEditExerciceMPR;