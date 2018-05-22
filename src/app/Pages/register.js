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
		};
	}
	state = {
	};
	appState = this.props.appState;
	
	/**
	 * Renders the register page.
	 */
	render(){
		var lng = this.appState("currentLanguage");
		return (
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
									id="newusername"
									label="Enter your Username"
									className="text_field "
									onChange={(event, newValue) =>
										this.setState({
											newusername: newValue
										})
									}
								/>
								<TextField
									id="newemail"
									label="Enter your E-mail"
									className="text_field "
									onChange={(event, newValue) =>
										this.setState({
											newemail: newValue
										})
									}
								/>
								<TextField
									id="newpassword"
									label="Enter your Password"
									className="text_field"
									type="password"
									onChange={(event, newValue) =>
										this.setState({
											newpassword: newValue
										})
									}
								/>
								<TextField
									id="newrepeatpassword"
									label="Repeat your Password"
									className="text_field"
									type="password"
									onChange={(event, newValue) =>
										this.setState({
											newrepeatpassword: newValue
										})
									}
								/>
							</Grid>
							<Grid item>
								<Link to="/register"><Button className="btn btn-1 down_30 white ">Register Now</Button></Link>
							</Grid>
						</Card>
					</Grid>
				</Grid>
				<Grid item xs={3}  className="margin2">
					<h1  className="register_title white ">E-Learning Platform</h1>
					<hr/>
					<p  className="register_text white">
						This is a platform made with the purpouse of
						teaching topics as Radiology, CPR and anatomy
						among others. GILAB, is a research group of the
						University of Girona (with code GRCT0081) and
						all researchers of the GIlab are from the
						Computer Science, Applied Mathematics and
						Statistics Department at the same university.
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