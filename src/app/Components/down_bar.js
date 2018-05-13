"use strict";

// React imports
import React from 'react';
import { withRouter } from 'react-router';
import { Redirect, Link } from 'react-router-dom';

// Material-UI imports
import Grid from "material-ui/Grid";
import Select from 'material-ui/Select';
// Components imports
// Utils imports


/** 
 * Authenticaton Page
 * @extends React.Component
 */
export default class Authentication extends React.Component {
	/**
	 * Creates the Authentication page.
	 * @param {object} props - React.Component props
	 */
	constructor(props){
		super(props);
		this.state = { redirect: false, };
	}
	
	appState = this.props.appState;
	
	/**
	 * Renders the page.
	 */
	render(){
		return (
			<div>
				<Grid container className="down_19">
					<Grid item xs={1}>
					</Grid>
					<Grid item xs={2}>
						<img src="./img/udg_logo.png" />
					</Grid>
					<Grid item xs={1}>
					</Grid>
					<Grid item xs={6}>
					</Grid>
					<Grid item xs={1} className="down_20">
						  <Select
							native
							value={this.state.age}
						  >
							<option value={"English"}>English</option>
							<option value={"Catala"}>Català</option>
							<option value={"Castellano"}>Castellano</option>
						  </Select>
					</Grid>
				</Grid>
			</div>
		)

	}
}