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
import SortableTree, {
  getFlatDataFromTree,
  getTreeFromFlatData,
} from 'react-sortable-tree';
/** 
 * Register Page
 * @extends React.Component
 */
 var initialData = [];
class TeacherCourses extends React.Component {
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
			}),
		};
	}
	appState = this.props.appState;
	
	componentDidMount() {
		var that = this;

		var settings = {
			type: 'GET',
			url: 'php/load_courses.php',
			success: function(response) {
				var jsonData = JSON.parse(response);
				var a = jsonData.map(node => ({ ...node, title: node.name }));
				that.setState({treeData: getTreeFromFlatData({
					flatData: a,
					getKey: node => node.id, // resolve a node's key
					getParentKey: node => node.parent, // resolve a node's parent's key
					rootKey: null, // The value of the parent key when there is no parent (i.e., at root level)
				})});
				console.log(jsonData);
			}
		};
		$.ajax(settings);
	}
	
	treeChange = (treeData,flatData) => {
		this.setState({ treeData });
		{flatData.map(({ id, name, parent }) => (
            console.log({id,name,parent})
          ))}
		
	}

	
	/**
	 * Renders the register page.
	 */
	render(){
		const {
            treeData,
            searchString,
            searchFoundCount,
        } = this.state;
		
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

		return (
			<div>
				<div className="left_30 down_20 orange size_30"><p>Current Courses</p></div>
				<hr/>
				<Grid container>
					<Grid item xs={3}  className="margin3"> 
						<label htmlFor="find-box">
							<TextField
								id="find-box"
								type="text"
								value={searchString}
								onChange={event => this.setState({ searchString: event.target.value })}
								label="Search"
							/>
						</label>
					</Grid>
					<Grid item xs={3}> 
						<Link to="/teacher_edit_course"><Button className="btn btn-2 down_30 white">Create New Course</Button></Link>
					</Grid>
					<Grid item xs={12}>
						<div style={{ height: 1500}}>
						<SortableTree
						  treeData={this.state.treeData}
						  onChange={treeData => 	this.treeChange(treeData,flatData)}
						  searchQuery={searchString}
						/>
						</div>
					</Grid>
				</Grid>
				
			</div>
		
		);
	}
}


TeacherCourses = withRouter(TeacherCourses);

export default TeacherCourses;