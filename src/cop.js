import React, {useState, useEffect} from 'react';

export const CopPage = (props) => {

	//is 'cop's initial state an empty object?
	const [cop, setCop] = useState({});

	useEffect(() => {
		fetch("/cops/id=:id")
		.then(result => result.json())
		//this sets the 'cop' equal to the cop returned above
		.then(cop => setCop(cop))
	})

	console.log(cop);

}