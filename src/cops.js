import React, {useState, useEffect} from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from 'react-router-dom'
import { values, orderBy } from 'lodash';
import { Button } from './button';
import { DropDown } from './dropdown';

export const CopsTable = (props) => {
	const { cops } = props;
	const orderOptions = [
		{
			id: 0,
			title: 'Number of Allegations',
			value: 'num_allegations',
			selected: false,
			key: 'order table by options'
		},
		{
			id: 1,
			title: 'Name',
			value: 'last_name',
			selected: false,
			key: 'order table by options'
		},
		{
			id: 2,
			title: 'Command Unit',
			value: 'command_unit_full',
			selected: false,
			key: 'order table by options'
		}
	]
	const [orderOptionsState, setOrderOptionsState] = useState(0)
	
	const [orderDir, setOrderDir] = useState(false);
	
	let sortByAlleg = orderBy(cops, orderOptionsState.value, orderDir ? 'asc' : 'desc');
	let orderDirDisplay = orderDir ? 'desc' : 'asc'

	function orderDirHandler() {
		setOrderDir(!orderDir)
	}

	function orderHandler(v) {
		console.log(v)
		setOrderOptionsState(orderOptions[v])
		console.log(orderOptionsState)
	}

	return (
		<div>
			<Button display={orderDirDisplay} handler={orderDirHandler}/>
			<DropDown options={orderOptions} handler={orderHandler}/>
			<table>
				<caption>Cops Table</caption>
				<thead>
					<tr>
						<th>name</th>
						<th>command unit</th>
						<th>number of allegations</th>
						<th>ethnicity</th>
					</tr>
				</thead>
				<tbody>
					{values(sortByAlleg).map(entry => (
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
		</div>
	)
}