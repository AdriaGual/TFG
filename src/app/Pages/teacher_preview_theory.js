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

		that.setState({theory_content: that.appState("theory_content")});
		that.setState({theory_url: that.appState("theory_url")});
		that.setState({theory_title: that.appState("theory_title")});
		that.setState({theory_subtitle: that.appState("theory_subtitle")});
		
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
	
	click = () =>{
		this.props.history.push("/teacher_create_theory");
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
				<div className="left_30 down_20 orange size_30"><p>{this.state.theory_title}</p></div>
				<hr/>
				<Link to={"/teacher_courses"} className="blue" style={{marginLeft:20}}>{language[lng].courses} ></Link>
				<Link to={"/teacher_create_theory"} className="blue" style={{marginLeft:20}}>{language[lng].createtheory}</Link>
				<Grid container>
					<Grid item xs={2}>
					</Grid>
					<Grid item xs={4}  className="padding2"> 
						<p className="left_30 down_20 black size_12">{this.state.theory_subtitle}</p>
						<br/>
						<a className="left_30 down_20 blue size_12" href={this.state.theory_url}>{language[lng].url}: {this.state.theory_url}</a>
						<br/>
						<br/>
						<div className="big_text">{this.state.theory_content}</div>
						
					</Grid>
					<Grid item xs={4}  className="padding2"> 
						<div id="image_div">
							<div id="canvas_div">
								<canvas id="canvas"></canvas>
							</div>
						</div>
					</Grid>
					<Grid item xs={2}>
					</Grid>
				</Grid>
				<br/><br/>

			</div>
		
		);
	}
}


Theory = withRouter(Theory);

export default Theory;