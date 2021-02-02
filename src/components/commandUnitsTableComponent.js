import React from 'react'
import {Link} from 'react-router-dom'

export const CommandUnitsTableComponent = props => {

	const { headers, headerClasses, data, view } = props

	const tableWidth = view === 'mobile' ? '100%' : '760px'

	return (
		<table style={{ minWidth: tableWidth }} id='main-table'>
			<thead>
				<tr>
					{headers.map(e => (
						<th className={headerClasses[e.type]}>{e.label}</th>
					))}
				</tr>		
			</thead>
			<tbody>
				{data.map(entry => (
					view === 'desktop' ? (
					entry.command_unit_full || entry.unit_id ? (
						<tr>
							<td>
								<Link to={`/command_unit/${entry.id}`}>
									{entry.command_unit_full != null ? entry.command_unit_full : entry.unit_id }
								</Link>
							</td>
							<td>
								{entry.unit_id ? entry.unit_id : null}
							</td>
							<td style={{textAlign: "center"}}>
								{entry.precinct != 'null' ? entry.precinct : ''}
							</td>
							<td style={{textAlign: "center"}}>
								{entry.num_allegations}
							</td>
							<td style={{textAlign: "center"}}>
								{entry.num_substantiated}
							</td>
						</tr>
					) : null )
				 : (
					entry.command_unit_full || entry.unit_id ? (
						<tr>
							<td>
								<Link to={`/command_unit/${entry.id}`}>
									{entry.command_unit_full != null ? entry.command_unit_full : entry.unit_id }
								</Link>
							</td>
							<td>
								{entry.unit_id ? entry.unit_id : null}
							</td>
							<td style={{textAlign: "center"}}>
								{entry.precinct != 'null' ? entry.precinct : ''}
							</td>
							<td style={{textAlign: "center"}}>
								{entry.num_allegations}
							</td>
						</tr>
					) : null
				)
			))}
			</tbody>
		</table>
	)
}