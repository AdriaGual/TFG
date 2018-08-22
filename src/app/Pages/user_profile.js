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
import language from "../Utils/language.js";
import * as STORAGE from '../Utils/Storage.js';
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
					that.setState({ showsnack: true ,snacktext: language[lng].usernameupdatedcorrectly});
					that.appState({username: $("#newusername").val()});
				}
				else if (response =="empty_inputfields"){
					that.setState({ showsnack: true ,snacktext: language[lng].emptyinputfieldsinusername});
				}
				else if (response =="fields_not_equal"){
					that.setState({ showsnack: true ,snacktext: language[lng].fieldsnotequalinusername});
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
					that.setState({ showsnack: true ,snacktext: language[lng].phonenumberupdatedcorrectly});
				}
				else if (response =="empty_inputfields"){
					that.setState({ showsnack: true ,snacktext: language[lng].emptyinputfieldsinphonenumber});
				}
				else if (response =="fields_not_equal"){
					that.setState({ showsnack: true ,snacktext: language[lng].fieldsnotequalinphonenumber});
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
					that.setState({ showsnack: true ,snacktext: language[lng].emailupdatedcorrectly});
				}
				else if (response =="empty_inputfields"){
					that.setState({ showsnack: true ,snacktext: language[lng].emptyinputfieldsinemail});
				}
				else if (response =="fields_not_equal"){
					that.setState({ showsnack: true ,snacktext: language[lng].fieldsnotequalinemail});
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
					that.setState({ showsnack: true ,snacktext: language[lng].passwordupdatedcorrectly});
				}
				else if (response =="empty_inputfields"){
					that.setState({ showsnack: true ,snacktext:language[lng].emptyinputfieldsinpassword });
				}
				else if (response =="fields_not_equal"){
					that.setState({ showsnack: true ,snacktext: language[lng].fieldsnotequalinpassword});
				}
				else if (response="old_password_not_correct"){
					that.setState({ showsnack: true ,snacktext:language[lng].oldpasswordnotcorrect});
				}
			}
		};
		$.ajax(settings);
	};
	
	
	/**
	 * Renders the register page.
	 */
	render(){
		lng = STORAGE.getLocalStorageItem("currentLanguage")|| this.appState("currentLanguage");
		const {
            searchString,
            searchFoundCount,
			course_description,
        } = this.state;

		return (
			<div>
				<br/>
				<div className="left_30 down_20 orange size_30"><p>{language[lng].profile}</p></div>
				<hr/>
				<br/>
				<Grid container>
					<Grid item xs={2}>
					</Grid>
					<Grid item xs={3}>
						<Card style={{width:300,height:300}}>
							<p className="orange size_20" style={{marginLeft:60,marginTop:10}}>{language[lng].changeusername}</p>
							<hr/>
							<br/>
							<TextField
								id="newusername"
								style={{width:200,marginLeft:50}}
								label={language[lng].enteryournewusername}
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
								label={language[lng].repeatyournewusername}
								onChange={(event, newValue) =>
									this.setState({
										repeatnewusername: newValue
									})
								}
							/>
							<br/>
							<Button onClick={() => this.clickusername()} style={{marginLeft:65,marginTop:50}} className="btn btn-1 white"> {language[lng].changeusername}</Button>
						</Card>
						<Card style={{width:300,height:300,marginTop:70}}>
							<p className="orange size_20" style={{marginLeft:60,marginTop:10}}>{language[lng].changephonenumber}</p>
							<hr/>
							<br/>
							<TextField
								id="newphonenumber"
								style={{width:220,marginLeft:40}}
								label={language[lng].enteryournewphonenumber}
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
								label={language[lng].repeatyournewphonenumber}
								onChange={(event, newValue) =>
									this.setState({
										repeatnewphonenumber: newValue
									})
								}
							/>
							<br/>
							<Button onClick={() => this.clickphonenumber()} style={{marginLeft:65,marginTop:50}} className="btn btn-1 white"> {language[lng].changephonenumber}</Button>
						</Card>
					</Grid>
					
					<Grid item xs={3}>
						<Card style={{width:300,height:300}}>
						<p className="orange size_20" style={{marginLeft:60,marginTop:10}}>{language[lng].changepassword}</p>
						<hr/>
						<TextField
							id="oldpass"
							type="password"
							style={{width:200,marginLeft:50}}
							label={language[lng].enteryouroldpassword}
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
							label={language[lng].enteryournewpassword}
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
							label={language[lng].repeatyournewpassword}
							onChange={(event, newValue) =>
								this.setState({
									repeatnewpass: newValue
								})
							}
						/>
						<br/>
						<Button onClick={() => this.clickpassword()} style={{marginLeft:68,marginTop:20}} className="btn btn-1 white">{language[lng].changepassword}</Button>
						</Card>
					</Grid>
					<Grid item xs={3}>
						<Card style={{width:300,height:300}}>
						<p className="orange size_20" style={{marginLeft:80,marginTop:10}}>{language[lng].changeemail}</p>
						<hr/>
						<br/>
						<TextField
							id="newemail"
							style={{width:200,marginLeft:50}}
							label={language[lng].enteryournewemail}
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
							label={language[lng].repeatyournewemail}
							onChange={(event, newValue) =>
								this.setState({
									repeatnewemail: newValue
								})
							}
						/>
						<br/>
						<Button onClick={() => this.clickemail()} style={{marginLeft:85,marginTop:50}} className="btn btn-1 white"> {language[lng].changeemail}</Button>
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