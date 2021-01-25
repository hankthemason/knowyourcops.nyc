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
	
	const [lineData, setLineData] = useState()
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
        text: title,
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

  useEffect(() => {
    setLineData({
      labels: [...dataKeys],
      datasets: [
        {
          label: "Complaints by year",
          data: [...dataValues],
          fill: false,
          pointBackgroundColor: '#123456',
          borderColor: '#ABCDEF',
          lineTension: 0 
        }
      ]
    })
    setLineOptions({
      options: {
        ...lineOptions.options,
        title: {
          ...lineOptions.options.title,
          text: title
        }
      }
    })
  }, [data])

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