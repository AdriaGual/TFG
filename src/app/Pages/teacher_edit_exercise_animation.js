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
import language from "../Utils/language.js"
import * as STORAGE from '../Utils/Storage.js';
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
	
	click  =()=>{
		if ($('#unityContent').length) // Si existia el guardem
		{
			$('#unity').appendTo("#unityHide");
		}
		
		this.props.history.push('/teacher_choose_exercise');	
	}
	
	componentDidMount(){
		LoadEditorAnimation();
	}
	
	appState = this.props.appState;

	handleChange = name => event => {
		this.setState({ [name]: event.target.checked });
	};

	/**
	 * Renders the register page.
	 */
	render(){
		var lng = STORAGE.getLocalStorageItem("currentLanguage")|| this.appState("currentLanguage");
		return (
			<div>
				<br/>
				<div className="left_30 down_20 orange size_30"><p>{language[lng].animationexercise}</p></div>
				<hr/>
				<Link to={"/teacher_courses"} className="blue" style={{marginLeft:20}} onClick={() => this.click()}>{language[lng].courses}></Link><Link to={"/teacher_choose_exercise"} className="blue" onClick={() => this.click()}>{language[lng].chooseexercise}</Link>
				<br/>
				<Grid container>
					<Grid item xs={1}> 
					</Grid>
					<Grid item xs={10} > 
						<div id ="contentID">
						</div>
					</Grid>
				</Grid>
			</div>
		);
	}
}


TeacherEditExerciceLocation2d = withRouter(TeacherEditExerciceLocation2d);

export default TeacherEditExerciceLocation2d;