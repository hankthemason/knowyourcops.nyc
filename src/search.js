import React, {useEffect, useState} from 'react';
import { filter } from 'lodash';
import { useParams, Link, useHistory } from 'react-router-dom';
import { useSearch } from './context/searchContext'
import { SearchBar } from './components/searchBar'

export const Search = props => {
	
	let searchResults = useSearch()
	
	const { model } = useParams()
	let placeHolder
	if (model === 'cops') {
		placeHolder = 'search by first or last name, full name, or badge #'
	} else if (model === 'commandUnits') {
		placeHolder = 'search for a command unit by its name or precinct number'
	}

	let history = useHistory()

	function search(v) {
		history.push(`/search/model=${model}?searchquery=${v}`)
	}

	const type = searchResults.type
	const identifier = searchResults.identifier
	const display = searchResults.display
	
	return (
		<div>
			<SearchBar handler={search} placeHolder={placeHolder}/>
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

