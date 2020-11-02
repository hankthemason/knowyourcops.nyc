import React, { useContext, 
								createContext, 
								useState, 
								useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useCops } from './copsContext';
import { map, range, reduce } from 'lodash'

const CopContext = createContext(); 

export const useCop = () => {
	const ctx = useContext(CopContext);
	if (ctx === undefined) {
		throw new Error('you need to call useCop inside of CopProvider')
	}
	return ctx
}

const normalizeData = cop => {
	let yearlyStats = cop.yearlyStats

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

	let locationStats = cop.locationStats

	locationStats = reduce(locationStats, (accumulator, value) => {
		return {...accumulator, [value.precinct]: value.count}
	}, {})

	return {
		...cop, 
		yearlyStats: allYears,
		locationStats: locationStats
	}
}

export const CopProvider = (props) => {
	const { id } = useParams();
	const { copsConfig } = useCops();

	const incompleteCop = copsConfig.cops.find(obj => {
		return obj.id === parseInt(id)
	})

	const [cop, setCop] = useState(null)

	const [complaintsLocations, setComplaintsLocations] = useState(null);

	const [complaintsDates, setComplaintsDates] = useState(null);

  const [complaintsWithAllegations, setComplaintsWithAllegations] = useState(null);

	useEffect(() => {
		fetch(`/cop_complaints/locations/id=${id}`)
    .then(result => result.json())
    .then(complaintsLocations => setComplaintsLocations(complaintsLocations))
    fetch(`/cop_complaints/years/id=${id}`)
    .then(result => result.json())
    .then(complaintsDates => setComplaintsDates(complaintsDates))
     fetch(`/cop_complaints/allegations/id=${id}`)
    .then(result => result.json())
    .then(complaintsWithAllegations => setComplaintsWithAllegations(complaintsWithAllegations))
	}, [])

	useEffect(() => {
		if (complaintsLocations === null || 
			complaintsDates === null || 
			complaintsWithAllegations === null) return
		setCop(normalizeData({
			...incompleteCop, 
			locationStats: complaintsLocations,
			yearlyStats: complaintsDates,
			complaintsWithAllegations: complaintsWithAllegations
		}))
	}, [complaintsLocations, complaintsDates, complaintsWithAllegations])

	return (
		<CopContext.Provider value={{cop}}>
			{ cop ? props.children : null}
		</CopContext.Provider>
		)
}