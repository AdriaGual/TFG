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
		//1. Load Topics and Problems
		var settings = {
			type: 'POST',
			data: { 
				'idcurs': that.appState("id_course")
			},
			url: 'php/load_assign_exercises.php',
			success: function(response) {
				var jsonData = JSON.parse(response);
				
				var name=jsonData[0].name;
				$("#formulariexercises").append("<p>"+jsonData[0].name+"</p>");
				for (var a=0; a<jsonData.length; a++){
					if (name != jsonData[a].name){
						$("#formulariexercises").append("<br/>");
						$("#formulariexercises").append("<p>"+jsonData[a].name+"</p>");
						name=jsonData[a].name;
					}
					
					$("#formulariexercises").append("<p class='size15'><input type='checkbox' id='"+a+"' name='exercise[]' value='"+jsonData[a].id+"' />"+jsonData[a].statement+"<select style='width:100px;margin-left:83px'><option></option><option value='no_penalty'>No Penalty</option><option value='partial_penalty'>Partial Penalty</option><option value='full_penalty'>Full Penalty</option></select><input style='margin-left:50px;width:50px' type='number'/><input style='margin-left:46px;width:50px' type='number'/><input style='margin-left:46px;width:50px' type='number'/><input style='margin-left:45px;width:140px' type='date'/><input style='margin-left:5px;width:140px' type='date'/></p>");
				}
				
				//2. Load students and add topics
				var settings2 = {
					type: 'POST',
					data: { 
						'idcurs': that.appState("id_course")
					},
					url: 'php/load_assign_exercises_students.php',
					success: function(response) {
						var jsonData2 = JSON.parse(response);
						
						for (var b=0; b<jsonData2.length; b++){
							$("#formulari").append("<hr/><label><input type='checkbox' class='"+b+"' name='students[]' value='"+jsonData2[b].id+"' />"+jsonData2[b].name+" "+jsonData2[b].surname+"</label><br/><br/>");
							//Now, its showtime!
							
							name=jsonData[0].name;
							$("#formulari").append("<p>"+jsonData[0].name+"</p>");
							for (var a=0; a<jsonData.length; a++){
								if (name != jsonData[a].name){
									$("#formulari").append("<br/>");
									$("#formulari").append("<p>"+jsonData[a].name+"</p>");
									name=jsonData[a].name;
								}
					
								$("#formulari").append("<p class='size15'><input type='checkbox' class='"+b+"' id='"+a+"' name='info[]' value='"+jsonData2[b].id+"#"+jsonData[a].id+"' />"+jsonData[a].statement+"</p>");
							}
							$("#formulari").append("<br/>");
						}
						
						//3. Do magic stuff
						 $('#formulariexercises input[type=checkbox]').change(function() {
							 var idproblema = $(this).prop("id");
							 								 
							//We are going to mark
							if ($(this).prop("checked")) $(this).prop("checked",true);
							else $(this).prop("checked",false);
										
							$("#formulari > label input[type=checkbox]:checked").each(function() {
								var laclase = $(this).prop("class");
								
								//Now, mark or unmark
								var selected = $("#"+idproblema+"."+laclase);
								selected.prop("checked", !selected.prop("checked"));
							});

						 });
				}
		};
		$.ajax(settings2);
		
			}
		};
		$.ajax(settings);
		
	}
	
	clicktoggle= ()=>{
		var checkBoxes = $("#formulariexercises input[type=checkbox]");
        checkBoxes.prop("checked", !checkBoxes.prop("checked"));

		//Also, update students!
		if (checkBoxes.prop("checked")){
			$("#formulari > label input[type=checkbox]:checked").each(function() {
				var laclase = $(this).prop("class");
				var selected = $("input[name='info[]']."+laclase);
				selected.prop("checked",true);
			});
		}
		else{
			$("#formulari > label input[type=checkbox]:checked").each(function() {
				var laclase = $(this).prop("class");
				var selected = $("input[name='info[]']."+laclase);
				selected.prop("checked",false);
			});
		}
	}
	clicktoggle2= ()=>{
		var checkBoxes = $("#formulari > label input[type=checkbox]"); //only students!
        checkBoxes.prop("checked", !checkBoxes.prop("checked"));		
	}

	
	clickaddexercise = () => {
		
		var formData = $('#formulari').serialize();

		var that = this;
		var settings = {
			type: 'POST',
			data: formData,
			url: 'php/add_exercises.php',
			success: function(response) {
				if(response=="OK"){
					that.props.history.push("/teacher_courses");
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
				<div className="left_30 down_20 orange size_30"><p>Assign Exercises</p></div>
				<hr/>
				<Link to={"/teacher_courses"} className="blue" style={{marginLeft:20}}>Courses</Link>
				<Grid container>
					<Grid item xs={1}>
					</Grid>
					<Grid item xs={3}>
						<Card style={{width:400}}>
							<br/>
							<p className="orange size_20" style={{marginLeft:160}}>Students</p>
							<hr/>
							<br/>
							<button onClick={() => this.clicktoggle2()} className="btn btn-1 check_selall  white" style={{border:"none",marginLeft:26}}><Icon className="fa fa-address-book" style={{ fontSize: 15,marginLeft:-1,marginTop:2 }}></Icon></button> All / None<br/>
							<form id="formulari"></form>
							<br/>
							<br/>
						</Card>
						<br/>
						<Button onClick={() => this.clickaddexercise()} className="btn btn-4 white" style={{width:250,marginLeft:75,marginBottom:10}}> Add Exercices</Button>
					</Grid>
					<Grid item xs={5}>
						<Card style={{width:1200}}>
							<br/>
							<p className="orange size_20" style={{marginLeft:550}}>Exercises</p>
							<hr/>
							<br/>
							<Grid container>
								<Grid item xs={2}>
								<button onClick={() => this.clicktoggle()} className="btn btn-1 check_selall  white" style={{border:"none",marginLeft:25,marginTop:-10}}><Icon className="fa fa-address-book" style={{ fontSize: 15,marginLeft:-1,marginTop:2 }}></Icon></button> All / None
								</Grid>
								<Grid item xs={2}>
									<p className="size12"  style={{marginLeft:25}} >Strategy</p>
								</Grid>
								<Grid item xs={1}>
									<p style={{marginLeft:-50}} className="size12">NS (of 1)</p>
								</Grid>
								<Grid item xs={1}>
									<p className="size12"  style={{marginLeft:-44}} >Attemp.</p>
								</Grid>
								<Grid item xs={1}>
									<p className="size12"  style={{marginLeft:-40}} >Time</p>
								</Grid>
								<Grid item xs={1}>
									<p className="size12">From</p>
								</Grid>
								<Grid item xs={1}>
									<p className="size12"  style={{marginLeft:60}} >To</p>
								</Grid>
							</Grid>
							<Grid container>
								<Grid item xs={2}>
									
								</Grid>
								<Grid item xs={2}>
									<select style={{width:100}}>
									  <option></option>
									  <option value="no_penalty">No Penalty</option>
									  <option value="partial_penalty">Partial Penalty</option>
									  <option value="full_penalty">Full Penalty</option>
									</select>
								</Grid>
								<Grid item xs={1} >
									<input style={{marginLeft:-50,width:50}} type="number"/>
								</Grid>
								<Grid item xs={1}>
									<input style={{marginLeft:-50,width:50}} type="number"/>
								</Grid>
								<Grid item xs={1}>
									<input style={{marginLeft:-50,width:50}} type="number"/>
								</Grid>
								<Grid item xs={1}>
									<input style={{marginLeft:-50,width:140}} type="date"/>
								</Grid>
								<Grid item xs={1}>
									<input tyle={{width:140}} type="date"/>
								</Grid>
							</Grid>
							<form id="formulariexercises"></form>
							
							<br/>
							<br/>
						</Card>
					</Grid>
				</Grid>
				
			</div>
		
		);
	}
}


UserCourses = withRouter(UserCourses);

export default UserCourses;