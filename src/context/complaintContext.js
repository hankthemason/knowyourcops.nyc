import React, 
			{ useContext, 
				createContext, 
				useState, 
				useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useComplaints } from './complaintsContext';
import { useViewConfig } from './viewConfigContext'
import { DefaultViewConfig } from '../types/default';
import { map, range, reduce } from 'lodash'

const ComplaintContext = createContext();

export const useComplaint = () => {
	const ctx = useContext(ComplaintContext);
	if (ctx === undefined) {
		throw new Error('you need to call useComplaint inside of ComplaintProvider')
	}
	return ctx
}

export const ComplaintProvider = (props) => {

	const { id } = useParams();
	const { complaints } = useComplaints();

	const [complaint, setComplaint] = useState(null);
	const [associatedCommandUnits, setAssociatedCommandUnits] = useState(null);

	useEffect(() => {
		fetch(`/complaint/id=${id}/command_units`)
		.then(result => result.json())
		.then(associatedCommandUnits => setAssociatedCommandUnits(associatedCommandUnits))
	}, [])

	useEffect(() => {
		const c = complaints.find(obj => {
			return obj.id === parseInt(id)
		})
		if (c === undefined) {
			fetch(`/complaint/id=${id}`)
			.then(result => result.json())
			.then(complaint => setComplaint(complaint[0]))
		} else {
			setComplaint(c)
		}
	}, [])

	const complaintConfig = { complaint, associatedCommandUnits }

	return (
		<ComplaintContext.Provider value={complaintConfig}>
			{ complaint ? props.children : null }
		</ComplaintContext.Provider>
		)
}