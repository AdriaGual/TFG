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
import Dialog,{DialogActions,DialogContent,DialogContentText,DialogTitle} from 'material-ui/Dialog';
import language from "../Utils/language.js";
/** 
 * Register Page
 * @extends React.Component
 */
 
var n;
var img;
var type_component;

class UserExercice extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			exercice_statement:"",
			exercice_description:"",
			exercice_question:"",
			exercice_help:"",
			exercice_ntries:"",
			component:"",
			id:"",
			img:"",
			tries:"",
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
		loadjs('js/canvas_viewer_loc.js',function (){
		});
		loadjs('js/viewer2d.js',function (){
		});
	}
	
	componentDidMount(){
		var that = this;
		console.log(that.appState("exercice_name"));
		var settings = {
			type: 'POST',
			data: { 
				'name': STORAGE.getLocalStorageItem("exercise_name") || that.appState("exercice_name"), 
			},
			async:false,
			url: 'php/load_exercice.php',
			success: function(response) {
				var jsonData = JSON.parse(response);
				that.setState({exercice_statement: jsonData.statement});
				that.setState({exercice_description: jsonData.description});
				that.setState({exercice_question: jsonData.question});
				that.setState({exercice_help: jsonData.help});
				that.setState({exercice_ntries: jsonData.ntries});
				that.setState({tries: jsonData.tries});
				that.appState({type_component: jsonData.type_component});
				that.setState({id: jsonData.isql});
				img = jsonData.img;
				n = jsonData.type_component;
				if (that.appState("type_component")==5){
					var canvas = document.getElementById("canvas");
					var ctx = canvas.getContext("2d");

					function drawMap(imgdata) {
					  var image = new Image();
					  image.onload = function() {
						ctx.drawImage(image, 0, 0);
					  };
					  image.src = imgdata;
					}
					drawMap(img);
				}
			}
		};
		$.ajax(settings);
		
		if (n==0){
			LoadExercise(0);
		}
		else if (n==1){
			LoadExercise(1);
		}
		else if (n==2){
			LoadExercise(2);
		}
		else if (n==3){
			LoadExercise(3);
		}
		else if (n==4){
			LoadExercise(4);
		}
		
	}

	click  =()=>{
		if ($('#unityContent').length) // Si existia el guardem
		{
			$('#unity').appendTo("#unityHide");
		}	
	}	


	
	/**
	 * Renders the register page.
	 */
	render(){
		var lng = STORAGE.getLocalStorageItem("currentLanguage")|| this.appState("currentLanguage");
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
				<Link to={"/user_courses"} className="blue" style={{marginLeft:20}} onClick={() => this.click()}>{language[lng].courses}</Link>
				<Grid container>
					<Grid item xs={5}  className="padding2"> 
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
						
							<div id ="contentID"></div> 
						
					</Grid>
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