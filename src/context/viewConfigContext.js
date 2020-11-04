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
	console.log('1')
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
		setPageSize,
		innerContext,
		setInnerContext }

	useEffect(() => {
		console.log('innerContext changed');
		setInnerContext(innerContext)
	}, [innerContext])

	console.log(innerContext)

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