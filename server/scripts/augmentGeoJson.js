export const augmentGeoJson = jsonObject => {

	jsonObject.features.forEach(e => {
		e.properties.precinctFull = e.properties.precinct.toString().padStart(3, '0')
		e.properties.precinctString = e.properties.precinct.toString().padStart(3, '0') + " PCT"
	})

	return jsonObject
	
}