import React, {useState, useEffect} from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from 'react-router-dom'
//the 'values' method returns an array(keys are arbitrary/autoincremented)
import { values, orderBy } from 'lodash';
import { Button } from './components/button';
import { DropDown } from './components/dropdown';
import { Pagination } from './components/pagination';

export const CopsTable = props => {
	//cops is an object of 'cop' objects with their id's as keys
	const { cops } = props
	
	//different categories by which to order the CopsTable
	const orderOptions = [
		{
			id: 0,
			title: 'Number of Allegations',
			value: 'num_allegations'
		},
		{
			id: 1,
			title: 'Name',
			value: 'last_name'
		},
		{
			id: 2,
			title: 'Command Unit',
			value: 'command_unit_full'
		},
		{
			id: 3,
			title: 'Number of Substantiated Allegations',
			value: 'num_substantiated'
		}
	]

	const pageSizeOptions = [
		{id: 0,
		 value: 10
		},
		{id: 1,
		 value: 25
		},
		{id: 2,
		 value: 50
		},
		{id: 3,
		 value: 100
		}
	]

	//which of the orderOptions is selected
	const [orderOptionsState, setOrderOptionsState] = useState(orderOptions[0])
	
	//whether the table is ordered ascending(true) or descending(false)
	const [orderDir, setOrderDir] = useState(false);

	//store the table's pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10)
	//let itemsPerPage = 10;
	let sliceBegin = (currentPage - 1) * itemsPerPage;
	let sliceEnd = sliceBegin + itemsPerPage;
	
	
	let copsTableSorted = orderBy(cops, orderOptionsState.value, orderDir ? 'asc' : 'desc');
	let orderDirDisplay = orderDir ? 'desc' : 'asc'

	function orderDirHandler() {
		setOrderDir(!orderDir)
	}

	function orderHandler(v) {
		setOrderOptionsState(orderOptions[v])
	}

	function currentPageHandler(v) {
		setCurrentPage(v+1)
	}

	function handlePageSizeChange(v) {
    setItemsPerPage(pageSizeOptions[v].value);
  };

	return (
		<div>
			<Button display={orderDirDisplay} handler={orderDirHandler}/>
			<DropDown options={orderOptions} handler={orderHandler}/>
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
        	options={pageSizeOptions}
        	handler={handlePageSizeChange} 
        />
      </div>
			<Pagination 
				data={values(copsTableSorted)} 
				itemsPerPage={itemsPerPage}
				handler={currentPageHandler}
			/>
		</div>
	)
}