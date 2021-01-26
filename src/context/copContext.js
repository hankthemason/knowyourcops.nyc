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

	let locationStatsForMap = cop.mapStats

	locationStatsForMap = reduce(locationStatsForMap, (accumulator, value) => {
		return {...accumulator, [value.precinct]: value.count}
	}, {})

	return {
		...cop, 
		yearlyStats: allYears,
		locationStats: locationStats,
		mapStats: locationStatsForMap
	}
}

export const CopProvider = (props) => {

	const viewConfigName = 'copViewConfig'

	const { setViewConfig, getViewConfig } = useViewConfig();

	const [incompleteCop, setIncompleteCop] = useState(null);

	const { id } = useParams();
	const { cops } = useCops();

	const setCopViewConfig = (viewConfig) => setViewConfig({[viewConfigName]: viewConfig})
	const getCopViewConfig = () => getViewConfig(viewConfigName)
	
	const viewConfig = getCopViewConfig()
	
	const [yearlyStatsSelector, setYearlyStatsSelector] = useState('allegations')
	const [locationStatsSelector, setLocationStatsSelector] = useState('allegations')
	const [mapStatsSelector, setMapStatsSelector] = useState('allegations')

	// let yearlyStatsSelector
	// let locationStatsSelector
	// if (viewConfig != undefined) {
	// 	yearlyStatsSelector = viewConfig.yearlyStatsSelector
	// 	locationStatsSelector = viewConfig.locationStatsSelector
	// }

	const viewConfigExists = getCopViewConfig() != undefined

	useEffect(() => {
		if (viewConfigExists === false) {
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
				],
				yearlyStatsSelector: 'allegations',
				locationStatsSelector: 'allegations',
				mapStatsSelector: 'allegations'
			})
		}
	}, [viewConfigExists])

	useEffect(() => {
		if (viewConfig != undefined && 
				viewConfig.yearlyStatsSelector != undefined && 
				viewConfig.locationStatsSelector != undefined &&
				viewConfig.mapStatsSelector != undefined) {
			setYearlyStatsSelector(viewConfig.yearlyStatsSelector)
			setLocationStatsSelector(viewConfig.locationStatsSelector)
			setMapStatsSelector(viewConfig.mapStatsSelector)
		}

	}, [viewConfig])
	
	useEffect(() => {
		const cop = cops.find(obj => {
			return obj.id === parseInt(id)
		})
		if (cop === undefined) {
			fetch(`/cop/id=${id}`)
  		.then(result => result.json())
  		.catch(error => {
  			console.error(error)
  		})
  		.then(incompleteCop => setIncompleteCop(incompleteCop))
  		.catch(error => {
  			console.error(error)
  		})
		} else {
			setIncompleteCop(cop)
		}
	}, [])

	const [cop, setCop] = useState(null)

	const [complaintsLocations, setComplaintsLocations] = useState(null);
	const [complaintsLocationsForMap, setComplaintsLocationsForMap] = useState(null);
	const [complaintsDates, setComplaintsDates] = useState(null);
  const [complaintsWithAllegations, setComplaintsWithAllegations] = useState(null)

	useEffect(() => {
   	
   	fetch(`/cop_complaints/allegations/id=${id}`)
  	.then(result => result.json())
  	.then(complaintsWithAllegations => setComplaintsWithAllegations(complaintsWithAllegations))

	}, [])

	useEffect(() => {
		if (yearlyStatsSelector != undefined) {
    	fetch(`/cop/yearly_stats/table=${yearlyStatsSelector}/id=${id}`)
    	.then(result => result.json())
    	.then(complaintsDates => setComplaintsDates(complaintsDates))
  	}
	}, [yearlyStatsSelector])

	useEffect(() => {
		if (locationStatsSelector != undefined) {
    	fetch(`/cop/locations_stats/table=${locationStatsSelector}/id=${id}`)
    	.then(result => result.json())
    	.then(complaintsLocations => setComplaintsLocations(complaintsLocations))
  	}
	}, [locationStatsSelector])

	useEffect(() => {
		if (mapStatsSelector != undefined) {
    	fetch(`/cop/locations_stats/table=${mapStatsSelector}/id=${id}`)
    	.then(result => result.json())
    	.then(complaintsLocationsForMap => setComplaintsLocationsForMap(complaintsLocationsForMap))
  	}
	}, [mapStatsSelector])

	useEffect(() => {
		if (incompleteCop === undefined || 
			complaintsLocations === null || 
			complaintsDates === null || 
			complaintsWithAllegations === null) {
			return
		}
		setCop(normalizeData({
			...incompleteCop, 
			locationStats: complaintsLocations,
			yearlyStats: complaintsDates,
			complaintsWithAllegations: complaintsWithAllegations,
			mapStats: complaintsLocationsForMap
		}))
	}, [complaintsLocations, complaintsLocationsForMap, complaintsDates, complaintsWithAllegations, incompleteCop])

	const copConfig = { cop, setCopViewConfig, getCopViewConfig }

	return (

		<CopContext.Provider value={copConfig}>
			{console.log(cop)}
			{ cop ? props.children : null}
		</CopContext.Provider>
		)
}