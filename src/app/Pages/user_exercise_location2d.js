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
import Dialog,{DialogActions,DialogContent,DialogContentText,DialogTitle} from 'material-ui/Dialog';
import language from "../Utils/language.js";
/** 
 * Register Page
 * @extends React.Component
 */
 
var n;
var img;
var tries;
var lng;
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
			finished:false,
			showhelp:false,
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
	
	handleClose = (event, reason) => {
		if (reason === 'clickaway') {
		  return;
		}
		this.setState({ showsnack: false });
	};
	
	handleCloseAdvice = () => {
		this.setState({ showhelp: false});
	}
	
	clickshowhelp = () => {
		this.setState({ showhelp: true});
	}
	
	componentDidMount(){
		var that = this;
		var settings = {
			type: 'POST',
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
				that.setState({answer: jsonData.answer});
				that.setState({finished: jsonData.finished});
				img = jsonData.original_img;
				n = jsonData.type_component;
				if (n==6){
					setImage(img);
				}
			}
		};
		$.ajax(settings);
	}
	
	clickcorregir  =()=>{
		var new_circles = [];
		
		$.each(location_points, function(index, location_point) {
			var id = location_point.id;
			var canvas = document.getElementById("canvas");
			var bounds = canvas.getBoundingClientRect();
			
			var x = location_point.point.x;
			var y = location_point.point.y;
			var radius = location_point.point.r * location_point.point.radius_factor;
			
			if (id == -1) new_circles.push({"x": x, "y": y, "radius": radius});
		});
		
		if (new_circles.length==0){
			document.getElementById('btn-edit-circle').style.border='solid';
			document.getElementById('btn-edit-circle').style.borderColor='#e52213';
			this.setState({ showsnack: true ,snacktext: language[lng].answersnotset});
		}
		else{
			var that = this;
			var settings = {
				type: 'POST',
				async:false,
				data: { 
					'name': STORAGE.getLocalStorageItem("exercise_name") || that.appState("exercice_name"), 
					'points': new_circles,
				},
				url: 'php/verify_answers_location2d.php',
				success: function(response) {
					if (response=="match"){
						var settings2 = {
							type: 'POST',
							data: { 
								'name': STORAGE.getLocalStorageItem("exercise_name") || that.appState("exercice_name"),
								'tries': that.state.tries,
								'puntuation': 10,
							},
							url: 'php/save_mark.php',
							success: function(response2) {

							}
						};
						$.ajax(settings2);
						that.setState({ finished: true });
						that.setState({ showcorrectanswer: true ,showwronganswer: false});
					}
					else if (response=="no_match"){
						var a = that.state.tries;
						a++;
						if (a==that.state.exercice_ntries){
							var settings2 = {
								type: 'POST',
								async:false,
								data: { 
									'name': STORAGE.getLocalStorageItem("exercise_name") || that.appState("exercice_name"),
									'tries': a,
									'puntuation': 0,
								},
								url: 'php/save_mark.php',
								success: function(response2) {

								}
							};
							$.ajax(settings2);
							that.setState({ finished: true });
						}

						that.setState({ showcorrectanswer: false ,showwronganswer: true});
						that.setState({tries: a});
						var settings2 = {
							type: 'POST',
							async:false,
							data: { 
								'name': STORAGE.getLocalStorageItem("exercise_name") || that.appState("exercice_name"),
								'tries': a,
							},
							url: 'php/save_tries.php',
							success: function(response2) {

							}
						};
						$.ajax(settings2);
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
		lng = STORAGE.getLocalStorageItem("currentLanguage")|| this.appState("currentLanguage");

		return (
			<div>
				<br/>
				<div className="left_30 down_20 orange size_30"><p>{this.state.exercice_statement}</p></div>
				<hr/>
				<Link to={"/user_courses"} className="blue" style={{marginLeft:20}} >{language[lng].courses}</Link>
				<Grid container>
					
					<Grid item xs={4}  className="padding2"> 
						<hr/>
						<div className="margin1 big_text">{this.state.exercice_description}</div>
						<hr/><br/><br/><hr/>
						<div className="left_30 down_20 black size_20 big_text">{this.state.exercice_question}</div>
						<hr/><br/><br/>
						<div className="left_30 down_20 black size_20">Tries: {this.state.tries}/{this.state.exercice_ntries}</div>
						<br/><br/><br/>
						<button type="button"  className="btn btn-6 white" style={{border:'none',width:40,height:36,borderRadius: 50,fontWeight: 700}} onClick={() => this.clickshowhelp()}> <Icon className="fa fa-question" style={{ fontSize: 15 }}></Icon></button>
						
					</Grid>
					<Grid item xs={4}  className="padding2">
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
						</div>
						
					</Grid>
					<Grid item xs={3}  className="padding2">
						<br/>
						{(this.state.tries < this.state.exercice_ntries)  ? this.state.finished==0 ?
							<Button
								className="btn btn-1 white left_30"
								onClick={() => 	this.clickcorregir()}
							> {language[lng].verify}</Button>:null: null
						}
						<br/><br/>
						{this.state.showcorrectanswer ? 
								this.state.answer!="" ?
								<div>
								<p>{language[lng].correct}</p>
								<br/>
								<hr/>
								<p>{this.state.answer}</p>
								</div> 
								: 
								<div>
								<p>{language[lng].correct}</p>
								<br/>
								</div> 
								: null
						}
						{this.state.showwronganswer ? 
							<div>
							<p>{language[lng].incorrect}</p>
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
					<Dialog
						open={this.state.showhelp}
						onClose={this.handleCloseAdvice}
					>
					<DialogTitle className="down_15">{STORAGE.getLocalStorageItem("exercise_name") + " help"}</DialogTitle>
						 <DialogContent>
							<DialogContentText>
							 {this.state.exercice_help}
							</DialogContentText>
						</DialogContent>
					</Dialog>	
				</Grid>

			</div>
		
		);
	}
}


UserExercice = withRouter(UserExercice);

export default UserExercice;