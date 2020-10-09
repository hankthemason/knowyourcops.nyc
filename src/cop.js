import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';

export const CopPage = (props) => {
	const { cops } = props;

	const {id} = useParams();
	
	const name = cops[id].first_name;
	const allegations = cops[id].num_allegations;
	return (
		<div>
			{id}, {name}, allegations: {allegations}
		</div>
	)
}