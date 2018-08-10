"use strict";

// React imports
import React from 'react';
import { withRouter } from 'react-router';
import { Redirect, Link } from 'react-router-dom';

// Material-UI imports
import Grid from "material-ui/Grid";
import Select from 'material-ui/Select';
import Button from 'material-ui/Button';
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
		this.state = { };
	}
	
	state = {
		lang: 0,
	};

	
	appState = this.props.appState;
	
	handleEnglish = () => {
		this.appState({currentLanguage:0});
	};
	
	handleCatala = () => {
		this.appState({currentLanguage:1});
	};
	
	handleLanguage = name => event => {
		this.appState({currentLanguage:event.target.value});
	};
	
	/**
	 * Renders the page.
	 */
	render(){
		return (
			<div className="bg_white">
				<Grid container className="bottom padding0 bg_white" style={{height:90}}>
					<hr className="margin0"/>
					<Grid item xs={1}>
					</Grid>
					<Grid item xs={2}>
						
					</Grid>
					<Grid item xs={1}>
					</Grid>
					<Grid item xs={6}>
					</Grid>
					<Grid item xs={1} className="down_15">
						  <Select native  
						  onChange={this.handleLanguage('value')}
						  value={this.state.lang}
						  > 
							<option value={0}>English</option>
							<option value={1}>Català</option>
							<option value={2}>Castellano</option>
						  </Select>
					</Grid>
				</Grid>
			</div>
		)

	}
}