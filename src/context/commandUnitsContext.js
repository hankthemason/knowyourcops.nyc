import React, { useContext, 
								createContext, 
								useState, 
								useEffect } from 'react';
import { reduce } from 'lodash';
import { DefaultViewConfig } from '../types/default'
import { useViewConfig } from './viewConfigContext'

const CommandUnitsContext = createContext();

export const useCommandUnits = () => {
	const ctx = useContext(CommandUnitsContext);
	if (ctx === undefined) {
		throw new Error ('you need to call useCommandUnits inside of CommandUnitsProvider')
	}
	return ctx
}

export const CommandUnitsProvider = props => {

	const viewConfigName = 'commandUnitsViewConfig';

	const componentName = 'commandUnits'

	const { setViewConfig, getViewConfig, getCurrentView } = useViewConfig();

	let currentView = getCurrentView()

	const setCommandUnitsViewConfig = (viewConfig) => setViewConfig({[viewConfigName]: viewConfig}, componentName)

	const getCommandUnitsViewConfig = () => getViewConfig(viewConfigName)

	useEffect(() => {
		if (currentView != componentName || getCommandUnitsViewConfig() === undefined) {
			setCommandUnitsViewConfig({
				...DefaultViewConfig,
				orderBy: {
						id: 0,
						title: 'Number of Allegations',
						value: 'num_allegations'
					},
				orderByOptions: [
					{
						id: 0,
						title: 'Number of Allegations',
						value: 'num_allegations'
					},
					{
						id: 1,
						title: 'Command Unit Name',
						value: 'command_unit_full'
					},
					{
						id: 2,
						title: 'Associated Precinct',
						value: 'precinct'
					},
					{
						id: 3,
						title: 'Number of Complaints',
						value: 'num_complaints'
					}
				]
			})
		}
	}, [])

	const viewConfigExists = getCommandUnitsViewConfig() != undefined

	const [commandUnits, setCommandUnits] = useState(null);
	
	//get the total number of rows in order to populate
	//paginate component
	const [total, setTotal] = useState(0)

	useEffect(() => {
		fetch(`/api/total_rows?table=commandUnits`)
		.then(result => result.json())
		.then(total => setTotal(total[0].rows))
	}, [])

	const viewConfig = getCommandUnitsViewConfig()

	useEffect(() => {
		if (viewConfigExists && currentView === componentName) {
			fetch(`/api/command_units?orderBy=${viewConfig.orderBy.value}&order=${viewConfig.order}&page=${viewConfig.page}&pageSize=${viewConfig.pageSize.value}`)
			.then(result => result.json())
			.then(commandUnits => {setCommandUnits(commandUnits)})
		}		
	}, [viewConfig])
	
	const commandUnitsConfig = { commandUnits, total, setCommandUnitsViewConfig, getCommandUnitsViewConfig }

	return (
		<CommandUnitsContext.Provider value={commandUnitsConfig}>
			{ commandUnits ? props.children : null}
		</CommandUnitsContext.Provider>
	)
}