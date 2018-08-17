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
import Select from 'material-ui/Select';
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
		loadjs('js/OrbitControls.js',function (){
		});
		loadjs('js/canvas_viewer_loc3d.js',function (){
		});
		loadjs('js/adm_problem_loc3d.js',function (){
		});
	}
	
	componentDidMount(){
		var that = this;
		var settings = {
			type: 'POST',
			async:false,
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
				that.setState({id: jsonData.idsql});
				n = jsonData.type_component;
			}
		};
		$.ajax(settings);
		
		var settings2 = {
			type: 'POST',
			async:false,
			data: { 
				'name': STORAGE.getLocalStorageItem("exercise_name") || that.appState("exercice_name") , 
			},
			url: 'php/load_exercice_location3d.php',
			success: function(response2) {
				var jsonData2 = JSON.parse(response2);
				loadFileModels(jsonData2);
				
			}
		};
		$.ajax(settings2);
	}
	
	/***clickcorregir  =()=>{
		var new_circles = [];
		
		$.each(location_points, function(index, location_point) {
			var id = location_point.id;
			var x = location_point.point.x;
			var y = location_point.point.y;
			var radius = location_point.point.r * location_point.point.radius_factor;
			if (id == -1) new_circles.push({"x": x, "y": y, "radius": radius});
		});
		
		var that = this;
		var settings = {
			type: 'POST',
			data: { 
				'name': that.appState("exercice_name"), 
				'points': new_circles,
			},
			url: 'php/verify_answers_location2d.php',
			success: function(response) {
				if (response=="match"){
					var settings2 = {
						type: 'POST',
						data: { 
							'name': that.appState("exercice_name"),
							'tries': that.state.tries,
							'puntuation': 10,
						},
						url: 'php/save_location2d_mark.php',
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
							url: 'php/save_location2d_mark.php',
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
	}	*/
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
							<div id="3d" class="tab-pane fade in active">
								<div id="canvas_div">
									<span id="canvas" class="canvas">
										
									</span>
									<div id="canvas_button_group" class="part">
										<button type="button" id="btn-fullscreen" title="Pantalla completa"></button>
									</div>
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
					<Grid item xs={3}  className="padding2">
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