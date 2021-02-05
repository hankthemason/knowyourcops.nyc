import React, { useContext, createContext, useState, useEffect } from 'react';
import { useViewConfig } from './viewConfigContext';
import { DefaultViewConfig } from '../types/default';

const CopsContext = createContext();

export const useCops = () => {
	const ctx = useContext(CopsContext);
	if (ctx === undefined) {
		throw new Error('you need to call useCops inside of CopsProvider')
	}
	return ctx
}

export const CopsProvider = (props) => {

	const viewConfigName = 'copsViewConfig';

	const componentName = 'cops'

	const { setViewConfig, getViewConfig, getCurrentView } = useViewConfig();

	let currentView = getCurrentView()

	const setCopsViewConfig = (viewConfig) => setViewConfig({[viewConfigName]: viewConfig}, componentName)

	const getCopsViewConfig = () => {
		return getViewConfig(viewConfigName)
	}

	useEffect(() => {
		//case 1: you are navigating from a different part of the site (so far there are 3)
		//case 2: no viewConfig has been made yet and you need the default
		if (currentView != componentName || getCopsViewConfig() === undefined) {
			setCopsViewConfig({
				...DefaultViewConfig,
				orderBy: {
						id: 0,
						title: 'Number of Allegations',
						value: 'num_allegations'
					},
				orderByOptions: [
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
			})
		}
	}, [])

	const viewConfigExists = getCopsViewConfig() != undefined

	const [cops, setCops] = useState(null)

	//get the total number of rows in order to populate
	//paginate component
	const [total, setTotal] = useState(0)

	// maybe don't do a fetch every time to get the total number of rows?
	useEffect(() => {
		fetch(`/api/total_rows?table=cops`)
		.then(result => result.json())
		.then(total => setTotal(total[0].rows))
	}, [])

	const viewConfig = getCopsViewConfig()
	
	useEffect(() => {
		if (viewConfigExists && currentView === componentName) {
		  fetch(`/api/cops?orderBy=${viewConfig.orderBy.value}&order=${viewConfig.order}&page=${viewConfig.page}&pageSize=${viewConfig.pageSize.value}`)
		  .then(result => result.json())
		  .then(cops => setCops(cops))
		}		 
  }, [viewConfig])

	const copsConfig = { cops, total, setCopsViewConfig, getCopsViewConfig }

	//console.log(viewConfig)

	//const copsViewConfig = { total, page, setPage, pageSize, setPageSize, pageSizeOptions, orderBy, setOrderBy, orderByOptions, order, setOrder, toggleOrder }

	// useEffect(() => {
	// 	const loadedCopsViewConfig = window.sessionStorage.getItem('copsViewConfig')
	// 	if (loadedCopsViewConfig) {
	// 		const viewConfig = JSON.parse(loadedCopsViewConfig)
	// 		setOrder(viewConfig.order)
	// 		setPage(viewConfig.page)
	// 		setOrderBy(viewConfig.orderBy)
	// 		setPageSize(viewConfig.pageSize)
	// 	} else {
	// 		setOrder('DESC')
	// 		setPage(1)
	// 		setOrderBy(orderByOptions[0])
	// 		setPageSize(pageSizeOptions[0])
	// 	}
	// }, [])

	// useEffect(() => {
	// 	window.sessionStorage.setItem('copsViewConfig', JSON.stringify(copsViewConfig))
	// }, [copsViewConfig])

	return (
		<CopsContext.Provider value={copsConfig}>
			{ cops && viewConfigExists ? props.children : null}
		</CopsContext.Provider>
	)
}