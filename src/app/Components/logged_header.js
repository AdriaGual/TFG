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
import language from "../Utils/language.js"
import * as STORAGE from '../Utils/Storage.js';
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
				else if (response=="is_student"){
					that.appState({is_student:true});
				}
				else if (response=="is_admin"){
					that.appState({is_admin:true});
					that.appState({is_student:false});
					that.appState({is_teacher:false});
				}
			}
		};
		$.ajax(settings);
	};
	
	handleAccount = () => {
		this.setState({ anchorEl: null });
	};
	
	handleClose = () => {
		this.setState({ anchorEl: null });
		this.appState({is_teacher: false});
		this.appState({is_student: false});
		this.appState({is_admin: false});
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
	
	componentDidMount(){
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
				else if (response=="is_student"){
					that.appState({is_student:true});
				}
				else if (response=="is_admin"){
					that.appState({is_admin:true});
					that.appState({is_student:false});
					that.appState({is_teacher:false});
				}
			}
		};
		$.ajax(settings);
	}
	/**
	 * Renders the Header app.
	 */
	render() {
		var lng = STORAGE.getLocalStorageItem("currentLanguage")|| this.appState("currentLanguage");
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
										<Link to="/user_profile"><MenuItem onClick={this.handleAccount}>{language[lng].profile}</MenuItem></Link>
										{this.appState("is_student")?
											<Link to="/user_courses"><MenuItem onClick={this.handleCourses}>{language[lng].courses}</MenuItem></Link>
										:this.appState("is_teacher")?
											<Link to="/teacher_courses"><MenuItem onClick={this.handleCourses}>{language[lng].courses}</MenuItem></Link>
										:
											<Link to="/adm_params"><MenuItem onClick={this.handleCourses}>{language[lng].courses}</MenuItem></Link>
										}
										<Link to="/"><MenuItem onClick={this.handleClose}>{language[lng].logout}</MenuItem></Link>
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
