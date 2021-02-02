import React, {useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom'
import { values, orderBy, filter } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from './components/button';
import { DropDown } from './components/dropdown';
import { useCops } from './context/copsContext';
import { SearchBar } from './components/searchBar';
import { Pagination } from './components/pagination';
import { useViewport } from './customHooks/useViewport'
import { CopsTableComponent } from './components/copsTableComponent'

const useStyles = makeStyles(theme => ({
	mainTable: {
		fontFamily: theme.typography.fontFamily
		//borderCollapse: "collapse"
	},
	thead: {
		backgroundColor: theme.palette.primary.main,
		color: 'white'
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
	
	const { width } = useViewport()
	

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

	const desktopHeaders = [
			{label: 'name',
				type: 'text'},
			{label: 'cmd unit',
				type: 'text'},
			{label: 'badge#',
				type: 'numeric'},
			{label: 'allegations',
				type: 'numeric'},
			{label: 'allegations substantiated',
				type: 'numeric'},
			{label: 'ethnicity',
				type: 'text'},
	]

	const mobileHeaders = [
			{label: 'name',
				type: 'text'},
			{label: 'cmd unit',
				type: 'text'},
			{label: 'badge#',
				type: 'numeric'},
			{label: 'allegations'}
	]

	const headerClasses = {
		text: 'text-header',
		numeric: 'num-header'
	}

	return (
		<div className='page-container'>
			<SearchBar handler={search} placeHolder={placeHolder}/>
			<h1 className='table-title'>Officers with Allegations</h1>
			<div className='sort-div'>Sort by: </div>
			<DropDown style={{display: 'inline-block'}} options={orderByOptions} handler={orderByHandler} value={orderBy.id}/>
			<Button style={{display: 'inline-block'}} display={order === 'asc' ? 'DESC' : 'ASC'} handler={toggleOrder}/>
			<div style={{maxWidth: '100%', overflow: 'scroll'}}>
				<CopsTableComponent
					classes={classes} 
					headers={width < 760 ? mobileHeaders : desktopHeaders} 
					headerClasses={headerClasses}
					data={copsTableSorted}
					view={width < 760 ? 'mobile' : 'desktop'}
				/>
			</div>
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