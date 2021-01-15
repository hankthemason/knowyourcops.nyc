import React from 'react';
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { values } from 'lodash'


const useStyles = makeStyles({
  table: {
    maxWidth: 400,
  },
});

export const SimpleTable = props => {

	const { title, headers, data } = props
	const classes = useStyles()
	console.log(data)

	return (
			<Table className={classes.table} aria-label={title}>
				<TableHead>
        	<TableRow>
        		{headers.map(e => (
        			<TableCell>{e}</TableCell>
        			)
        		)}
        	</TableRow>
        </TableHead>
        <TableBody>
          {data.map(e => (

            <TableRow key={e.id}>
            	{Object.entries(e).map(obj => (
            		obj[0] != 'id' ?
            		obj[0] === 'fullName' ?
            		<TableCell component="th" scope="row">
            			<Link to={`/cop/${e.id}`}>{obj[1]}</Link>
	            	</TableCell> :
	            	<TableCell component="th" scope="row">
	            		{obj[1]}
	            	</TableCell> : null	        
            	))}
            </TableRow>
          ))}
        </TableBody>
			</Table>

	)
}