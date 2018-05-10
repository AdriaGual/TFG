"use strict";

// React imports
import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

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
			<div style={{textAlign: 'center'}}>
				<Link to="/auth">Login now!</Link>
			</div>
		);
	}
}

Register = withRouter(Register);

export default Register;