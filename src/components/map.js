import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useMaps } from '../context/mapsContext'
import { useViewConfig } from '../context/viewConfigContext'
import { makeStyles } from '@material-ui/core/styles';
import { values } from 'lodash'
import { MuiSelect } from './muiSelect'

const useStyles = makeStyles(theme => ({
	selected: {
		fill: theme.palette.primary.light,
	},
	unselected: {
		fill: 'transparent',
	}
}))

export const PrecinctsMap = props => {

	//get the main geoJsonData
	const { mapData, commandUnits } = useMaps()

	//get the page-specific data
	const { height, width, type, dataPoint, pageData, select, selectHandler, screen } = props
	const svgWidth = width + 50
	let tooltipLabel
	
	if (dataPoint === 'allegations' || dataPoint === 'num_allegations') {
		tooltipLabel = 'Allegations'
	} else if (dataPoint === 'complaints') {
		tooltipLabel = 'Complaints'
	}

	let sequentialScale
	let max

	//get the max value if the map is heat style
	if (type === 'heat') {
		max = pageData.reduce((acc, current) => {
			acc = current[dataPoint] > acc ? current[dataPoint] : acc
			return acc
		}, 0)
		sequentialScale = d3.scaleSequential([0, max], d3.interpolateBlues)
	}

	mapData.features.map(e => {
		const match = commandUnits.filter(unit => unit.unit_id === e.properties.precinctString)
    match.length ? e.properties.id = match[0].id : e.properties.id = null
	})

	const containerRef = useRef()
	const classes = useStyles()

	const [size, setSize] = useState(window.innerWidth)

	const tooltipMouseOver = (event, d) => {
		const match = getMatch(pageData, d)
		const rect = d3.select(".map-container").node().getBoundingClientRect()
		var tooltip = d3.select(".tooltip")
		
		tooltip
		.style("left", (event.pageX - rect.x) + "px")
  	.style("top", (event.pageY - rect.y + 20) + "px")
		.transition()
   	.duration(100)
   	.style("opacity", .9)
   	
   	if (type === 'heat') {
      match ? 
     	tooltip.html("<strong> Precinct: " + d.properties.precinct + "</strong>"
     								+ "<br>" + `${tooltipLabel}: ` + match[dataPoint]) : 
     	tooltip.html("<strong> Precinct: " + d.properties.precinct + "</strong>"
     								+ "<br>" + `${tooltipLabel}: ` + 0)
   	} else if (type === 'commandUnit') {
   		tooltip.html("<strong> Precinct: " + d.properties.precinct + "</strong>")
   	}
  }

	const getMatch = (pageData, mapDatum) => {
		const match = pageData.find(e => {
  		if (e.precinct === parseInt(mapDatum.properties.precinct)) {
  			if (e.unit_id) {
  				return e.unit_id.endsWith('PCT') ? e : undefined
  			}
  			return e
  		}
  	})
  	return match
	}

	useEffect(() => {
		
		const handleResize = () => {
			setSize(window.innerWidth)
		}

		window.addEventListener('resize', handleResize)

		d3.selectAll("#precinctPath")
			.each(function(d) {
				d3.select(this)
				.on("mouseover mousemove", tooltipMouseOver)
		})

		return () => window.removeEventListener("resize", handleResize)
	}, [size])

	//update elements if the data changes
	useEffect(() => {
		
		var tooltip = d3.select(".tooltip")
		let rect = containerRef.current.getBoundingClientRect()
		
		if (type === 'heat') {
			d3.selectAll("#precinctPath")
					.each(function(d) {
					d3.select(this)
						.attr('fill', d => {
							const match = getMatch(pageData, d)
			      	if (match != undefined) {
		            return sequentialScale(match[dataPoint])
		        	}
		        	return 'transparent' 
				    })
				    .on("mouseover mousemove", tooltipMouseOver)
				})
		} else {
			d3.selectAll("#precinctPath")
				.each(function(d) {
					d3.select(this)
					.on("mouseover mousemove", tooltipMouseOver)
				})
		}
	}, [pageData])

	useEffect(() => {

		const projection = d3.geoAlbers().fitExtent([[0, 20], [height, width]], mapData)

		const pathGenerator = d3.geoPath().projection(projection)
		
		let rect = containerRef.current.getBoundingClientRect()
		
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
			.attr("width", function() {
				return screen < 500 ? screen - 50 : `${svgWidth}`
			})
			.attr("z-index", -1)

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
        .append("a")
      	//this allows you to conditionally set an "href" attr, only for precincts that actually have allegations
      	//another alternative would be to set up a default page for precincts that don't have allegations
        .each(function(d) {
          const a = d3.select(this)
          if (d.properties.id) {
            a.attr("href", function(d) {
              return (`/command_unit/${d.properties.id}`)
            })
          }
        })
    		.append("path")
    			.attr('id', 'precinctPath')
        	.attr('d', pathGenerator)
        	.each((d, i, nodes) => {
        		if (type === 'heat') {
        			d3.select(nodes[i])
			        	.attr('fill', d => {
			        		//for now, 'DET' command units aren't included
			          	const match = pageData.find(e => {
			          		if (e.precinct === parseInt(d.properties.precinct)) {
			          			if (e.unit_id) {
			          				return e.unit_id.endsWith('PCT') ? e : undefined
			          			}
			          			return e
			          		}
			          	})
		          	if (match != undefined) {
		            	return sequentialScale(match[dataPoint])
		          	}
		          	return 'transparent' 
		        	})
		        } else if (type === 'commandUnit') {
		        	d3.select(nodes[i])
		        		.attr('class', d => {
		        		return (
		        			d.properties.precinctString === pageData[0].unit_id || 
		        			d.properties.precinctFull === pageData[0].unit_id.slice(0, 3)) ? 
		        				`${classes.selected}` : 
		        				`${classes.unselected}`
		        	})
		        }
		      })
    			.on("mouseover mousemove", tooltipMouseOver)
		    	.on("mouseout", function(event, d) {
		       	tooltip.transition()
		        	.duration(100)
		         	.style("opacity", 0);
		       });
	}, [])


return (
	<div ref={containerRef} className="map-container" style={{position: 'relative'}}>
		{select ? <MuiSelect handler={selectHandler} style={{marginTop: '1rem', position: 'absolute'}}/> : null}
	</div>
		)
}