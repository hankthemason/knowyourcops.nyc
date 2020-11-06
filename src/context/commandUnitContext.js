import React, 
			{ useContext, 
				createContext, 
				useState, 
				useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useCommandUnits } from './commandUnitsContext';
import { map, range, reduce } from 'lodash'
import { useViewConfig } from './viewConfigContext'

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
	const { commandUnits, settings } = useCommandUnits();

	const { currentUnit, setCurrentUnit } = settings

	const [commandUnit, setCommandUnit] = useState();

	const { viewConfig } = useViewConfig();
	
	const { subTableOrder: order, 
					setSubTableOrder: setOrder,
					subTableOrderBy: orderBy,
					setSubTableOrderBy: setOrderBy } = viewConfig;

	const tableConfig = {
		order,
		setOrder,
		orderBy,
		setOrderBy,
	}

	useEffect(() => {
		if (order === null && orderBy === null) {
			setOrder('desc')
			setOrderBy('date_received')
		}
	}, [])

	const [incompleteCommandUnit, setIncompleteCommandUnit] = useState(null)

	useEffect(() => {
		const commandUnit = commandUnits.find(obj => {
				return obj.id === parseInt(id)
		})
		if (commandUnit === undefined) {
			fetch(`/commandUnit/id=${id}`)
  		.then(result => result.json())
  		.then(incompleteCommandUnit => setIncompleteCommandUnit(incompleteCommandUnit[0]))
		} else {
			setIncompleteCommandUnit(commandUnit)
		}
	}, [])

	useEffect(() => {
		if (incompleteCommandUnit && incompleteCommandUnit.id != currentUnit) {
			console.log('id changed')
			setCurrentUnit(incompleteCommandUnit.id)
			setOrder('desc')
			setOrderBy('date_received')
		} else if (incompleteCommandUnit && incompleteCommandUnit.id === currentUnit) {
			console.log('nothing changed')
		}
	}, [incompleteCommandUnit])

	const [complaintsDates, setComplaintsDates] = useState(null)
	const [complaintsWithAllegations, setComplaintsWithAllegations] = useState(null)

	useEffect(() => {
    fetch(`/command_unit_complaints/years/id=${id}`)
    .then(result => result.json())
    .then(complaintsDates => setComplaintsDates(complaintsDates))
     fetch(`/command_unit_complaints/allegations/id=${id}`)
    .then(result => result.json())
    .then(complaintsWithAllegations => setComplaintsWithAllegations(complaintsWithAllegations))
	}, [])

	useEffect(() => {
		if (complaintsDates === null || 
				complaintsWithAllegations === null) return
		setCommandUnit(normalizeData({
			...incompleteCommandUnit, 
			yearlyStats: complaintsDates,
			complaintsWithAllegations: complaintsWithAllegations
		}))
	}, [complaintsDates, complaintsWithAllegations])
	
	return (
		<CommandUnitContext.Provider value={{ tableConfig, commandUnit }}>
			{ commandUnit ? props.children : null}
		</CommandUnitContext.Provider>
	)
}
