import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import { Button } from './components/button';
import { DropDown } from './components/dropdown';
import { SearchBar } from './components/searchBar';
import { Pagination } from './components/pagination';
import { useCommandUnits } from './context/commandUnitsContext';

const useStyles = makeStyles(theme => ({
	table: {
		fontFamily: theme.typography.fontFamily
		//borderCollapse: "collapse"
	},
	thead: {
		backgroundColor: theme.palette.background.secondary
	}
}))

export const CommandUnitsTable = props => {

	const { commandUnits, 
					total, 
					setCommandUnitsViewConfig, 
					getCommandUnitsViewConfig } = useCommandUnits()

	const viewConfig = getCommandUnitsViewConfig();

	const {
		order,
		orderBy,
		page,
		pageSize,
		orderByOptions,
		pageSizeOptions
	} = viewConfig

	function orderByHandler(v) {
		setCommandUnitsViewConfig({
			...viewConfig,
			orderBy: orderByOptions[v]
		})
	}

	function currentPageHandler(v) {
		setCommandUnitsViewConfig({
			...viewConfig,
			page: v + 1
		})
	}

	function handlePageSizeChange(v) {
    setCommandUnitsViewConfig({
			...viewConfig,
			pageSize: pageSizeOptions[v]
		});
  };

  function toggleOrder() {
  	setCommandUnitsViewConfig({
  		...viewConfig,
  		order: order === 'asc' ? 'desc' : 'asc'
  	})
  }

  let history = useHistory()

  const model = 'commandUnits'

  function search(v) {
		history.push(`/search/model=${model}?searchquery=${v}`);
	}

	return (
		<div>
			<Button display={order === 'ASC' ? 'DESC' : 'ASC'} handler={toggleOrder}/>
			<DropDown options={orderByOptions} handler={orderByHandler} value={orderBy.id}/>	
			<SearchBar handler={search} placeHolder='search for a command unit'/> 		
			<table>
				<caption>Command Units Table</caption>
				<thead className={useStyles().thead}>
					<tr>
						<th>Full Name</th>
						<th>Abbreviation</th>
						<th>Associated Precinct</th>
						<th>Number of Allegations</th>
					</tr>		
				</thead>
				<tbody>
					{commandUnits.map(entry => (
						entry.command_unit_full || entry.unit_id ? (
							<tr>
								<td>
									<Link to={`/command_unit/${entry.id}`}>
										{entry.command_unit_full != null ? entry.command_unit_full : entry.unit_id }
									</Link>
								</td>
								<td>
									{entry.unit_id ? entry.unit_id : null}
								</td>
								<td style={{textAlign: "center"}}>
									{entry.precinct != 'null' ? entry.precinct : ''}
								</td>
								<td style={{textAlign: "center"}}>
									{entry.num_allegations}
								</td>
							</tr>
						) : null
					))}
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