import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useMaps } from '../context/mapsContext'
import { makeStyles } from '@material-ui/core/styles';
import { values } from 'lodash'

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

	let max
	let sequentialScale

	if (type === 'heat') {
		max = pageData.reduce((acc, current) => {
			acc = current.allegations > acc ? current.allegations : acc
			return acc
		}, 0)

		sequentialScale = d3.scaleSequential([0, max + 1], d3.interpolateBlues)
	}

	useEffect(() => {

		const projection = d3.geoAlbers().fitExtent([[0, 20], [height, width]], mapData)

		const pathGenerator = d3.geoPath().projection(projection)

		var tooltip = d3.select(containerRef.current)
			.append("div")
    	.attr("class", "tooltip")
    	.style("position", "absolute")
    	.style("opacity", 0)
    	.style("pointer-events", "none")
    	.style("border", "1px solid black")
    	.style("background", "white")

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
        .each((d, i, nodes) => {
        	if (type === 'commandUnit') {
        		d3.select(nodes[i])
		        .attr('class', d => {
		        	return (d.properties.precinctString === pageData.unit_id || d.properties.precinctFull === pageData.unit_id.slice(0, 3)) ? `${classes.selected}` : `${classes.unselected}`
		        })
		      } else if (type === 'heat') {
		      	d3.select(nodes[i])
			      	.attr('fill', d => {
			      		const precinct = parseInt(d.properties.precinct)
			      		
			      		const match = pageData.filter(e => e.precinct === precinct)

			      		return match[0] ? sequentialScale(match[0].allegations) : 'transparent'
			      	})
			    }
			  })
	}, [])

	return (
		<div ref={containerRef} className="container" style={{ marginBottom: "2rem", paddingRight: "12rem", position: "relative", float: "right" }}>
		</div>
		)
}