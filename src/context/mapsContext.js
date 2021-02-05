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

	const [ commandUnits, setCommandUnits ] = useState(null)

	useEffect(() => {
		fetch('/api/map')
		.then(result => result.json())
		.then(mapData => setMapData(mapData))

		fetch('/api/command_units_with_precincts')
		.then(result => result.json())
		.then(commandUnits => setCommandUnits(commandUnits))

	}, [])
	
	return (
		 
		<MapsContext.Provider value ={{mapData, commandUnits}}>
			{mapData && commandUnits ? props.children : null}
		</MapsContext.Provider> 
	)
}