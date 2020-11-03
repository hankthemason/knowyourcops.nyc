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

	const [commandUnits, setCommandUnits] = useState(null);

	//make sure to use .value to access the actual value of pageSize
	const pageSizeOptions = [
		{id: 0,
		 value: 10
		},
		{id: 1,
		 value: 25
		},
		{id: 2,
		 value: 50
		},
		{id: 3,
		 value: 100
		}
	]
	
	const orderByOptions = [
		{
			id: 0,
			title: 'Number of Allegations',
			value: 'num_allegations'
		},
		{
			id: 1,
			title: 'Command Unit Name',
			value: 'unit_id'
		},
		{
			id: 2,
			title: 'Associated Precinct',
			value: 'precinct'
		},
		{
			id: 3,
			title: 'Number of Complaints',
			value: 'num_complaints'
		}
	]

	const [orderBy, setOrderBy] = useState(orderByOptions[0])

	const [order, setOrder] = useState('DESC')

	const [page, setPage] = useState(1)

	const [pageSize, setPageSize] = useState(pageSizeOptions[0])

	

	const toggleOrder = () => {
		setOrder(order === 'ASC' ? 'DESC' : 'ASC')
	}

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