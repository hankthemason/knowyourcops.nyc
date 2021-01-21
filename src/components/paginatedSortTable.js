import React, { useState, useEffect } from 'react';
import { useCommandUnit } from '../context/commandUnitContext';
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

export const PaginatedSortTable = props => {

	const { data: rows, 
					headCells,
					width,
					viewConfigGetter: getTableViewConfig,
					viewConfigSetter: setTableViewConfig } = props

	const tableViewConfig = getTableViewConfig()

	const { order,
					orderBy,
					page,
					pageSize,
					orderByOptions,
					pageSizeOptions } = tableViewConfig

	function EnhancedTableHead(props) {
  	const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;

  	const createClickHandler = (id, sortable) => () => {
	 		if (sortable) {
	 			const isAsc = orderBy.value === orderByOptions[id].value && order === 'asc';
	    	setTableViewConfig({
	    		...tableViewConfig,
	    		order: isAsc ? 'desc' : 'asc',
	    		orderBy: orderByOptions[id]
	    	})
	 		}
 		}

	  return (
	  	<TableHead>
	      <TableRow>
	        {headCells.map((headCell) => (
	          <TableCell
	            key={headCell.id}
	            align='left'
	            //padding={headCell.disablePadding ? 'none' : 'default'}
	            sortDirection={orderBy.value === headCell.value ? order : false}
	          >
	          	{headCell.sortable ? (
	            	<TableSortLabel
	              	active={orderBy.value === headCell.value}
	              	direction={orderBy.value === headCell.value ? order : 'asc'}
	              	onClick={createClickHandler(headCell.id, headCell.sortable)}
	            	>
	              	{headCell.title}
	            	</TableSortLabel> ) : headCell.title }
	          </TableCell>
	        ))}
	      </TableRow>
    	</TableHead>
    )
	}

	const getLastName = (fullName) => {
		return fullName.split(' ')[1]
	}

	const array = rows.map(e => e.last_name)

	const sortFunction = (rows) => {
		if (orderBy.type === 'string') {
			order === 'asc' ?
				rows.sort((a, b) => {
					return a[orderBy.value].localeCompare(b[orderBy.value])
				}) : rows.sort((a, b) => {
					return b[orderBy.value].localeCompare(a[orderBy.value])
				})
			return rows
		}
		order === 'asc' ? 
			rows.sort((a, b) => {
				return a[orderBy.value] - b[orderBy.value]
			}) : rows.sort((a, b) => {
				return b[orderBy.value] - a[orderBy.value]
			})
		return rows
	}

	const currentPageHandler = (event, newPage) => {
    setTableViewConfig({
    	...tableViewConfig,
    	page: newPage
    });
  };

  const handlePageSizeChange = (event) => {
    setTableViewConfig({
			...tableViewConfig,
			pageSize: event.target.value
		})
  };

	return (
		<div>
      <Table
        //className={classes.table}
        aria-labelledby="tableTitle"
        //size={dense ? 'small' : 'medium'}
        aria-label="enhanced table"
        style={{maxWidth: `${width}`}}
      >
        <EnhancedTableHead
          //classes={classes}
          order={order}
          orderBy={orderBy}
          //onRequestSort={handleRequestSort}
          //rowCount={rows.length}
        />
      <TableBody>
        {sortFunction(rows)
          .slice(page * pageSize, page * pageSize + pageSize)
          .map((row, index) => {
            return (
              <TableRow component="th" scope="row" padding="none">
              	<TableCell>
              		<Link to={`/cop/${row.id}`}>
                		{row.first_name + ' ' + row.last_name}
                	</Link>
              	</TableCell>
                <TableCell align="center">{row.num_allegations}</TableCell>
                <TableCell align="center">{row.num_complaints}</TableCell>
                <TableCell>{row.cop_details}</TableCell>
              </TableRow>
            );
          })
        }
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
    </div>
  );
}
