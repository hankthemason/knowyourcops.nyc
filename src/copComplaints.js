import React from 'react'

export const CopComplaintsTable = props => {

	const { data: complaints } = props

	return (
		<div>
		<table>
			<thead>
				<tr>
					<th>complaint_id</th>
					<th>date received</th>
					<th>date closed</th>
					<th>precinct/location of allegation</th>
					<th>number of allegations on complaint</th>
				</tr>
			</thead>
			<tbody>
				{complaints.map(entry => (
					<tr key={`${entry.id}`}>
						<td>{`${entry.id}`}</td>
						<td>{`${entry.date_received}`}</td>
						<td>{`${entry.date_closed}`}</td>
						<td>{`${entry.precinct}`}</td>
						<td>{`${entry.num_allegations_on_complaint}`}</td>
					</tr>
					)
				)}
			</tbody>
		</table>
		</div>
	)
}