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
class Theory extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			theory_content:"",
			theory_url:"",
			theory_title:"",
			theory_subtitle:"",
		}
	}
	appState = this.props.appState;

	componentDidMount() {
		var that = this;
		var settings = {
			type: 'POST',
			data: { 
				'name': that.appState("theory_name"), 
			},
			url: 'php/load_theory.php',
			success: function(response) {
				var jsonData = JSON.parse(response);
				that.setState({theory_content: jsonData.content});
				that.setState({theory_url: jsonData.url});
				that.setState({theory_title: jsonData.title});
				that.setState({theory_subtitle: jsonData.subtitle});
			}
		};
		$.ajax(settings);
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
		return (
			<div>
				<div className="left_30 down_20 orange size_30"><p>{this.state.theory_title}</p></div>
				<hr/>
				<Grid container>
					<Grid item xs={5}  className="padding2"> 
						<p className="left_30 down_20 black size_12">{this.state.theory_subtitle}</p>
						<a className="left_30 down_20 blue size_12" href={this.state.theory_url}>URL: {this.state.theory_url}</a>
						<Card className="course_description_form margin2 padding2">
								<p className="margin1">{this.state.theory_content}</p>
						</Card>
					</Grid>
					<Grid item xs={5}  className="padding2"> 
					
					</Grid>
				</Grid>

			</div>
		
		);
	}
}


Theory = withRouter(Theory);

export default Theory;