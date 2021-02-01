import React, { useState, useEffect } from 'react'

export const UseCurrentSize = () => {

	const [size, setSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	})

}