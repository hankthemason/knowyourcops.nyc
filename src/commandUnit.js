import React from 'react';
import { useCommandUnit } from './context/commandUnitContext'; 
import { BarChart } from './components/barChart'
import { LineChart } from './components/lineChart'
import { pick, values, reduce, keys } from 'lodash';
import { CommandUnitComplaintsTable } from './commandUnitComplaints'
import { PaginatedSortTable } from './components/paginatedSortTable'
import { PrecinctsMap } from './components/map'
import { CommandUnitWithoutComplaints } from './commandUnitWithoutComplaints.js'

export const CommandUnitPage = props => {

	const { commandUnit: c, 
          setCommandUnitViewConfig, 
          getCommandUnitViewConfig, 
          commandUnitWithoutComplaints,
          commandUnitWithoutComplaintsCops } = useCommandUnit()
  
  if (commandUnitWithoutComplaints != undefined) {
    return (
      <CommandUnitWithoutComplaints data={{commandUnitWithoutComplaints, commandUnitWithoutComplaintsCops}} />
      )
  }

  const complaintsTableExists = getCommandUnitViewConfig() != undefined

  const viewConfig = getCommandUnitViewConfig()

  let complaintsTableOrderByOptions;
  if (complaintsTableExists) {
     complaintsTableOrderByOptions = getCommandUnitViewConfig().complaintsTable.orderByOptions
  }

  const getCopsTableViewConfig = () => {
    return getCommandUnitViewConfig().copsTable
  }

  const setCopsTableViewConfig = (object) => {
    setCommandUnitViewConfig({
      ...viewConfig,
      copsTable: object
    })
  }

  const getComplaintsTableViewConfig = () => {
    return getCommandUnitViewConfig().complaintsTable
  }

  const setComplaintsTableViewConfig = (object) => {
    setCommandUnitViewConfig({
      ...viewConfig,
      complaintsTable: {object}
    })
  }

  const raceData = pick(c, ['american_indian',
                            'asian', 
                            'black', 
                        		'hispanic', 
                        		'white', 
                            'other_ethnicity',
                        		'ethnicity_unknown'])

  const raceDataLabels = keys(raceData).map(e => {
    if (e === 'american_indian') e = 'American Indian'
    else if (e === 'other_ethnicity') e = 'Other'
    else if (e === 'ethnicity_unknown') e = 'Unknown'
    return e = e.charAt(0).toUpperCase() + e.slice(1)
  })
  console.log(c)

	const genderData = pick(c, ['male', 
                          		'female', 
                          		'gender_unknown'])

  const genderDataLabels = keys(genderData).map(e => {
    if (e === 'trans_male') e = 'Male (trans)'
    else if (e === 'trans_female') e = 'Female (trans)'
    else if (e === 'gender_non_conforming') e = 'Gender Non-conforming'
    else if (e === 'gender_unknown') e = 'Unknown'
    return e = e.charAt(0).toUpperCase() + e.slice(1)
  })


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

  const complaintsTableHeadCells = complaintsTableOrderByOptions.map(e => {
    return {
      ...e,
      sortable: true
    }
  })
  
  c.complaintsWithAllegations.map(e => {
    e.date_received = new Date(e.date_received)
    e.date_closed = new Date(e.date_closed)
  })

  const copsTableHeadCells = [
    {
      id: 0,
      title: 'Full Name',
      value: 'last_name',
      sortable: true,
      type: 'string'
    },
    {
      id: 1,
      title: 'No. Allegations (In This Unit)',
      value: 'num_allegations',
      sortable: true,
      type: 'integer'
    },
    {
      id: 2,
      title: 'No. Complaints (In This Unit)',
      value: 'num_complaints',
      sortable: true,
      type: 'integer'
    },
    {
      id: 3,
      title: 'Officer Details',
      value: 'cop_details',
      sortable: false,
      type: 'string'
    }
  ]

  const mapType = 'commandUnit'
  const mapDataPoint = ''
  const mapFloat = 'right'

	return (
		<div className='page-container'>
      <PrecinctsMap height={400} width={400} type={mapType} pageData={[c]} float={mapFloat}/>
			<p> Command Unit: {c.command_unit_full != null ? c.command_unit_full : c.unit_id } </p>
      {c.precinct != 'null' ? <p> Associated Precinct: {c.precinct}</p> : null}
			<p> Number of allegations:  {c.num_allegations}</p>
			<p> Number of complaints:  {c.num_complaints}</p>
			<p> Number of allegations substantiated: {c.num_substantiated}  </p>
			<BarChart data={raceData} labels={raceDataLabels} title='Allegations by complainant ethnicity'/>
			<BarChart data={genderData} labels={genderDataLabels} title='Allegations by complainant gender'/>
			<LineChart data={c.yearlyStats} title='Complaints by year'/>
			<BarChart data={allegationsByFado} title='Allegations by FADO type' />
      <BarChart data={allegationsByDescription} title='Allegations by description' padding={true} />
      <h2>Complaints received: </h2>
      <div>(click the arrow to show allegations on the complaint)</div>
      <CommandUnitComplaintsTable data={c.complaintsWithAllegations} headCells={complaintsTableHeadCells} />
      <h2>Officers Associated With This Unit: </h2>
      <PaginatedSortTable 
        data={c.cops} 
        headCells={copsTableHeadCells} 
        viewConfigGetter={getCopsTableViewConfig}
        viewConfigSetter={setCopsTableViewConfig}
        width='60%' />
		</div>
	)
}