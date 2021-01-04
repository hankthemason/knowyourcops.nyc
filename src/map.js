import React, { useEffect, useRef, useState } from "react";
import { usePrecinctsMap } from './context/precinctsMapContext'
import * as d3 from "d3";
import values from 'lodash'

export const PrecinctsMap = props => {

	const { mapData: data, commandUnits } = usePrecinctsMap()

	//console.log(commandUnits)

  data.features.map(e => {
		const match = commandUnits.filter(unit => unit.unit_id === e.properties.precinctString)
		//console.log(e.properties.precinctString)
    //console.log(match)
    match.length ? e.properties.id = match[0].id : e.properties.id = null
	})

	const containerRef = useRef()
  //console.log(containerRef)

	useEffect(() => {

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

		const projection = d3.geoAlbers().fitExtent([[20, 20], [300, 300]], data)

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
        .on("mouseover", function(event, d) {
          d3.select(event.currentTarget)
            .attr('stroke', '#000000')
            .attr('stroke-width', .5)
            .raise()
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
    		// .attr("href", function(d) {
      //     return (d.properties.id ?
    		// 	 (`command_unit/${d.properties.id}`) : (`command_unit/empty_precinct`))
    		// })
    	.append("path")
        .attr('d', pathGenerator)
    	.attr('class', 'precinct')
    	.attr('fill', 'white')
    	.attr('stroke', '#999999')
    	.attr('stroke-width', '.2')
    	.on("mouseover", function(event,d) {
    		
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

       	d3.select(event.currentTarget)
       		.attr('stroke', '#000000')
       		.attr('stroke-width', .5)
       		.raise()
      })
    	.on("mouseout", function(event, d) {
       	tooltip.transition()
        	.duration(500)
         	.style("opacity", 0);

        d3.select(event.currentTarget)
        	.attr('stroke', '#999999')
        	.attr('stroke-width', '0.2')
        	.lower()

       });
	}, [])

	return (
		<div ref={containerRef} className="container"style={{ marginBottom: "2rem", position: "relative" }}>
    </div>
	)
}