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
										<Button type="button" id="btn-choose-set" className="btn btn-1 right_15 white">Escull de la biblioteca</Button>
									</span>
									<Input type="text" id="set-input-text" className="left_15 border_grey" value="" disabled=""/>
									
									<div id="library_div" style={{display:'none'}} className="border_black down_10">
										<div id="library_content">
											<Grid container>
												<Grid item xs={6}>
													<div id="library_title" className="orange size_30 left_15">Biblioteca</div>
												</Grid>
												<Grid item xs={4}>
												<div id="library_button_group">
												
												<Button type="button" id="btn-open-library-item" className="btn btn-4 white down_10" disabled="">Obrir conjunt</Button>
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
										<span id="sagittal_label" >Sagital</span>
										<input type="number" id="sagittal-number" style={{width:100,marginLeft:20}} className="border_grey" aria-describedby="sagittal_label" value="0" min="0" max="0" disabled=""/>
									</div>
									
									<div id="coronal_input_group" className="down_10">
										<span id="coronal_label" >Coronal</span>
										<input type="number" id="coronal-number" style={{width:100,marginLeft:14}} className="border_grey" aria-describedby="coronal_label" value="0" min="0" max="0" disabled=""/>
									</div>
								</div>
								
								<div id="centre_radius_group" style={{width:700}} className="down_10">
									<div id="centre_input_group">
										<span id="centre_label" >Centre</span>
										<input type="text" className="border_grey" aria-describedby="centre_label" style={{width:160,marginLeft:22}} value="" readonly=""/>
									</div>
									<div id="radius_input_group" className="down_10" style={{width:200}}>
										<span id="radius_label" >Radi</span>
										<input type="number" className="border_grey" id="radius-number" style={{width:100,marginLeft:38}} aria-describedby="radius_label" value="0" min="1" disabled=""/>
									</div>
								</div>
							</div>
						</div>
						</Grid>
						</Grid>
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