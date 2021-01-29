export const checkOrder = order => {
	if (typeof(order) !== 'string') {
		return false
	} else if (order.toLowerCase() !== 'asc' && 
						order.toLowerCase() !== 'desc') {
		return false
	}
	return true
}

export const checkOrderBy = orderBy => {
	const regex = /^[A-Za-z_]+$/
	if (typeof(orderBy) !== 'string') {
		return false
	} else if (!orderBy.match(regex)) {
		return false
	}
	return true
}

export const checkSearchQuery = searchQuery => {
	const regex = /^[A-Za-z0-9_\s]+$/
	if (typeof(searchQuery) !== 'string') {
		return false
	} else if (!searchQuery.match(regex)) {
		return false
	}
	return true

}
