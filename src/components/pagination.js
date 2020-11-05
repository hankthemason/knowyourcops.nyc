import React, {useState} from 'react';
import ReactPaginate from 'react-paginate';
import { useCops } from '../context/copsContext';
import { useViewConfig } from '../context/viewConfigContext'

export const Pagination = props => {
	//const { copsConfig } = useCops();
	const { viewConfig } = useViewConfig();

	let currPage = viewConfig.page

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
			<ReactPaginate
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
        forcePage={currPage-1}
        />
		</div>
	)
}