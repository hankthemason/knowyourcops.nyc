import React, { useState } from 'react';
import { values } from 'lodash';

export const DropDown = (props) => {

	function onSelectChange(event) {
		props.handler(event.target.value)
	}
	
  return (
    <select onChange={onSelectChange}>
    	{props.options.map(entry => (
    		<option key={`${entry.id}`}value={`${entry.id}`}>
    			{`${entry.title}`}
    		</option>
    		)
    	)}
    </select>
  );
}

// <option value="Number of Allegations">
//         Number of Allegations
//       </option>
//       <option value="Name">Name</option>
//       <option value="Precinct">Precinct</option>