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
class TeacherEditExerciceLocation2d extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			hasTextSolution:false,
		};
	}
	
	componentWillMount(){
		var loadjs = require('loadjs');
		loadjs('js/edubody/JavaScript/GlobalUnityController.js',function (){
		});
		
	}
	
	click  =()=>{

    
		//SaveUnity();
		this.props.history.push('/teacher_choose_exercice');
		//ReloadUnity();
		
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
				
				<Grid container>
					<Grid item xs={12} >
						<p></p>				
					</Grid>
				</Grid>
				<Grid container>
					<Grid item xs={1}> 
					</Grid>
					
					<Grid item xs={10} > 
						<iframe className="edubody" src="edubody/LabellingEditorcall.html"></iframe>
					</Grid>
					
					<Grid item xs={1} > 
						<Button
							className="btn btn-1 white left_15"
							onClick={() => this.click()}
						>
							Return 
						</Button>
					</Grid>

				</Grid>
				
			</div>
		
		);
	}
}


TeacherEditExerciceLocation2d = withRouter(TeacherEditExerciceLocation2d);

export default TeacherEditExerciceLocation2d;