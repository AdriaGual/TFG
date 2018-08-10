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
			type: 'GET',
			url: 'php/load_only_courses.php',
			success: function(response) {
				var jsonData = JSON.parse(response);
				for (var a=0; a<jsonData.length; a++){
					$("#formulari").append("<input type='radio' name='curs' value='"+jsonData[a].id+"' />"+jsonData[a].name+"<br/>");
				}
			}
		};
		$.ajax(settings);
	}
	
	click = () => {
		var curs = $("input[name=curs]:checked").val();
		var input = document.getElementById('input')
		var jsonexcel = "";
		readXlsxFile(input.files[0], { dateFormat: 'MM/DD/YY' }).then(function(data) {
			   // `data` is an array of rows
			   // each row being an array of cells.
			   jsonexcel = JSON.stringify(data, null, 2);
			   
			   var settings = {
					type: 'POST',
					data: { 
						'curs': curs,
						'jsonexcel': jsonexcel
					},
					url: 'php/create_users.php',
					success: function(response) {
						
					}
				};
				$.ajax(settings);
			   
			  }, (error) => {
			  	console.error(error)
		});		
	}

	clickshowexcel = () => {
		
		var input = document.getElementById('input')
		var that = this;
		var jsonexcel = "";
		var curs = $("input[name=curs]:checked").val();
		readXlsxFile(input.files[0], { dateFormat: 'MM/DD/YY' }).then(function(data) {
			   // `data` is an array of rows
			   // each row being an array of cells.
			   jsonexcel = JSON.stringify(data, null, 2);
			   
			   var settings = {
					type: 'POST',
					data: { 
						'idcurs': curs,
						'jsonexcel': jsonexcel
					},
					url: 'php/show_users_from_admin.php',
					success: function(response) {
						that.setState({showinfo: true});
						var jsonData = JSON.parse(response);
						$("#formulari2").empty();
						$("#formulari2").append("<table style='width:100%'><tr><th style='width:(100/5)%'>Username</th><th style='width:(100/5)%'>Name</th> <th style='width:(100/5)%'>Surname</th><th style='width:(100/5)%'>Email</th><th style='width:(100/5)%'>New Student?</th></tr>");
						for (var a=0; a<jsonData.length; a++){
							$("#formulari2 tr:last").after("<tr><td style='width:(100/5)%'>"+jsonData[a].username+"</td><td style='width:(100/5)%'>"+jsonData[a].name+"</td> <td style='width:(100/5)%'>"+jsonData[a].surname+"</td> <td style='width:(100/5)%'>"+jsonData[a].email+"</td> <td style='width:(100/5)%'>"+jsonData[a].isnew+"</td> </tr>");
						}
						$("#formulari2 tr:last").after("</table>");
						
					}
				};
				$.ajax(settings);
			   
			  }, (error) => {
			  	console.error(error)
		});
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
				<div className="left_30 down_20 orange size_30"><p>Admin</p></div>
				<hr/>
				<Grid container>
					<Grid item xs={1}>
					</Grid>
					<Grid item xs={3}>
						<br/>
						<p className="orange size_20" style={{marginLeft:95}}>Load Users From Excel</p>
						<hr/>
						<br/>
						<div id="formulari"></div>
						<br/>
						<a href="./public/Plantilla.xlsx" style={{color:"#0645AD",marginLeft:20}}>Download Template</a>
						
						<br/><br/>
						
						<p style={{marginLeft:20}} className="size_15 ">Load xlsx file</p> 
						<input style={{marginLeft:20}}type="file" id="input" onChange={(event)=> { this.clickshowexcel() }} />
						<br/><br/>
						
					</Grid>
					<Grid item xs={2}>
						
					</Grid>
					<Grid item xs={4}>
						{ this.state.showinfo ? 
							<Card style={{width:700}}>
								<br/>
								<p className="orange size_20" style={{marginLeft:300}}>Students</p>
								<hr/>
								<br/>
								<form id="formulari2"></form>
								<br/>
								<br/>
								<Button onClick={() => this.clickenrollexcel()} className="btn btn-4 white" style={{width:250,marginLeft:230,marginBottom:10}}> Enroll Excel Students</Button>		
							</Card>				
							: null
						}
					</Grid>
					<Grid item xs={2}>
						
					</Grid>
				</Grid>
				
			</div>
		
		);
	}
}


UserCourses = withRouter(UserCourses);

export default UserCourses;