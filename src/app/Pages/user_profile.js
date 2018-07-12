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
	
	clickusername = () => {
		var that = this;
		var settings = {
			type: 'POST',
			data: { 
				'username': $("#newusername").val(), 
				'repeatedusername': $("#repeatnewusername").val(), 
			},
			url: 'php/changeusername.php',
			success: function(response) {
				if (response == "OK"){
					that.appState({username: $("#newusername").val()});
				}
				
			}
		};
		$.ajax(settings);
	};
	
	clickemail = () => {
		var that = this;
		var settings = {
			type: 'POST',
			data: { 
				'email': $("#newemail").val(), 
				'repeatemail': $("#repeatnewemail").val(), 
			},
			url: 'php/changeemail.php',
			success: function(response) {
				if (response == "OK"){
				}
				
			}
		};
		$.ajax(settings);
	};
	
	clickpassword = () => {
		var that = this;
		var settings = {
			type: 'POST',
			data: { 
				'oldpass': $("#oldpass").val(), 
				'newpass': $("#newpass").val(), 
				'repeatnewpass': $("#repeatnewpass").val(), 
			},
			url: 'php/changepassword.php',
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
				<br/>
				<div className="left_30 down_20 orange size_30"><p>Profile</p></div>
				<hr/>
				<br/>
				<Grid container>
					<Grid item xs={1}>
					</Grid>
					<Grid item xs={3}>
						<Card style={{width:300,height:300}}>
						<p className="orange size_20" style={{marginLeft:60,marginTop:10}}>Change Username</p>
						<hr/>
						<br/>
						<TextField
							id="newusername"
							style={{width:200,marginLeft:50}}
							label="Enter your New Username"
							onChange={(event, newValue) =>
								this.setState({
									newusername: newValue
								})
							}
						/>
						<br/>
						<TextField
							id="repeatnewusername"
							style={{width:200,marginLeft:50}}
							label="Repeat your New Username"
							onChange={(event, newValue) =>
								this.setState({
									repeatnewusername: newValue
								})
							}
						/>
						<br/>
						<Button onClick={() => this.clickusername()} style={{marginLeft:65,marginTop:50}} className="btn btn-1 white"> Change Username</Button>
						</Card>
					</Grid>
					
					<Grid item xs={3}>
						<Card style={{width:300,height:300}}>
						<p className="orange size_20" style={{marginLeft:60,marginTop:10}}>Change Password</p>
						<hr/>
						<TextField
							id="oldpass"
							type="password"
							style={{width:200,marginLeft:50}}
							label="Enter your Old Password"
							onChange={(event, newValue) =>
								this.setState({
									oldpass: newValue
								})
							}
						/>
						<br/>
						<TextField
							id="newpass"
							type="password"
							style={{width:200,marginLeft:50}}
							label="Enter your New Password"
							onChange={(event, newValue) =>
								this.setState({
									newpass: newValue
								})
							}
						/>
						<br/>
						<TextField
							id="repeatnewpass"
							type="password"
							style={{width:200,marginLeft:50}}
							label="Repeat your New Password"
							onChange={(event, newValue) =>
								this.setState({
									repeatnewpass: newValue
								})
							}
						/>
						<br/>
						<Button onClick={() => this.clickpassword()} style={{marginLeft:65,marginTop:20}} className="btn btn-1 white"> Change Password</Button>
						</Card>
					</Grid>
					<Grid item xs={3}>
						<Card style={{width:300,height:300}}>
						<p className="orange size_20" style={{marginLeft:60,marginTop:10}}>Change E-mail</p>
						<hr/>
						<br/>
						<TextField
							id="newemail"
							style={{width:200,marginLeft:50}}
							label="Enter your New E-mail"
							onChange={(event, newValue) =>
								this.setState({
									newemail: newValue
								})
							}
						/>
						<br/>
						<TextField
							id="repeatnewemail"
							style={{width:200,marginLeft:50}}
							label="Repeat your New E-mail"
							onChange={(event, newValue) =>
								this.setState({
									repeatnewemail: newValue
								})
							}
						/>
						<br/>
						<Button onClick={() => this.clickemail()} style={{marginLeft:65,marginTop:50}} className="btn btn-1 white"> Change E-mail</Button>
						</Card>
					</Grid>
				</Grid>
				
			</div>
		
		);
	}
}


UserCourses = withRouter(UserCourses);

export default UserCourses;