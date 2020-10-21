import React, { useEffect, useRef, useState } from 'react';
import Chartjs from 'chart.js';
import { Line } from 'react-chartjs-2';
import { keys, values } from 'lodash';

export const LineChart = (props) => {
	const {data, title} = props;
  //console.log('data: ' + data)
	let dataKeys = keys(data)
	let dataValues = values(data)
	let maxValue = Math.max(...dataValues)

  // dataKeys.map((element, index) => {
  //   const date = new Date(element, 0);
  //   // const year = date.getFullYear()
  //   dataKeys[index] = date
  // })
  // console.log(dataKeys)
	
	const [lineData, setLineData] = useState({
		labels: [...dataKeys],
		datasets: [
		  {
		    label: "Complaints by year",
		    data: [...dataValues],
		    fill: false,
		    backgroundColor: "rgba(75,192,192,0.2)",
		    borderColor: 'rgba(54, 162, 235, 0.6)',
		    lineTension: 0
		  }
		]
	})

	const [lineOptions, setLineOptions] = useState({
	  options: {
    	scales: {
    		yAxes: [
    			{
    				ticks: {
              min: 0,
    					suggestedMax: maxValue + 1,
    					stepSize: 1
    				}
    			}
    		],
        // xAxes: [
        //   {
        //     ticks: {
        //       suggestedMin: 1996
        //     }
        //   }
        // ]
      	xAxes: [
      		{
            ticks: {
            },
        		type: 'time',
        		time: {
        			unit: 'year',
              displayFormats: { year: 'YYYY'}
        		}
      		}
      	]
    	},
    	title: {
        display: true,
        text: props.title,
        fontSize: 25
      },
      legend: {
        display: false,
        position: 'top'
      },
      responsive: false,
      maintainAspectRatio: true
  	}
	})

	return (
		<div className="LineChart">
			<Line 
				data={lineData} 
        options={lineOptions.options}
        width={600}
        height={400}
        />
		</div>
	)
}