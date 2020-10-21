import React, { useContext, createContext, useState, useEffect } from 'react';

const CopsContext = createContext();

export const useCops = () => {
	const ctx = useContext(CopsContext);
	if (ctx === undefined) {
		throw new Error('you need to call useCops inside of CopsProvider')
	}
	return ctx
}

export const CopsProvider = (props) => {

	const [cops, setCops] = useState(null)

	useEffect(() => {
    fetch("/cops")
    .then(result => result.json())
    .then(cops => setCops(cops))
  }, [])

	return (
		<CopsContext.Provider value={{cops}}>
			{props.children}
		</CopsContext.Provider>
	)
}