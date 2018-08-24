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
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import language from "../Utils/language.js"
import * as STORAGE from '../Utils/Storage.js';
import Dialog,{DialogActions,DialogContent,DialogContentText,DialogTitle} from 'material-ui/Dialog';

/** 
 * Register Page
 * @extends React.Component
 */
 
var initialData = [];
var initialDataTopic = [];
var lng;
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
			showinfo:false,
			showadvice:false,
			showcreatetopic:false,
			type:"",
		};
	}
	appState = this.props.appState;

	componentDidMount() {
		var that = this;
	}
	
	createcourse = () => {
		this.props.history.push('/admin_edit_course');
	};
	
	enroll = () => {
		this.props.history.push('/admin_enroll');
	}
	
	createtopic = () => {
		this.setState({showcreatetopic: true});
		this.setState({showinfo: true});
	};
	
	createtheory = () => {
		this.props.history.push('/admin_create_theory');
	};
	
	createexercise = () => {
		this.props.history.push('/admin_choose_exercise');
	}
	
	deletecourse = () => {
		var that = this;
		var settings = {
			type: 'GET',
			url: 'php/load_all_courses.php',
			success: function(response) {
				if(response!="nocourses"){
					var jsonData = JSON.parse(response);
					var a = jsonData.map(node => ({ ...node, title: node.name }));
					that.setState({treeData: getTreeFromFlatData({
						flatData: a,
						getKey: node => node.id, // resolve a node's key
						getParentKey: node => node.parent, // resolve a node's parent's key
						rootKey: null, // The value of the parent key when there is no parent (i.e., at root level)
					})});
					console.log(jsonData);
					that.setState({showinfo: true});
					that.setState({type: language[lng].courses});
				}
				else{
					that.setState({showinfo: false});
				}
			}
		};
		$.ajax(settings);
	};
	
	deletetopic = () => {
		var that = this;
		var settings = {
			type: 'GET',
			url: 'php/load_all_topics.php',
			success: function(response) {
				if(response!="notopics"){
					var jsonData = JSON.parse(response);
					var a = jsonData.map(node => ({ ...node, title: node.name }));
					that.setState({treeData: getTreeFromFlatData({
						flatData: a,
						getKey: node => node.id, // resolve a node's key
						getParentKey: node => node.parent, // resolve a node's parent's key
						rootKey: null, // The value of the parent key when there is no parent (i.e., at root level)
					})});
					console.log(jsonData);
					that.setState({showinfo: true});
					that.setState({type: language[lng].topics});
				}
				else{
					that.setState({showinfo: false});
				}
			}
		};
		$.ajax(settings);
	};
	
	deleteexercise = () => {
		var that = this;
		var settings = {
			type: 'GET',
			url: 'php/load_all_exercises.php',
			success: function(response) {
				if(response!="noexercises"){
					var jsonData = JSON.parse(response);
					var a = jsonData.map(node => ({ ...node, title: node.name }));
					that.setState({treeData: getTreeFromFlatData({
						flatData: a,
						getKey: node => node.id, // resolve a node's key
						getParentKey: node => node.parent, // resolve a node's parent's key
						rootKey: null, // The value of the parent key when there is no parent (i.e., at root level)
					})});
					console.log(jsonData);
					that.setState({showinfo: true});
					that.setState({type: language[lng].exercises});
				}
				else{
					that.setState({showinfo: false});
				}
			}
		};
		$.ajax(settings);
	};
	
	deletetheory = () => {
		var that = this;
		var settings = {
			type: 'GET',
			url: 'php/load_all_theory.php',
			success: function(response) {
				if(response!="noexercises"){
					var jsonData = JSON.parse(response);
					var a = jsonData.map(node => ({ ...node, title: node.name }));
					that.setState({treeData: getTreeFromFlatData({
						flatData: a,
						getKey: node => node.id, // resolve a node's key
						getParentKey: node => node.parent, // resolve a node's parent's key
						rootKey: null, // The value of the parent key when there is no parent (i.e., at root level)
					})});
					console.log(jsonData);
					that.setState({showinfo: true});
					that.setState({type: language[lng].theory});
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
	
	clickdeletecourse = (name) => {
		var that = this;
		var settings2 = {
			type: 'POST',
			data: { 
				'name': name, 
			},
			async:false,
			url: 'php/delete_course.php',
			success: function(response) {
			}
		};
		$.ajax(settings2);
		window.location.reload();
	}
	
	clickdeletetopic = (name) => {
		var that = this;
		var settings2 = {
			type: 'POST',
			data: { 
				'name': name, 
			},
			async:false,
			url: 'php/delete_topic.php',
			success: function(response) {
			}
		};
		$.ajax(settings2);
		window.location.reload();
	}
	
	clickdeleteexercise = (name) => {
		var that = this;
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
		window.location.reload();
	}
	
	clickdeletetheory = (name) => {
		var that = this;
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
		window.location.reload();
	}
	
	clickcreatetopic= (name) => {
		var that = this;
		var settings2 = {
			type: 'POST',
			data: { 
				'name': name, 
			},
			async:false,
			url: 'php/add_topic.php',
			success: function(response) {
			}
		};
		$.ajax(settings2);
		window.location.reload();
	}
	

	/**
	 * Renders the register page.
	 */
	render(){
		lng = STORAGE.getLocalStorageItem("currentLanguage")|| this.appState("currentLanguage");
		const {
			treeData,
            searchString,
            searchFoundCount,
			course_description,
        } = this.state;

		
		return (
			<div>
				<br/>
				<div className="left_30 down_20 orange size_30"><p>{language[lng].admin}</p></div>
				<hr/>
				<Grid container>
					<Grid item xs={1}>
					</Grid>
					
					<Grid item xs={3}>
						<br/>
						<Button
							className="btn btn-1 white right_15"
							onClick={() => 	this.createcourse()}
						>
							{language[lng].createcourse}
						</Button>
						<br/><br/>
						<Button
							className="btn btn-1 white right_15"
							onClick={() => 	this.createtopic()}
						>
							{language[lng].createtopic}
						</Button>
						<br/><br/>
						<Button
							className="btn btn-1 white right_15"
							onClick={() => 	this.createexercise()}
						>
							{language[lng].createnewexercise}
						</Button>
						<br/><br/>
						<Button
							className="btn btn-1 white right_15"
							onClick={() => 	this.createtheory()}
						>
							{language[lng].createnewtheory}
						</Button>
						<br/><br/>
						<Button
							className="btn btn-4 white right_15"
							onClick={() => 	this.enroll()}
						>
							{language[lng].enroll}
						</Button>
						<br/><br/>
						<Button
							className="btn btn-5 white right_15"
							onClick={() => 	this.deletecourse()}
						>
							{language[lng].deletecourse}
						</Button>
						
						<br/><br/>
						<Button
							className="btn btn-5 white right_15"
							onClick={() => 	this.deletetopic()}
						>
							{language[lng].deletetopic}
						</Button>
						
						<br/><br/>
						<Button
							className="btn btn-5 white right_15"
							onClick={() => 	this.deleteexercise()}
						>
							{language[lng].deleteexercise}
						</Button>
						
						<br/><br/>
						<Button
							className="btn btn-5 white right_15"
							onClick={() => 	this.deletetheory()}
						>
							{language[lng].deletetheory}
						</Button>
						
						
					</Grid>
					
					<Grid item xs={2}>
					</Grid>
					
					<Grid item xs={4}>
						{ this.state.showinfo ? 
						
							<Card className="topic_info_form margin2">
								<CardContent className="orange size_30">
								
								{this.state.showcreatetopic ? language[lng].createtopic : language[lng].deletee+" "+this.state.type} 
								<Button
									className="btn btn-5 white left_60"
									onClick={() =>this.setState({showinfo: false})}
								>
									<Icon className="fa fa-times" style={{ fontSize: 15 }}></Icon>
									
								</Button>
								<hr/>
								</CardContent>
								{this.state.showcreatetopic ? 
									<div>
										<TextField
											id="newtitle"
											label={language[lng].entertopicname}
											className="text_field "
											style = {{width: 300}}
											onChange={(event, newValue) =>
												this.setState({
													newtitle: newValue
												})
											}
										/>
										<br/><br/><br/><br/>
										<Button
											className="btn btn-1 white"
											onClick={() => 	this.clickcreatetopic($("#newtitle").val())}
										>
											<Icon className="fa fa-save" style={{ fontSize: 15 }}></Icon>
										</Button>
									</div>
								
								:
								 <SortableTree
									style = {{height: 500}}
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
												<Button
													className="btn btn-5 white right_15"
													onClick={() => 	this.clickshowadvice(node.name)}
												>
													<Icon className="fa fa-trash" style={{ fontSize: 15 }}></Icon>
												</Button>,
											],
										};
									}}	
								/>}
							</Card>
						: 
						null 
					}
					</Grid>
					
					<Snackbar
						  anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						  }}
						  open={this.state.showsnack}
						  autoHideDuration={4000}
						  onClose={this.handleClose}
						  message={<span id="message-id">{this.state.snacktext}</span>}
						  action={[
							<IconButton
							  key="close"
							  aria-label="Close"
							  color="inherit"
							  onClick={this.handleClose}
							>
							<CloseIcon />
							</IconButton>,
						  ]}
						/>
						<Dialog
						open={this.state.showadvice}
						onClose={this.handleCloseAdvice}
						>
							<DialogTitle className="down_15">{language[lng].wannadelete+" "+this.state.name +" item?"}</DialogTitle>
								{this.state.type == language[lng].courses ?
									<Button className="btn btn-1 white" onClick={() => this.clickdeletecourse(this.state.name)}>{language[lng].deletee}</Button>
								:this.state.type == language[lng].topics ?
									<Button className="btn btn-1 white" onClick={() => this.clickdeletetopic(this.state.name)}>{language[lng].deletee}</Button>
								: this.state.type == language[lng].exercises ?
									<Button className="btn btn-1 white" onClick={() => this.clickdeleteexercise(this.state.name)}>{language[lng].deletee}</Button>
								: this.state.type == language[lng].theory ?
									<Button className="btn btn-1 white" onClick={() => this.clickdeletetheory(this.state.name)}>{language[lng].deletee}</Button>
								: null
								}
							
						</Dialog>	
					<Grid item xs={2}>
					</Grid>
				</Grid>
				
			</div>
		
		);
	}
}


UserCourses = withRouter(UserCourses);

export default UserCourses;