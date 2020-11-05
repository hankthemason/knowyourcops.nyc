import React, {useState, useEffect } from 'react'; 
import { CopComplaintsTable } from './copComplaints'
import { BarChart } from './components/barChart'
import { LineChart } from './components/lineChart'
import { pick, values, reduce } from 'lodash';
import { useCop } from './context/copContext';

export const CopPage = (props) => {

  const { cop } = useCop();

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
    if (!allegationDescriptions.includes(allegationDescription)) {
      allegationDescriptions.push(allegationDescription)
      allegationsByDescription.[allegationDescription] = 1
    }

    if (allegationsByDescription.hasOwnProperty(allegationDescription)) {
      allegationsByDescription.[allegationDescription] += 1;
    }
  } 
  

  const headCells = [
    { id: 'date_received', sortable: true, label: 'Date Received' },
    { id: 'date_closed', sortable: true, label: 'Date Closed' },
    { id: 'precinct', sortable: true, label: 'Location(Precinct)' },
    { id: 'num_allegations_on_complaint', sortable: true, label: 'Allegations on complaint' },
    { id: 'complainant_details', sortable: false, label: 'Complainant details' },
  ];

	return (
		<div>
			<p> Full name: {name}</p>
			<p> Ethnicity: {ethnicity}</p>
			<p> Number of allegations: {numAllegations} </p>
			<p> Number of complaints: {complaints} </p>
			<p> Number of allegations substantiated: {allegationsSubstantiated} </p>
      <p> Rank: {rank} </p>
      {assignment_full != null ? (
        <p> Assignment: {assignment_full} </p> ):
        <p> Assignment: {assignment_abbrev} </p> }
			{percentageSubstantiated != null ? <p>Percentage of allegations substantiated: {percentageSubstantiated} </p> : null}
			<BarChart data={raceData} title='Allegations by complainant ethnicity'/>
			<BarChart data={genderData} title='Allegations by complainant gender'/> 
			<BarChart data={cop.locationStats} title='Allegations by location'/>
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