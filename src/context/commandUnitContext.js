import React, 
			{ useContext, 
				createContext, 
				useState, 
				useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useCommandUnits } from './commandUnitsContext';

const CommandUnitContext = createContext();

export const useCommandUnit = () => {
	const ctx = useContext(CommandUnitContext);
	if (ctx === undefined) {
		throw new Error('you need to call useCommandUnit inside of CommandUnitProvider')
	}
	return ctx
}

export const CommandUnitProvider = (props) => {
	const { id } = useParams();
	const { commandUnits } = useCommandUnits();

	let commandUnit = commandUnits.find(obj => obj.id === parseInt(id))
	console.log(commandUnit)

	

	
	return (
		<CommandUnitContext.Provider value={{commandUnit}}>
			{ commandUnit ? props.children : null}
		</CommandUnitContext.Provider>
	)
}
