import React, { useContext, createContext, useState, useEffect } from 'react';
import { useViewConfig } from './viewConfigContext'

const CopsContext = createContext();

export const useCops = () => {
	const ctx = useContext(CopsContext);
	if (ctx === undefined) {
		throw new Error('you need to call useCops inside of CopsProvider')
	}
	return ctx
}

export const CopsProvider = (props) => {
	console.log('2')

	const { viewConfig } = useViewConfig();
	const { order, 
		setOrder, 
		toggleOrder,
		page,
		setPage,
		orderBy,
		setOrderBy,
		pageSize,
		setPageSize,
		innerContext,
		setInnerContext } = viewConfig

	setInnerContext('cops')

	const [cops, setCops] = useState(null)

	//make sure to use .value to access the actual value of pageSize
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

	const orderByOptions = [
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

	//get the total number of rows in order to populate
	//paginate component
	const [total, setTotal] = useState(0)

	useEffect(() => {
		fetch(`/total_rows/table=cops`)
		.then(result => result.json())
		.then(total => setTotal(total[0].rows))
	}, [])

	useEffect(() => {
		if (order && page && orderBy && pageSize) {
		  fetch(`/cops/orderBy=${orderBy.value}/order=${order}/page=${page}/pageSize=${pageSize.value}`)
		  .then(result => result.json())
		  .then(cops => setCops(cops))
		}
  }, [page, pageSize, orderBy, order])

	const copsConfig = { cops, total, page, setPage, pageSize, setPageSize, pageSizeOptions, orderBy, setOrderBy, orderByOptions, order, setOrder, toggleOrder }

	const copsViewConfig = { total, page, setPage, pageSize, setPageSize, pageSizeOptions, orderBy, setOrderBy, orderByOptions, order, setOrder, toggleOrder }

	useEffect(() => {
		const loadedCopsViewConfig = window.sessionStorage.getItem('copsViewConfig')
		if (loadedCopsViewConfig) {
			const viewConfig = JSON.parse(loadedCopsViewConfig)
			setOrder(viewConfig.order)
			setPage(viewConfig.page)
			setOrderBy(viewConfig.orderBy)
			setPageSize(viewConfig.pageSize)
		} else {
			setOrder('DESC')
			setPage(1)
			setOrderBy(orderByOptions[0])
			setPageSize(pageSizeOptions[0])
		}
	}, [])

	useEffect(() => {
		window.sessionStorage.setItem('copsViewConfig', JSON.stringify(copsViewConfig))
	}, [copsViewConfig])

	return (
		<CopsContext.Provider value={{copsConfig}}>
			{ cops && order ? props.children : null}
		</CopsContext.Provider>
	)
}