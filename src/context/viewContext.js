import React, { useContext, createContext } from 'react';

const ViewConfigContext = createContext();

export const useViewConfig = () => {
	const ctx = useContext(ViewConfigProvider);
	if (ctx === undefined) {
		throw new Error ('you need to call useViewConfig inside of ViewConfigProvider')
	}
	return ctx
}

export const ViewConfigProvider = props => {
	const viewConfig = {}


	return (
		<ViewConfigContext.Provider value={{viewConfig}}>
			{ props.children }
		</ViewConfigContext.Provider>
	)
}