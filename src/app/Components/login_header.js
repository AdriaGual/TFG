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

/**
 * Header of the app.
 * @extends React.Component
 */
export default class LoginHeader extends React.Component {
	/**
	 * Creates the Header component of the app.
	 * @param {object} props - React.Component props
	 */
	constructor(props) {
		super(props);
		this.state = {};
	}

	appState = this.props.appState;
	
	click = () => {
		this.appState({logged: true});
		var settings = {
			async: true,
			type: 'GET',
			dataType: 'text',
			cache: false,
			url: './php/return.php',
			error: function(xml, error) {
				console.log(error);
			}
		};
		$.ajax(settings).done(function(response) {
			var a = JSON.parse(JSON.stringify(response));

			$("#accept").html(a);   
		});
	};

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
			<AppBar className="toolbarStyle ">
				<Toolbar>
					<Grid container spacing={24}>
						<Grid item xs={6}>
						</Grid>
						<Grid item xs={2}>
							<Grid container>
								<Grid item xs={12} className="centerVertical">
									<TextField
										id="username"
										label="Enter your Username"
										className="text_field"
										InputLabelProps={{
										 className: "white" 
										}}
										onChange={(event, newValue) =>
											this.setState({
												username: newValue
											})
										}
									/>
								</Grid>
								<Grid item>
									<p className="white size12 linkhover">
										<Icon className="fa fa-eye" style={{ fontSize: 15 }}></Icon>
										Enter as Guest
									</p>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={2}>
							<Grid container>
								<Grid item xs={12} className="centerVertical">
									<TextField
										id="password"
										label="Enter your Password"
										className="text_field"
										type="password"
										InputLabelProps={{
										 className: "white" 
										}}
										onChange={(event, newValue) =>
											this.setState({
												password: newValue
											})
										}
									/>
								</Grid>
								<Grid item>
									<p className="white size12 linkhover">
									<Icon className="fa fa-question" style={{ fontSize: 15 }}></Icon>
										Forgot Password?
									</p>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={2} className="centerVertical">
							<Link to="/user_courses"><Button onClick={() => this.click()} className="btn btn-1 white" id="accept"> {LoginText}</Button></Link>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
		);
	}
}
