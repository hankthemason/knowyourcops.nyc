import React, { useState } from 'react';
import { values } from 'lodash';

export const DropDown = (props) => {

  function onSelectChange(event) {
    props.handler(event.target.value) 
  }
  console.log(props.id, props.value)
	
  return (
    <select onChange={onSelectChange} value={props.value}>
    	{props.options.map(entry => (
    		<option 
            key={`${entry.id}`}
            value={`${entry.id}`}>
    		  	{entry.title != undefined ? `${entry.title}` : `${entry.value}`}
    		</option>
    		)
    	)}
    </select>
  );
}