import React, { useContext, 
								createContext,
								useState,
								useEffect } from 'react';

const ViewConfigContext = createContext();

export const useViewConfig = () => {
	const ctx = useContext(ViewConfigProvider);
	if (ctx === undefined) {
		throw new Error ('you need to call useViewConfig inside of ViewConfigProvider')
	}
	return ctx
}

export const ViewConfigProvider = props => {
	const [order, setOrder] = useState('DESC')

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

	const viewConfig = { order }

	return (
		<ViewConfigContext.Provider value={{viewConfig}}>
			{ props.children }
		</ViewConfigContext.Provider>
	)
}