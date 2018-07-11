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
import SortableTree, { addNodeUnderParent, removeNodeAtPath,changeNodeAtPath,getFlatDataFromTree,
  getTreeFromFlatData, } from 'react-sortable-tree';
import List,{ListItem,ListItemText} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Select from 'material-ui/Select';

/** 
 * Register Page
 * @extends React.Component
 */
 var initialData = [{ id: '1', name: 'New topic', parent: null },];
 var contador = '1';
 
class TeacherEditCourse extends React.Component {
	constructor(props){
		super(props);
						
		this.state = {
		searchString: '',
		searchFocusIndex: 0,
		searchFoundCount: null,
		treeData: getTreeFromFlatData({
				flatData: initialData.map(node => ({ ...node, title: node.name })),
				getKey: node => node.id, // resolve a node's key
				getParentKey: node => node.parent, // resolve a node's parent's key
				rootKey: null, // The value of the parent key when there is no parent (i.e., at root level)
			})
				
		};
	}
	
	click = () => {
		var that = this;
		const flatData = getFlatDataFromTree({
			  treeData: this.state.treeData,
			  getNodeKey: ({ node }) => node.id, // This ensures your "id" properties are exported in the path
			  ignoreCollapsed: false, // Makes sure you traverse every node in the tree, not just the visible ones
			}).map(({ node, path }) => ({
			  id: node.id,
			  name: node.name,

			  // The last entry in the path is this node's key
			  // The second to last entry (accessed here) is the parent node's key
			  parent: path.length > 1 ? path[path.length - 2] : null,
		}));
		console.log(flatData);
		
		var settings = {
			type: 'POST',
			data: { 
				'coursename': $("#newtitle").val(),
				'topics' : flatData
			},
			url: 'php/add_course.php',
			success: function(response) {
				if(response == "OK"){
					that.props.history.push('/teacher_courses');
				}
				
			}
		};
		$.ajax(settings);
	};
	
	addclick = (path,getNodeKey) =>{
		
		contador = (parseInt(contador)+1).toString();
		
		this.setState(state => ({
		  treeData: addNodeUnderParent({
			treeData: state.treeData,
			parentKey: path[path.length - 1],
			expandParent: true,
			getNodeKey,
			newNode: {
			  id: contador
			},
		  }).treeData,
		}));
		
	};
	
	
	appState = this.props.appState;

	
	/**
	 * Renders the register page.
	 */
	render(){
		 const getNodeKey = ({ treeIndex }) => treeIndex;
		const {
            treeData,
            searchString,
            searchFoundCount,
        } = this.state;
		return (
			<div>
				<div className="left_30">	
					<TextField
						id="newtitle"
						label="Enter Course Title"
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
				<Link to={"/teacher_courses"} className="blue" style={{marginLeft:20}}>Courses</Link>
				<br/>
				<Grid container>
					<Grid item xs={5} > 
						<a className="orange size_30 left_30">Topics</a>
						<label htmlFor="find-box" className="left_30">
							<TextField
								id="find-box"
								type="text"
								value={searchString}
								onChange={event => this.setState({ searchString: event.target.value })}
								label="Search"
							/>
						</label>
						<div style={{height:'150%'}}>
							<SortableTree

							  treeData={this.state.treeData}
							  onChange={treeData => this.setState({ treeData })}
							  searchQuery={searchString}
							  generateNodeProps={({ node, path }) => ({
								  title: (
									<input
									  style={{ fontSize: '1.1rem' }}
									  value={node.name}
									  onChange={event => {
										const name = event.target.value;

										this.setState(state => ({
										  treeData: changeNodeAtPath({
											treeData: state.treeData,
											path,
											getNodeKey,
											newNode: { ...node, name },
										  }),
										}));
									  }}
									/>
								  ),
								  buttons: [
									<Button
										className="btn btn-1 white"
										onClick={()=> this.addclick(path,getNodeKey)}
										
									>
									 <Icon className="fa fa-plus" style={{ fontSize: 15 }}></Icon>
									</Button>,
									<Button
										className="btn btn-3 white  left_15 "
									  onClick={() =>
										this.setState(state => ({
										  treeData: removeNodeAtPath({
											treeData: state.treeData,
											path,
											getNodeKey,
										  }),
										}))
									  }
									>
									 	<Icon className="fa fa-trash" style={{ fontSize: 15 }}></Icon>
									</Button>,
								  ],

								})}
							/>
						</div>
						
					</Grid>
					<Grid item xs={3}> 
						<a className="orange size_30 left_30">Categories</a>
						<List>
							<ListItem>
								<Checkbox/>
								<ListItemText>Magnetic Resonance</ListItemText>
							</ListItem>
							<ListItem>
								<Checkbox/>
								<ListItemText>Clinical Cases</ListItemText>
							</ListItem>
							<ListItem>
								<Checkbox/>
								<ListItemText>Evolution</ListItemText>
							</ListItem>
							<ListItem>
								<Checkbox/>
								<ListItemText>Plate in PA or AP</ListItemText>
							</ListItem>
							<ListItem>
								<Checkbox/>
								<ListItemText>Diafragmes</ListItemText>
							</ListItem>
						</List>
					</Grid>
					<Grid item xs={4}> 
						<Grid item xs={12}> 
							<a className="orange size_30">Description</a>
						</Grid>
						<Card className="course_description_form down_30">
							<TextField
								id="desc"
								className="text_field"
							/>
						</Card>
						<Grid item xs={12}> 
							<a className="orange size_30">Pre-Requisits</a>
						</Grid>
						<Card className="course_description_form down_30">
							<TextField
								id="prerequisists"
								className="text_field"
							/>
						</Card>
						<Grid item xs={12}> 
							<Select native className="down_30 "> 
								<option value="">Course Type</option>
								<option value={0}>Tòrax</option>
								<option value={1}>Nefro</option>
							</Select>
						</Grid>
						<Select native className="down_30"> 
							<option value="">Difficulty</option>
							<option value={0}>1</option>
							<option value={1}>2</option>
							<option value={0}>3</option>
							<option value={1}>4</option>
						</Select>
					</Grid>
				</Grid>
				<Grid container>
					<Grid item>
						<Button
							className="btn btn-3 white  left_15 "
							onClick={() =>this.click()}
						>
							Create Course
						</Button>
					</Grid>
				</Grid>
			</div>
		
		);
	}
}


TeacherEditCourse = withRouter(TeacherEditCourse);

export default TeacherEditCourse;