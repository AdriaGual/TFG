/**
 * @file Header
 * @version 0.0.1
 * @module
 */

"use strict";

// React imports
import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from 'react-router';
// Material-UI imports
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import Icon from 'material-ui/Icon';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Dialog,{DialogActions,DialogContent,DialogContentText,DialogTitle} from 'material-ui/Dialog';
import language from "../Utils/language.js"
import * as STORAGE from '../Utils/Storage.js';

/**
 * Header of the app.
 * @extends React.Component
 */
 var lng;
 class LoginHeader extends React.Component {
	/**
	 * Creates the Header component of the app.
	 * @param {object} props - React.Component props
	 */
	constructor(props) {
		super(props);
		this.state = {
			showsnack: false,
			showforgotpassword: false,
			snacktext: "",
		};
	}

	appState = this.props.appState;
	
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
					that.appState({logged: true,is_teacher:true,username:$("#username").val()});
				}
				else if (response == "2"){
					that.props.history.push('/adm_params');
					that.appState({logged: true,username:$("#username").val()});
				}
				else if(response == "bad_login"){
					that.setState({ showsnack: true ,snacktext: language[lng].usernameorpasswordinvalid});
				}
				else if(response == "empty_inputfields"){
					that.setState({ showsnack: true ,snacktext: language[lng].emptyinputfieldsinlogin});
				}
			}
		};
		$.ajax(settings);
		
		var that=this;
		var settings = {
			type: 'POST',
			data: { 
				'is_teacher': that.appState("is_teacher"),
				'is_student': that.appState("is_student")
			},
			url: 'php/usertype_session.php',
			success: function(response) {
				if (response=="is_teacher"){

					that.appState({is_student:false});
				}
				else{
					that.appState({is_student:true});
				}
			}
		};
		$.ajax(settings);
		
		
	};
	
	click_forgot_pass = () => {
		var that = this;
		var settings = {
			type: 'POST',
			data: { 
				'email': $("#forgot_email").val(), 
			},
			url: 'php/forgot_password.php',
			success: function(response) {
				if (response == "OK"){
					
					that.appState({logged: true,username:$("#username").val()});
				}
				else if(response == "empty_inputfields"){
					that.setState({ showsnack: true ,snacktext: language[lng].emptyinputfieldsinpasswordrecovery});
				}
			}
		};
		$.ajax(settings);
	};
	
	handleCloseSnack = () => {
		this.setState({ showsnack: false });
	};
	handleClose = () => {
		this.setState({ showsnack: false });
	};
	handleCloseFPassword = () => {
		this.setState({ showforgotpassword: false });
	};
	
	handleClickOpenFPassword = () => {
		this.setState({
			showforgotpassword: true,
		});
	};

	/**
	 * Renders the Header app.
	 */
	render() {
		lng = STORAGE.getLocalStorageItem("currentLanguage")|| this.appState("currentLanguage");
		const toolbarStyle = {
			backgroundColor: "#022140",
			height: "80px"
		};

		return (
			<AppBar className="toolbarStyle ">
				<Toolbar>
					<Grid container spacing={24}>
						<Grid item xs={1}>
						</Grid>
						<Grid item xs={5}>
					
						</Grid>
						<Grid item xs={2}>
							<Grid container>
								<Grid item xs={12} className="centerVertical">
									<TextField
										id="username"
										label={language[lng].enterusername}
										className="text_field"
										InputLabelProps={{
										 className: "white" 
										}}
										InputProps={{
										 className: "white" 
										}}
										onChange={(event, newValue) =>
											this.setState({
												username: newValue
											})
										}
									/>
								</Grid>
								<Grid item className="down_15"> 
									<a className="white size12 linkhover">
										<Icon className="fa fa-eye" style={{ fontSize: 15 }}></Icon>
										{language[lng].enterasguest}
									</a>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={2}>
							<Grid container>
								<Grid item xs={12} className="centerVertical">
									<TextField
										id="password"
										label={language[lng].enterpassword}
										className="text_field"
										type="password"
										InputLabelProps={{
										 className: "white" 
										}}
										InputProps={{
										 className: "white" 
										}}
										onChange={(event, newValue) =>
											this.setState({
												password: newValue
											})
										}
									/>
								</Grid>
								<Grid item className="down_15">
									<a className="white size12 linkhover" onClick={this.handleClickOpenFPassword}>
									<Icon className="fa fa-question" style={{ fontSize: 15 }}></Icon>
										{language[lng].forgotpassword}
									</a>
								</Grid>
							</Grid>
								<Snackbar
									  anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'left',
									  }}
									  open={this.state.showsnack}
									  autoHideDuration={4000}
									  onClose={this.handleCloseSnack}
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
									open={this.state.showforgotpassword}
									onClose={this.handleCloseFPassword}
								>
								<DialogTitle className="down_15">{"Forgot Password?"}</DialogTitle>
								 <DialogContent>
									<DialogContentText>
									 If you have forgotten your password, just enter your e-mail adress and we will send you a token for you.
									</DialogContentText>
									<TextField
										autoFocus
										id="forgot_email"
										label={language[lng].enteremail}
										className="text_field "
										onChange={(event, newValue) =>
											this.setState({
												forgotemail: newValue
											})
										}
									/>
								  </DialogContent>
								
								<Button className="btn btn-1 white" onClick={() => this.click_forgot_pass()}>Submit</Button>
							</Dialog>
						</Grid>
						<Grid item xs={2} className="centerVertical">
							<Button onClick={() => this.click()} className="btn btn-1 white" id="accept"> {language[lng].login}</Button>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
		);
	}
}


LoginHeader = withRouter(LoginHeader);

export default LoginHeader;
