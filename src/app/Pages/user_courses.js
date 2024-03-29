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
			url: 'php/load_courses.php',
			success: function(response) {
				var jsonData = JSON.parse(response);
				var a = jsonData.map(node => ({ ...node, title: node.name }));
				that.setState({treeData: getTreeFromFlatData({
					flatData: a,
					getKey: node => node.id, 
					getParentKey: node => node.parent, 
					rootKey: null, 
				})});
			}
		};
		$.ajax(settings);
	}
	
	click = (name,idsql) => {
		var that = this;
		this.appState({id_course: idsql});
		
		var settings2 = {
			type: 'POST',
			async:false,
			data: { 
				'idsql': idsql, 
			},
			url: 'php/save_courseid.php',
			success: function(response) {

			}
		};
		$.ajax(settings2);
		
		var settings = {
			type: 'POST',
			data: { 
				'name': name, 
			},
			async:false,
			url: 'php/is_course_topic.php',
			success: function(response) {
				if (response == "course"){
					that.appState({course_name: name});
					that.props.history.push('/user_course');
				}
				if(response == "topic"){
					that.appState({topic_name: name});
					that.props.history.push('/user_topic');
				}
				if(response == "theory"){
					that.appState({theory_name:name});
					that.props.history.push('/user_theory');
				}
				if(response == "exercice"){
					that.appState({exercice_name:name});
					var settings = {
						type: 'POST',
						data: { 
							'name': that.appState("exercice_name"), 
						},
						async:false,
						url: 'php/load_exercice.php',
						success: function(response) {
							var jsonData = JSON.parse(response);
							that.appState({type_component: jsonData.type_component});
							if (that.appState("type_component")<5){
								that.props.history.push('/user_exercise_edubody');
							}
							else{
								that.props.history.push('/user_exercise_test');
							}
						}
					};
					$.ajax(settings);
					
				}
			}
		};
		$.ajax(settings);
	};
	
	clicktopic = (name) => {
		var that = this;
		var settings = {
			type: 'POST',
			data: { 
				'name': name, 
			},
			async:false,
			url: 'php/is_course_topic.php',
			success: function(response) {
				if (response == "course"){
					that.appState({course_name: name});
					that.props.history.push('/user_course');
				}
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
				<div className="left_30 down_20 orange size_30"><p>{language[lng].currentcourses}</p></div>
				<hr/>
				<Grid container>
					<Grid item xs={4}  className="margin3"> 
						<label htmlFor="find-box">
							<TextField
								id="find-box"
								type="text"
								value={searchString}
								onChange={event => this.setState({ searchString: event.target.value })}
								label={language[lng].search}
							/>
						</label>

						<div>
						<SortableTree
							style = {{height: 700}}
							treeData={this.state.treeData}
							onChange={treeData => this.setState({ treeData })}
							canDrag={false}
							searchQuery={searchString}
							generateNodeProps={({ node, path }) => {
									return {
										style: {
											color: node.iscourse ? "black" : node.istopic ? "blue" : node.istheory ? "green":"red",
										},

									buttons: [
										node.hastheory ? node.iscourse ? null:  <Button
											className="btn btn-4 white right_15"
											onClick={() => 	this.clicktheory(node.name)}
										>
											<Icon className="fa fa-book" style={{ fontSize: 15 }}></Icon>
										</Button>:null,
										node.hasexercice ?node.iscourse ? null:  <Button
											className="btn btn-5 white right_15"
											onClick={() => 	this.clickexercice(node.name)}
										>
											<Icon className="fa fa-pencil" style={{ fontSize: 15 }}></Icon>
										</Button>:null,
										node.iscourse ?
										<Button
											className="btn btn-1 white"
											onClick={() => 	this.click(node.name,node.idsql)}
										>
											<Icon className="fa fa-sign-in" style={{ fontSize: 15 }}></Icon>
										</Button>:null,
									],
								};
							}}
								
						/>
						
						</div>
					</Grid>
					<Grid item xs={4}>
					{ this.state.showinfo ? <Card className="topic_info_form margin2">
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
								style = {{height: 500}}
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
												onClick={() => 	this.clicktopic(node.name)}
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
				</Grid>
				
			</div>
		
		);
	}
}


UserCourses = withRouter(UserCourses);

export default UserCourses;