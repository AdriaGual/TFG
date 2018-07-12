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
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
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
			showsnack: false,
			snacktext: "",
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
					that.setState({ showsnack: true ,snacktext: "Username updated correctly!"});
					that.appState({username: $("#newusername").val()});
				}
				else if (response =="empty_inputfields"){
					that.setState({ showsnack: true ,snacktext: "Empty input fields in Username!"});
				}
				else if (response =="fields_not_equal"){
					that.setState({ showsnack: true ,snacktext: "Fields not equal in Username!"});
				}
				
			}
		};
		$.ajax(settings);
	};
	
	handleClose = (event, reason) => {
		if (reason === 'clickaway') {
		  return;
		}
		this.setState({ showsnack: false });
	};
	
	clickphonenumber = () => {
		var that = this;
		var settings = {
			type: 'POST',
			data: { 
				'newphonenumber': $("#newphonenumber").val(), 
				'repeatnewphonenumber': $("#repeatnewphonenumber").val(), 
			},
			url: 'php/changephonenumber.php',
			success: function(response) {
				if (response == "OK"){
					that.setState({ showsnack: true ,snacktext: "Phone number updated correctly!"});
				}
				else if (response =="empty_inputfields"){
					that.setState({ showsnack: true ,snacktext: "Empty input fields in Phone Number!"});
				}
				else if (response =="fields_not_equal"){
					that.setState({ showsnack: true ,snacktext: "Fields not equal in Phone Number!"});
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
					that.setState({ showsnack: true ,snacktext: "E-mail updated correctly!"});
				}
				else if (response =="empty_inputfields"){
					that.setState({ showsnack: true ,snacktext: "Empty input fields in E-mail!"});
				}
				else if (response =="fields_not_equal"){
					that.setState({ showsnack: true ,snacktext: "Fields not equal in E-mail!"});
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
				if (response == "OK"){
					that.setState({ showsnack: true ,snacktext: "Password updated correctly!"});
				}
				else if (response =="empty_inputfields"){
					that.setState({ showsnack: true ,snacktext: "Empty input fields in Password!"});
				}
				else if (response =="fields_not_equal"){
					that.setState({ showsnack: true ,snacktext: "Fields not equal in Password!"});
				}
				else if (response="old_password_not_correct"){
					that.setState({ showsnack: true ,snacktext: "Old Password not correct!"});
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
					<Grid item xs={2}>
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
						<Card style={{width:300,height:300,marginTop:70}}>
							<p className="orange size_20" style={{marginLeft:60,marginTop:10}}>Change Phone Number</p>
							<hr/>
							<br/>
							<TextField
								id="newphonenumber"
								style={{width:220,marginLeft:40}}
								label="Enter your New Phone Number"
								onChange={(event, newValue) =>
									this.setState({
										newphonenumber: newValue
									})
								}
							/>
							<br/>
							<TextField
								id="repeatnewphonenumber"
								style={{width:240,marginLeft:30}}
								label="Repeat your New Phone Number"
								onChange={(event, newValue) =>
									this.setState({
										repeatnewphonenumber: newValue
									})
								}
							/>
							<br/>
							<Button onClick={() => this.clickphonenumber()} style={{marginLeft:65,marginTop:50}} className="btn btn-1 white"> Change Phone Number</Button>
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
						<Button onClick={() => this.clickpassword()} style={{marginLeft:68,marginTop:20}} className="btn btn-1 white"> Change Password</Button>
						</Card>
					</Grid>
					<Grid item xs={3}>
						<Card style={{width:300,height:300}}>
						<p className="orange size_20" style={{marginLeft:80,marginTop:10}}>Change E-mail</p>
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
						<Button onClick={() => this.clickemail()} style={{marginLeft:85,marginTop:50}} className="btn btn-1 white"> Change E-mail</Button>
						</Card>
					</Grid>
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
			</div>
		
		);
	}
}


UserCourses = withRouter(UserCourses);

export default UserCourses;