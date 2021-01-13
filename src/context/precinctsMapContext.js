import React, 
	{useContext,
		createContext, 
		useEffect, 
		useState,} from 'react'

const PrecinctsMapContext = createContext()

export const usePrecinctsMap = () => {
	const ctx = useContext(PrecinctsMapContext);
	if (ctx === undefined) {
		throw new Error('you need to call usePrecinctsMap inside of PrecinctsMapProvider')
	}
	return ctx
}

export const PrecinctsMapProvider = props => {

	const [ mapData, setMapData ] = useState(null)

	const [ commandUnits, setCommandUnits ] = useState(null)

	useEffect(() => {
		fetch('/map')
		.then(result => result.json())
		.then(mapData => setMapData(mapData))

		fetch('/command_units')
		.then(result => result.json())
		.then(commandUnits => setCommandUnits(commandUnits))
	}, [])

	if (mapData) {
		mapData.features.map(e => {
			e.properties.precinctString = e.properties.precinct.toString().padStart(3, '0') + " PCT"
		})
	}

	return (
		<PrecinctsMapContext.Provider value={{mapData, commandUnits}}>
		
			{ mapData && commandUnits ? props.children : null }
			
		</PrecinctsMapContext.Provider>
	)
}