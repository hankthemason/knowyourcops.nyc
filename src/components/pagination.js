import React, {useState} from 'react';
import ReactPaginate from 'react-paginate';
import { useCops } from '../context/copsContext';
import { useViewConfig } from '../context/viewConfigContext'
import { useViewport } from '../customHooks/useViewport'

export const Pagination = props => {

	//const { copsConfig } = useCops();
	const { viewConfig } = useViewConfig();

	const { forcePage } = props

	const { width } = useViewport()

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
			<ReactPaginate 
        previousLabel={"prev"}
        nextLabel={"next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={numPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={width > 760 ? 5 : 2}
        onPageChange={handleChange}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
        forcePage={forcePage-1}
        />
		</div>
	)
}