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
class TeacherChooseExercice extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		searchString: '',
		searchFocusIndex: 0,
		searchFoundCount: null,
		hasTextSolution:false,
		};
	}
	click = (name) => {
		if (name== "2D"){
			this.appState({exercice_type:"2D"});
			this.props.history.push('/admin_edit_exercise_location2d');
		}
		if(name == "3D"){
			this.appState({exercice_type: "3D"});
			this.props.history.push('/admin_edit_exercise_location3d');
		}
		if(name == "Test"){
			this.appState({exercice_type: "Test"});
			this.props.history.push('/admin_edit_exercise_test2d');
		}
		if(name == "MPR"){
			this.appState({exercice_type: "MPR"});
			this.props.history.push('/admin_edit_exercise_mpr');
		}
		if(name == "Animation"){
			this.appState({exercice_type: "Animation"});
			this.props.history.push('/admin_edit_exercise_animation');
		}
		if(name == "Labelling"){
			this.appState({exercice_type: "Labelling"});
			this.props.history.push('/admin_edit_exercise_labelling');
		}
		if(name == "Selection"){
			this.appState({exercice_type: "Selection"});
			this.props.history.push('/admin_edit_exercise_selection');
		}
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
		const getNodeKey = ({ treeIndex }) => treeIndex;
		const {
            treeData,
            searchString,
            searchFoundCount,
        } = this.state;
		return (
			<div style={{ height: 1500}}>
				<br/>
				<div className="left_30">	
					<p className="orange size_30">{language[lng].chooseexercisetype}</p>
				</div>
				<hr/>
				<Link to={"/adm_params"} className="blue" style={{marginLeft:20}}>Courses</Link>
				
				<Grid container>
					<Grid container>
						<Grid item xs={1} > 
						</Grid>
						<Grid item xs={2} > 
							<br/><br/>
							<Button
								className="btn btn-1 white"
								onClick={() => 	this.click("2D")}
								style={{width:100}}
							>
								{language[lng].image2d}
							</Button>
							<Button
								className="btn btn-1 white left_15"
								onClick={() => 	this.click("Test")}
								style={{width:100}}
							>
								{language[lng].test2d}
							</Button>
							
							<br/><br/>
							
							<Button
								className="btn btn-1 white"
								onClick={() => 	this.click("MPR")}
								style={{width:100}}
							>
							{language[lng].mpr}
							</Button>
							<Button
								className="btn btn-1 white"
								onClick={() => 	this.click("3D")}
								style={{width:100,marginLeft:15}}
							>
							{language[lng].image3d}
							</Button>
							<br/><br/>
							<Button
								className="btn btn-1 white"
								onClick={() => 	this.click("Animation")}
								style={{width:100}}
							>
								{language[lng].animation}
							</Button>
							<Button
								className="btn btn-1 white"
								style={{width:100,marginLeft:15}}
								onClick={() => 	this.click("Labelling")}
							>
								{language[lng].labelling}
							</Button>
							
							<br/><br/>
							<Button
								className="btn btn-1 white"
								onClick={() => 	this.click("Selection")}
								style={{width:100}}
							>
								{language[lng].selection}
							</Button>
						</Grid>
					</Grid>
				</Grid>
				
			</div>
		
		);
	}
}


TeacherChooseExercice  = withRouter(TeacherChooseExercice );

export default TeacherChooseExercice ;