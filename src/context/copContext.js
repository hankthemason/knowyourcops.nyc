import React, 
			{ useContext, 
				createContext, 
				useState, 
				useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useCops } from './copsContext';
import { useViewConfig } from './viewConfigContext'
import { DefaultViewConfig } from '../types/default';
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

	let tempCop = {
		...cop,
		yearlyStats: allYears,
		locationStats: locationStats
	}

	return {
		...cop, 
		yearlyStats: allYears,
		locationStats: locationStats
	}
}

export const CopProvider = (props) => {

	const viewConfigName = 'copViewConfig'

	const { setViewConfig, getViewConfig } = useViewConfig();

	const setCopViewConfig = (viewConfig) => setViewConfig({[viewConfigName]: viewConfig})
	const getCopViewConfig = () => getViewConfig(viewConfigName)

	const viewConfigExists = getCopViewConfig() != undefined

	useEffect(() => {
		setCopViewConfig({
			...DefaultViewConfig,
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

	const { id } = useParams();
	const { cops } = useCops();

	const [incompleteCop, setIncompleteCop] = useState(null);
	
	useEffect(() => {
		const cop = cops.find(obj => {
			return obj.id === parseInt(id)
		})
		console.log(cop)
		if (cop === undefined) {
			fetch(`/cop/id=${id}`)
  		.then(result => result.json())
  		.catch(error => {
  			console.error(error)
  		})
  		.then(incompleteCop => setIncompleteCop(incompleteCop[0]))
  		.catch(error => {
  			console.error(error)
  		})
		} else {
			setIncompleteCop(cop)
		}
	}, [])

	const [cop, setCop] = useState(null)

	const [complaintsLocations, setComplaintsLocations] = useState(null);

	const [complaintsDates, setComplaintsDates] = useState(null);

  const [complaintsWithAllegations, setComplaintsWithAllegations] = useState(null)

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
		if (incompleteCop === null || 
			complaintsLocations === null || 
			complaintsDates === null || 
			complaintsWithAllegations === null) return
		setCop(normalizeData({
			...incompleteCop, 
			locationStats: complaintsLocations,
			yearlyStats: complaintsDates,
			complaintsWithAllegations: complaintsWithAllegations
		}))
	}, [complaintsLocations, complaintsDates, complaintsWithAllegations, incompleteCop])

	const copConfig = { cop, setCopViewConfig, getCopViewConfig }

	return (
		<CopContext.Provider value={copConfig}>
			{ cop ? props.children : null}
		</CopContext.Provider>
		)
}