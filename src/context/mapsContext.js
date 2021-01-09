import React, 
	{useContext,
		createContext, 
		useEffect, 
		useState } from 'react'

const MapsContext = createContext()

export const useMaps = () => {
	const ctx = useContext(MapsContext);
	if (ctx === undefined) {
		throw new Error('you need to call useMaps inside of MapsProvider')
	}
	return ctx

}

export const MapsProvider = props => {

	const [ mapData, setMapData ] = useState(null)

	useEffect(() => {
		fetch('/map')
		.then(result => result.json())
		.then(mapData => setMapData(mapData))

	}, [])

	return (
		 
		<MapsContext.Provider value ={{mapData}}>
			{mapData ? props.children : null}
		</MapsContext.Provider> 
	)
}