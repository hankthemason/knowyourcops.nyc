import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import { Button } from './components/button';
import { DropDown } from './components/dropdown';
import { SearchBar } from './components/searchBar';
import { Pagination } from './components/pagination';
import { useCommandUnits } from './context/commandUnitsContext';
import { useViewport } from './customHooks/useViewport'
import { CommandUnitsTableComponent } from './components/commandUnitsTableComponent'

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

	const { width } = useViewport()

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

	const placeHolder = 'search for unit by name or precinct number'

	const desktopHeaders = [
			{label: 'name',
				type: 'text'},
			{label: 'abbreviation',
				type: 'text'},
			{label: 'associated precinct',
				type: 'numeric'},
			{label: 'no. allegations',
				type: 'numeric'},
			{label: 'allegations substantiated',
				type: 'numeric'}
	]

	const mobileHeaders = [
			{label: 'name',
				type: 'text'},
			{label: 'abbreviation',
				type: 'text'},
			{label: 'associated precinct',
				type: 'numeric'},
			{label: 'no. allegations',
				type: 'numeric'}
	]

	const headerClasses = {
		text: 'text-header',
		numeric: 'num-header'
	}

	return (
		<div className='page-container'>
			<SearchBar handler={search} placeHolder={placeHolder}/> 
			<h1 className='table-title'>Command Units with Allegations</h1>
			<div className='sort-div'>Sort by: </div>
			<DropDown options={orderByOptions} handler={orderByHandler} value={orderBy.id}/>
			<Button display={order === 'ASC' ? 'DESC' : 'ASC'} handler={toggleOrder}/>
			<CommandUnitsTableComponent 
				headers={width < 760 ? mobileHeaders : desktopHeaders}  
				headerClasses={headerClasses}
				data={commandUnits}
				view={width < 760 ? 'mobile' : 'desktop'}
			/>
		<div className="pagination-text">
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