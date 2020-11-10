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

	const { setViewConfig, getViewConfig } = useViewConfig();

	const setCopsViewConfig = (viewConfig) => setViewConfig({[viewConfigName]: viewConfig})

	const getCopsViewConfig = () => getViewConfig(viewConfigName)

	const viewConfigExists = getCopsViewConfig() != undefined

	useEffect(() => {
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
	}, [viewConfigExists]);

	const [cops, setCops] = useState(null)

	//get the total number of rows in order to populate
	//paginate component
	const [total, setTotal] = useState(0)

	useEffect(() => {
		fetch(`/total_rows/table=cops`)
		.then(result => result.json())
		.then(total => setTotal(total[0].rows))
	}, [])

	const viewConfig = getCopsViewConfig()

	useEffect(() => {
		if (viewConfigExists) {
		  fetch(`/cops/orderBy=${viewConfig.orderBy.value}/order=${viewConfig.order}/page=${viewConfig.page}/pageSize=${viewConfig.pageSize.value}`)
		  .then(result => result.json())
		  .then(cops => setCops(cops))
		}		 
  }, [viewConfig])

	const copsConfig = { cops, total, setCopsViewConfig, getCopsViewConfig }

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