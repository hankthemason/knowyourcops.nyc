import React, 
			{ useContext, 
				createContext, 
				useState, 
				useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useCommandUnits } from './commandUnitsContext';
import { map, range, reduce } from 'lodash'

const CommandUnitContext = createContext();

export const useCommandUnit = () => {
	const ctx = useContext(CommandUnitContext);
	if (ctx === undefined) {
		throw new Error('you need to call useCommandUnit inside of CommandUnitProvider')
	}
	return ctx
}

const normalizeData = commandUnit => {
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
	const { commandUnits } = useCommandUnits();

	const [commandUnit, setCommandUnit] = useState();

	let incompleteCommandUnit = commandUnits.find(obj => obj.id === parseInt(id))

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
		<CommandUnitContext.Provider value={{commandUnit}}>
			{ commandUnit ? props.children : null}
		</CommandUnitContext.Provider>
	)
}
