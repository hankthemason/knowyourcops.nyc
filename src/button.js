import React, { useState } from 'react';

var buttonStyle = {
  margin: '10px 10px 10px 0'
};

export const Button = (props) => {
  return (
  	<div>
	  	<button style={buttonStyle}
	  					onClick={props.handler}>
	  		{props.display}
	  	</button>
  	</div>
  )
};
