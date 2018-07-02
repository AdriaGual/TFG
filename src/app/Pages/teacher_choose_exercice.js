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
class TeacherChooseExercice extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		searchString: '',
		searchFocusIndex: 0,
		searchFoundCount: null,
		hasTextSolution:false,
		treeData: [
				{
					name: "Topic 1",
					expanded:true, 
					children: [{ name: 'Topic 1 1', 
					children: [{ name: 'Topic 1 1 1' },{ name: 'Topic 1 1 2' }] }] 
			
				},
				{ name: 'Topic 2',
					expanded:true, 
					children: [{ name: 'Topic 2 1', 
					children: [{ name: 'Topic 2 1 1' },{ name: 'Topic 2 1 2' }] },
					{ name: 'Topic 2 2', 
					children: [{ name:'Topic 2 2 1' },{ name: 'Topic 2 2 2' }] },
					{ name: 'Topic 2 3', 
					children: [{ name: 'Topic 2 3 1'},{ name: 'Topic 2 3 2' }] }
					]
				}
			],
				
		};
	}
	click = (name) => {
		if (name== "2D"){
			this.appState({exercice_type:"2D"});
			this.props.history.push('/teacher_edit_exercice_location2d');
		}
		if(name == "3D"){
			this.appState({exercice_type: "3D"});
		}
		if(name == "Test"){
			this.appState({exercice_type: "Test"});
			this.props.history.push('/teacher_edit_exercice_test2d');
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
		 const getNodeKey = ({ treeIndex }) => treeIndex;
		const {
            treeData,
            searchString,
            searchFoundCount,
        } = this.state;
		return (
			<div style={{ height: 1500}}>
				<div className="left_30">	
					<p>Choose Exercice Type:</p>
				</div>
				<hr/>
				<Grid container>
					<Grid item xs={12} >
						<p></p>				
					</Grid>
				</Grid>
				<Grid container>
					<Grid item xs={1} > 
					</Grid>
					<Grid item xs={2} > 
						<Button
							className="btn btn-1 white"
							onClick={() => 	this.click("2D")}
						>
							2D Image
						</Button>
					</Grid>
					<Grid item xs={1}> 
					</Grid>
					<Grid item xs={2}> 
						<Button
							className="btn btn-1 white"
							onClick={() => 	this.click("Test")}
						>
							Test
						</Button>
					</Grid>
					<Grid item xs={1}> 
					</Grid>
					<Grid item xs={2}> 
						<Button
							className="btn btn-1 white"
							onClick={() => 	this.click("Test")}
						>
							Test
						</Button>
					</Grid>
					<Grid item xs={1}>
						
					</Grid>
					
				</Grid>
			</div>
		
		);
	}
}


TeacherChooseExercice  = withRouter(TeacherChooseExercice );

export default TeacherChooseExercice ;