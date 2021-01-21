import React, { useState } from 'react'

export const SearchBar = props => {

	const { placeHolder } = props
	
	const [searchQuery, setSearchQuery] = useState(null)

	const BarStyling = 
		{width:"20rem",background:"#F2F1F9",border: "thin solid black",padding:"0.5rem"};

	function handleSearch(event) {
		if (event.keyCode === 13) {
			props.handler(searchQuery)
		}
	}

	function handleSearchQueryChange(event) {
		setSearchQuery(event.target.value)
	}

	function handleOnSubmit(event) {
		//this is to stop the page from automatically reloading
		//and deleting console.log results
		event.preventDefault()
		props.handler(searchQuery)
	}

	return (
		<div className='search-bar'>
		<form onSubmit={handleOnSubmit}>
  		<input 
  			type="text" 
  			style={BarStyling}
  			placeholder={placeHolder}
  			onChange={handleSearchQueryChange}
  		/>
  		<input type="submit" style={{marginLeft: '.25rem'}} />
		</form>	
    </div> 
  );
}


// <form onSubmit={handleOnSubmit}>
// 			  <input 
// 				  type="text"
// 				  style={BarStyling}
// 				  key="random1"
// 				  value={props.keyword}
// 				  placeholder={"search for a cop"}
// 				  onChange={handleSearchQueryChange}
// 				  onKeyDown={handleSearch}
// 				  onSubmit={handleOnSubmit}
// 			  />
// 		  <input type="submit" value="Search" onSubmit={handleOnSubmit} />
// 		  </form>