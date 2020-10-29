import React, { useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';


export const CopComplaintsTable = props => {

	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	]

	const { data } = props
	let rows = data;

	const useStyles = makeStyles({
		table: {
		  maxWidth: 800,
		},
	});

	const useRowStyles = makeStyles({
	  root: {
	    '& > *': {
	      borderBottom: 'unset',
	    },
	  },
	});

	const classes = useStyles();

	function Row(props) {
		const { row } = props;

		const [open, setOpen] = React.useState(false);
		const rowClasses = useRowStyles();

		return (
		  <React.Fragment>
		    <TableRow className={rowClasses.root}>
		      <TableCell>
		        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
		          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
		        </IconButton>
		      </TableCell>
		      <TableCell component="th" scope="row">
		        {monthNames[moment(row.date_received).month()]} {moment(row.date_received).year()}
		      </TableCell>
		      <TableCell align="right">
		      	{monthNames[moment(row.date_closed).month()]} {moment(row.date_closed).year()}
		      </TableCell>
		      <TableCell align="right">
		      	{row.precinct}
		      </TableCell>
		      <TableCell align="center">{row.num_allegations_on_complaint}</TableCell>
		      <TableCell align="right">{
		      	((row.complainant_ethnicity || row.complainant_gender || row.complainant_age_incident) ? 
		      		(row.complainant_ethnicity.toLowerCase() != 'unknown' && (row.complainant_gender.toLowerCase() === 'male' || 'female') ?
								`${row.complainant_ethnicity} ${row.complainant_gender.toLowerCase()}` + 
										(row.complainant_age_incident != null && typeof(row.complainant_age_incident) === 'number' ? `, ${row.complainant_age_incident}` : '') 
								: null) 
		      		: null
		      	)}
		      </TableCell>
		    </TableRow>
		    <TableRow>
		      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
		        <Collapse in={open} timeout="auto" unmountOnExit>
		          <Box margin={1}>
		            <Typography variant="h6" gutterBottom component="div">
		              Allegations
		            </Typography>
		            <Table size="small" aria-label="allegations">
		              <TableHead>
		                <TableRow>
		                  <TableCell>Description</TableCell>
		                  <TableCell>Fado Type</TableCell>
		                  <TableCell align="right">Board Decision</TableCell>
		                </TableRow>
		              </TableHead>
		              <TableBody>
		                {row.allegations.map((allegationRow) => (
		                  <TableRow key={allegationRow.id}>
		                    <TableCell component="th" scope="row">
		                      {allegationRow.description}
		                    </TableCell>
		                    <TableCell>{allegationRow.fado_type}</TableCell>
		                    <TableCell align="right">{allegationRow.board_disposition}</TableCell>
		                  </TableRow>
		                ))}
		              </TableBody>
		            </Table>
		          </Box>
		        </Collapse>
		      </TableCell>
		    </TableRow>
		  </React.Fragment>
		);
	};

	// Row.propTypes = {
	//   row: PropTypes.shape({
	//     id: PropTypes.number.isRequired,
	//     : PropTypes.number.isRequired,
	//     fat: PropTypes.number.isRequired,
	//     history: PropTypes.arrayOf(
	//       PropTypes.shape({
	//         amount: PropTypes.number.isRequired,
	//         customerId: PropTypes.string.isRequired,
	//         date: PropTypes.string.isRequired,
	//       }),
	//     ).isRequired,
	//     name: PropTypes.string.isRequired,
	//     price: PropTypes.number.isRequired,
	//     protein: PropTypes.number.isRequired,
	//   }).isRequired,
	// };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} stylesaria-label="collapsible table">
        <TableHead>
          <TableRow>
          	<TableCell />
            <TableCell>Date Received</TableCell>
            <TableCell align="right">Date Closed</TableCell>
            <TableCell align="right">Location(Precinct)</TableCell>
            <TableCell align="center">Allegations on complaint</TableCell>
            <TableCell align="right">Complainant deatails</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}




		