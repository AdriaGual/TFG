"use strict";

// React imports
import React from 'react';
import { withRouter } from 'react-router';
import { Link, Redirect } from 'react-router-dom';
import Particles from "react-particles-js";
import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Icon from 'material-ui/Icon';
import SortableTree, {
  getFlatDataFromTree,
  getTreeFromFlatData,
} from 'react-sortable-tree';
/** 
 * Register Page
 * @extends React.Component
 */
 
 	var initialData = [];
class UserCourses extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			searchString: '',
			searchFocusIndex: 0,
			searchFoundCount: null,
			treeData: getTreeFromFlatData({
				flatData: initialData.map(node => ({ ...node, title: node.name })),
				getKey: node => node.id, // resolve a node's key
				getParentKey: node => node.parent, // resolve a node's parent's key
				rootKey: null, // The value of the parent key when there is no parent (i.e., at root level)
			}),
			redirect_course: false,
			redirect_topic: false,
			redirect_theory: false,
			redirect_exercice: false,
		};
	}
	appState = this.props.appState;

	componentDidMount() {
		var that = this;

		var settings = {
			type: 'GET',
			url: 'php/load_courses.php',
			success: function(response) {
				var jsonData = JSON.parse(response);
				var a = jsonData.map(node => ({ ...node, title: node.name }));
				that.setState({treeData: getTreeFromFlatData({
					flatData: a,
					getKey: node => node.id, // resolve a node's key
					getParentKey: node => node.parent, // resolve a node's parent's key
					rootKey: null, // The value of the parent key when there is no parent (i.e., at root level)
				})});
				console.log(jsonData);
			}
		};
		$.ajax(settings);
	}
	
	click = (name) => {
		var that = this;
		var settings = {
			type: 'POST',
			data: { 
				'name': name, 
			},
			url: 'php/is_course_topic.php',
			success: function(response) {
				if (response == "course"){
					that.appState({course_name: name});
					that.props.history.push('/user_course');
				}
				if(response == "topic"){
					that.appState({topic_name: name});
					that.setState({ redirect_topic: true});
				}
				if(response == "theory"){
					that.appState({theory_name:name});
					that.setState({ redirect_theory: true});
				}
				if(response == "exercice"){
					that.appState({exercice_name:name});
					that.setState({ redirect_exercice: true});
				}
			}
		};
		$.ajax(settings);
	};
	
	/**
	 * Renders the register page.
	 */
	render(){
		var {
            searchString,
            searchFoundCount,
        } = this.state;
		const { redirect_course, redirect_topic,redirect_theory,redirect_exercice} = this.state;

		if (redirect_course) {
			return <Redirect from='user_courses 'to='/user_course'/>;
		}
		if (redirect_topic){
			return <Redirect from='user_courses' to='/user_topic'/>;
		}
		if (redirect_theory){
			return <Redirect from='user_courses'  to='/user_theory'/>;
		}
		if (redirect_exercice){
			return <Redirect from='user_courses' to='/user_exercice'/>;
		}

		return (
			<div>
				<div className="left_30 down_20 orange size_30"><p>Current Courses</p></div>
				<hr/>
				<Grid container>
					<Grid item xs={12}  className="margin3"> 
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
					<Grid item xs={12}>
						<div style={{ height: 1500}}>
						<SortableTree
						treeData={this.state.treeData}
						onChange={treeData => this.setState({ treeData })}
						canDrag={false}
						searchQuery={searchString}
						generateNodeProps={({ node, path }) => {
								return {
									style: {
										color: path.length===1 ? "black" : path.length===2 ? "green" : "blue",
									},

								buttons: [
									<Button
										className={path.length===1 ? "btn btn-1 white":"btn btn-2 white"}
										onClick={() => 	this.click(node.name)}>
										<Icon className="fa fa-sign-in" style={{ fontSize: 15 }}></Icon>
									</Button>,
								],
							};
						}}
								
						/>
						</div>
					</Grid>
				</Grid>
				
			</div>
		
		);
	}
}


UserCourses = withRouter(UserCourses);

export default UserCourses;