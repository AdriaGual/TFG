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
				<div className="left_30 down_20 orange size_30"><p>Profile</p></div>
				<hr/>
				<Grid container>
					<Grid item xs={1}>
					</Grid>
					<Grid item xs={3}>
						
					</Grid>
					<Grid item xs={4}>
						<div id="formulari"></div>
						<br/>
						<input type="file" id="input" />
						<br/><br/>
						<Button
							className="btn btn-3 white  left_15 "
							onClick={() => this.click()}
						>
							Create Users
						</Button>
					</Grid>
					<Grid item xs={4}>
						
					</Grid>
				</Grid>
				
			</div>
		
		);
	}
}


UserCourses = withRouter(UserCourses);

export default UserCourses;