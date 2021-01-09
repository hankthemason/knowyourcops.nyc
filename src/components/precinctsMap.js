import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useMaps } from '../context/mapsContext'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	selected: {
		fill: theme.palette.primary.main,
	},
	unselected: {
		fill: theme.palette.background.secondary,
	}
}))

export const PrecinctsMap = props => {

	const classes = useStyles()

	const { height, width, type, pageData } = props

	const { mapData } = useMaps()

	const containerRef = useRef()

	useEffect(() => {

		const projection = d3.geoAlbers().fitExtent([[0, 20], [height, width]], mapData)

		const pathGenerator = d3.geoPath().projection(projection)

		const svg = d3.select(containerRef.current)
			.append("svg")
			.attr("height", `${height}`)
			.attr("width", `${width}`)

		svg.append("g")
			.selectAll("g")
			.data(mapData.features)
			.join("g")
				.attr('stroke', '#000000')
        .attr('stroke-width', '.2')
      .append("path")
        .attr('d', pathGenerator)
        .attr('class', d => {
        	return (d.properties.precinctString === pageData.unit_id || d.properties.precinctFull === pageData.unit_id.slice(0, 3)) ? `${classes.selected}` : `${classes.unselected}`
        })

	}, [])

	return (
		<div ref={containerRef} className="container" style={{ marginBottom: "2rem", paddingRight: "12rem", position: "relative", float: "right" }}>
		</div>
		)
}