import React, {useEffect, useState} from 'react';
import { filter } from 'lodash';
import { useCops } from './context/copsContext';
import { useLocation, Link } from 'react-router-dom';

export const Search = props => {
	const { results, setSearchResults } = props
	const { copsConfig } = useCops();
	const { cops } = copsConfig;

	const [searchRes, setSearchRes] = useState([])

	let keyword = useLocation().search.match(/\?keyword=(.*)/)
	if (keyword.length === 2) {
		keyword = keyword[1]
	}

	useEffect(() => {
    fetch(`/search?searchquery=${keyword}`)
    .then(result => result.json())
    .then(searchRes => setSearchRes(searchRes))
  }, [])

  console.log(searchRes)

	let v = keyword
	useEffect(() => {
		if (results.length === 0 && cops) {
	  	let filterResults = filter(cops, function(e) {
	  		return e.last_name.toLowerCase() === v.toLowerCase() ||
	  			e.first_name.toLowerCase() === v.toLowerCase();
	  	})
	  	//stops infinite loop if there are no results
	  	if (filterResults.length === 0) {
	  		return
	  	}
	  	setSearchResults(filterResults);
		}  
	}, [cops, results])
	
	return (
		<div>
			<h1>Search results: </h1>
			<ul>
			{results.map(e => (
					<li>
						<Link to={`/cop/${e.id}`}>{`${e.first_name} ${e.last_name}`}</Link>
					</li>
				))
			}
			</ul>
		</div>
	)
}