import React, {useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom'
import { BarChart } from './components/barChart'
import { LineChart } from './components/lineChart'
import { pick, values, reduce } from 'lodash';
import { useComplaint } from './context/complaintContext';
import { monthNames } from './types/monthNames'
import moment from 'moment'

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const AllegationsTable = (props) => {

	const { data: rows } = props

	const useStyles = makeStyles({
  	table: {
    	maxWidth: 1000,
  	},
	});

	const classes = useStyles();

	return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell align="right">FADO Type</TableCell>
            <TableCell align="right">Officer</TableCell>
            <TableCell align="right">Officer Rank Now</TableCell>
            <TableCell align="right">Officer Command Now</TableCell>
            <TableCell align="right">Officer Details</TableCell>
            <TableCell align="right">Board Disposition</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.allegation_id}>
              <TableCell component="th" scope="row">
                {row.description}
              </TableCell>
              <TableCell align="right">{row.fado_type}</TableCell>
              <TableCell align="right">
              	<Link to={`/cop/${row.cop_id}`}>
              		{row.cop_full_name}
              	</Link>
              </TableCell>
              <TableCell align="right">{row.cop_rank_full}</TableCell>
              <TableCell align="right">
              <Link to={`/command_unit/${row.command_unit_id}`}>
              	{row.cop_command_unit}
              </Link>
              </TableCell>
              <TableCell align="right">
              	{row.cop_ethnicity + (row.cop_gender === 'F' ? ' Female' : ' Male')}
              </TableCell>
              <TableCell align="right">{row.board_disposition}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const CopsTable = (props) => {

	const { data: cops } = props

	return (
		<table>
			<thead>
				<tr>
					<th>full name</th>
					<th>rank</th>
					<th>current command unit</th>
					<th>officer details</th>
				</tr>
			</thead>
			<tbody>
				{values(cops).map(e => (
					<tr>
						<td>
							<Link to={`/cop/${e.cop_id}`}>
								{e.cop_full_name}
							</Link>
						</td>
						<td>{e.cop_rank_full}</td>
						<td styles={{align: "center"}}>
							<Link to={`/command_unit/${e.command_unit_id}`}>
								{e.cop_command_unit}
							</Link>
						</td>
						<td>
							{e.cop_ethnicity + (e.cop_gender === 'F' ? ' Female' : ' Male')}
						</td>
					</tr>
					)
				)}
			</tbody>
		</table>
	)
}

const getCops = c => {
	const cops = c.allegations.reduce((a, v) => {
		return {...a, [v.cop_id]: v}
	}, {})

	return cops
}

export const ComplaintPage = (props) => {

	const { complaint: c, associatedCommandUnits } = useComplaint()

	const allegations = c.allegations

	const cops = getCops(c)

	return (
		<div>
			<p>
				{`Date received: ${monthNames[moment(c.date_received).month()]}, ${moment(c.date_received).year()}` }	
			</p>
			<p>
				{`Date closed: ${monthNames[moment(c.date_closed).month()]}, ${moment(c.date_closed).year()}` }	
			</p>
			<p>
				{`Associated precinct: ${c.precinct}`}	
			</p>
				{`Command units associated with his precinct: `}
				<ul>
					{values(associatedCommandUnits).map(e => (
						e.command_unit_full ? (
							<li>
								<Link to={`/command_unit/${e.id}`}>{e.command_unit_full}</Link>
							</li> ) : (
							<li>
								<Link to={`/command_unit/${e.id}`}>{e.unit_id}</Link>
							</li>
							) 
						)
					)}
				</ul>
			<p>
				{`Complainant details: ${c.complainant_ethnicity} ${c.complainant_gender}, ${c.complainant_age_incident}`}
			</p>
			<p>
				{`Contact reason: ${c.contact_reason}`}
			</p>
			<p>
				{`Outcome description: ${c.outcome_description}`}
			</p>
			<p>
				{`Number of allegations on complaint: ${c.num_allegations}`}
			</p>
			<p>
				{`Officers on complaint: `}
			</p>
			
			<AllegationsTable data={allegations} />
		</div>
	)
}