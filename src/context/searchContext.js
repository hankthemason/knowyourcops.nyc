import React, { useContext, 
								useState,
								useEffect,
								createContext } from 'react'
import { useParams, useLocation } from 'react-router-dom'

const SearchContext = createContext();

export const useSearch = () => {
	const ctx = useContext(SearchContext);
	if (ctx === undefined) {
		throw new Error('you need to call useSearch inside of SearchProvider')
	}
	return ctx
}

export const SearchProvider = (props) => {
	console.log('in the sp')

	const [ searchResults, setSearchResults ] = useState()

	const { model } = useParams()

	let keyword = useLocation().search.match(/\?searchquery=(.*)/)
	if (keyword.length === 2) {
		keyword = keyword[1].trim()
	}

	useEffect(() => {
    fetch(`/search/model=${model}?searchquery=${keyword}`)
    .then(result => result.json())
    .then(searchResults => setSearchResults(searchResults))
  }, [keyword])

	return (
		<SearchContext.Provider value={searchResults}>
			{ searchResults ? props.children : null }
		</SearchContext.Provider>
	)
}