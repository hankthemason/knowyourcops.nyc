import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

export const CopPage = (props) => {
	const { cops } = props;

	const {id} = useParams();

	console.log(cops)
	
	const name = cops[id].first_name;
	return (
		<div>
			{id}, {name}
		</div>
	)
}