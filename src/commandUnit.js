import React, { useState, useEffect } from 'react';
import { useCommandUnit } from './context/commandUnitContext' 

export const CommandUnitPage = props => {
	const { commandUnit: c } = useCommandUnit()

	return (
		<div>
			<p> Command Unit: {c.command_unit_full != null ? c.command_unit_full : c.unit_id } </p>
			<p> Associated Precinct: {c.precinct}</p>
			<p> Number of allegations:  {c.num_allegations}</p>
			<p> Number of complaints:  {c.num_complaints}</p>
			<p> Number of allegations substantiated:  </p>
		</div>
	)
}