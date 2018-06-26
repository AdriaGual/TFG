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
import Menu,{MenuItem} from 'material-ui/Menu';

/**
 * Header of the app.
 * @extends React.Component
 */
export default class LoggedHeader extends React.Component {
	/**
	 * Creates the Header component of the app.
	 * @param {object} props - React.Component props
	 */
	state = {
		anchorEl: null,
	};
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	
	appState = this.props.appState;
	
	handleClick = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleCourses = () => {
		this.setState({ anchorEl: null });
	};
	
	handleAccount = () => {
		this.setState({ anchorEl: null });
	};
	
	handleClose = () => {
		this.setState({ anchorEl: null });
		this.appState({logged: false});
		//PHP destroy
		$.ajax({
			type: 'GET',
			url: 'php/logout.php'
		});
	};
	
	handleCloseMenu = () => {
		this.setState({ anchorEl: null });
	};
	

	/**
	 * Renders the Header app.
	 */
	render() {
		var LoginText = "Login"
		const { anchorEl } = this.state;
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
						<Grid item xs={4}>
						</Grid>
						<Grid item xs={2}>
							<Grid container>
								<Grid item xs={12} className="down_30">
									<a
									  aria-owns={anchorEl ? 'simple-menu' : null}
									  aria-haspopup="true"
									  className="white down_20"
									  
									  onClick={this.handleClick}
									>
									<Icon className="fa fa-user" style={{ fontSize: 15 }}></Icon>
									  {this.appState("username")}
									<Icon className="fa fa-chevron-down" style={{ fontSize: 15 }}></Icon>
									</a>
									<Menu
									  id="simple-menu"
									  anchorEl={anchorEl}
									  open={Boolean(anchorEl)}
									  onClose={this.handleCloseMenu}
									>
									  <MenuItem onClick={this.handleAccount}>Profile</MenuItem>
									  <Link to="/user_courses"><MenuItem onClick={this.handleCourses}>Courses</MenuItem></Link>
									  <Link to="/"><MenuItem onClick={this.handleClose}>Logout</MenuItem></Link>
									</Menu>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
		);
	}
}
