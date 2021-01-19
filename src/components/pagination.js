import React, {useState} from 'react';
import ReactPaginate from 'react-paginate';
import { useCops } from '../context/copsContext';
import { useViewConfig } from '../context/viewConfigContext'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	pagination: {
		'.li & .active': {
			a: {
				backgroundColor: theme.palette.background.secondary
			}
		}
	}
}))

export const Pagination = props => {

	const classes = useStyles()
	//const { copsConfig } = useCops();
	const { viewConfig } = useViewConfig();

	const { forcePage } = props

	//let currPage = viewConfig.page

	//let currentPage = copsConfig.page

	const numPages = Math.ceil(props.data / props.itemsPerPage);

	let numbers = [];
	for (var i = 0; i<numPages; i++) {
		numbers.push(i)
	}

	function handleChange(event) {
		props.handler(event.selected)
	}
	

	return (
		<div>
			<p>
				{"Page :"}
			</p>
			<ReactPaginate className={classes.pagination}
        previousLabel={"prev"}
        nextLabel={"next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={numPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handleChange}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
        forcePage={forcePage-1}
        />
		</div>
	)
}