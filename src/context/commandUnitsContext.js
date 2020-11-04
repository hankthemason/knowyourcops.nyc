import React, { useContext, 
								createContext, 
								useState, 
								useEffect } from 'react';
import { reduce } from 'lodash';
import { useViewConfig } from './viewConfigContext'

const CommandUnitsContext = createContext();

export const useCommandUnits = () => {
	const ctx = useContext(CommandUnitsContext);
	if (ctx === undefined) {
		throw new Error ('you need to call useCommandUnits inside of CommandUnitsProvider')
	}
	return ctx
}

export const CommandUnitsProvider = props => {

	const { viewConfig } = useViewConfig();
	const { order, 
		setOrder, 
		toggleOrder,
		page,
		setPage,
		orderBy,
		setOrderBy,
		orderByOptions,
		pageSize,
		setPageSize,
		pageSizeOptions } = viewConfig

	const [commandUnits, setCommandUnits] = useState(null);

	

	//get the total number of rows in order to populate
	//paginate component
	const [total, setTotal] = useState(0)

	useEffect(() => {
		fetch(`/total_rows/table=commandUnits`)
		.then(result => result.json())
		.then(total => setTotal(total[0].rows))
	}, [])

	useEffect(() => {
		if (order && page && orderBy && pageSize) {
			fetch(`/command_units/orderBy=${orderBy.value}/order=${order}/page=${page}/pageSize=${pageSize.value}`)
			.then(result => result.json())
			.then(commandUnits => {setCommandUnits(commandUnits)})
		}
	}, [page, pageSize, orderBy, order])

	const settings = { page, 
										setPage, 
										pageSize, 
										setPageSize, 
										order, 
										setOrder, 
										orderBy, 
										setOrderBy,
										pageSizeOptions, 
										orderByOptions,
										toggleOrder,
										total }

	return (
		<CommandUnitsContext.Provider value={{settings, commandUnits}}>
			{ commandUnits ? props.children : null}
		</CommandUnitsContext.Provider>
	)
}