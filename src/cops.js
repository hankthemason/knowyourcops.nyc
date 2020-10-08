import React, {useState, useEffect} from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from 'react-router-dom'
import { values } from 'lodash';

export const CopsTable = (props) => {
	const { cops } = props;

	return (
		<div>
			<table>
				<thead>
					<tr>
						<th colspan="4">cops table</th>
					</tr>
				</thead>
				<tbody>
					{values(cops).map(entry => (
						<tr>
							<td>
								<Link to={`/cop/${entry.id}`}>{`${entry.first_name} ${entry.last_name}`}</Link>
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


			{values(cops).map(entry => (
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