import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { BarChart } from './components/barChart'
import { pick, values, reduce } from 'lodash';

export const CopPage = (props) => {
	const {cops} = props;

	const {id} = useParams();

	const [copComplaints, setCopComplaints] = useState(null);

	const [cop, setCop] = useState(null);

	const [complaintsLocations, setComplaintsLocations] = useState(null);

	useEffect(() => {
    fetch(`/cop_complaints/complainant_info/id=${id}`)
    .then(result => result.json())
    .then(copComplaints => setCopComplaints(copComplaints))
  }, [])

	useEffect(() => {
    fetch(`/cops/id=${id}`)
    .then(result => result.json())
    .then(cop => setCop(cop))
  }, [])

  useEffect(() => {
    fetch(`/cop_complaints/locations/id=${id}`)
    .then(result => result.json())
    .then(complaintsLocations => setComplaintsLocations(complaintsLocations))
  }, [])

  let name;
  let numAllegations;
  let complaints;
  let allegationsSubstantiated;
  let percentageSubstantiated;
  let ethnicity;

  if (cop) {
  	name = cop.first_name + ' ' + cop.last_name;
  	numAllegations = cop.num_allegations;
		complaints = cop.num_complaints
		allegationsSubstantiated = cop.num_substantiated
		percentageSubstantiated = cop.substantiated_percentage
		ethnicity = cop.ethnicity
  }

  let raceData;

  if (copComplaints) {
  	raceData = pick(copComplaints[0], ['black', 'hispanic', 'asian', 'white', 'ethnicity_unknown'])
  }

  // if (copComplaints) {
  // 	let object = {...copComplaints[0]}
  	
	//	raceData = (({ black, hispanic, asian, white, ethnicity_unknown }) => ({ black, hispanic, asian, white, ethnicity_unknown }))(object)
  // }

  let genderData;

  if (copComplaints) {
  	genderData = pick(copComplaints[0], ['male', 'female', 'gender_unknown'])
  }

  const complaintsLocationsReduced = reduce(complaintsLocations, (accumulator, value) => {
				let tempKey = value.precinct;
				accumulator[tempKey] = value.count;
				return accumulator
	}, {})

	console.log(complaintsLocationsReduced)
  
	return (
		<div>
			<p> Full name: {name}</p>
			<p> Ethnicity: {ethnicity}</p>
			<p> Number of allegations: {numAllegations} </p>
			<p> Number of complaints: {complaints} </p>
			<p> Number of allegations substantiated: {allegationsSubstantiated} </p>
			{percentageSubstantiated != null ? <p>Percentage of allegations substantiated: {percentageSubstantiated} </p> : null}
			{raceData ? 
			<BarChart data={raceData} title='Allegations by complainant ethnicity'/> : null}
			{genderData ?
			<BarChart data={genderData} title='Allegations by complainant gender'/> : null}
			{complaintsLocations ?
			<BarChart data={complaintsLocationsReduced} title='Allegations by location'/> : null}
		</div>
	)
}