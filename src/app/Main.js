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
import UserCourse from './Pages/user_course.js';
import UserTheory from './Pages/user_theory.js';
import UserTopic from './Pages/user_topic.js';
import UserExercice from './Pages/user_exercice.js';
import UserQualifications from './Pages/user_qualifications.js';
import TeacherCourses from './Pages/teacher_courses.js';
import TeacherEditCourse from './Pages/teacher_edit_course.js';
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
			<Route exact path='/' render={() => (<div><Register appState={this.appState}></Register></div>)} />
			<Route path='/user_courses' render={() => (<div><UserCourses appState={this.appState}></UserCourses></div>)} />
			<Route path='/user_course' render={() => (<div><UserCourse appState={this.appState}></UserCourse></div>)} />
			<Route path='/user_theory' render={() => (<div><UserTheory appState={this.appState}></UserTheory></div>)} />
			<Route path='/user_topic' render={() => (<div><UserTopic appState={this.appState}></UserTopic></div>)} />
			<Route path='/user_exercice' render={() => (<div><UserExercice appState={this.appState}></UserExercice></div>)} />
			<Route path='/user_qualifications' render={() => (<div><UserQualifications appState={this.appState}></UserQualifications></div>)} />
			<Route path='/teacher_courses' render={() => (<div><TeacherCourses appState={this.appState}></TeacherCourses></div>)} />
			<Route path='/teacher_edit_course' render={() => (<div><TeacherEditCourse appState={this.appState}></TeacherEditCourse></div>)} />
			<Redirect to='/' from='/test2 ' />
		</Switch></main>
		);
	}
}
