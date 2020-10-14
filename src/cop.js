import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

export const CopPage = (props) => {
	const { cops } = props;

	const {id} = useParams();
	
	const name = cops[id].first_name + ' ' + cops[id].last_name;
	const num_allegations = cops[id].num_allegations;
	const complaints = cops[id].num_complaints
	const allegations_substantiated = cops[id].num_substantiated
	return (
		<div>
			<p> Full name: {name} </p>
			<p> Number of allegations: {num_allegations} </p>
			<p> Number of complaints: {complaints} </p>
			<p> Number of allegations substantiated: {allegations_substantiated} </p>
		</div>
	)
}