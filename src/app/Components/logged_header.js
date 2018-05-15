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
	
	handleClick = event => {
	this.setState({ anchorEl: event.currentTarget });
	};

	handleClose = () => {
	this.setState({ anchorEl: null });
	};

	appState = this.props.appState;
	
	click = () => {
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
		const { anchorEl } = this.state;
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
								</Grid>
								
							</Grid>
						</Grid>
						<Grid item xs={2}>
							<Grid container>
								<Grid item xs={12} className="centerVertical">
								<Button
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          Open Menu
        </Button>
									<Menu
									  id="simple-menu"
									  anchorEl={anchorEl}
									  open={Boolean(anchorEl)}
									  onClose={this.handleClose}
									>
									  <MenuItem onClick={this.handleClose}>Profile</MenuItem>
									  <MenuItem onClick={this.handleClose}>My account</MenuItem>
									  <MenuItem onClick={this.handleClose}>Logout</MenuItem>
									</Menu>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={2} className="centerVertical">
							<Button onClick={() => this.click()} className="btn btn-1 white" id="accept"> {LoginText}</Button>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
		);
	}
}
