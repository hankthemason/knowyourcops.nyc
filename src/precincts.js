import React, {useState, useEffect} from 'react';

export const PrecinctsTable = (props) => {
	const [precincts, setPrecincts] = useState([]);

	useEffect(() => {
		fetch("/precincts")
		.then(result => result.json())
		.then(precinctList => setPrecincts(precinctList))
	})

	console.log(precincts);

	return (
		<div>
			hi
		</div>
	)
}