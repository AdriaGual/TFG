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
class UserCourse extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		searchString: '',
		searchFocusIndex: 0,
		searchFoundCount: null,
		treeData: [
				{ title:'Topic 1',
					expanded:true, 
					children: [{ title: <Link to="/user_theory" className="blue">Theory</Link> },{ title: <Link to="/user_exercice" className="red">Exercices</Link> }]  
			
				}
			],
		course_description:"",
		course_prerequisits:"",
				
		};
	}
	appState = this.props.appState;

	componentDidMount() {
		var that = this;

		var settings = {
			type: 'POST',
			data: { 
				'name': that.appState("course_name"), 
			},
			url: 'php/load_course_information.php',
			success: function(response) {
				var jsonData = JSON.parse(response);
				that.setState({course_description: jsonData.description});
				that.setState({course_prerequisits: jsonData.prerequisits});
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
			course_description,
			course_prerequisits,
        } = this.state;
		return (
			<div>
				<div className="left_30 down_20 orange size_30"><p>{this.appState("course_name")}
				</p></div>
				<hr/>
				<Grid container>
					<Grid item xs={10}  className="padding2"> 
						<label htmlFor="find-box">
							<TextField
								id="find-box"
								type="text"
								value={searchString}
								onChange={event => this.setState({ searchString: event.target.value })}
								label="Search"
							/>
						</label>
					</Grid>
					<Grid item xs={2} className="down_20"> 
						<Link to="/user_qualifications" className="blue"> Qualifications</Link>
					</Grid>
				</Grid>
				<Grid container>
					<Grid item xs={8}>
						<div style={{ height: 1500}}>
						<SortableTree
						className="margin0" 
						  treeData={this.state.treeData}
						  onChange={treeData => this.setState({ treeData })}
						  canDrag={false}
						  searchQuery={searchString}
						/>
						</div>
					</Grid>
					<Grid item xs={3}>
						<Card className="course_description_form margin2 ">
							<CardContent className="bold">
								Course Description
							</CardContent>
								<p id="description_text" className="margin1">{this.state.course_description}</p>
						</Card>
						<Card className="course_description_form margin2 ">
							<CardContent className="bold">
								Pre-Requirements
							</CardContent>
								<p className="margin1">{this.state.course_prerequisits}</p>
						</Card>
					</Grid>
					<Grid item xs={1}>
					</Grid>
				</Grid>
				
			</div>
		
		);
	}
}


UserCourse = withRouter(UserCourse);

export default UserCourse;