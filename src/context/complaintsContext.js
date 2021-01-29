import React, { useContext, createContext, useState, useEffect } from 'react';
import { useViewConfig } from './viewConfigContext';
import { DefaultViewConfig } from '../types/default';

const ComplaintsContext = createContext();

export const useComplaints = () => {
	const ctx = useContext(ComplaintsContext);
	if (ctx === undefined) {
		throw new Error('you need to call useComplaints inside of ComplaintsProvider')
	}
	return ctx
}

export const ComplaintsProvider = (props) => {

	const viewConfigName = 'complaintsViewConfig';

	const { setViewConfig, getViewConfig } = useViewConfig();

	const setComplaintsViewConfig = (viewConfig) => setViewConfig({[viewConfigName]: viewConfig})

	const getComplaintsViewConfig = () => getViewConfig(viewConfigName)

	const viewConfigExists = getComplaintsViewConfig() != undefined

	useEffect(() => {
		setComplaintsViewConfig({
			...DefaultViewConfig,
			orderBy: {
					id: 0,
					title: 'Date Received',
					value: 'date_received'
				},
			orderByOptions: [
				{
					id: 0,
					title: 'Date Received',
					value: 'date_received'
				},
				{
					id: 1,
					title: 'Date Closed',
					value: 'date_closed'
				},
				{
					id: 2,
					title: 'Associated Precinct',
					value: 'precinct'
				},
				{
					id: 3,
					title: 'Number of Allegations on Complaint',
					value: 'num_allegations'
				}
			] 
		})
	}, [viewConfigExists]);

	const [complaints, setComplaints] = useState(null)

	//get the total number of rows in order to populate
	//paginate component
	const [total, setTotal] = useState(0)

	useEffect(() => {
		fetch(`/total_rows?table=complaints`)
		.then(result => result.json())
		.then(total => setTotal(total[0].rows))
	}, [])

	const viewConfig = getComplaintsViewConfig()

	useEffect(() => {
		if (viewConfigExists) {
		  fetch(`/complaints?orderBy=${viewConfig.orderBy.value}&order=${viewConfig.order}&page=${viewConfig.page}&pageSize=${viewConfig.pageSize.value}`)
		  .then(result => result.json())
		  .then(complaints => setComplaints(complaints))
		}		 
  }, [viewConfig])

	const complaintsConfig = { complaints, total, setComplaintsViewConfig, getComplaintsViewConfig }

	return (
		<ComplaintsContext.Provider value={complaintsConfig}>
			{ complaints && viewConfigExists ? props.children : null}
		</ComplaintsContext.Provider>
	)	
}