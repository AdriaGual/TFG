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
import SortableTree, { addNodeUnderParent, removeNodeAtPath,changeNodeAtPath,getFlatDataFromTree,
  getTreeFromFlatData, } from 'react-sortable-tree';
import * as STORAGE from '../Utils/Storage.js';
import Dialog,{DialogActions,DialogContent,DialogContentText,DialogTitle} from 'material-ui/Dialog';

/** 
 * Register Page
 * @extends React.Component
 */
var initialData = [];
var initialDataTopic = [];
class TeacherCourses extends React.Component {
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
			name:"",
			showadvice:false,
		};
	}
	appState = this.props.appState;
	
	componentDidMount() {
		var that = this;

		var settings = {
			type: 'GET',
			url: 'php/load_courses_teacher.php',
			success: function(response) {
				var jsonData = JSON.parse(response);
				console.log(jsonData);
				var a = jsonData.map(node => ({ ...node, title: node.name }));
				that.setState({treeData: getTreeFromFlatData({
					flatData: a,
					getKey: node => node.id, // resolve a node's key
					getParentKey: node => node.parent, // resolve a node's parent's key
					rootKey: null, // The value of the parent key when there is no parent (i.e., at root level)
				})});
			}
		};
		$.ajax(settings);
	}
	
	treeChange = (treeData,flatData) => {
		this.setState({ treeData });
		{flatData.map(({ id, name, parent }) => (
            console.log({id,name,parent})
          ))}
	}
	
	clickenroll = (idsql) => {
		this.appState({id_course: idsql});
		this.props.history.push('/teacher_enroll');
	};
	
	clickassignexercise = (idsql) => {
		this.appState({id_course: idsql});
		this.props.history.push('/teacher_assign_exercise');
	};
	
	clickqualifications = (name,idsql) => {
		this.appState({course_name: name});
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
		this.appState({id_course: idsql});
		this.props.history.push('/teacher_qualifications');
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
						url: 'php/load_exercice_teacher.php',
						success: function(response) {
							var jsonData = JSON.parse(response);
							a= jsonData.type_component;
							
						}
					};
					$.ajax(settings2);
					
					if (a<5){
						that.props.history.push('/teacher_exercise_edubody_preview');
					}
					else if (a==5){
						that.props.history.push('/teacher_exercise_test_preview');
					}
					else if (a==6){
						that.props.history.push('/teacher_exercise_location2d_preview');
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
			url: 'php/load_topic_exercice_teacher.php',
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
					that.setState({type_info_selected: "Exercice"});
					that.setState({topic_selected: name});
				}
				else{
					that.setState({showinfo: false});
					
				}
			}
		};
		$.ajax(settings);
	};
	
	clickshowadvice = (name) =>{
		this.setState({ name: name });
		this.setState({ showadvice: true});
	}
	
	handleCloseAdvice = () => {
		this.setState({ showadvice: false});
	}
	
	clickdeletetopic = (name) =>{
		var that = this;
		var settings = {
			type: 'POST',
			data: { 
				'name': name, 
			},
			async:false,
			url: 'php/is_course_topic.php',
			success: function(response) {
				if(response == "theory"){
					var settings2 = {
						type: 'POST',
						data: { 
							'name': name, 
						},
						async:false,
						url: 'php/delete_theory.php',
						success: function(response) {
						}
					};
					$.ajax(settings2);
				}
				if(response == "exercice"){
					var settings2 = {
						type: 'POST',
						data: { 
							'name': name, 
						},
						async:false,
						url: 'php/delete_exercise.php',
						success: function(response) {
						}
					};
					$.ajax(settings2);
				}
			}
		};
		$.ajax(settings);
		window.location.reload();
	}
	

	
	/**
	 * Renders the register page.
	 */
	render(){
		const getNodeKey = ({ treeIndex }) => treeIndex;
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
		
		const flatData = getFlatDataFromTree({
		treeData: this.state.treeData,
		getNodeKey: ({ node }) => node.id, // This ensures your "id" properties are exported in the path
		ignoreCollapsed: false, // Makes sure you traverse every node in the tree, not just the visible ones
		}).map(({ node, path }) => ({
		id: node.id,
		name: node.name,

		// The last entry in the path is this node's key
		// The second to last entry (accessed here) is the parent node's key
		parent: path.length > 1 ? path[path.length - 2] : null,
		}));

		return (
			<div>
				<br/>
				<div className="left_30 down_20 orange size_30"><p>Current Courses</p></div>
				<hr/>
				<Grid container>
					<Grid item xs={3}  className="margin3"> 
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
					<Grid item xs={5}> 
						<Link to="/teacher_edit_course"><Button className="btn btn-2 down_30 white">Create New Course</Button></Link>
						<Link to="/teacher_choose_exercise"><Button className="btn btn-5 down_30 white left_15">Create New Exercice</Button></Link>
						<Link to="/teacher_create_theory"><Button className="btn btn-1 down_30 white left_15">Create New Theory</Button></Link>
					</Grid>
				</Grid>
				<Grid container>
					<Grid item xs={6}>
						<div>
						<SortableTree
						  treeData={this.state.treeData}
						  style = {{height: 600}}
						  onChange={treeData => 	this.treeChange(treeData,flatData)}
						  searchQuery={searchString}
						  generateNodeProps={({ node, path }) => {
									return {
										style: {
											color: node.iscourse ? "black" : node.istopic ? "blue" : node.istheory ? "green":"red",
										},

									buttons: [
										node.iscourse ? <Button
											className="btn btn-4 white right_15"
											onClick={() => 	this.clickenroll(node.idsql)}
										>
											<Icon className="fa fa-graduation-cap" style={{ fontSize: 15 }}></Icon>
										</Button>:null,
										node.iscourse?<Button
											className="btn btn-5 white right_15"
											onClick={() => 	this.clickassignexercise(node.idsql)}
										>
											<Icon className="fa fa-calendar" style={{ fontSize: 15 }}></Icon>
										</Button>
										:null,
										node.iscourse?<Button
											className="btn btn-1 white right_15"
											onClick={() => 	this.clickqualifications(node.name,node.idsql)}
										>
											<Icon className="fa fa-list-ol" style={{ fontSize: 15 }}></Icon>
										</Button>:null,
										node.hastheory ? node.iscourse ? null:  <Button
											className="btn btn-4 white right_15"
											onClick={() => 	this.clicktheory(node.name)}
										>
											<Icon className="fa fa-book" style={{ fontSize: 15 }}></Icon>
										</Button>:null,
										node.hasexercice ? node.iscourse ? null:  <Button
											className="btn btn-5 white right_15"
											onClick={() => 	this.clickexercice(node.name)}
										>
											<Icon className="fa fa-pencil" style={{ fontSize: 15 }}></Icon>
										</Button>:null,
									],
								};
							}}
						/>
						</div>
					</Grid>
					<Grid item xs={6}>
					{ this.state.showinfo ? 
						
						<Card className="topic_info_form margin2">
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
												className="btn btn-4 white right_15"
												onClick={() => 	this.clickedittopic(node.name)}
											>
												<Icon className="fa fa-edit" style={{ fontSize: 15 }}></Icon>
											</Button>,
											<Button
												className="btn btn-5 white right_15"
												onClick={() => 	this.clickshowadvice(node.name)}
											>
												<Icon className="fa fa-trash" style={{ fontSize: 15 }}></Icon>
											</Button>,
											<Button
												className="btn btn-1 white right_15"
												onClick={() => 	this.clicktopic(node.name)}
											>
												<Icon className="fa fa-sign-in" style={{ fontSize: 15 }}></Icon>
											</Button>,
										],
									};
								}}	
							/>
						</Card>

				: null 
					}
						
					</Grid>
				<Dialog
					open={this.state.showadvice}
					onClose={this.handleCloseAdvice}
				>
				<DialogTitle className="down_15">{"Wanna delete '"+this.state.name +"' item?"}</DialogTitle>
				<Button className="btn btn-1 white" onClick={() => this.clickdeletetopic(this.state.name)}>Submit</Button>
			</Dialog>	
				</Grid>

			</div>
		
		);
	}
}


TeacherCourses = withRouter(TeacherCourses);

export default TeacherCourses;