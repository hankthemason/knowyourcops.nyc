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

	commandUnit.cops.map(e => {
		let genderFull = ''
		if (e.gender === 'M') {
			genderFull = 'Male'
		} else if (e.gender === 'F') {
			genderFull = 'Female'
		}
		e.cop_details = `${e.ethnicity} ${genderFull}`
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

	const [commandUnitWithoutComplaints, setCommandUnitWithoutComplaints] = useState()

	const viewConfigExists = getCommandUnitViewConfig() != undefined

	const viewConfig = getCommandUnitViewConfig()
	const [yearlyStatsSelector, setYearlyStatsSelector] = useState('allegations')

	const viewConfigPopulated = viewConfig != undefined

	useEffect(() => {
		if (viewConfig != undefined) {
			if (viewConfig['complaintsTable'].hasOwnProperty('order')) return
		}
		setCommandUnitViewConfig({
			copsTable: {
				...DefaultViewConfig,
				page: 0,
				pageSize: 10,
				orderBy: {
			      id: 1,
			      title: 'Number of Allegations (In This Unit)',
			      value: 'num_allegations',
			      type: 'integer'
			    },
				orderByOptions: [
					{
						id: 0,
						title: 'Full Name',
						value: 'last_name',
						type: 'string'
					},
					{
			      id: 1,
			      title: 'Number of Allegations (In This Unit)',
			      value: 'num_allegations',
			      type: 'integer'
			    },
			    {
			      id: 2,
			      title: 'Number of Complaints (In This Unit)',
			      value: 'num_complaints',
			      type: 'integer'
			    },
			    {
			      id: 3,
			      title: 'Officer Details',
			      value: 'cop_details',
			      type: 'text'
			    }
				]
			},
			complaintsTable: {
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
						value: 'date_received',
						type: 'text'
					},
					{
						id: 1,
						title: 'Date Closed',
						value: 'date_closed',
						type: 'text',
					},
					{
						id: 2,
						title: 'Precinct',
						value: 'precinct',
						type: 'numeric'
					},
					{
						id: 3,
						title: 'No. Allegations on Complaint',
						value: 'num_allegations_on_complaint',
						type: 'numeric'
					}
				]
			},
			yearlyStatsSelector: 'allegations'
		})
	}, [viewConfigExists])

	useEffect(() => {
		if (viewConfig != undefined && 
				viewConfig.yearlyStatsSelector != undefined) {
			setYearlyStatsSelector(viewConfig.yearlyStatsSelector)
		}

	}, [viewConfig])

	const { commandUnits } = useCommandUnits();

	const [incompleteCommandUnit, setIncompleteCommandUnit] = useState(null)

	//if commandUnit is in the already-fetched list of commandUnits, no need for another fetch
	useEffect(() => {
		const commandUnit = commandUnits.find(obj => {
				return obj.id === parseInt(id)
		}) 
		if (commandUnit === undefined) {
			fetch(`/command_unit?id=${id}`)
  		.then(result => result.json())
  		.then(incompleteCommandUnit => setIncompleteCommandUnit(incompleteCommandUnit))
		} else {
			setIncompleteCommandUnit(commandUnit)
		}
	}, [])

	const [complaintsDates, setComplaintsDates] = useState(null)
	const [complaintsWithAllegations, setComplaintsWithAllegations] = useState(null)
	const [cops, setCops] = useState(null)
	const [commandUnitWithoutComplaintsCops, setCommandUnitWithoutComplaintsCops] = useState(null)

	useEffect(() => {
    fetch(`/command_unit_complaints/allegations?id=${id}`)
    .then(result => result.json())
    .then(complaintsWithAllegations => setComplaintsWithAllegations(complaintsWithAllegations))
    fetch(`/command_unit/cops?id=${id}`)
    .then(result => result.json())
    .then(cops => setCops(cops))
	}, [])

	useEffect(() => {
		fetch(`/command_unit/yearly_stats?column=${yearlyStatsSelector}&id=${id}`)
    .then(result => result.json())
    .then(complaintsDates => setComplaintsDates(complaintsDates))
	}, [yearlyStatsSelector])

	useEffect(() => {
		if (complaintsDates === null || 
				complaintsWithAllegations === null ||
				cops === null) return
		if (incompleteCommandUnit !== null && complaintsWithAllegations.length) {
			setCommandUnit(normalizeData({
				...incompleteCommandUnit, 
				yearlyStats: complaintsDates,
				complaintsWithAllegations: complaintsWithAllegations,
				cops: cops
			}))
		}
		if (incompleteCommandUnit && !complaintsDates.length && !complaintsWithAllegations.length && !cops.length) {
			setCommandUnitWithoutComplaints(incompleteCommandUnit[0])	
		}
	}, [incompleteCommandUnit, complaintsDates, complaintsWithAllegations, cops])

	useEffect(() => {
		if (commandUnitWithoutComplaints != undefined) {
			fetch(`/command_unit/complaints=0/cops?id=${id}`)
			.then(result => result.json())
			.then(commandUnitWithoutComplaintsCops => setCommandUnitWithoutComplaintsCops(commandUnitWithoutComplaintsCops))
		}
	}, [commandUnitWithoutComplaints])

	const commandUnitConfig = { commandUnit, setCommandUnitViewConfig, getCommandUnitViewConfig, commandUnitWithoutComplaints, commandUnitWithoutComplaintsCops }

	return (
		<CommandUnitContext.Provider value={ commandUnitConfig }>
			{ commandUnit || (commandUnitWithoutComplaints && commandUnitWithoutComplaintsCops) ? props.children : null}
		</CommandUnitContext.Provider>
	)
}
