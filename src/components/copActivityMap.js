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

export const CopActivityMap = props => {

	const classes = useStyles()

	const { height, width, pageData } = props

	const { mapData, commandUnits } = useMaps()

	const containerRef = useRef()

	const max = pageData.reduce((acc, current) => {
		acc = current.complaints > acc ? current.complaints : acc
		return acc
	}, 0)

	const sequentialScale = d3.scaleSequential([0, max], d3.interpolateBlues)

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
        .on("mouseover", function(event, d) {
          d3.select(event.currentTarget)
            .attr('stroke', '#000000')
            .attr('stroke-width', 1)
            .raise()
        })
        .on("mouseout", function(event, d) {
          d3.select(event.currentTarget)
            .attr('stroke', '#000000')
            .attr('stroke-width', '0.2')
            .lower()
        })
      .append("path")
        .attr('d', pathGenerator)
			  .attr('fill', d => {
			    const precinct = parseInt(d.properties.precinct)
			      		
			    const match = pageData.filter(e => e.precinct === precinct)

			    return match[0] ? sequentialScale(match[0].complaints) : 'transparent'
			  })
			  .on("mouseover mousemove", function(event,d) {
    		
		  		const precinct = parseInt(d.properties.precinct)
			      		
			    const match = pageData.filter(e => e.precinct === precinct)

		  		tooltip
		  			.style("left", (event.pageX - 1000) + "px")
		      	.style("top", (event.pageY - 28) + "px")
		    		.transition()
		       	.duration(200)
		       	.style("opacity", .9);

		      
		     	match[0] ? tooltip.html("<strong> Precinct: " + precinct + "</strong>"
		     								+ "<br>" + "Complaints: " + match[0].complaints) : 
		     							tooltip.html("<strong> Precinct: " + precinct + "</strong>"
		     								+ "<br>" + "Complaints: " + 0)
		     
		     	

      	})
		  	.on("mouseout", function(event, d) {
		     	tooltip.transition()
		      	.duration(500)
		       	.style("opacity", 0);
		    });  
	}, [])

	return (
		<div ref={containerRef} className="container" style={{ marginBottom: "2rem", paddingRight: "12rem", position: "relative", float: "right" }}>
		</div>
		)
}