import React from 'react';
import { useCommandUnit } from './context/commandUnitContext'; 
import { BarChart } from './components/barChart'
import { LineChart } from './components/lineChart'
import { pick, values, reduce, keys } from 'lodash';
import { CommandUnitComplaintsTable } from './commandUnitComplaints'
import { PaginatedSortTable } from './components/paginatedSortTable'
import { PrecinctsMap } from './components/map'
import { CommandUnitWithoutComplaints } from './commandUnitWithoutComplaints.js'
import { MuiSelect } from './components/muiSelect'
import { firstLetterCap } from './scripts/firstLetterCap'

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

	const genderData = pick(c, ['female', 
                          'male',
                          'trans_female',
                          'trans_male',
                          'gender_non_conforming',
                          'gender_unknown'])

  const genderDataLabels = keys(genderData).map(e => {
    if (e === 'trans_male') e = 'Male (trans)'
    else if (e === 'trans_female') e = 'Female (trans)'
    else if (e === 'gender_non_conforming') e = 'Gender Non-conforming'
    else if (e === 'gender_unknown') e = 'Unknown or Refused'
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

  const yearlyStatsHandler = (event) => {
    const v = event.target.value
    setCommandUnitViewConfig({
      ...viewConfig,
      yearlyStatsSelector: v
    })
  };

	return (
		<div className='page-container'>
      <div className='parent' style={{display: 'flex', flexFlow: 'wrap', justifyContent: 'space-between'}}>
        <div className='text-parent'>
          <h1 id='individual-header'>{c.command_unit_full != null ? c.command_unit_full : c.unit_id } </h1>
            {c.precinct != 'null' || c.unit_id.endsWith('DET') ? <h4 id='associated-precinct'> Associated Precinct: {c.precinct}</h4> : null}
          
          <ul id='command-unit' class="individual-page-stats">
            <li><span id="stats-span">{c.num_allegations}</span> total allegations</li>
            <li>
              <span id='stats-span'>{c.num_substantiated}</span> allegations substantiated 
              {c.substantiated_percentage ? <span> (<span id='stats-span'>{c.substantiated_percentage}%</span> substantiated)</span>: null}
            </li>
            <li><span id="stats-span">{c.num_complaints}</span> total complaints</li>
          </ul>
      
        </div>
        <div className='map-parent'>
          <PrecinctsMap height={350} width={350} type={mapType} pageData={[c]} float={mapFloat}/>
        </div>
      </div>
    		<BarChart data={raceData} labels={raceDataLabels} title='Allegations by complainant ethnicity'/>
        <ul className="individual-page-stats">
          {Object.entries(c.race_percentages).map((value, index) => (
            <li><span id='stats-span'>{value[1]}%</span> {value[0]}</li>
          ))}
        </ul>
    		<BarChart data={genderData} labels={genderDataLabels} title='Allegations by complainant gender'/>
        <ul className="individual-page-stats">
          {Object.entries(c.gender_percentages).map((value, index) => (
            <li><span id='stats-span'>{value[1]}%</span> {value[0]}</li>
          ))}
        </ul>
        <MuiSelect handler={yearlyStatsHandler} value={viewConfig.yearlyStatsSelector} />
    		<LineChart data={c.yearlyStats} title={firstLetterCap(viewConfig.yearlyStatsSelector) + ' by year'}/>
    		<BarChart data={allegationsByFado} title='Allegations by FADO type' />
        <BarChart height={'300px'} data={allegationsByDescription} title='Allegations by description' padding={true} />
        <h1>Complaints received: </h1>
        <div>(click the arrow to show allegations on the complaint)</div>
        <CommandUnitComplaintsTable data={c.complaintsWithAllegations} headCells={complaintsTableHeadCells} />
        <h1>Officers Associated With This Unit: </h1>
        <PaginatedSortTable 
          data={c.cops} 
          headCells={copsTableHeadCells} 
          viewConfigGetter={getCopsTableViewConfig}
          viewConfigSetter={setCopsTableViewConfig}
          width='60%' />
		</div>
	)
}