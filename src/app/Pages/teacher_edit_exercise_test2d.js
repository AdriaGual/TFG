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
import SortableTree, { addNodeUnderParent, removeNodeAtPath,changeNodeAtPath } from 'react-sortable-tree';
import List,{ListItem,ListItemText} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Select from 'material-ui/Select';

/** 
 * Register Page
 * @extends React.Component
 */
class TeacherEditExerciceTest2d extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			hasTextSolution:false,
		};
	}
	
	appState = this.props.appState;

	componentWillMount(){
		var loadjs = require('loadjs');
		loadjs('js/test.js',function (){
		});
		loadjs('js/canvas_viewer_loc.js',function (){
		});
		loadjs('js/viewer2d.js',function (){
		});
	}
	
	componentDidMount(){
		var settings = {
			type: 'GET',
			url: 'php/load_only_courses_teacher.php',
			async:false,
			success: function(response) {
				var jsonData = JSON.parse(response);
				for (var a=0; a<jsonData.length; a++){
					$("#formulari").append("<p value='"+jsonData[a].id+"'> "+jsonData[a].name+"</p>");
					
					var settings2 = {
						type: 'POST',
						data: { 
							'curs': jsonData[a].id,
						},
						url: 'php/load_only_topics.php',
						async:false,
						success: function(response2) {
							if (response2!="0_topics"){
								var jsonData2 = JSON.parse(response2);
								for (var b=0; b<jsonData2.length; b++){
									$("#formulari").append("<input type='checkbox' name='topic' value='"+jsonData2[b].id+"' />"+jsonData2[b].name+"<br/>");
								}
								$("#formulari").append("<br/>");
							}
							else{
								$("#formulari").append("<p class='size15'>No hi han topics en aquest curs </p><br/><br/>");
							}
						}
					};
					$.ajax(settings2);
				}
			}
		};
		$.ajax(settings);
	}
	
	handleChange = name => event => {
		this.setState({ [name]: event.target.checked });
	};
	
	click = () => {
		var canvas = document.getElementById('canvas');
		var dataURL = canvas.toDataURL("image/png");
		var topics = $("input[name=topic]:checked").serialize();
		var answers = [];
		var a = 0;
		$('.answer_item').each(function(index, item) {
			var id = a;
			var text = $(item).find("input[type=text]").val();
			var solution = $(item).find("span.input-group-addon > input[type=checkbox]").is(":checked");
			answers[id] = {"text": text, "solution": solution};
			a++;
		});
			
		
		var that = this;
		var settings = {
			type: 'POST',
			data: { 
				'img': dataURL, 
				'topics':topics,
				'title': $("#newtitle").val(), 
				'description': $("#problem_description").val(), 
				'question': $("#problem_question").val(), 
				'help': $("#help").val(), 
				'answers': answers,
			},
			url: 'php/save_exercise_test.php',
			success: function(response) {
				if (response=="OK"){
					that.props.history.push("/teacher_courses");
				}
			}
		};
		$.ajax(settings);
		
	}
	
	
	
	/**
	 * Renders the register page.
	 */
	render(){
		return (
			<div style={{ height: 1500}}>
				<div className="left_30">	
					<TextField
						id="newtitle"
						label="Enter Exercise Statement"
						className="text_field "
						style = {{width: 1000}}
						onChange={(event, newValue) =>
							this.setState({
								newtitle: newValue
							})
						}
					/>
				</div>
				<hr/>
				<Link to={"/teacher_courses"} className="blue" style={{marginLeft:20}}>Courses></Link><Link to={"/teacher_choose_exercise"} className="blue" >Choose Exercise</Link>
				<Grid container>
					<Grid item xs={12} >
						<p></p>				
					</Grid>
				</Grid>
				<Grid container>
					<Grid item xs={1} > 
					</Grid>
					<Grid item xs={3} > 
						<p>Description:</p>
						<textarea value={this.state.value} onChange={this.handleChange} id="problem_description" style={{height:200,width:400}}/>
						<p>Question:</p>
						<textarea value={this.state.value} onChange={this.handleChange} id="problem_question" style={{height:100,width:400}}/>
						<Grid container>
							<Grid item xs={1} > 
								<Checkbox
								  id="has_text"
								  checked={this.state.hasTextSolution}
								  onChange={this.handleChange('hasTextSolution')}
								  value="checkedA"
								/>
							</Grid>
							<Grid item xs={3} > 
								<p>Text Solution:</p>
							 </Grid>
							{this.state.hasTextSolution ?
								<textarea value={this.state.value} onChange={this.handleChange} id="problem_solution" style={{height:50,width:400}}/>
							:null}
						</Grid>
						
						<p>Help Text:</p>
						<textarea value={this.state.value} id="help" onChange={this.handleChange} style={{height:100,width:400}}/>
						<Grid container>
							<Grid item xs={6} > 
								<Select native className="down_30 " id="problem_difficulty_level"> 
									<option value="">Difficulty</option>
									<option value={1}>1</option>
									<option value={2}>2</option>
									<option value={3}>3</option>
									<option value={4}>4</option>
								</Select>
							</Grid>
							<Grid item xs={6} > 
								<Select native className="down_30 "> 
									<option value="">Maximum Tries</option>
									<option value={1}>1</option>
									<option value={2}>2</option>
									<option value={3}>3</option>
									<option value={4}>4</option>
								</Select>
							</Grid>
						</Grid>
					</Grid>

					<Grid item xs={4} > 
						<div id="image_div">
							<div id="canvas_div">
								<canvas id="canvas" width="448" height="350"></canvas>
							</div>
							<div id="image_file_input_group" class="input-group">
								<input type="file" id="problem_image_input" />
							</div>
							<div id="current_image_input_group" class="input-group">
								<input type="hidden" id="problem_image_url" value="" disabled />
								<button type="button" id="btn-delete-image">Eliminar imatge</button>
							</div>
							
						</div>
					</Grid>
					<Grid item xs={2} >
						<div id="items_box">
						</div>
						<Button type="button" id="btn-new-item" className="btn btn-4 white" >Afegir resposta</Button>
					</Grid>
					<Grid item xs={2} > 
						<div className="left_30 down_20 orange size_20"><p>Topics</p></div>
						<hr/>
						<div id="formulari"></div>
						<hr/>
						<br/>
						<Button
							className="btn btn-1 white left_15"
							onClick={() => 	this.click()}
						>
							<Icon className="fa fa-save" style={{ fontSize: 15 }}></Icon>
						</Button>
					</Grid>

				</Grid>
				
			</div>
		
		);
	}
}


TeacherEditExerciceTest2d = withRouter(TeacherEditExerciceTest2d);

export default TeacherEditExerciceTest2d;