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
import language from "../Utils/language.js"
import * as STORAGE from '../Utils/Storage.js';

/** 
 * Register Page
 * @extends React.Component
 */
var lng;
class Theory extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			theory_content:"",
			theory_url:"",
			theory_title:"",
			theory_subtitle:"",
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
	
	componentDidMount() {
		var that = this;
		$("#newtitle").val(that.appState("theory_title"));
		$("#newsubtitle").val(that.appState("theory_subtitle"));
		$("#content_text").val(that.appState("theory_content"));
		$("#url_text").val(that.appState("theory_url"));
		
		if (that.appState("theory_image")!=""){
			var settings = {
				type: 'GET',
				url: 'php/load_image.php',
				success: function(response) {
					var canvas = document.getElementById("canvas");
					var ctx = canvas.getContext("2d");

					function drawMap(imgdata) {
					  var image = new Image();
					  image.onload = function() {
						ctx.drawImage(image, 0, 0);
					  };
					  image.src = imgdata;
					  
					  
					}
					setTimeout(() => {
					 drawMap(that.appState("theory_image"));
					}, 200);
				}
			};
			$.ajax(settings);
		}
		
		
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
	
	
	clickPreview = () =>{
		var canvas = document.getElementById('canvas');
		var dataURL = canvas.toDataURL("image/png");
		
		this.appState({theory_image: dataURL});
		this.appState({theory_title: $("#newtitle").val()});
		this.appState({theory_subtitle: $("#newsubtitle").val()});
		this.appState({theory_content: $("#content_text").val()});
		this.appState({theory_url: $("#url_text").val()});
		this.props.history.push("/teacher_preview_theory");
	}
	
	clickback = () =>{
		
		this.appState({theory_image: ""});
		this.appState({theory_title: ""});
		this.appState({theory_subtitle:""});
		this.appState({theory_content: ""});
		this.appState({theory_url: ""});
	}
	
	click = () => {
		var canvas = document.getElementById('canvas');
		var dataURL = canvas.toDataURL("image/png");
		var topics = $("input[name=topic]:checked").serialize();
		var that = this;
		var settings = {
			type: 'POST',
			data: { 
				'img': dataURL, 
				'title': $("#newtitle").val(), 
				'subtitle': $("#newsubtitle").val(), 
				'content': $("#content_text").val(), 
				'url': $("#url_text").val(), 
				'topics': topics,
			},
			url: 'php/save_theory.php',
			success: function(response) {
				if (response=="OK"){
					that.props.history.push("/teacher_courses");
				}
			}
		};
		$.ajax(settings);
	}
	
	/**
	 * Renders the register page.
	 */
	render(){
		lng = STORAGE.getLocalStorageItem("currentLanguage")|| this.appState("currentLanguage");
		const {
            treeData,
            searchString,
            searchFoundCount,
        } = this.state;
		return (
			<div>
				<br/>
				<Link to={"/teacher_courses"} className="blue" style={{marginLeft:20}} onClick={() => 	this.clickback()}>{language[lng].courses}</Link>
				<Grid container>
					<Grid item xs={1}> 
					</Grid>
					<Grid item xs={3}> 
						<TextField
							id="newtitle"
							label={language[lng].entertheorytitle}
							className="text_field "
							style = {{width: 600}}
							onChange={(event, newValue) =>
								this.setState({
									newtitle: newValue
								})
							}
						/>
						<br/>
						<TextField
							id="newsubtitle"
							label={language[lng].entertheorysubtitle}
							className="text_field "
							style = {{width: 600}}
							onChange={(event, newValue) =>
								this.setState({
									newsubtitle: newValue
								})
							}
						/>
						<br/><br/>
						<p>{language[lng].content}:</p>
						<textarea id="content_text" value={this.state.value} onChange={this.handleChange} style={{height:400,width:600}}/>
						<br/>
						<p>{language[lng].url}:</p>
						<textarea id="url_text" value={this.state.value} onChange={this.handleChange} style={{height:50,width:600}}/>
					</Grid>
					<Grid item xs={1}>
					</Grid>
					<Grid item xs={3} className="padding2"> 
						<div id="image_div">
							<div id="canvas_div">
								<canvas id="canvas"></canvas>
								<div id="canvas_button_group" class="part">
									<button type="button" id="btn-fullscreen" title="Pantalla completa"></button>
								</div>
							</div>
							
							<div id="image_file_input_group" class="input-group">
								<input type="file" id="problem_image_input" />
							</div>
							<div id="current_image_input_group" class="input-group">
								<input type="hidden" id="problem_image_url" value="" disabled />
								<button type="button" id="btn-delete-image">{language[lng].deleteimage}</button>
							</div>
						</div>
					</Grid>
					<Grid item xs={1}> 
					</Grid>
					<Grid item xs={2} > 
						<div className="left_30 down_20 orange size_20"><p>{language[lng].topics}</p></div>
						<hr/>
						<div id="formulari"></div>
						<hr/>
						<br/>
						<Grid container>
							<Grid item xs={6}>
								<Button
									id="btn-preview"
									className="btn btn-4 white left_30"
									onClick={() => 	this.clickPreview()}
								>
									<Icon className="fa fa-eye" style={{ fontSize: 15 }}></Icon>
								</Button>
							</Grid>
						
							<Grid item xs={6}>
								<Button
									id="btn-save"
									className="btn btn-1 white left_30"
									onClick={() => 	this.click()}
								>
									<Icon className="fa fa-save" style={{ fontSize: 15 }}></Icon>
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</div>
		
		);
	}
}


Theory = withRouter(Theory);

export default Theory;