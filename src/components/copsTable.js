import React from 'react'
import values from 'lodash'
import {Link} from 'react-router-dom'

export const CopsTableComponent = props => {

	const { classes, headers, headerClasses, data, view } = props

return (
	<table className={classes.mainTable} id='main-table'>
		<thead className={classes.thead}>
			<tr>
				{headers.map(e => (
				<th className={headerClasses[e.type]}>
					{e.label}
				</th>
				))}
			</tr>
		</thead>
		<tbody>
			{data.map(entry => (
				view === 'desktop' ? 
				(<tr>
					<td>
						<Link to={`/cop/${entry.id}`}>{`${entry.first_name} ${entry.last_name}`}</Link>
					</td>
					<td>
						{`${entry.command_unit}`}
					</td>
					<td style={{textAlign: "center"}}>
						{entry.shield_no > 0 ? entry.shield_no : null}
					</td>
					<td style={{textAlign: "center"}}>
						{`${entry.num_allegations}`}
					</td>
					<td style={{textAlign: "center"}}>
						{`${entry.num_substantiated}`}
					</td>
					<td>
						{`${entry.ethnicity}`}
					</td>
				</tr>) : (
				<tr>
					<td>
						<Link to={`/cop/${entry.id}`}>{`${entry.first_name} ${entry.last_name}`}</Link>
					</td>
					<td>
						{`${entry.command_unit}`}
					</td>
					<td style={{textAlign: "center"}}>
						{entry.shield_no > 0 ? entry.shield_no : null}
					</td>
					<td style={{textAlign: "center"}}>
						{`${entry.num_allegations}`}
					</td>
				</tr>)
				)
			)}
		</tbody>
	</table>)
}