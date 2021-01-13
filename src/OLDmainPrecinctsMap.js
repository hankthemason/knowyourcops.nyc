import React, { useEffect, useRef, useState } from "react";
import { usePrecinctsMap } from './context/precinctsMapContext'
import * as d3 from "d3";
import values from 'lodash'

export const PrecinctsMap = props => {

	const { mapData: data, commandUnits } = usePrecinctsMap()

  data.features.map(e => {
		const match = commandUnits.filter(unit => unit.unit_id === e.properties.precinctString)
    
    match.length ? e.properties.id = match[0].id : e.properties.id = null
	})

  const max = commandUnits.reduce((a, b) => {
    //the cmdunit with the most allegations is null
    if (b.unit_id.length) {
      a = Math.max(a, b.num_allegations)
    }
    return a
  }, 0)

	const containerRef = useRef()

	useEffect(() => {

    const quantizeScale = d3.scaleSequential([0, max], d3.interpolateBlues)

		var tooltip = d3.select(containerRef.current)
			.append("div")
    	.attr("class", "tooltip")
    	.style("position", "absolute")
    	.style("opacity", 0)
    	.style("pointer-events", "none")
    	.style("border", "1px solid black")
    	.style("background", "white")

		const svg = d3.select(".container")
			.append("svg")
			.attr("height", "500")
			.attr("width", "100%")

		const projection = d3.geoAlbers().fitExtent([[20, 20], [500, 500]], data)

		const pathGenerator = d3.geoPath().projection(projection)

		// svg.append("g")
		// 	.selectAll("path")
  //   	.data(data.features)
  //   	.join("path")
  //       .attr('d', pathGenerator)
  //   	.attr('class', 'precinct')
  //   	.attr('fill', 'transparent')
  //   	.attr('stroke', '#999999')
  //   	.attr('stroke-width', '1')

  	svg.append("g")
			.selectAll("g")
    	.data(data.features)
    	.join("g")
        .attr('class', 'precinct')

        .attr('stroke', '#999999')
        .attr('stroke-width', '.2')
        .on("mouseover", function(event, d) {
          d3.select(event.currentTarget)
            .attr('stroke', '#000000')
            .attr('stroke-width', 1)
            .raise()
        })
        .on("mouseout", function(event, d) {
          d3.select(event.currentTarget)
            .attr('stroke', '#999999')
            .attr('stroke-width', '0.2')
            .lower()
        })
      .append("a")
      //this allows you to conditionally set an "href" attr, only for precincts that actually have allegations
      //another alternative would be to set up a default page for precincts that don't have allegations
        .each(function(d) {
          const a = d3.select(this)
          if (d.properties.id) {
            a.attr("href", function(d) {
              return (`command_unit/${d.properties.id}`)
            })
          }
        })
    	.append("path")
        .attr('d', pathGenerator)
        .attr('fill', d => {
          const match = commandUnits.filter(e => e.unit_id === d.properties.precinctString)
          if (match[0] != undefined) {
            return quantizeScale(match[0].num_allegations)
          }
          return quantizeScale(0)
          
        })
    	.on("mouseover mousemove", function(event,d) {
    		
    		const cmdUnit = commandUnits.filter(e => e.unit_id === d.properties.precinctString)[0]

    		tooltip
    			.style("left", (event.pageX + 18) + "px")
        	.style("top", (event.pageY - 28) + "px")
      		.transition()
         	.duration(200)
         	.style("opacity", .9);

        cmdUnit ? 
       	tooltip.html("<strong> Precinct: " + d.properties.precinct + "</strong>"
       								+ "<br>" + "Allegations: " + cmdUnit.num_allegations) : 
       	tooltip.html("<strong> Precinct: " + d.properties.precinct + "</strong>"
       								+ "<br>" + "Allegations: " + 0)

      })
    	.on("mouseout", function(event, d) {
       	tooltip.transition()
        	.duration(500)
         	.style("opacity", 0);
       });
	}, [])

	return (
		<div ref={containerRef} className="container"style={{ marginBottom: "2rem", position: "relative" }}>
    </div>
	)
}