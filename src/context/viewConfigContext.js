import React, { useContext, 
								createContext,
								useState,
								useEffect } from 'react';

const ViewConfigContext = createContext();

export const useViewConfig = () => {
	const ctx = useContext(ViewConfigContext);
	if (ctx === undefined) {
		throw new Error ('you need to call useViewConfig inside of ViewConfigProvider')
	}
	return ctx
}

export const ViewConfigProvider = props => {
	const [order, setOrder] = useState('DESC')
	const [page, setPage] = useState(1)

	const toggleOrder = () => {
		setOrder(order === 'ASC' ? 'DESC' : 'ASC')
	}

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
			title: 'Command Unit Name',
			value: 'unit_id'
		},
		{
			id: 2,
			title: 'Associated Precinct',
			value: 'precinct'
		},
		{
			id: 3,
			title: 'Number of Complaints',
			value: 'num_complaints'
		}
	]

	const [orderBy, setOrderBy] = useState(orderByOptions[0])

	const [pageSize, setPageSize] = useState(pageSizeOptions[0])

	const viewConfig = { order, 
		setOrder, 
		toggleOrder,
		page,
		setPage,
		orderBy,
		setOrderBy,
		orderByOptions,
		pageSize,
		setPageSize,
		pageSizeOptions }

	useEffect(() => {
		const loadedViewConfig = window.sessionStorage.getItem('viewConfig');
		if (loadedViewConfig) {
			const viewConfig = JSON.parse(loadedViewConfig)
			setOrder(viewConfig.order)
		} else {
			setOrder('DESC')
		}
	}, [])

	useEffect(() => {
		window.sessionStorage.setItem('viewConfig', JSON.stringify(viewConfig))
	}, [viewConfig])

	

	return (
		<ViewConfigContext.Provider value={{viewConfig}}>
			{ props.children }
		</ViewConfigContext.Provider>
	)
}