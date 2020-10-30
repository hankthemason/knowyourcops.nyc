import React, { useState, useEffect } from 'react';
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
import TableSortLabel from '@material-ui/core/TableSortLabel';
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

	const [order, setOrder] = useState('asc')
	const [orderBy, setOrderBy] = useState('date_received')

	const { data, headCells } = props
	let rows = data;

	useEffect(() => {
		rows.map(e => {
			e.date_received = new Date(e.date_received)
			e.date_closed = new Date(e.date_closed)
		})
	}, [])

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

	const sortFunction = (rows) => {
		order === 'asc' ? 
			rows.sort((a, b) => {
				return a[orderBy] - b[orderBy]
			}) : rows.sort((a, b) => {
				return b[orderBy] - a[orderBy]
			})
		return rows
	}

	const onRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
	}

	const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} stylesaria-label="collapsible table">
        <TableHead>
          <TableRow>
          	<TableCell>
          	</TableCell>
          	{headCells.map((headCell) => (
		          <TableCell
		            key={headCell.id}
		            sortDirection={orderBy === headCell.id ? order : false}
		          >
		            <TableSortLabel
		              active={orderBy === headCell.id}
		              direction={orderBy === headCell.id ? order : 'asc'}
		              //onClick needs to return a function ??
		              onClick={createSortHandler(headCell.id)}
		            >
		              {headCell.label}
		            </TableSortLabel>
		          </TableCell>
		        ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortFunction(rows).map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}




		