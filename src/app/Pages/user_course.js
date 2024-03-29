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
  var initialDataTopic = [];
class UserCourse extends React.Component {
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
			course_description:"",
			course_prerequisits:"",
			topic_selected:"",
			type_info_selected:"",
			showinfo:false,
			searchStringTopic: '',
			searchFocusIndexTopic: 0,
			searchFoundCountTopic: null,
			treeDataTopic: getTreeFromFlatData({
					flatData: initialDataTopic.map(node => ({ ...node, title: node.name })),
					getKey: node => node.id, // resolve a node's key
					getParentKey: node => node.parent, // resolve a node's parent's key
					rootKey: null, // The value of the parent key when there is no parent (i.e., at root level)
				}),
			
		};
	}
	appState = this.props.appState;

	componentDidMount() {
		var that = this;
		var settings = {
			type: 'GET',
			url: 'php/load_course_information.php',
			success: function(response) {
				var jsonData = JSON.parse(response);
				that.appState({course_name: jsonData.name});
				that.setState({course_description: jsonData.description});
				that.setState({course_prerequisits: jsonData.prerequisits});
			}
		};
		$.ajax(settings);
		
		var settings = {
			type: 'POST',
			data: { 
				'name': that.appState("course_name"), 
			},
			url: 'php/load_course.php',
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
					else if (a==7){
						that.props.history.push('/user_exercise_location3d');
					}
				}
			}
		};
		$.ajax(settings);
	};
	
	clicktheory = (name) => {
		var that = this;
		var settings = {
			type: 'POST',
			data: { 
				'name': name, 
			},
			url: 'php/load_topic_theory.php',
			success: function(response) {
				if(response!="topichasnotheory"){
					var jsonData = JSON.parse(response);
					var a = jsonData.map(node => ({ ...node, title: node.name }));
					that.setState({treeDataTopic: getTreeFromFlatData({
						flatData: a,
						getKey: node => node.id, // resolve a node's key
						getParentKey: node => node.parent, // resolve a node's parent's key
						rootKey: null, // The value of the parent key when there is no parent (i.e., at root level)
					})});
					console.log(jsonData);
					that.setState({showinfo: true});
					that.setState({type_info_selected: "Theory"});
					that.setState({topic_selected: name});
				}
				else{
					that.setState({showinfo: false});
					
				}
			}
		};
		$.ajax(settings);
		
	};
	
	clickexercice = (name) => {
		var that = this;
		var settings = {
			type: 'POST',
			data: { 
				'name': name, 
			},
			url: 'php/load_topic_exercice.php',
			success: function(response) {
				if(response!="topichasnoexercice"){
					var jsonData = JSON.parse(response);
					var a = jsonData.map(node => ({ ...node, title: node.name }));
					that.setState({treeDataTopic: getTreeFromFlatData({
						flatData: a,
						getKey: node => node.id, // resolve a node's key
						getParentKey: node => node.parent, // resolve a node's parent's key
						rootKey: null, // The value of the parent key when there is no parent (i.e., at root level)
					})});
					console.log(jsonData);
					that.setState({showinfo: true});
					that.setState({type_info_selected: "Exercise"});
					that.setState({topic_selected: name});
				}
				else{
					that.setState({showinfo: false});
					
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
			treeDataTopic,
            searchStringTopic,
            searchFoundCountTopic,
        } = this.state;

		return (
			<div>
				<br/>
				<div className="left_30 down_20 orange size_30">
					<p>{this.appState("course_name")}</p>
				</div>
				<hr/>
				<Link to={"/user_courses"} className="blue" style={{marginLeft:20}}>{language[lng].courses}</Link>
				<Grid container>
				<Grid item xs={10}>
				</Grid>
					<Grid item xs={2} className="down_20"> 
						<Link to="/user_qualifications" className="blue"> {language[lng].qualifications}</Link>
					</Grid>
				</Grid>
				<Grid container>
					<Grid item xs={4}>
						<label htmlFor="find-box" className="left_15">
							<TextField
								id="find-box"
								type="text"
								value={searchString}
								onChange={event => this.setState({ searchString: event.target.value })}
								label={language[lng].search}
							/>
						</label>
						<div style={{ height: 1500}}>
						<SortableTree
							treeData={this.state.treeData}
							onChange={treeData => this.setState({ treeData })}
							canDrag={false}
							searchQuery={searchString}
							generateNodeProps={({ node, path }) => {
								return {
									style: {
										color: "black",
									},

								buttons: [
									node.hastheory ? <Button
										className="btn btn-4 white right_15"
										onClick={() => 	this.clicktheory(node.name)}
									>
										<Icon className="fa fa-book" style={{ fontSize: 15 }}></Icon>
									</Button>:null,
									node.hasexercice ? <Button
										className="btn btn-5 white right_15"
										onClick={() => 	this.clickexercice(node.name)}
									>
										<Icon className="fa fa-pencil" style={{ fontSize: 15 }}></Icon>
									</Button>:null,
									<Button
										className="btn btn-1 white"
										onClick={() => 	this.click(node.name)}
									>
										<Icon className="fa fa-sign-in" style={{ fontSize: 15 }}></Icon>
									</Button>,
								],
							};
						}}
								
						/>
						</div>
					</Grid>
					<Grid item xs={4}>
					{ this.state.showinfo ? 
						<Card className="topic_info_form margin2" style={{width:500}}>
							<CardContent className="orange size_30">
							{this.state.topic_selected} : {this.state.type_info_selected}
							<Button
								className="btn btn-5 white left_60"
								onClick={() =>this.setState({showinfo: false})}
							>
								<Icon className="fa fa-times" style={{ fontSize: 15 }}></Icon>
							</Button>
							<hr/>
							</CardContent>
							<SortableTree
								treeData={this.state.treeDataTopic}
								onChange={treeData => this.setState({ treeDataTopic })}
								canDrag={false}
								searchQuery={searchStringTopic}
								generateNodeProps={({ node, path }) => {
										return {
											style: {
												color: "black",
											},
										buttons: [
											<Button
												className="btn btn-1 white"
												onClick={() => 	this.click(node.name)}
											>
												<Icon className="fa fa-sign-in" style={{ fontSize: 15 }}></Icon>
											</Button>,
											this.state.type_info_selected == "Exercise" ?
											node.finished==1 ? 
												node.puntuation>5 ? 
													<div className="circle bg_green left_15 down_5"></div> 
												: 
													<div className="circle bg_red left_15 down_5"></div>
											:
												<div className="circle bg_yellow left_15 down_5"></div>:null,
										],
									};
								}}	
							/>
						</Card> : null 
					}
						
					</Grid>
					<Grid item xs={3}>
						<br/>
						<p>{language[lng].coursedescription}</p>
						<hr/>
						<div id="description_text" className="margin1 big_text">{this.state.course_description}</div>
						<hr/>
						<br/><br/>
						
						<p>{language[lng].prerequisits}</p>
						<hr/>
						<div className="margin1 big_text">{this.state.course_prerequisits}</div>
						<hr/>
						
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