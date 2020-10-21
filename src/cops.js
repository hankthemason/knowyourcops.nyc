import React, {useState, useEffect} from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link, 
	useHistory
} from 'react-router-dom'
//the 'values' method returns an array(keys are arbitrary/autoincremented)
import { values, orderBy, filter } from 'lodash';
import { Button } from './components/button';
import { DropDown } from './components/dropdown';
import { Pagination } from './components/pagination';
import { useViewConfig } from './context/viewConfig';
import { SearchBar } from './components/searchBar';

export const CopsTable = props => {

	const { config } = useViewConfig()
	
	const { orderDirection, 
					toggleOrderDirection, 
					currentPage, 
					setCurrentPage, 
					orderByOption, 
					setOrderByOption,
					orderOptions,
					itemsPerPage,
					setItemsPerPage,
					pageSizeOptions } = config

	//cops is an object of 'cop' objects with their id's as keys
	const { cops, setSearchResults } = props

	let sliceBegin = (currentPage - 1) * itemsPerPage.value;
	let sliceEnd = sliceBegin + itemsPerPage.value;
	
	let copsTableSorted = orderBy(cops, orderByOption.value, orderDirection.toLowerCase());

	function orderHandler(v) {
		setOrderByOption(orderOptions[v])
	}

	function currentPageHandler(v) {
		setCurrentPage(v+1)
	}

	function handlePageSizeChange(v) {
    setItemsPerPage(pageSizeOptions[v]);
  };

  let history = useHistory()

  function search(v) {
  	let results = filter(cops, function(e) {
  		return e.last_name.toLowerCase() === v.toLowerCase() ||
  			e.first_name.toLowerCase() === v.toLowerCase();
  	})
  	if (results) {
  		setSearchResults(results);
	  	history.push(`/search?keyword=${v}`);
		}
  }

	return (
		<div>
			<Button display={orderDirection === 'ASC' ? 'DESC' : 'ASC'} handler={toggleOrderDirection}/>
			<DropDown options={orderOptions} handler={orderHandler} value={orderByOption.id}/>
			<SearchBar handler={search}/> 
			<table>
				<caption>Cops Table</caption>
				<thead>
					<tr>
						<th>name</th>
						<th>command unit</th>
						<th>number of allegations</th>
						<th>allegations substantiated</th>
						<th>ethnicity</th>
					</tr>
				</thead>
				<tbody>
					{values(copsTableSorted).slice(sliceBegin, sliceEnd).map(entry => (
						<tr>
							<td>
								<Link to={`/cop/${entry.id}`}>{`${entry.first_name} ${entry.last_name}`}</Link>
							</td>
							<td>
								{`${entry.command_unit_full ? entry.command_unit_full : entry.command_unit }`}
							</td>
							<td>
								{`Allegations: ${entry.num_allegations}`}
							</td>
							<td>
								{`Substantiated: ${entry.num_substantiated}`}
							</td>
							<td>
								{`Ethnicity: ${entry.ethnicity}`}
							</td>
						</tr>
						)
					)}
				</tbody>
			</table>
			<div className="">
        {"Items per Page: "}
        <DropDown 
        	id="itemsPerPageDropdown"
        	options={pageSizeOptions}
        	handler={handlePageSizeChange}
        	value={itemsPerPage.id}
        />
      </div>
			<Pagination 
				data={values(copsTableSorted)} 
				itemsPerPage={itemsPerPage.value}
				handler={currentPageHandler}
			/>
		</div>
	)
}