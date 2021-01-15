import React, {useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom'
import { values, orderBy, filter } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from './components/button';
import { DropDown } from './components/dropdown';
import { useCops } from './context/copsContext';
import { SearchBar } from './components/searchBar';
import { Pagination } from './components/pagination';

const useStyles = makeStyles(theme => ({
	table: {
		fontFamily: theme.typography.fontFamily
		//borderCollapse: "collapse"
	},
	thead: {
		backgroundColor: theme.palette.background.secondary
	}
}))

export const CopsTable = props => {

	const classes = useStyles()

	const { cops, total, setCopsViewConfig, getCopsViewConfig } = useCops()

	const viewConfig = getCopsViewConfig()

	const {
		order,
		orderBy,
		page,
		pageSize,
		orderByOptions,
		pageSizeOptions
	} = viewConfig
	
	//cops is an object of 'cop' objects with their id's as keys
	const { setSearchResults } = props
	
	let copsTableSorted = cops

	function orderByHandler(v) {
		setCopsViewConfig({
			...viewConfig,
			orderBy: orderByOptions[v]
		})
	}

	function currentPageHandler(v) {
		setCopsViewConfig({
			...viewConfig,
			page: v + 1
		})	
	}

	function handlePageSizeChange(v) {
		setCopsViewConfig({
			...viewConfig,
			pageSize: pageSizeOptions[v]
		})
  };

  function toggleOrder() {
  	setCopsViewConfig({
  		...viewConfig,
  		order: order === 'asc' ? 'desc' : 'asc'
  	})
  }

  let history = useHistory()

  const model = 'cops'
  
	function search(v) {
		history.push(`/search/model=${model}?searchquery=${v}`)
	}

	const placeHolder = 'search by first or last name, full name, or badge #'

	return (
		<div>
			<SearchBar handler={search} placeHolder={placeHolder}/>
			<Button display={order === 'ASC' ? 'DESC' : 'ASC'} handler={toggleOrder}/>
			<DropDown options={orderByOptions} handler={orderByHandler} value={orderBy.id}/>
			<table className={classes.table}>
				<caption>Cops Table</caption>
				<thead className={classes.thead}>
					<tr>
						<th>name</th>
						<th>command unit</th>
						<th>badge number</th>
						<th>number of allegations</th>
						<th>allegations substantiated</th>
						<th>ethnicity</th>
					</tr>
				</thead>
				<tbody>
					{values(copsTableSorted).map(entry => (
						<tr>
							<td>
								<Link to={`/cop/${entry.id}`}>{`${entry.first_name} ${entry.last_name}`}</Link>
							</td>
							<td>
								{`${entry.command_unit_full ? entry.command_unit_full : entry.command_unit }`}
							</td>
							<td style={{textAlign: "center"}}>
								{entry.shield_no > 0 ? entry.shield_no : null}
							</td>
							<td style={{textAlign: "center"}}>
								{`${entry.num_allegations}`}
							</td>
							<td style={{textAlign: "center"}}>
								{`${entry.num_substantiated}`}
							</td>
							<td>
								{`${entry.ethnicity}`}
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