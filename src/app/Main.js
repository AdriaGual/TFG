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
import UserProfile from './Pages/user_profile.js';
import UserCourses from './Pages/user_courses.js';
import UserCourse from './Pages/user_course.js';
import UserTheory from './Pages/user_theory.js';
import UserTopic from './Pages/user_topic.js';
import UserExercise from './Pages/user_exercise.js';
import UserQualifications from './Pages/user_qualifications.js';
import TeacherCourses from './Pages/teacher_courses.js';
import TeacherEditCourse from './Pages/teacher_edit_course.js';
import TeacherChooseExercise from './Pages/teacher_choose_exercise.js';
import TeacherCreateTheory from './Pages/teacher_create_theory.js';
import TeacherEditExerciseLocation2d from './Pages/teacher_edit_exercise_location2d.js';
import TeacherEditExerciseTest2d from './Pages/teacher_edit_exercise_test2d.js';
import TeacherEditExerciseMPR from './Pages/teacher_edit_exercise_mpr.js';
import TeacherEditExerciseLocation3d from './Pages/teacher_edit_exercise_location3d.js';
import TeacherEditExerciseAnimation from './Pages/teacher_edit_exercise_animation.js';
import TeacherEditExerciseLabelling from './Pages/teacher_edit_exercise_labelling.js';
import TeacherEditExerciseSelection from './Pages/teacher_edit_exercise_selection.js';
import TeacherEnroll from './Pages/teacher_enroll.js';
import TeacherAssignExercise from './Pages/teacher_assign_exercise.js';
import TeacherQualifications from './Pages/teacher_qualifications.js';
import AdmParams from './Pages/adm_params.js';



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
			<Route exact path='/' render={() => (<div><div><Register appState={this.appState}></Register></div><div className="bot_margin"></div></div>)} />
			<Route path='/user_courses' render={() => (<div><div><UserCourses appState={this.appState}></UserCourses></div><div className="bot_margin"></div></div>)} />
			<Route path='/user_course' render={() => (<div><div><UserCourse appState={this.appState}></UserCourse></div><div className="bot_margin"></div></div>)} />
			<Route path='/user_profile' render={() => (<div><div><UserProfile appState={this.appState}></UserProfile></div><div className="bot_margin"></div></div>)} />
			<Route path='/user_theory' render={() => (<div><div><UserTheory appState={this.appState}></UserTheory></div><div className="bot_margin"></div></div>)} />
			<Route path='/user_topic' render={() => (<div><div><UserTopic appState={this.appState}></UserTopic></div><div className="bot_margin"></div></div>)} />
			<Route path='/user_exercise' render={() => (<div><div><UserExercise appState={this.appState}></UserExercise></div><div className="bot_margin"></div></div>)} />
			<Route path='/user_qualifications' render={() => (<div><div><UserQualifications appState={this.appState}></UserQualifications></div><div className="bot_margin"></div></div>)} />
			<Route path='/teacher_courses' render={() => (<div><div><TeacherCourses appState={this.appState}></TeacherCourses></div><div className="bot_margin"></div></div>)} />
			<Route path='/teacher_edit_course' render={() => (<div><div><TeacherEditCourse appState={this.appState}></TeacherEditCourse></div><div className="bot_margin"></div></div>)} />
			<Route path='/teacher_choose_exercise' render={() => (<div><div><TeacherChooseExercise appState={this.appState}></TeacherChooseExercise></div><div className="bot_margin"></div></div>)} />
			<Route path='/teacher_edit_exercise_location2d' render={() => (<div><div><TeacherEditExerciseLocation2d appState={this.appState}></TeacherEditExerciseLocation2d></div><div className="bot_margin"></div></div>)} />
			<Route path='/teacher_edit_exercise_test2d' render={() => (<div><div><TeacherEditExerciseTest2d appState={this.appState}></TeacherEditExerciseTest2d></div><div className="bot_margin"></div></div>)} />
			<Route path='/teacher_edit_exercise_mpr' render={() => (<div><div><TeacherEditExerciseMPR appState={this.appState}></TeacherEditExerciseMPR></div><div className="bot_margin"></div></div>)} />
			<Route path='/teacher_edit_exercise_location3d' render={() => (<div><div><TeacherEditExerciseLocation3d appState={this.appState}></TeacherEditExerciseLocation3d></div><div className="bot_margin"></div></div>)} />
			<Route path='/teacher_edit_exercise_animation' render={() => (<div><div><TeacherEditExerciseAnimation appState={this.appState}></TeacherEditExerciseAnimation></div><div className="bot_margin"></div></div>)} />
			<Route path='/teacher_edit_exercise_labelling' render={() => (<div><div><TeacherEditExerciseLabelling appState={this.appState}></TeacherEditExerciseLabelling></div><div className="bot_margin"></div></div>)} />
			<Route path='/teacher_edit_exercise_selection' render={() => (<div><div><TeacherEditExerciseSelection appState={this.appState}></TeacherEditExerciseSelection></div><div className="bot_margin"></div></div>)} />
			<Route path='/teacher_enroll' render={() => (<div><div><TeacherEnroll appState={this.appState}></TeacherEnroll></div><div className="bot_margin"></div></div>)} />
			<Route path='/teacher_assign_exercise' render={() => (<div><div><TeacherAssignExercise appState={this.appState}></TeacherAssignExercise></div><div className="bot_margin"></div></div>)} />
			<Route path='/teacher_qualifications' render={() => (<div><div><TeacherQualifications appState={this.appState}></TeacherQualifications></div><div className="bot_margin"></div></div>)} />
			<Route path='/teacher_create_theory' render={() => (<div><div><TeacherCreateTheory appState={this.appState}></TeacherCreateTheory></div><div className="bot_margin"></div></div>)} />
			<Route path='/adm_params' render={() => (<div><div><AdmParams appState={this.appState}></AdmParams></div><div className="bot_margin"></div></div>)} />
			<Redirect to='/' from='/test2 ' />
		</Switch></main>
		);
	}
}
