import React, { useState, useEffect } from 'react';
import { useCommandUnit } from './context/commandUnitContext';
import { Link } from 'react-router-dom'
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
import TablePagination from '@material-ui/core/TablePagination';


export const CommandUnitComplaintsTable = props => {

	const { commandUnit, setCommandUnitViewConfig, getCommandUnitViewConfig } = useCommandUnit();
	
	const viewConfig = getCommandUnitViewConfig();

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

	const { data, headCells } = props
	let rows = data;

	const { order,
					orderBy,
					page,
					pageSize,
					pageSizeOptions,
					orderByOptions } = viewConfig;

	const currentPageHandler = (event, newPage) => {
    setCommandUnitViewConfig({
    	...viewConfig,
    	page: newPage
    });
  };

  const handlePageSizeChange = (event) => {
    setCommandUnitViewConfig({
			...viewConfig,
			pageSize: event.target.value
		})
  };

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
		                	<TableCell>Officer</TableCell>
		                  <TableCell>Description</TableCell>
		                  <TableCell>Fado Type</TableCell>
		                  <TableCell align="right">Board Decision</TableCell>
		                </TableRow>
		              </TableHead>
		              <TableBody>
		                {row.allegations.map((allegationRow) => (
		                  <TableRow key={allegationRow.id}>
		                    <TableCell component="th" scope="row">
		                    	<Link to={`/cop/${allegationRow.cop_id}`}>{allegationRow.cop_name}</Link>
		                    </TableCell>
		                    <TableCell>
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
				return a[orderBy.value] - b[orderBy.value]
			}) : rows.sort((a, b) => {
				return b[orderBy.value] - a[orderBy.value]
			})
		return rows
	}



	// const onRequestSort = (event, property) => {
	// 	const isAsc = orderBy === property && order === 'asc';
 //    setOrder(isAsc ? 'desc' : 'asc');
 //    setOrderBy(property);
	// }

	// const createSortHandler = (property, sortable) => event => {
	// 	if (sortable) {
	// 		onRequestSort(event, property)
	// 	}
 //  };

 	//this is a curried function
 	const createClickHandler = (id, sortable) => () => {
 		if (sortable) {
 			const isAsc = orderBy.value === orderByOptions[id].value && order === 'asc';
    	setCommandUnitViewConfig({
    		...viewConfig,
    		order: isAsc ? 'desc' : 'asc',
    		orderBy: orderByOptions[id]
    	})
 		}
 	}

 	//this is a closure function
 	// const clickHandler = (event) => {
 	// 	if (headCell.sortable) {
 	// 		const isAsc = orderBy === headCell.property && order === 'asc';
	 //    setOrder(isAsc ? 'desc' : 'asc');
	 //    setOrderBy(property);
 	// 	}
 	// }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} stylesaria-label="collapsible table">
        <TableHead rowcount={rows.length}>
          <TableRow>
          	<TableCell>
          	</TableCell>
          	{headCells.map((headCell) => (
          		headCell.sortable ? (
		          <TableCell
		            key={headCell.id}
		            sortDirection={orderBy.value === headCell.value ? order : false}
		          >
		            <TableSortLabel
		              active={orderBy.value === headCell.value}
		              direction={orderBy.value === headCell.value ? order : 'asc'}
		              //onClick needs to return a function ??
		              //onClick={createSortHandler(headCell.id, headCell.sortable)}
		              onClick={createClickHandler(headCell.id, headCell.sortable)}
		            >
		              {headCell.title}
		            </TableSortLabel>
		          </TableCell>
		          ) : <TableCell
		            key={headCell.id}
		            sortDirection={orderBy.value === headCell.value ? order : false}
		          >
		          	{headCell.title}
		          </TableCell>
		        ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortFunction(rows)
          	.slice(page * pageSize, page * pageSize + pageSize)
          	.map((row) => (
            <Row key={row.name} row={row} />
          ))}
         	
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={rows.length}
        rowsPerPage={pageSize}
        page={page}
        onChangePage={currentPageHandler}
        onChangeRowsPerPage={handlePageSizeChange}
        style={{display:'flex',
   							justifyContent: 'left',  
   							width: "100%",  
   							alignItems: 'left',
   							padding:'0px'}}
      />
    </TableContainer>
  )
}




		