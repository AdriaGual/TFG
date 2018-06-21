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
class UserExercice extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			exercice_statement:"",
			exercice_description:"",
			exercice_question:"",
			exercice_help:"",
			exercice_tries:"",
		}
	}
	appState = this.props.appState;

	
	componentDidMount() {
		var that = this;
		var settings = {
			type: 'POST',
			data: { 
				'name': that.appState("exercice_name"), 
			},
			url: 'php/load_exercice.php',
			success: function(response) {
				var jsonData = JSON.parse(response);
				that.setState({exercice_statement: jsonData.statement});
				that.setState({exercice_description: jsonData.description});
				that.setState({exercice_question: jsonData.question});
				that.setState({exercice_help: jsonData.help});
				that.setState({exercice_ntries: jsonData.tries});
			}
		};
		$.ajax(settings);
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
				<div className="left_30 down_20 orange size_30"><p>{this.state.exercice_statement}</p></div>
				<hr/>
				<Grid container>
					<Grid item xs={5}  className="padding2"> 
						<Card className="course_description_form margin2 padding2">
								<p className="margin1">{this.state.exercice_description}</p>
						</Card>
						<p className="left_30 down_20 black size_20">{this.state.exercice_question}</p>
						<Card className="course_description_form margin2 padding2">
								<p className="margin1">{this.state.exercice_help}</p>
						</Card>
						<p className="left_30 down_20 black size_20">Tries: {this.state.exercice_ntries}</p>

					</Grid>
					<Grid item xs={5}  className="padding2"> 
					
					</Grid>
				</Grid>

			</div>
		
		);
	}
}


UserExercice = withRouter(UserExercice);

export default UserExercice;