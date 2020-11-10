import React, {useEffect, useState} from 'react';
import { filter } from 'lodash';
import { useLocation, useParams, Link } from 'react-router-dom';

export const Search = props => {
	
	const [ searchResults, setSearchResults ] = useState();

	const { model } = useParams()

	let keyword = useLocation().search.match(/\?searchquery=(.*)/)
	if (keyword.length === 2) {
		keyword = keyword[1]
	}

	useEffect(() => {
    fetch(`/search/model=${model}?searchquery=${keyword}`)
    .then(result => result.json())
    .then(searchResults => setSearchResults(searchResults))
  }, [])

  let type;
  let identifier;

  useEffect(() => {
  	if (searchResults != undefined) {
  		type = searchResults.type
  		identifier = searchResults.identifier
  	}
  }, [searchResults])
	
	return (
		<div>
			<h1>Search results: </h1>
			<ul>
			{searchResults != undefined ? 
				searchResults.results.map(e => (
						<li>
							<Link to={`/${type}/${e.id}`}>{`${e.id}`}</Link>
						</li> 
					))
				: null }
			</ul>
		</div>
	)
}