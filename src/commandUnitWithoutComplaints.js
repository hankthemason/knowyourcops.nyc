import React from 'react';
import { SimpleTable } from './components/simpleTable.js'


//import { pick, values, reduce } from 'lodash';

//import { CopsTable } from './cops'
//import { PaginatedSortTable } from './components/paginatedSortTable'
import { PrecinctsMap } from './components/map'

export const CommandUnitWithoutComplaints = props => {

  const { commandUnitWithoutComplaints: c, commandUnitWithoutComplaintsCops: cops } = props.data
  const mapType = 'commandUnit'
  const mapDataPoint = ''
  const mapFloat = 'right'

  const tableTitle = 'Officers Assigned to This Unit As Of July 2020:'
  const headers = ['Full Name', 'Badge Number', 'Officer Details']
  const data = cops.map(e => {
    if (e.shield_no < 1) e.shield_no = null
    const fullName = `${e.first_name} ${e.last_name}`
    let fullGender
    const genderInitial = e.gender.toLowerCase()
    if (genderInitial === 'm') {
      fullGender = 'Male'
    } else if (genderInitial === 'f') {
      fullGender = 'Female'
    } else {
      fullGender = ''
    }
    return {
      id: e.id,
      fullName: fullName,
      badgeNumber: e.shield_no,
      officerDetails: e.ethnicity + ' ' + fullGender
    }
  })

  return (
  <div className='page-container'>
    <div className='parent' style={{display: 'flex', flexFlow: 'wrap', justifyContent: 'space-between'}}>
      <div className='text-parent'>
        <h1 className='individual-header'> 
          Command Unit: {c.command_unit_full != null ? 
            c.command_unit_full : c.unit_id } 
        </h1>
        {c.precinct != 'null' ? 
        <p> Associated Precinct: {c.precinct}</p> : null }
        <p> Note: this command unit is not directly associated with any complaints in the database.</p>
    <SimpleTable title={tableTitle} headers={headers} data={data} />
      </div>
      <div className='map-parent'>
        <PrecinctsMap height={380} width={380} type={mapType} pageData={[c]} float={mapFloat}/>
      </div>
    </div>
  </div>
  )
}

// 	const { commandUnit: c, 
//           setCommandUnitViewConfig, 
//           getCommandUnitViewConfig, 
//           commandUnitWithoutComplaints } = useCommandUnit()
  
//   if (commandUnitWithoutComplaints != undefined) {
//     return null
//   }

//   const complaintsTableExists = getCommandUnitViewConfig() != undefined

//   const viewConfig = getCommandUnitViewConfig()

//   let complaintsTableOrderByOptions;
//   if (complaintsTableExists) {
//      complaintsTableOrderByOptions = getCommandUnitViewConfig().complaintsTable.orderByOptions
//   }

//   const getCopsTableViewConfig = () => {
//     return getCommandUnitViewConfig().copsTable
//   }

//   const setCopsTableViewConfig = (object) => {
//     setCommandUnitViewConfig({
//       ...viewConfig,
//       copsTable: object
//     })
//   }

//   const getComplaintsTableViewConfig = () => {
//     return getCommandUnitViewConfig().complaintsTable
//   }

//   const setComplaintsTableViewConfig = (object) => {
//     setCommandUnitViewConfig({
//       ...viewConfig,
//       complaintsTable: {object}
//     })
//   }

//   const raceData = pick(c, ['black', 
//                         		'hispanic', 
//                         		'asian', 
//                         		'white', 
//                         		'ethnicity_unknown'])

// 	const genderData = pick(c, ['male', 
//                           		'female', 
//                           		'gender_unknown'])

// 	//rather than make a separate API call for allegations,
//   //derive them from complaints
//   let allegations;
//   let allegationsByFado = {}
//   let allegationsByDescription = {}

//   allegations = c.complaintsWithAllegations.reduce((acc, val) => acc.concat(val.allegations), [])
//     allegations = allegations.reduce((acc, value) => {
//       return {...acc, [value.allegation_id]: value}
//   }, {})

//   let fadoTypes = ['Abuse of Authority', 'Discourtesy', 'Force', 'Offensive Language']

//   for (const fadoType of fadoTypes) {
//     allegationsByFado.[fadoType] = 0
//   }

//   let allegationDescriptions = [];

//   for (const [key, value] of Object.entries(allegations)) {
//     let fadoType = allegations.[key].fado_type;
//     let allegationDescription = allegations.[key].description;
//     if (allegationsByFado.hasOwnProperty(fadoType)) {
//       allegationsByFado.[fadoType] += 1;
//     }
    
//     allegationsByDescription.hasOwnProperty(allegationDescription) ? 
//       allegationsByDescription[allegationDescription] += 1 :
//       allegationsByDescription[allegationDescription] = 1
//   } 

//   const complaintsTableHeadCells = complaintsTableOrderByOptions.map(e => {
//     return {
//       ...e,
//       sortable: true
//     }
//   })
//   complaintsTableHeadCells.push({ id: 4, title: 'Complainant Details', value: 'complainant_details', sortable: false })
  
//   c.complaintsWithAllegations.map(e => {
//     e.date_received = new Date(e.date_received)
//     e.date_closed = new Date(e.date_closed)
//   })

//   const copsTableHeadCells = [
//     {
//       id: 0,
//       title: 'Full Name',
//       value: 'last_name',
//       sortable: true,
//       type: 'string'
//     },
//     {
//       id: 1,
//       title: 'Number of Allegations (In This Unit)',
//       value: 'num_allegations',
//       sortable: true,
//       type: 'integer'
//     },
//     {
//       id: 2,
//       title: 'Number of Complaints (In This Unit)',
//       value: 'num_complaints',
//       sortable: true,
//       type: 'integer'
//     },
//     {
//       id: 3,
//       title: 'Officer Details',
//       value: 'cop_details',
//       sortable: false,
//       type: 'string'
//     }
//   ]

//   const mapType = 'commandUnit'
//   const mapDataPoint = ''
//   const mapFloat = 'right'

// 	return (
// 		<div>
//       <PrecinctsMap height={400} width={400} type={mapType} pageData={[c]} float={mapFloat}/>
// 			<p> Command Unit: {c.command_unit_full != null ? c.command_unit_full : c.unit_id } </p>
// 			<p> Associated Precinct: {c.precinct}</p>
// 			<p> Number of allegations:  {c.num_allegations}</p>
// 			<p> Number of complaints:  {c.num_complaints}</p>
// 			<p> Number of allegations substantiated: {c.num_substantiated}  </p>
// 			<BarChart data={raceData} title='Complaints by complainant ethnicity'/>
// 			<BarChart data={genderData} title='Complaints by complainant gender'/>
// 			<LineChart data={c.yearlyStats} title='Complaints by year'/>
// 			<BarChart data={allegationsByFado} title='Allegations by FADO type' />
//       <BarChart data={allegationsByDescription} title='Allegations by description' />
//       <h2>Complaints received: </h2>
//       <CommandUnitComplaintsTable data={c.complaintsWithAllegations} headCells={complaintsTableHeadCells} />
//       <PaginatedSortTable 
//         data={c.cops} 
//         headCells={copsTableHeadCells} 
//         viewConfigGetter={getCopsTableViewConfig}
//         viewConfigSetter={setCopsTableViewConfig} />
// 		</div>
// 	)
// }