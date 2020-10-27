import React, {useEffect, useState} from 'react';
import { filter } from 'lodash';
import { useLocation, Link } from 'react-router-dom';

export const Search = props => {
	
	const { results, setSearchResults } = props

	let keyword = useLocation().search.match(/\?searchquery=(.*)/)
	if (keyword.length === 2) {
		keyword = keyword[1]
	}

	useEffect(() => {
    fetch(`/search?searchquery=${keyword}`)
    .then(result => result.json())
    .then(searchResults => setSearchResults(searchResults))
  }, [])

	//let v = keyword
	// useEffect(() => {
	// 	if (results.length === 0 && cops) {
	//   	let filterResults = filter(cops, function(e) {
	//   		return e.last_name.toLowerCase() === v.toLowerCase() ||
	//   			e.first_name.toLowerCase() === v.toLowerCase();
	//   	})
	//   	//stops infinite loop if there are no results
	//   	if (filterResults.length === 0) {
	//   		return
	//   	}
	//   	setSearchResults(filterResults);
	// 	}  
	// }, [cops, results])
	
	// const { copsResults, commandUnitsResults } = results
	const { cops: copsResults, commandUnits: commandUnitsResults } = results
	
	
	return (
		<div>
			<h1>Search results: </h1>
			<ul>
			{copsResults ? 
				copsResults.map(e => (
						<li>
							<Link to={`/cop/${e.id}`}>{`${e.first_name} ${e.last_name}`}</Link>
						</li> 
					))
				: null }

			{commandUnitsResults ? 
				commandUnitsResults.map(e => (
						<li>
							{`${e.unit_id}`}
						</li> 
					))
				: null }
			</ul>
		</div>
	)
}