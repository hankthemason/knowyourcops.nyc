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

	const [config, setConfig] = useState({})

	//component config is an object that might look like this:
	//	{ componentName: {
	//			componentState1: 'state',
	//			componentState2: 'state'
	//		}	
	//	}
	const setViewConfig = componentConfig => {
		setConfig({
			...config,
			...componentConfig,
		})
	}

	const getViewConfig = componentConfig => {
		return config[componentConfig]
	}

	console.log(config)

	const viewConfig = { setViewConfig, getViewConfig }

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
		<ViewConfigContext.Provider value={viewConfig}>
			{ props.children }
		</ViewConfigContext.Provider>
	)
}