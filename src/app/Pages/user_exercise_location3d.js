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
var loader = new THREE.JSONLoader();
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
var solucions =[];
var fjson;
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
	
	handleCloseAdvice = () => {
		this.setState({ showhelp: false});
	}
	
	clickshowhelp = () => {
		this.setState({ showhelp: true});
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
				that.setState({answer: jsonData.answer});
				that.setState({finished: jsonData.finished});
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
				var json_n = jsonData2[0].matrix;	
				fjson =JSON.parse(json_n); 
				for (var a=0; a<fjson.length; a++){
					solucions[a] = fjson[a].name.concat(','+fjson[a].solution);
				}
			}
		};
		$.ajax(settings2);
		
		setTimeout(function(){
			loadFileModels(fjson);
		}, 200);
		
	}
	
	clickcorregir  =()=>{	
		var that = this;
		var correcte = true;
		
		if ($('#list_models_solution_select option').length==0){
			document.getElementById('btn-add-model-solution').style.border='solid';
			document.getElementById('btn-add-model-solution').style.borderColor='#e52213';
			this.setState({ showsnack: true ,snacktext:language[lng].answersnotset});
		}
		else{
			for (var a=0; a<solucions.length; a++){
				var array = solucions[a].split(",");
				if (array[1]==1){
					var b = 0;
					$('#list_models_solution_select option').each(function() {
						if (array[0] == $(this).text()){
							
							b=b+1;
						}
					});
					if (b==0){
						correcte = false;
					}
				}
				else{
					$('#list_models_solution_select option').each(function() {
						if (array[0] == $(this).text()){
							correcte=false;
						}
					});
				}
			}
			
			if (correcte){
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
			else{
				var a = that.state.tries;
				if (that.state.tries>=that.state.exercice_ntries){
					var settings2 = {
						type: 'POST',
						data: { 
							'name': STORAGE.getLocalStorageItem("exercise_name") || that.appState("exercice_name"),
							'tries': that.state.tries,
							'puntuation': 0,
						},
						url: 'php/save_mark.php',
						success: function(response2) {

						}
					};
					$.ajax(settings2);
					that.setState({ finished: true });
				}
				else{
					a++;
				}
				that.setState({ showcorrectanswer: false ,showwronganswer: true});
				that.setState({tries: a});
				var settings2 = {
					type: 'POST',
					data: { 
						'name': STORAGE.getLocalStorageItem("exercise_name") || that.appState("exercice_name"),
						'tries': that.state.tries,
					},
					url: 'php/save_tries.php',
					success: function(response2) {

					}
				};
				$.ajax(settings2);
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