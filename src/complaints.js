import React, {useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom'
//the 'values' method returns an array(keys are arbitrary/autoincremented)
import { values, orderBy, filter } from 'lodash';
import moment from 'moment';
import { Button } from './components/button';
import { DropDown } from './components/dropdown';
import { useCops } from './context/copsContext';
import { SearchBar } from './components/searchBar';
import { Pagination } from './components/pagination';
import { useComplaints } from './context/complaintsContext';
import { monthNames } from './types/monthNames'

export const ComplaintsTable = () => {

	const { complaints, total, setComplaintsViewConfig, getComplaintsViewConfig } = useComplaints()

	const viewConfig = getComplaintsViewConfig()

	const { order,
					orderBy,
					page,
					pageSize,
					orderByOptions,
					pageSizeOptions } = viewConfig

	let complaintsTableSorted = complaints

	function orderByHandler(v) {
		setComplaintsViewConfig({
			...viewConfig,
			orderBy: orderByOptions[v]
		})
	}

	function currentPageHandler(v) {
		setComplaintsViewConfig({
			...viewConfig,
			page: v + 1
		})	
	}

	function handlePageSizeChange(v) {
		setComplaintsViewConfig({
			...viewConfig,
			pageSize: pageSizeOptions[v]
		})
  };

  function toggleOrder() {
  	console.log(order)
  	setComplaintsViewConfig({
  		...viewConfig,
  		order: order === 'asc' ? 'desc' : 'asc'
  	})
  }

  let history = useHistory()

  let model = 'complaints'
  
	// function search(v) {
	// 	history.push(`/search/model=${model}?searchquery=${v}`);
	// }

	return (
		<div>
			<Button display={order === 'asc' ? 'DESC' : 'ASC'} handler={toggleOrder}/>
			<DropDown options={orderByOptions} handler={orderByHandler} value={orderBy.id}/>
			{
			//<SearchBar handler={search} placeHolder='search for a cop'/>
			}
			<table style={{width: "100%"}}>
				<caption>Complaints Table</caption>
				<thead>
					<tr>
						<th>Date Received</th>
						<th>Date Closed</th>
						<th>Associated Precinct</th>
						<th>Number of Allegations on Complaint</th>
					</tr>
				</thead>
				<tbody>
					{values(complaintsTableSorted).map(entry => (
						<tr>
							<td>
								<Link to={`/complaint/${entry.id}`}>
									{monthNames[moment(entry.date_received).month()]} {moment(entry.date_received).year()}
								</Link>
							</td>
							<td>
								{monthNames[moment(entry.date_closed).month()]} {moment(entry.date_closed).year()}
							</td>
							<td style={{textAlign: "center"}}>
								{`${entry.precinct}`}
							</td>
							<td style={{textAlign: "center"}}>
								{`${entry.num_allegations}`}
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
        	value={pageSize.id}
        />
      </div>
			<Pagination 
				data={total} 
				itemsPerPage={pageSize.value}
				handler={currentPageHandler}
				forcePage={page}
			/>
		</div>
	)
}