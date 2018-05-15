/**
 * @file Main page
 * @version 0.0.1
 * @module
 */

"use strict";

// React imports
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Register from './Pages/register.js';
import UserCourses from './Pages/user_courses.js';
import DownBar from './Components/down_bar.js';
// Pages imports


/**
 * Main page of the app
 * @extends React.Component
 */
export default class Main extends React.Component {
	/**
	 * Create the main page component.
	 * @param {object} props - React.Component props
	 */
	constructor(props){
		super(props);
		this.state = {};
	}
	
	appState = this.props.appState;

	/**
	 * Renders the main page with routes to every page.
	 */
	render(){		
		return (
		<main className="padding0"><Switch>
			<Route exact path='/' render={() => (<div><Register></Register><DownBar></DownBar></div>)} />
			<Route path='/user_courses' render={() => (<div><UserCourses></UserCourses></div>)} />
			<Redirect to='/' from='/test2 ' />
		</Switch></main>
		);
	}
}
