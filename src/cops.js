import React, {useState, useEffect} from 'react';

export const CopsTable = (props) => {

	const [cops, setCops] = useState([]);

	useEffect(() => {
		fetch("/cops")
		.then(result => result.json())
		//this sets 'cops' equal to the copList returned above
		.then(copList => setCops(copList))
	})

	console.log(cops);

	return (
		<div>
			<table>
				<thead>
					<tr>
						<th colspan="4">cops table</th>
					</tr>
				</thead>
				<tbody>
					{cops.map(entry => (
						<tr>
							<td>
								{`${entry.first_name} ${entry.last_name}`}
							</td>
							<td>
								{`${entry.command_unit_full ? entry.command_unit_full : entry.command_unit }`}
							</td>
							<td>
								{`Allegations: ${entry.num_allegations}`}
							</td>
							<td>
								{`Ethnicity: ${entry.ethnicity}`}
							</td>
						</tr>
						)
					)}
				</tbody>
			</table>


			{cops.map(entry => (
				<div>
					{`${entry.first_name} ${entry.last_name}`}
					<a href="/precincts">
						{`Precinct: ${entry.precinct}`}
					</a>
						
				</div>
			)
			)}
		</div>
	)
}