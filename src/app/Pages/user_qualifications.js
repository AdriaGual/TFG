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
import Icon from 'material-ui/Icon';
import SortableTree from 'react-sortable-tree';
import Table,{TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import {BarChart} from 'react-easy-chart';

/** 
 * Register Page
 * @extends React.Component
 */
class UserQualifications extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		}
	}
	appState = this.props.appState;


	
	
	/**
	 * Renders the register page.
	 */
	render(){
		const {
            treedades,
            searchString,
            searchFoundCount,
        } = this.state;

		return (
			<div>
				<div className="left_30 down_20 orange size_30"><p>Course 1</p></div>
				<hr/>
				
				
			</div>
		
		);
	}
}


UserQualifications = withRouter(UserQualifications);

export default UserQualifications;