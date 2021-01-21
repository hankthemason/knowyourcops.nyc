import React, { useState } from 'react';

export const Button = (props) => {
  return (
  	<div style={{position: 'relative',
  								display: 'inline-block',
  								margin: '.25rem'}}>
	  	<button onClick={props.handler}>
	  		{props.display}
	  	</button>
  	</div>
  )
};
