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
				<br/>
				<div className="left_30 down_20 orange size_30"><p>Assign Exercises</p></div>
				<hr/>
				<Link to={"/teacher_courses"} className="blue" style={{marginLeft:20}}>Courses</Link>
				<Grid container>
					<Grid item xs={1}>
					</Grid>
					<Grid item xs={4}>
						<Card style={{width:400}}>
							<br/>
							<p className="orange size_20" style={{marginLeft:130}}>Enroll Students</p>
							<hr/>
							<br/>
							<button onClick={() => this.clicktoggle()} className="btn btn-1 check_selall  white" style={{border:"none",marginLeft:50}}><Icon className="fa fa-address-book" style={{ fontSize: 15,marginLeft:-1,marginTop:2 }}></Icon></button>Select all<br/>
							<form id="formulari"></form>
							<br/>
							<br/>
							<Button onClick={() => this.clickenroll()} style={{width:250,marginLeft:70,marginBottom:10}} className="btn btn-4 white"> Enroll Selected Students</Button>
						</Card>
					</Grid>
					<Grid item xs={4}>
						<Card style={{width:400}}>
							<br/>
							<p className="orange size_20" style={{marginLeft:95}}>Load Users From Excel</p>
							<hr/>
							<br/>
							<a href="./public/Plantilla.xlsx" style={{color:"#0645AD",marginLeft:20}}>Download Template</a>
							
							<br/><br/>
							
							<p style={{marginLeft:20}} className="size_15 ">Load xlsx file</p> 
							<input style={{marginLeft:20}}type="file" id="input" />
							
							
							<br/>
							<br/>
							<Button onClick={() => this.clickenrollexcel()} className="btn btn-4 white" style={{width:250,marginLeft:75,marginBottom:10}}> Enroll Excel Students</Button>
						</Card>
					</Grid>
				</Grid>
				
			</div>
		
		);
	}
}


UserCourses = withRouter(UserCourses);

export default UserCourses;