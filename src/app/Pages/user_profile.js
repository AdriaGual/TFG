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
  var initialDataTopic = [];
class UserCourses extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			searchString: '',
			searchFocusIndex: 0,
			searchFoundCount: null,
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
	
	click = () => {
		var that = this;
		var settings = {
			type: 'POST',
			data: { 
				'username': $("#username").val(), 
				'password': $("#password").val(), 
			},
			url: 'php/login.php',
			success: function(response) {
				if (response == "0"){
					that.props.history.push('/user_courses');
					that.appState({logged: true,is_student:true,username:$("#username").val()});
				}
				else if (response == "1"){
					that.props.history.push('/teacher_courses');
					that.appState({logged: true,username:$("#username").val()});
				}
				else if (response == "2"){
					that.props.history.push('/adm_params');
					that.appState({logged: true,username:$("#username").val()});
				}
				else if(response == "bad_login"){
					that.setState({ showsnack: true ,snacktext: "Username or Password invalid!"});
				}
				else if(response == "empty_inputfields"){
					that.setState({ showsnack: true ,snacktext: "Empty input fields in login!"});
				}
			}
		};
		$.ajax(settings);
	};
	
	/**
	 * Renders the register page.
	 */
	render(){
		const {
            searchString,
            searchFoundCount,
			course_description,
        } = this.state;

		return (
			<div>
				<div className="left_30 down_20 orange size_30"><p>Profile</p></div>
				<hr/>
				<Grid container>
					
					<Grid item xs={4}>
						<a>Change Password</a>
						<hr/>
						<TextField
							id="oldpass"
							label="Enter your Old Password"
							className="text_field"
							onChange={(event, newValue) =>
								this.setState({
									oldpass: newValue
								})
							}
						/>
						<br/>
						<TextField
							id="newpass"
							label="Enter your New Password"
							className="text_field"
							onChange={(event, newValue) =>
								this.setState({
									newpass: newValue
								})
							}
						/>
						<br/>
						<TextField
							id="repeatnewpass"
							label="Repeat your New Password"
							className="text_field"
							onChange={(event, newValue) =>
								this.setState({
									repenewpass: newValue
								})
							}
						/>
						<br/>
						<Button onClick={() => this.click()} className="btn btn-1 white"> Change Password</Button>
						
					</Grid>
				</Grid>
				
			</div>
		
		);
	}
}


UserCourses = withRouter(UserCourses);

export default UserCourses;