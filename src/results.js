import React from 'react';
import { useLocation } from 'react-router-dom'

export const Search = props => {
	let location = useLocation();
	console.log(location.state)
	let results = location.state.results.results
	//console.log(props.location.state.detail)
	console.log(results)
	return (
		null
		//results ? <p>results</p>: <p>hi!</p>
	)
}