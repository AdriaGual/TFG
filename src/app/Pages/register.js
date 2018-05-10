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
		this.state = {};
	}
	
	appState = this.props.appState;
	
	/**
	 * Renders the register page.
	 */
	render(){
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
			<Grid container spacing={24}  >
				<Grid item xs={2}>
				</Grid>
				<Grid item xs={4} className="margin2">
					<Grid container>	
						<Card className="register_form">
							<CardContent>
								Register
							</CardContent>
							<Grid container className="left_30 ">	
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
									label="Repear your Password"
									className="text_field"
									type="password"
									onChange={(event, newValue) =>
										this.setState({
											newrepeatpassword: newValue
										})
									}
								/>
							</Grid>
							<Button className="btn btn-1">Login</Button>
						</Card>
					</Grid>
				</Grid>
				<Grid item xs={4}>
					
				</Grid>
				<Grid item xs={2}>
					
				</Grid>
			</Grid>
		</div>
		);
	}
}

Register = withRouter(Register);

export default Register;