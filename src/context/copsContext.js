import React, { useContext, createContext, useState, useEffect } from 'react';
import { useViewConfig } from './viewConfig';

const CopsContext = createContext();

export const useCops = () => {
	const ctx = useContext(CopsContext);
	if (ctx === undefined) {
		throw new Error('you need to call useCops inside of CopsProvider')
	}
	return ctx
}

export const CopsProvider = (props) => {

	const [cops, setCops] = useState(null);

	const [page, setPage] = useState(1);

	//make sure to use .value to access the actual value of pageSize
	const pso = [
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

	const [pageSize, setPageSize] = useState(pso[0]);

	const oo = [
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

	const [orderBy, setOrderBy] = useState(oo[0])

	const [order, setOrder] = useState('DESC')

	const toggleOrder = () => {
		setOrder(order === 'ASC' ? 'DESC' : 'ASC')
	}

	//get the total number of rows in order to populate
	//paginate component
	const [total, setTotal] = useState(0)

	useEffect(() => {
		fetch(`/total_rows`)
		.then(result => result.json())
		.then(total => setTotal(total[0].rows))
	}, [])

	useEffect(() => {
    fetch(`/cops/orderBy=${orderBy.value}/order=${order}/page=${page}/pageSize=${pageSize.value}`)
    .then(result => result.json())
    .then(cops => setCops(cops))
  }, [page, pageSize, orderBy, order])

	const copsConfig = { cops, total, page, setPage, pageSize, setPageSize, pso, orderBy, setOrderBy, oo, order, setOrder, toggleOrder }

	const copsViewConfig = { total, page, setPage, pageSize, setPageSize, pso, orderBy, setOrderBy, oo, order, setOrder, toggleOrder }

	// useEffect(() => {
	// 	const loadedViewConfig = window.sessionStorage.getItem('viewConfig')
	// 	if (loadedViewConfig) {
	// 		const viewConfig = JSON.parse(loadedViewConfig)
	// 		setOrder(viewConfig.order)
	// 		setPage(viewConfig.page)
	// 		setOrderBy(viewConfig.orderBy)
	// 		setPageSize(viewConfig.pageSize)
	// 	}
	// }, [])

	// useEffect(() => {
	// 	window.sessionStorage.setItem('copsConfig', JSON.stringify(copsViewConfig))
	// }, [copsViewConfig])

	return (
		<CopsContext.Provider value={{copsConfig}}>
			{props.children}
		</CopsContext.Provider>
	)
}