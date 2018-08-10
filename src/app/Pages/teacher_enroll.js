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
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
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
			showsnack: false,
			snacktext: "",
			showinfo:false,
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
				$("#formulari").empty();
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
							that.setState({ showsnack: true ,snacktext: "Enrolled users!"});
							that.props.history.push("/teacher_courses");
						}
					}
				};
				$.ajax(settings);
			   
			  }, (error) => {
			  	console.error(error)
		});
	};
	
	clickshowexcel = () => {
		
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
					url: 'php/show_users_from_session.php',
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
	
	clickenroll = () => {
		var formData = $('#formulari').serialize();

		var that = this;
		var settings = {
			type: 'POST',
			data: formData,
			url: 'php/enroll_add_users.php',
			success: function(response) {
				if(response=="OK"){
					var then = that;

					var settings = {
						type: 'POST',
						data: { 
							'idcurs': then.appState("id_course")
						},
						url: 'php/enroll.php',
						success: function(response) {
							var jsonData = JSON.parse(response);
							$("#formulari").empty();
							for (var a=0; a<jsonData.length; a++){
								$("#formulari").append("<label><input type='checkbox' name='student[]' value='"+jsonData[a].id+"' />"+jsonData[a].username+" ("+jsonData[a].email+")"+"</label><br/>");
							}
						}
					};
					$.ajax(settings);
					that.setState({ showsnack: true ,snacktext: "Enrolled users!"});
				}
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
				<div className="left_30 down_20 orange size_30"><p>Enroll</p></div>
				<hr/>
				<Link to={"/teacher_courses"} className="blue" style={{marginLeft:20}}>Courses</Link>
				<Grid container>
					<Grid item xs={1}>
					</Grid>
					<Grid item xs={3}>
						<Card style={{width:400}}>
							<br/>
							<p className="orange size_20" style={{marginLeft:130}}>Enroll Students</p>
							<hr/>
							<br/>
							<button onClick={() => this.clicktoggle()} className="btn btn-1 check_selall  white" style={{border:"none",marginLeft:24}}><Icon className="fa fa-address-book" style={{ fontSize: 15,marginLeft:-1,marginTop:2 }}></Icon></button>Select all<br/>
							<form id="formulari"></form>
							<br/>
							<br/>
							<Button onClick={() => this.clickenroll()} style={{width:250,marginLeft:70,marginBottom:10}} className="btn btn-4 white"> Enroll Selected Students</Button>
						</Card>
					</Grid>
					<Grid item xs={3}>
						<Card style={{width:400}}>
							<br/>
							<p className="orange size_20" style={{marginLeft:95}}>Load Users From Excel</p>
							<hr/>
							<br/>
							<a href="./public/Plantilla.xlsx" style={{color:"#0645AD",marginLeft:20}}>Download Template</a>
							
							<br/><br/>
							
							<p style={{marginLeft:20}} className="size_15 ">Load xlsx file</p> 
							<input style={{marginLeft:20}}type="file" id="input" onChange={(event)=> { this.clickshowexcel() }} />
							<br/>
							<br/>
						</Card>
						
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
				</Grid>
				<Snackbar
				  anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				  }}
				  open={this.state.showsnack}
				  autoHideDuration={4000}
				  onClose={this.handleClose}
				  message={<span id="message-id">{this.state.snacktext}</span>}
				  action={[
					<IconButton
					  key="close"
					  aria-label="Close"
					  color="inherit"
					  onClick={this.handleClose}
					>
					<CloseIcon />
					</IconButton>,
				  ]}
				/>
			</div>
		
		);
	}
}


UserCourses = withRouter(UserCourses);

export default UserCourses;