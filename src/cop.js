import React, {useState, useEffect } from 'react'; 
import { CopComplaintsTable } from './copComplaints'
import { BarChart } from './components/barChart'
import { LineChart } from './components/lineChart'
import { pick, values, reduce } from 'lodash';
import { useCop } from './context/copContext';
import { Link } from 'react-router-dom'
import { PrecinctsMap } from './components/map'

export const CopPage = (props) => {

  const { cop, setCopViewConfig, getCopViewConfig } = useCop();

  const { orderByOptions } = getCopViewConfig()

	let name = cop.first_name + ' ' + cop.last_name;
	let numAllegations = cop.num_allegations;
	let complaints = cop.num_complaints
	let allegationsSubstantiated = cop.num_substantiated
	let percentageSubstantiated = cop.substantiated_percentage
	let ethnicity = cop.ethnicity
  let rank = cop.rank_full
  let assignment_abbrev = cop.command_unit
  let assignment_full = cop.command_unit_full

  let raceData;

	raceData = pick(cop, ['black', 
                        'hispanic', 
                        'asian', 
                        'white', 
                        'ethnicity_unknown'])

  let genderData;

  genderData = pick(cop, ['male', 
                          'female', 
                          'gender_unknown'])

  //rather than make a separate API call for allegations,
  //derive them from complaints
  let allegations;
  let allegationsByFado = {}
  let allegationsByDescription = {}

  let allRanksHeld = []
  let allAssignments = {}

  cop.complaintsWithAllegations.forEach(e => {
    if (!allRanksHeld.includes(e.cop_rank_full)) {
      allRanksHeld.push(e.cop_rank_full)
    }
    if (e.cop_command_unit_full != 'undefined' && !allAssignments.hasOwnProperty(e.command_unit_id)) {
      allAssignments[e.command_unit_id] = e.cop_command_unit_full
    }
  })
  
  allegations = cop.complaintsWithAllegations.reduce((acc, val) => acc.concat(val.allegations), [])
    allegations = allegations.reduce((acc, value) => {
      return {...acc, [value.allegation_id]: value}
  }, {})
    
  let fadoTypes = ['Abuse of Authority', 'Discourtesy', 'Force', 'Offensive Language']

  for (const fadoType of fadoTypes) {
    allegationsByFado.[fadoType] = 0
  }

  let allegationDescriptions = [];

  for (const [key, value] of Object.entries(allegations)) {
    let fadoType = allegations.[key].fado_type;
    let allegationDescription = allegations.[key].description;
    if (allegationsByFado.hasOwnProperty(fadoType)) {
      allegationsByFado.[fadoType] += 1;
    }

    allegationsByDescription.hasOwnProperty(allegationDescription) ? 
      allegationsByDescription[allegationDescription] += 1 :
      allegationsByDescription[allegationDescription] = 1
  } 
  
  const headCells = orderByOptions.map(e => {
    return {
      ...e,
      sortable: true
    }
  })
  headCells.push({ id: 4, title: 'Complainant Details', value: 'complainant_details', sortable: false })

  cop.complaintsWithAllegations.map(e => {
    e.date_received = new Date(e.date_received)
    e.date_closed = new Date(e.date_closed)
  })

  let locationStatsArr

  if (cop.locationStats) {
    locationStatsArr = reduce(cop.locationStats, function(acc, val, key) {
      acc.push({precinct: parseInt(key), num_complaints: val})
      return acc
    }, [])
  }

  const mapType = 'heat'
  const mapDataPoint = 'num_complaints'
  const mapFloat = 'right'

	return (
		<div>
      <PrecinctsMap height={400} width={400} pageData={locationStatsArr} type={mapType} dataPoint={mapDataPoint} float={mapFloat} />
			<p> Full name: {name}</p>
			<p> Ethnicity: {ethnicity}</p>
			<p> Number of allegations: {numAllegations} </p>
			<p> Number of complaints: {complaints} </p>
			<p> Number of allegations substantiated: {allegationsSubstantiated} </p>
      <p> Most Recent Rank: {rank} </p>
      <p> {'All ranks held: ' + allRanksHeld.map(e => ' ' + e)}</p>
      <p> {`Most Recent Assignment: `}  
        <Link to={`/command_unit/${cop.command_unit_id}`}>
        {assignment_full ? assignment_full : assignment_abbrev}
        </Link>
      </p>
      
      <p>{`All assignments: `} 
        {Object.entries(allAssignments).map((item, index) => (
          [(index ? ', ': ''),
            <Link to={`/command_unit/${item[0]}`}>{item[1]}</Link>]
        ))}
      </p>
			{percentageSubstantiated != null ? <p>Percentage of allegations substantiated: {percentageSubstantiated}% </p> : null}
			<BarChart data={raceData} title='Complaints by complainant ethnicity'/>
			<BarChart data={genderData} title='Complaints by complainant gender'/> 
			<BarChart data={cop.locationStats} title='Complaints by location'/>
			<LineChart data={cop.yearlyStats} title='Complaints by year'/>
      <div>
        <BarChart data={allegationsByFado} title='Allegations by FADO type' />
        <BarChart data={allegationsByDescription} title='Allegations by description' />
        <h2>Complaints received: </h2>
        <CopComplaintsTable data={cop.complaintsWithAllegations} headCells={headCells} />              
      </div>
		</div>
	)
}