"use strict";

// React imports
import React from 'react';
import { withRouter } from 'react-router';
import { Link, Redirect } from 'react-router-dom';
import Particles from "react-particles-js";
import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Icon from 'material-ui/Icon';
import SortableTree, {
  getFlatDataFromTree,
  getTreeFromFlatData,
} from 'react-sortable-tree';
/** 
 * Register Page
 * @extends React.Component
 */
 
 var initialData = [];
  var initialDataTopic = [];
class UserCourses extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			searchString: '',
			searchFocusIndex: 0,
			searchFoundCount: null,
		};
	}
	appState = this.props.appState;

	componentDidMount() {
		var that = this;

		var settings = {
			type: 'POST',
			data: { 
				'idcurs': that.appState("id_course")
			},
			url: 'php/enroll.php',
			success: function(response) {
				var jsonData = JSON.parse(response);
				for (var a=0; a<jsonData.length; a++){
					$("#formulari").append("<label><input type='checkbox' name='student[]' value='"+jsonData[a].id+"' />"+jsonData[a].username+" ("+jsonData[a].email+")"+"</label><br/>");
				}
			}
		};
		$.ajax(settings);
	}
	
	clicktoggle= ()=>{
		var checkBoxes = $("input[type=checkbox]");
        checkBoxes.prop("checked", !checkBoxes.prop("checked"));		
	}
	
	clickenrollexcel = () => {
		
		var input = document.getElementById('input')
		var that = this;
		var jsonexcel = "";
		readXlsxFile(input.files[0], { dateFormat: 'MM/DD/YY' }).then(function(data) {
			   // `data` is an array of rows
			   // each row being an array of cells.
			   jsonexcel = JSON.stringify(data, null, 2);
			   
			   var settings = {
					type: 'POST',
					data: { 
						'jsonexcel': jsonexcel
					},
					url: 'php/create_users_from_session.php',
					success: function(response) {
						if (response=="OK"){
							that.props.history.push("/teacher_courses");
						}
					}
				};
				$.ajax(settings);
			   
			  }, (error) => {
			  	console.error(error)
		});
	};
	
	clickenroll = () => {
		
		var formData = $('#formulari').serialize();

		var that = this;
		var settings = {
			type: 'POST',
			data: formData,
			url: 'php/enroll_add_users.php',
			success: function(response) {
				
			}
		};
		$.ajax(settings);
	};
	
	/**
	 * Renders the register page.
	 */
	render(){
		const {
            searchString,
            searchFoundCount,
			course_description,
        } = this.state;

		return (
			<div>
				<div className="left_30 down_20 orange size_30"><p>Enroll</p></div>
				<hr/>
				<Grid container>
					
					<Grid item xs={4}>
						<Button onClick={() => this.clicktoggle()} className="btn btn-4 white">Select All</Button><br/>
						<form id="formulari"></form>
						<br/>
						<br/>
						<Button onClick={() => this.clickenroll()} className="btn btn-4 white"> Enroll Selected Students</Button>
						
					</Grid>
					<Grid item xs={4}>
						<input type="file" id="input" />
						<a href="./public/Plantilla.xlsx">Plantilla</a>
						
						<br/>
						<br/>
						<Button onClick={() => this.clickenrollexcel()} className="btn btn-4 white"> Enroll Excel Students</Button>
						
					</Grid>
				</Grid>
				
			</div>
		
		);
	}
}


UserCourses = withRouter(UserCourses);

export default UserCourses;