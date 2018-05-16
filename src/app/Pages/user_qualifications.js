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

/** 
 * Register Page
 * @extends React.Component
 */
class UserQualifications extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		}
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
	let id = 0;
	function createData(name, tries, puntuation, avg_tries, avg_puntuation) {
	  id += 1;
	  return { id, name, tries, puntuation, avg_tries, avg_puntuation };
	}

	const data = [
	  createData('Exercice 1', "1/3", 6.0, "1.33/3", 4.0),
	  createData('Exercice 2',"2/3", 9.0, "2.47/3", 7.3),
	  createData('Exercice 3',"3/3", 10.0, "1.24/3", 8.0),
	  createData('Exercice 4', "1/3", 3.7, "1.57/3", 2.3),
	  createData('Exercice 5', "1/3", 5.5, "2.67/3", 6.9),
	];

	var tablemode=true;
	var showresults;
	if (tablemode){
	
	}

		return (
			<div style={{height:1500}}>
				<div className="left_30 down_20 orange size_30">Course 1</div>
				<hr/>
				<div className="left_30 down_20 orange size_20 ">Topic 1</div>
				<Paper>
			      <Table >
			        <TableHead>
			          <TableRow>
			            <TableCell>Exercices</TableCell>
			            <TableCell numeric>Tries</TableCell>
			            <TableCell numeric>Puntuation</TableCell>
			            <TableCell numeric>Average Tries</TableCell>
			            <TableCell numeric>Average Puntuation</TableCell>
			          </TableRow>
			        </TableHead>
			        <TableBody>
			          {data.map(n => {
			            return (
			              <TableRow key={n.id}>
			                <TableCell component="th" scope="row">
			                  {n.name}
			                </TableCell>
			                <TableCell numeric>{n.tries}</TableCell>
			                <TableCell numeric>{n.puntuation}</TableCell>
			                <TableCell numeric>{n.avg_tries}</TableCell>
			                <TableCell numeric>{n.avg_puntuation}</TableCell>
			              </TableRow>
			            );
			          })}
			        </TableBody>
			      </Table>
			    </Paper>
			    <hr />
			    <div className="left_30 down_20 orange size_20 ">Topic 2</div>
				<Paper>
			      <Table >
			        <TableHead>
			          <TableRow>
			            <TableCell>Exercices</TableCell>
			            <TableCell numeric>Tries</TableCell>
			            <TableCell numeric>Puntuation</TableCell>
			            <TableCell numeric>Average Tries</TableCell>
			            <TableCell numeric>Average Puntuation</TableCell>
			          </TableRow>
			        </TableHead>
			        <TableBody>
			          {data.map(n => {
			            return (
			              <TableRow key={n.id}>
			                <TableCell component="th" scope="row">
			                  {n.name}
			                </TableCell>
			                <TableCell numeric>{n.tries}</TableCell>
			                <TableCell numeric>{n.puntuation}</TableCell>
			                <TableCell numeric>{n.avg_tries}</TableCell>
			                <TableCell numeric>{n.avg_puntuation}</TableCell>
			              </TableRow>
			            );
			          })}
			        </TableBody>
			      </Table>
			    </Paper>
			     <hr />
			    <div className="left_30 down_20 orange size_20 ">Topic 3</div>
				<Paper>
			      <Table >
			        <TableHead>
			          <TableRow>
			            <TableCell>Exercices</TableCell>
			            <TableCell numeric>Tries</TableCell>
			            <TableCell numeric>Puntuation</TableCell>
			            <TableCell numeric>Average Tries</TableCell>
			            <TableCell numeric>Average Puntuation</TableCell>
			          </TableRow>
			        </TableHead>
			        <TableBody>
			          {data.map(n => {
			            return (
			              <TableRow key={n.id}>
			                <TableCell component="th" scope="row">
			                  {n.name}
			                </TableCell>
			                <TableCell numeric>{n.tries}</TableCell>
			                <TableCell numeric>{n.puntuation}</TableCell>
			                <TableCell numeric>{n.avg_tries}</TableCell>
			                <TableCell numeric>{n.avg_puntuation}</TableCell>
			              </TableRow>
			            );
			          })}
			        </TableBody>
			      </Table>
			    </Paper>

			</div>
		
		);
	}
}


UserQualifications = withRouter(UserQualifications);

export default UserQualifications;