import React from 'react';
import { Button } from './components/button';
import { DropDown } from './components/dropdown';
import { SearchBar } from './components/searchBar';
import { Pagination } from './components/pagination';
import { useCommandUnits } from './context/commandUnitsContext';
import { values } from 'lodash'

export const CommandUnitsTable = props => {
	const { commandUnits, settings } = useCommandUnits()
	const { page,
					setPage, 
					pageSize,
					setPageSize, 
					order,
					setOrder, 
					orderBy,
					setOrderBy, 
					pageSizeOptions, 
					orderByOptions, 
					toggleOrder,
					total } = settings

	function orderByHandler(v) {
		setOrderBy(orderByOptions[v])
	}

	function currentPageHandler(v) {
		setPage(v+1)
	}

	function handlePageSizeChange(v) {
    setPageSize(pageSizeOptions[v]);
  };

	return (
		<div>
			<Button display={order === 'ASC' ? 'DESC' : 'ASC'} handler={toggleOrder}/>
			<DropDown options={orderByOptions} handler={orderByHandler} value={orderBy.id}/>			
			<table>
				<caption>Command Units Table</caption>
				<thead>
					<tr>
						<th>Full Name</th>
						<th>Abbreviation</th>
						<th>Associated Precinct</th>
						<th>Number of Allegations</th>
					</tr>		
				</thead>
				<tbody>
					{commandUnits.map(entry => (
						<tr>
							<td>
								{entry.command_unit_full != null ? entry.command_unit_full : entry.unit_id }
							</td>
							<td>
								{entry.unit_id ? entry.unit_id : null}
							</td>
							<td>
								{entry.precinct != 'null' ? entry.precinct : ''}
							</td>
							<td>
								{entry.num_allegations}
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
			/>
		</div>
	)
}