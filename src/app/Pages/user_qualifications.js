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
import Table,{TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import {BarChart} from 'react-easy-chart';
import language from "../Utils/language.js";
import * as STORAGE from '../Utils/Storage.js';

/** 
 * Register Page
 * @extends React.Component
 */
var lng;
class UserQualifications extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		}
	}
	appState = this.props.appState;
	
	componentDidMount() {
		var that = this;

		var settings = {
			type: 'POST',
			data: { 
				'idcurs': that.appState("id_course")
			},
			url: 'php/show_user_course_topics.php',
			async:false,
			success: function(response) {
				var jsonData = JSON.parse(response);
				$("#formulari").empty();
				
				for (var a=0; a<jsonData.length; a++){
					$("#formulari").append("<p style='font-weight:bold'>"+jsonData[a].topicname+"</p><hr/>");
					var settings2 = {
						type: 'POST',
						data: { 
							'idtopic': jsonData[a].idtopic
						},
						async:false,
						url: 'php/show_user_topic_qualifications.php',
						success: function(response2) {
							var jsonData2 = JSON.parse(response2);
							if (jsonData2.length>0){
								$("#formulari").append("<table style='width:100%'><tr><th style='width:(100/4)%'>"+language[lng].exercise+"</th><th style='width:(100/4)%'>"+language[lng].tries+"</th> <th style='width:(100/4)%'>"+language[lng].puntuation+"</th><th style='width:(100/4)%'>"+language[lng].finished+"</th></tr>");
								for (var b=0; b<jsonData2.length; b++){
									var color;
									if (jsonData2[b].finished>0){
										color = "#91F5AD";
									}
									else{
										color = "#F49090";
									}
									$("#formulari tr:last").after("<tr><td style='width:(100/4)%'>"+jsonData2[b].statement+"</td><td style='width:(100/4)%'>"+jsonData2[b].tries+"</td> <td style='width:(100/4)%'>"+jsonData2[b].puntuation+"</td> <td style='width:(100/4)%' bgcolor = "+color+" >"+jsonData2[b].finished+"</td> </tr>");
								}
								$("#formulari tr:last").after("</table>");
								$("#formulari").append("<br/>");
							}
							else{
								$("#formulari").append("<p>"+language[lng].noexercisesassigned+"</p><br/><br/>");
							}
						}
					};
					$.ajax(settings2);
				}
			}
		};
		$.ajax(settings);
	}

	
	/**
	 * Renders the register page.
	 */
	render(){
		lng = STORAGE.getLocalStorageItem("currentLanguage")|| this.appState("currentLanguage");
		const {
            treedades,
            searchString,
            searchFoundCount,
        } = this.state;

		return (
			<div>
				<br/>
				<div className="left_30 down_20 orange size_30"><p>{this.appState("course_name")}</p></div>
				<hr/>
				<Link to={"/user_courses"} className="blue" style={{marginLeft:20}}>{language[lng].courses}</Link>
				<form id="formulari"></form>
				
			</div>
		
		);
	}
}


UserQualifications = withRouter(UserQualifications);

export default UserQualifications;