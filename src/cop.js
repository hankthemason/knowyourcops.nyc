import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

export const CopPage = (props) => {
	const {cops} = props;

	const {id} = useParams();
	
	const name = cops[id].first_name + ' ' + cops[id].last_name;
	const numAllegations = cops[id].num_allegations;
	const complaints = cops[id].num_complaints
	const allegationsSubstantiated = cops[id].num_substantiated
	const percentageSubstantiated = cops[id].substantiated_percentage
	return (
		<div>
			<p> Full name: {name} </p>
			<p> Number of allegations: {numAllegations} </p>
			<p> Number of complaints: {complaints} </p>
			<p> Number of allegations substantiated: {allegationsSubstantiated} </p>
			{percentageSubstantiated != null ? <p>Percentage of allegations substantiated: {percentageSubstantiated} </p> : null}
			<canvas id="myChart" width="400" height="400"></canvas>
		</div>
	)
}