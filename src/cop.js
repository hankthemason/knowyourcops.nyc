import React, {useState, useEffect } from 'react'; 
import { CopComplaintsTable } from './copComplaints'
import { BarChart } from './components/barChart'
import { AllegationsByDescriptionBarChart } from './components/allegationsByDescriptionBarChart';
import { LineChart } from './components/lineChart'
import { pick, reduce, keys } from 'lodash';
import { useCop } from './context/copContext';
import { Link } from 'react-router-dom'
import { PrecinctsMap } from './components/map'
import { MuiSelect } from './components/muiSelect'
import { firstLetterCap } from './scripts/firstLetterCap'
import { useViewport } from './customHooks/useViewport'

export const CopPage = (props) => {
  const { cop, setCopViewConfig, getCopViewConfig } = useCop();

  const { width } = useViewport()
  const barHeight = width < 500 ? 350 : null

  const viewConfig = getCopViewConfig()
  const orderByOptions = viewConfig.orderByOptions
  const [yearlyStatsSelector, setYearlyStatsSelector] = useState(viewConfig.yearlyStatsSelector)
  const [locationStatsSelector, setLocationStatsSelector] = useState(viewConfig.locationStatsSelector)
  const [mapStatsSelector, setMapStatsSelector] = useState(viewConfig.mapStatsSelector)
  
	let name = cop.first_name + ' ' + cop.last_name;
	let numAllegations = cop.num_allegations;
	let complaints = cop.num_complaints
	let allegationsSubstantiated = cop.num_substantiated
	let percentageSubstantiated = cop.substantiated_percentage
	let ethnicity = cop.ethnicity
  let gender = cop.gender
  if (cop.gender && cop.gender.toLowerCase() === 'f') {
    gender = 'Female'
  } else if (cop.gender && cop.gender.toLowerCase() === 'm') {
    gender = 'Male'
  }
  let badgeNumber = cop.shield_no
  let rank = cop.rank_full
  let assignment_abbrev = cop.command_unit
  let assignment_full = cop.command_unit_full

  useEffect(() => {
    let ranks = []
    let assignments = {}
    cop.complaintsWithAllegations.forEach(e => {
      if (!ranks.includes(e.cop_rank_full)) {
        ranks.push(e.cop_rank_full)
      }
      if (e.cop_command_unit_full != 'undefined' && !allAssignments.hasOwnProperty(e.command_unit_id)) {
        assignments[e.command_unit_id] = e.cop_command_unit_full
      }
    })
    setAllRanksHeld(ranks)
    setAllAssignments(assignments)
  }, [])

  let raceData;

	raceData = pick(cop, ['american_indian',
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

  let genderData;

  genderData = pick(cop, ['female', 
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

  const [allRanksHeld, setAllRanksHeld] = useState([])
  const [allAssignments, setAllAssignments] = useState({})
  
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

  let mapStatsArr
  
  if (cop.mapStats) {
    mapStatsArr = reduce(cop.mapStats, function(acc, val, key) {
      acc.push({precinct: parseInt(key), [mapStatsSelector]: val})
      return acc
    }, [])
  }

  const mapType = 'heat'

  const yearlyStatsHandler = (event) => {
    const v = event.target.value
    setCopViewConfig({
      ...viewConfig,
      yearlyStatsSelector: v
    })
  };

  const locationStatsHandler = (event) => {
    const v = event.target.value
    setCopViewConfig({
      ...viewConfig,
      locationStatsSelector: v
    })
  };

  const mapStatsHandler = (event) => {
    const v = event.target.value
    setCopViewConfig({
      ...viewConfig,
      mapStatsSelector: v
    })
  };

  const [yearlyStats, setYearlyStats] = useState(cop.yearlyStats)
  
  useEffect(() => {
    setYearlyStats(cop.yearlyStats)
    setYearlyStatsSelector(viewConfig.yearlyStatsSelector)
  }, [cop.yearlyStats])

  const [locationStats, setLocationStats] = useState(cop.locationStats)
  
  useEffect(() => {
    setLocationStats(cop.locationStats)
    setLocationStatsSelector(viewConfig.locationStatsSelector)
  }, [cop.locationStats])

  const [mapStats, setMapStats] = useState(cop.mapStats)
  
  useEffect(() => {
    setMapStats(cop.mapStats)
    setMapStatsSelector(viewConfig.mapStatsSelector)
  }, [cop.mapStats])

  const barChartStyles = {
    width: '100%',
    height: 'auto',
    maxWidth: '600px'
  }

	return (
		<div className='page-container'>
      <div className='parent' style={{display: 'flex', flexFlow: 'wrap', justifyContent: 'space-between'}}>
        <div className='text-parent'>
          <h1 id='individual-header' style={{display: 'inline-block', marginRight: '1rem'}}>{name}</h1>
          {badgeNumber > 0 ? (<h2 id='badge-number'><i>badge #{badgeNumber}</i></h2>) : null}
			    <h4 id='officer-description'>{`${ethnicity} ${gender}`}</h4>
          <ul class='individual-page-attributes'>
          <li><strong>Most recent rank and assignment:</strong> {rank}, <Link to={`/command_unit/${cop.command_unit_id}`}>
            {assignment_full ? assignment_full : assignment_abbrev}</Link>
          </li>
          <li>
          <strong>All ranks held: </strong> 
            {allRanksHeld.map((e, index) => (
              (index ? ', ' : '') + e
            ))}
          </li>
          <li>
            <strong>All assignments: </strong>
              {Object.entries(allAssignments).map((item, index) => (
                [(index ? ', ': ''),
                <Link to={`/command_unit/${item[0]}`}>{item[1]}</Link>]
              ))}
          </li>
          </ul>
          <ul class="individual-page-stats">
            <li>
              <span id='stats-span'>{numAllegations}</span> total allegations
            </li>
            <li>
              <span id='stats-span'>{cop.num_substantiated}</span> allegations substantiated 
              {percentageSubstantiated ? <span> (<span id='stats-span'>{percentageSubstantiated}%</span> substantiated)</span>: null}
            </li>
            <li>
              <span id='stats-span'>{complaints}</span> total complaints
            </li>
          </ul>
          <MuiSelect handler={locationStatsHandler} value={viewConfig.locationStatsSelector}/>
        </div>
        <div className='map-parent'>
          <PrecinctsMap screen={width} height={350} width={350} pageData={mapStatsArr} type={mapType} dataPoint={mapStatsSelector} select={true} selectHandler={mapStatsHandler} />
        </div>
      </div>
      <BarChart height={barHeight} data={cop.locationStats} title={`${firstLetterCap(locationStatsSelector)} by precinct`} style={barChartStyles}/>
			<BarChart height={barHeight} data={raceData} labels={raceDataLabels} title='Allegations by complainant ethnicity'/>
      <ul className="individual-page-stats">
        {Object.entries(cop.race_percentages).map((value, index) => (
          <li><span id='stats-span'>{value[1]}%</span> {value[0]}</li>
        ))}
      </ul>
			<BarChart height={barHeight} data={genderData} labels={genderDataLabels} title='Allegations by complainant gender'/> 
      <ul className="individual-page-stats">
        {Object.entries(cop.gender_percentages).map((value, index) => (
          <li><span id='stats-span'>{value[1]}%</span> {value[0]}</li>
        ))}
      </ul>
      <MuiSelect handler={yearlyStatsHandler} value={viewConfig.yearlyStatsSelector}/>
			<LineChart data={yearlyStats} title={`${firstLetterCap(yearlyStatsSelector)} by year`}/>
      <div>
        <BarChart height={barHeight} data={allegationsByFado} title='Allegations by FADO type' />
        <AllegationsByDescriptionBarChart height={375} data={allegationsByDescription} title='Allegations by description' />
        <h1>Complaints received: </h1>
        <div style={{maxWidth: '100%', overflow: 'scroll'}}>
          <CopComplaintsTable id='cop-complaints-table' data={cop.complaintsWithAllegations} headCells={headCells} />     
        </div>         
      </div>
		</div>
	)
}