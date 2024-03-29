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
import * as STORAGE from '../Utils/Storage.js';
import language from "../Utils/language.js";
/** 
 * Register Page
 * @extends React.Component
 */
var initialData = [];
class UserTopic extends React.Component {
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
		topic_description:"",
		};
	}
	appState = this.props.appState;

	componentDidMount() {
		var that = this;
		var settings = {
			type: 'POST',
			data: { 
				'name': that.appState("topic_name"), 
			},
			url: 'php/load_topic.php',
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
	
	load_topic() {
		var that = this;
		var settings = {
			type: 'POST',
			data: { 
				'name': that.appState("topic_name"), 
			},
			url: 'php/load_topic.php',
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
				if(response == "topic"){
					that.appState({topic_name: name});
					that.props.history.push('/user_topic');
				}
				if(response == "theory"){
					that.appState({theory_name:name});
					STORAGE.setLocalStorageItem("theory_name", name);
					that.props.history.push('/user_theory');
				}
				if(response == "exercice"){
					STORAGE.setLocalStorageItem("exercise_name", name);
					that.appState({exercice_name:name});
					var a;
					var settings2 = {
						type: 'POST',
						data: { 
							'name': name, 
						},
						async:false,
						url: 'php/load_exercice.php',
						success: function(response) {
							var jsonData = JSON.parse(response);
							a= jsonData.type_component;
							
						}
					};
					$.ajax(settings2);
					
					if (a<5){
						that.props.history.push('/user_exercise_edubody');
					}
					else if (a==5){
						that.props.history.push('/user_exercise_test');
					}
					else if (a==6){
						that.props.history.push('/user_exercise_location2d');
					}
				}
			}
		};
		$.ajax(settings);
	};
	
	/**
	 * Renders the register page.
	 */
	render(){
		var lng = STORAGE.getLocalStorageItem("currentLanguage")|| this.appState("currentLanguage");
		const {
            treeData,
            searchString,
            searchFoundCount,
			course_description,
			course_prerequisits,
        } = this.state;
		
		const {redirect_topic, redirect_theory, redirect_exercice } = this.state;
		if (redirect_theory){
			return <Redirect from='user_topic' to='/user_theory'/>;
		}
		if (redirect_exercice){
			return <Redirect from='user_topic' to='/user_exercise'/>;
		}
		
		
		return (
			<div>
				<br/>
				<div className="left_30 down_20 orange size_30"><p>{this.appState("topic_name")}
				</p></div>
				<hr/>
				<Link to={"/user_courses"} className="blue" style={{marginLeft:20}}>{language[lng].courses}></Link><Link to={"/user_course"} className="blue" >{this.appState("course_name")}</Link>
				<Grid container>
					<Grid item xs={10}  className="padding2"> 
						<label htmlFor="find-box">
							<TextField
								id="find-box"
								type="text"
								value={searchString}
								onChange={event => this.setState({ searchString: event.target.value })}
								label={language[lng].search}
							/>
						</label>
					</Grid>
					<Grid item xs={2} className="down_20"> 
						<Link to="/user_qualifications" className="blue"> {language[lng].qualifications}</Link>
					</Grid>
				</Grid>
				<Grid container>
					<Grid item xs={8}>
						<div style={{ height: 1500}}>
						<SortableTree
						treeData={this.state.treeData}
						onChange={treeData => this.setState({ treeData })}
						canDrag={false}
						searchQuery={searchString}
						generateNodeProps={({ node, path }) => {
							return {
								style: {
									color: node.istheory ? "green" : node.isexercise ? "red" : "blue",
								},

								buttons: [<Button
										className="btn btn-1 white"
										onClick={() => 	this.click(node.name)}>
										<Icon className="fa fa-sign-in" style={{ fontSize: 15 }}></Icon>
									</Button>,
								],
							};
						}}	
						/>
						</div>
					</Grid>
					<Grid item xs={3}>
					</Grid>
					<Grid item xs={1}>
					</Grid>
				</Grid>
				
			</div>
		
		);
	}
}


UserTopic = withRouter(UserTopic);

export default UserTopic;