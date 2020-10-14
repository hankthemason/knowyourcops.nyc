import React, {useState} from 'react';
import ReactPaginate from 'react-paginate'

export const PageNumbers = props => {
	const numPages = Math.ceil(props.data.length / props.itemsPerPage);
	
	let numbers = [];
	for (var i = 0; i<numPages; i++) {
		numbers.push(i)
	}

	function handleClick(event) {
		console.log(event)
		props.handler(event.selected)
	}
	

	return (
		<div>
			<p>
				page:
			</p>
			<ReactPaginate
        previousLabel={"prev"}
        nextLabel={"next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={numPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handleClick}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}/>
		</div>
	)
}