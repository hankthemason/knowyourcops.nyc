import React, 
			{ useContext, 
				createContext, 
				useState, 
				useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useCommandUnits } from './commandUnitsContext';
import { map, range, reduce } from 'lodash'
import { useViewConfig } from './viewConfigContext'
import { DefaultViewConfig } from '../types/default'

const CommandUnitContext = createContext();

export const useCommandUnit = () => {
	const ctx = useContext(CommandUnitContext);
	if (ctx === undefined) {
		throw new Error('you need to call useCommandUnit inside of CommandUnitProvider')
	}
	return ctx
}

const normalizeData = commandUnit => {
	
	commandUnit.complaintsWithAllegations.map(e => {
		e.date_received = new Date(e.date_received)
		e.date_closed = new Date(e.date_closed)
	})

	let yearlyStats = commandUnit.yearlyStats

	if (yearlyStats.length === 1) {
		yearlyStats.splice(0, 0, ({year: yearlyStats[0].year-1, count: 0}))
		yearlyStats.push({year: yearlyStats[1].year+1, count: 0})
	} 

	const allYears = reduce(map(
		yearlyStats ? range(yearlyStats[0].year, yearlyStats[yearlyStats.length-1].year+1) : [], 
			year => {
				const stat = yearlyStats.find(stat => stat.year === year)
				return stat ? stat : {year, count: 0}
			} 
		), (accumulator, value) => {
			return {...accumulator, [value.year]: value.count}
		}, {}
	)

	return {
		...commandUnit, 
		yearlyStats: allYears,
	}
}

export const CommandUnitProvider = (props) => {

	const { id } = useParams();

	const viewConfigName = `commandUnit${id}ViewConfig`

	const { setViewConfig, getViewConfig } = useViewConfig()

	const setCommandUnitViewConfig = (viewConfig) => setViewConfig({[viewConfigName]: viewConfig})
	const getCommandUnitViewConfig = () => getViewConfig(viewConfigName)

	const [commandUnit, setCommandUnit] = useState();

	const viewConfigExists = getCommandUnitViewConfig != undefined

	const viewConfig = getCommandUnitViewConfig()

	const viewConfigPopulated = viewConfig != undefined && 
															viewConfig.hasOwnProperty('order') &&
															viewConfig.hasOwnProperty('orderBy') &&
															viewConfig.hasOwnProperty('page') &&
															viewConfig.hasOwnProperty('pageSize')

	useEffect(() => {
			if (viewConfigPopulated) return
			setCommandUnitViewConfig({
				...DefaultViewConfig,
				page: 0,
				pageSize: 10,
				orderBy: {
						id: 0,
						title: 'Date Received',
						value: 'date_received'
					},
				orderByOptions: [
					{
						id: 0,
						title: 'Date Received',
						value: 'date_received'
					},
					{
						id: 1,
						title: 'Date Closed',
						value: 'date_closed'
					},
					{
						id: 2,
						title: 'Precinct',
						value: 'precinct'
					},
					{
						id: 3,
						title: 'Number of Allegations on Complaint',
						value: 'num_allegations_on_complaint'
					}
				]
			})
	}, [viewConfigExists])

	const { commandUnits } = useCommandUnits();

	const [incompleteCommandUnit, setIncompleteCommandUnit] = useState(null)

	useEffect(() => {
		console.log('hi')
		const commandUnit = commandUnits.find(obj => {
				return obj.id === parseInt(id)
		})
		console.log(commandUnit)
		if (commandUnit === undefined) {
			fetch(`/command_unit/id=${id}`)
  		.then(result => result.json())
  		.then(incompleteCommandUnit => setIncompleteCommandUnit(incompleteCommandUnit[0]))
		} else {
			setIncompleteCommandUnit(commandUnit)
		}
	}, [])

	const [complaintsDates, setComplaintsDates] = useState(null)
	const [complaintsWithAllegations, setComplaintsWithAllegations] = useState(null)
	const [cops, setCops] = useState(null)

	useEffect(() => {
    fetch(`/command_unit_complaints/years/id=${id}`)
    .then(result => result.json())
    .then(complaintsDates => setComplaintsDates(complaintsDates))
     fetch(`/command_unit_complaints/allegations/id=${id}`)
    .then(result => result.json())
    .then(complaintsWithAllegations => setComplaintsWithAllegations(complaintsWithAllegations))
    fetch(`/command_unit/id=${id}/cops`)
    .then(result => result.json())
    .then(cops => setCops(cops))
	}, [])

	useEffect(() => {
		if (complaintsDates === null || 
				complaintsWithAllegations === null ||
				cops === null) return
		setCommandUnit(normalizeData({
			...incompleteCommandUnit, 
			yearlyStats: complaintsDates,
			complaintsWithAllegations: complaintsWithAllegations,
			cops: cops
		}))
	}, [complaintsDates, complaintsWithAllegations, cops])

	const commandUnitConfig = { commandUnit, setCommandUnitViewConfig, getCommandUnitViewConfig }
	
	return (
		<CommandUnitContext.Provider value={ commandUnitConfig }>
			{ commandUnit ? props.children : null}
		</CommandUnitContext.Provider>
	)
}
