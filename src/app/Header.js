/**
 * @file Header
 * @version 0.0.1
 * @module
 */

"use strict";

// React imports
import React from "react";
import { Link } from "react-router-dom";
// Material-UI imports
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import Icon from 'material-ui/Icon';
import LoginHeader from "./Components/login_header.js"

/**
 * Header of the app.
 * @extends React.Component
 */
export default class Header extends React.Component {
	/**
	 * Creates the Header component of the app.
	 * @param {object} props - React.Component props
	 */
	constructor(props) {
		super(props);
		this.state = {};
	}

	appState = this.props.appState;
	
	/**
	 * Renders the Header app.
	 */
	render() {
		var LoginText = "Login"
		const toolbarStyle = {
			backgroundColor: "#022140",
			height: "80px"
		};

		return (
			<div>
				if (this.appState("logged")){ <LoginHeader appState={this.appState} ></LoginHeader>}
				else{ <p>ggg</p>}
			</div>
		);
	}
}
