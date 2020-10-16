import React, { useContext, createContext, useState, useEffect } from 'react';

const ViewConfigContext = createContext();

export const useViewConfig = () => {
	const ctx = useContext(ViewConfigContext)
	if (ctx === undefined) {
		throw new Error('you need to call useViewConfig inside of ViewConfigProvider')
	} 
	return ctx
}

export const ViewConfigProvider = (props) => {
	//add all viewConfig state here
	const [orderDirection, setOrderDirection] = useState('DESC')

	const [currentPage, setCurrentPage] = useState(1);
	
	const orderOptions = [
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

	const [orderByOption, setOrderByOption] = useState(orderOptions[0]);

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

	const [itemsPerPage, setItemsPerPage] = useState(pageSizeOptions[0]);

	const toggleOrderDirection = () => {
		setOrderDirection(orderDirection === 'ASC' ? 'DESC' : 'ASC')
	}

	//compile view state into config object
	const config = { orderDirection, toggleOrderDirection, currentPage, setCurrentPage, orderByOption, setOrderByOption, orderOptions, itemsPerPage, setItemsPerPage, pageSizeOptions  }
	
	useEffect(() => {
		const loadedViewConfig = window.sessionStorage.getItem('viewConfig')
		if (loadedViewConfig) {
			const viewConfig = JSON.parse(loadedViewConfig)
			setOrderDirection(viewConfig.orderDirection)
			setCurrentPage(viewConfig.currentPage)
			setOrderByOption(viewConfig.orderByOption)
			setItemsPerPage(viewConfig.itemsPerPage)
		}
	}, [])

	useEffect(() => {
		window.sessionStorage.setItem('viewConfig', JSON.stringify(config))
	}, [config])


	return <ViewConfigContext.Provider value={{config}}>
					{props.children}
				 </ViewConfigContext.Provider> 
}
