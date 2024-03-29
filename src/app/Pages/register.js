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
import language from "../Utils/language.js"
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import * as STORAGE from '../Utils/Storage.js';
import DoneIcon from 'material-ui-icons/Done';
/** 
 * Register Page
 * @extends React.Component
 */
class Register extends React.Component {
	/**
	 * Creates the Authentication page.
	 * @param {object} props - React.Component props
	 */
	constructor(props){
		super(props);
		this.state = {
			showsnack: false,
			showsnackcookie: true,
			snacktext: "",
		};
	}
	state = {
	};
	appState = this.props.appState;
	
	click = () => {
		var that = this;
		var settings = {
			type: 'POST',
			data: { 
				'register_username': $("#register_username").val(), 
				'register_password': $("#register_password").val(), 
				'register_repeatpassword': $("#register_repeatpassword").val(), 
				'register_email': $("#register_email").val(), 
			},
			url: 'php/register.php',
			success: function(response) {
				if(response == "empty_inputfields"){
					that.setState({ showsnack: true ,snacktext: "Empty input fields in register!"});
				}
				else if(response == "user_already_exists"){
					that.setState({ showsnack: true ,snacktext: "User already exists!"});
				}
				else if(response == "password_not_equal"){
					that.setState({ showsnack: true ,snacktext: "Password not equal!"});
				}
				else if(response == "email_already_exists"){
					that.setState({ showsnack: true ,snacktext: "E-mail already exists!"});
				}
				else if(response == "OK"){
					that.setState({ showsnack: true ,snacktext: "Thank you for registering with our website!"});
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
	
	handleClosecookie = (event, reason) => {
		this.setState({ showsnackcookie: false });
	};
	
	
	/**
	 * Renders the register page.
	 */
	render(){
		var lng = STORAGE.getLocalStorageItem("currentLanguage")|| this.appState("currentLanguage");
		return (
		<div>
			<div>
			<Particles
				className="particles"
				params={{
					particles: {
						number: {value: 160,density: {enable: true,value_area: 1000}},
						color: {value: "#ffffff"},
						shape: {type: "circle",stroke: {width: 0,color: "#000000"},
						polygon: {nb_sides: 5}},
						opacity: {
							value: 1,
							random: true,
							anim: {enable: true,speed: 1,opacity_min: 0,sync: false}},
						size: {value: 3,random: true,anim: {enable: false,speed: 4,size_min: 0.3,sync: false}},
						line_linked: {
							enable: false,
							distance: 150,
							color: "#ffffff",
							opacity: 0.4,
							width: 1
						},
						move: {enable: true,speed: 1,direction: "none",random: true,straight: false,out_mode: "out",bounce: false,attract: {enable: false,rotateX: 600,rotateY: 600}}
					}
				}}
			/>
			</div>
			<Grid container>
				<Grid item xs={3}>
				</Grid>
				<Grid item xs={3}>
					<Grid container>	
						<Card className="register_form ">
							<CardContent>
							{language[lng].register}
							</CardContent>
							<Grid container className="left_30pc">	
								<TextField
									id="register_username"
									label={language[lng].enterusername}
									className="text_field "
									onChange={(event, newValue) =>
										this.setState({
											newusername: newValue
										})
									}
								/>
								<TextField
									id="register_email"
									label={language[lng].enteremail}
									className="text_field "
									onChange={(event, newValue) =>
										this.setState({
											newemail: newValue
										})
									}
								/>
								<TextField
									id="register_password"
									label={language[lng].enterpassword}
									className="text_field"
									type="password"
									onChange={(event, newValue) =>
										this.setState({
											newpassword: newValue
										})
									}
								/>
								<TextField
									id="register_repeatpassword"
									label={language[lng].enterrepeatpassword}
									className="text_field"
									type="password"
									onChange={(event, newValue) =>
										this.setState({
											newrepeatpassword: newValue
										})
									}
								/>
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
								<Snackbar
								  anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'center',
								  }}
								  open={this.state.showsnackcookie}
								  
								  message={<span id="message-id">{language[lng].cookies}</span>}
								  action={[
									<IconButton
									  key="close"
									  aria-label="Close"
									  color="inherit"
									  onClick={this.handleClosecookie}
									  style={{width:100}}
									>
									<DoneIcon /> <p className="size15" >{language[lng].continue}</p>
									</IconButton>,
								  ]}
								/>
							</Grid>
							<Grid item>
								<Button onClick={() => this.click()} className="btn btn-1 down_30 white " id="accept">{language[lng].registernow}</Button>
							</Grid>
						</Card>
					</Grid>
				</Grid>
				<Grid item xs={3}  className="margin2">
					<h1  className="register_title white ">{language[lng].elearningplatform}</h1>
					<hr/>
					<p  className="register_text white">
						{language[lng].registerintro}
					</p>
				</Grid>
				<Grid item xs={3}>
				</Grid>
			</Grid>
		</div>
		);
	}
}

Register = withRouter(Register);

export default Register;