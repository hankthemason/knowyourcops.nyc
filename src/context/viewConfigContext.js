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

	const [innerContext, setInnerContext] = useState()
	const [order, setOrder] = useState('DESC')
	const [page, setPage] = useState(1)

	const toggleOrder = () => {
		setOrder(order === 'ASC' ? 'DESC' : 'ASC')
	}

	const [orderBy, setOrderBy] = useState(null)

	const [pageSize, setPageSize] = useState(null)

	const viewConfig = { order, 
		setOrder, 
		toggleOrder,
		page,
		setPage,
		orderBy,
		setOrderBy,
		pageSize,
		setPageSize }

	// useEffect(() => {
	// 	const loadedViewConfig = window.sessionStorage.getItem('viewConfig');
	// 	if (loadedViewConfig) {
	// 		console.log('loaded')
	// 		const viewConfig = JSON.parse(loadedViewConfig)
	// 		//setOrder(viewConfig.order)
	// 	} else {
	// 		console.log('no loaded view config')
	// 		//setOrder('DESC')
	// 	}
	// }, [])

	// useEffect(() => {
	// 	window.sessionStorage.setItem('viewConfig', JSON.stringify(viewConfig))
	// }, [viewConfig])

	

	return (
		<ViewConfigContext.Provider value={{viewConfig}}>
			{ props.children }
		</ViewConfigContext.Provider>
	)
}