"use strict";

// React imports
import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Particles from "react-particles-js";

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
				
		</div>
		);
	}
}

Register = withRouter(Register);

export default Register;