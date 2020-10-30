import React, { useContext, 
								createContext, 
								useState, 
								useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useCops } from './copsContext';

const CopContext = createContext(); 

export const useCop = () => {
	const ctx = useContext(CopContext);
	if (ctx === undefined) {
		throw new Error('you need to call useCop inside of CopProvider')
	}
	return ctx
}

export const CopProvider = (props) => {
	const { id } = useParams()
	console.log(id)
	const { copsConfig } = useCops();

	const incompleteCop = copsConfig.cops.find(obj => {
		return obj.id === parseInt(id)
	})

	const [cop, setCop] = useState(null)

	const [complaintsLocations, setComplaintsLocations] = useState(null);

	const [complaintsDates, setComplaintsDates] = useState(null);

  const [complaintsWithAllegations, setComplaintsWithAllegations] = useState(null);

	useEffect(() => {
		fetch(`/cop_complaints/locations/id=${id}`)
    .then(result => result.json())
    .then(complaintsLocations => setComplaintsLocations(complaintsLocations))
    fetch(`/cop_complaints/years/id=${id}`)
    .then(result => result.json())
    .then(complaintsDates => setComplaintsDates(complaintsDates))
     fetch(`/cop_complaints/allegations/id=${id}`)
    .then(result => result.json())
    .then(complaintsWithAllegations => setComplaintsWithAllegations(complaintsWithAllegations))
	}, [])

	useEffect(() => {
		if (complaintsLocations === null || 
			complaintsDates === null || 
			complaintsWithAllegations === null) return
		setCop({
			...incompleteCop, 
			locationStats: complaintsLocations,
			yearlyStats: complaintsDates,
			complaintsWithAllegations: complaintsWithAllegations
		})
	}, [complaintsLocations, complaintsDates, complaintsWithAllegations])


	return (
		<CopContext.Provider value={{cop}}>
			{ cop ? props.children : null}
		</CopContext.Provider>
		)
}