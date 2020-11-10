import React, {useEffect, useState} from 'react';
import { filter } from 'lodash';
import { useLocation, useParams, Link } from 'react-router-dom';
import { useSearch } from './context/searchContext'

export const Search = props => {
	
	const searchResults = useSearch()
	
	const type = searchResults.type
	const identifier = searchResults.identifier
	const display = searchResults.display
	
	return (
		<div>
			<h1>Search results: </h1>
			<ul>
				{searchResults ? 
					searchResults.results.map(e => (
						<li>
							<Link to={`/${type}/${e.id}`}>
								{	searchResults.display ? `${e[display[0]]} ${e[display[1]]}` :
									`${e[identifier[0]]}` ? `${e[identifier[0]]}` : `${e[identifier[1]]}` }
							</Link>
						</li> 
					))
				: null }
			</ul>
		</div>
		
	)
}

