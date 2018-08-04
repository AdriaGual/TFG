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
	
	click = () => {
		/*var canvas = document.getElementById('canvas');
		var dataURL = canvas.toDataURL();
		var settings = {
			type: 'POST',
			data: { 
				'img': dataURL, 
			},
			url: 'php/save_theory.php',
			success: function(response) {
				
			}
		};
		$.ajax(settings);*/
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
		return (
			<div>
				<br/>
				<Link to={"/teacher_courses"} className="blue" style={{marginLeft:20}}>Courses</Link>
				<Grid container>
					<Grid item xs={1}> 
					</Grid>
					<Grid item xs={3}> 
						<TextField
							id="newtitle"
							label="Enter Theory Title"
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
							label="Enter Theory Subtitle"
							className="text_field "
							style = {{width: 600}}
							onChange={(event, newValue) =>
								this.setState({
									newsubtitle: newValue
								})
							}
						/>
						<br/><br/>
						<p>Content:</p>
						<textarea value={this.state.value} onChange={this.handleChange} style={{height:400,width:600}}/>
						<br/>
						<p>URL:</p>
						<textarea value={this.state.value} onChange={this.handleChange} style={{height:100,width:600}}/>
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
								<button type="button" id="btn-delete-image">Eliminar imatge</button>
							</div>
						</div>
					</Grid>
					<Grid item xs={1}> 
					</Grid>
					<Grid item xs={2} > 
						<Button
							className="btn btn-1 white left_30"
							onClick={() => 	this.click()}
						>
							<Icon className="fa fa-save" style={{ fontSize: 15 }}></Icon>
						</Button>
					</Grid>
					
				</Grid>

			</div>
		
		);
	}
}


Theory = withRouter(Theory);

export default Theory;