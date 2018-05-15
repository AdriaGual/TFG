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
import SortableTree from 'react-sortable-tree';
/** 
 * Register Page
 * @extends React.Component
 */
class UserCourses extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		searchString: '',
		searchFocusIndex: 0,
		searchFoundCount: null,
		treeData: [
				{ title:'Course 1',
					expanded:true, 
					children: [{ title: 'Topic 1', 
					children: [{ title: <Link to="/c11_theory" className="blue">Theory</Link> },{ title: <Link to="/c11_exercices" className="red">Exercices</Link> }] }] 
			
				},
				{ title: 'Course 2',
					expanded:true, 
					children: [{ title: 'Topic 1', 
					children: [{ title: <Link to="/c11_theory" className="blue">Theory</Link> },{ title: <Link to="/c11_exercices" className="red">Exercices</Link> }] },
					{ title: 'Topic 2', 
					children: [{ title: <Link to="/c11_theory" className="blue">Theory</Link> },{ title: <Link to="/c11_exercices" className="red">Exercices</Link> }] },
					{ title: 'Topic 3', 
					children: [{ title: <Link to="/c11_theory" className="blue">Theory</Link> },{ title: <Link to="/c11_exercices" className="red">Exercices</Link> }] }
					]
				}
			],
				
		};
	}
	appState = this.props.appState;

	
	/**
	 * Renders the register page.
	 */
	render(){
		const {
            treeData,
            searchString,
            searchFoundCount,
        } = this.state;
		
		return (
			<div>
				<div className="left_30 down_20 orange size_30">Actual Courses</div>
				<hr/>
				<Grid container>
					<Grid item xs={5}> 
						<div style={{ height: 1500}}>
						<SortableTree
						  treeData={this.state.treeData}
						  onChange={treeData => this.setState({ treeData })}
						  canDrag={false}
						  searchQuery={searchString}
						/>
						</div>
					</Grid>
					<Grid Item xs={3}>
						<label htmlFor="find-box">Search: 
							<input
								id="find-box"
								type="text"
								value={searchString}
								onChange={event => this.setState({ searchString: event.target.value })}
							/>
						</label>
					</Grid>
				</Grid>
				
			</div>
		
		);
	}
}


UserCourses = withRouter(UserCourses);

export default UserCourses;