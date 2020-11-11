import React, { useState, useEffect } from 'react';
import { useCommandUnit } from './context/commandUnitContext'; 
import { BarChart } from './components/barChart'
import { LineChart } from './components/lineChart'
import { pick, values, reduce } from 'lodash';
import { CommandUnitComplaintsTable } from './commandUnitComplaints'
import { CopsTable } from './cops'
import { PaginatedSortTable } from './components/paginatedSortTable'

export const CommandUnitPage = props => {

	const { commandUnit: c, 
          setCommandUnitViewConfig, 
          getCommandUnitViewConfig } = useCommandUnit()

  const complaintsTableExists = getCommandUnitViewConfig() != undefined

  let orderByOptions;
  if (complaintsTableExists) {
     orderByOptions = getCommandUnitViewConfig().complaintsTable.orderByOptions
  }

  const getCopsTableViewConfig = () => {
    return getCommandUnitViewConfig().copsTable
  }

  const setCopsTableViewConfig = (object) => {
    setCommandUnitViewConfig({copsTable: {object}})
  }

  const [id, setId] = useState(null)

  const raceData = pick(c, ['black', 
                        		'hispanic', 
                        		'asian', 
                        		'white', 
                        		'ethnicity_unknown'])

	const genderData = pick(c, ['male', 
                          		'female', 
                          		'gender_unknown'])

	//rather than make a separate API call for allegations,
  //derive them from complaints
  let allegations;
  let allegationsByFado = {}
  let allegationsByDescription = {}

  allegations = c.complaintsWithAllegations.reduce((acc, val) => acc.concat(val.allegations), [])
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

  const complaintsTableHeadCells = orderByOptions.map(e => {
    return {
      ...e,
      sortable: true
    }
  })
  complaintsTableHeadCells.push({ id: 4, title: 'Complainant Details', value: 'complainant_details', sortable: false })
  
  c.complaintsWithAllegations.map(e => {
    e.date_received = new Date(e.date_received)
    e.date_closed = new Date(e.date_closed)
  })

  const copsTableHeadCells = [
    {
      id: 0,
      title: 'Full Name',
      value: 'full_name',
      sortable: true
    },
    {
      id: 1,
      title: 'Number of Allegations (In This Unit)',
      value: 'num_allegations',
      sortable: true
    },
    {
      id: 2,
      title: 'Number of Complaints (In This Unit)',
      value: 'num_complaints',
      sortable: true
    },
    {
      id: 3,
      title: 'Officer Details',
      value: 'cop_details',
      sortable: false
    }
  ]

	return (
		<div>
			<p> Command Unit: {c.command_unit_full != null ? c.command_unit_full : c.unit_id } </p>
			<p> Associated Precinct: {c.precinct}</p>
			<p> Number of allegations:  {c.num_allegations}</p>
			<p> Number of complaints:  {c.num_complaints}</p>
			<p> Number of allegations substantiated: {c.num_substantiated}  </p>
			<BarChart data={raceData} title='Complaints by complainant ethnicity'/>
			<BarChart data={genderData} title='Complaints by complainant gender'/>
			<LineChart data={c.yearlyStats} title='Complaints by year'/>
			<BarChart data={allegationsByFado} title='Allegations by FADO type' />
      <BarChart data={allegationsByDescription} title='Allegations by description' />
      <h2>Complaints received: </h2>
      <CommandUnitComplaintsTable data={c.complaintsWithAllegations} headCells={complaintsTableHeadCells} />
      <PaginatedSortTable 
        data={c.cops} 
        headCells={copsTableHeadCells} 
        viewConfigGetter={getCopsTableViewConfig}
        viewConfigGetter={setCopsTableViewConfig} />
		</div>
	)
}