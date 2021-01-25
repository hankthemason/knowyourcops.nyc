import React, { useEffect, useRef, useState } from 'react';
import Chartjs from 'chart.js';
import { Bar } from 'react-chartjs-2'
import { keys, values } from 'lodash'

export const BarChart = (props) => {
  const {data, title, labels, width, height, padding} = props;

  const chartLabels = labels !== undefined ? labels : keys(data) 

  let chartData = values(data)
  const yScaleMax = Math.max(...chartData) % 2 === 1 ? Math.max(...chartData) + 5 : Math.max(...chartData) + 4
  
  //set data
  const [barData, setBarData] = useState()
  //set options
  const [barOptions, setBarOptions] = useState({
    options: {
      layout: {
        padding: {
          bottom: (padding === true) ? 75 : 0,
          left: (padding === true) ? 75 : 0
        }
      },
      scales: {
        yAxes: [
         {
            ticks: {
              beginAtZero: true,
              suggestedMax: 25
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
  });

  useEffect(() => {
    setBarData({
    labels: [...chartLabels],
    datasets: [
      {
        label: '',
        data: [...chartData],
        backgroundColor: '#789ABC',
        borderWidth: 3
      }
    ]
    })
  }, [data])

  useEffect(() => {
    setBarOptions({
      options: {
        ...barOptions.options,
        title: {
          ...barOptions.options.title,
          text: title
        }
      }
    })
  }, [title])

  return (
    <div className="BarChart">
      <Bar 
        data={barData}
        width={width != undefined ? width : 600}
        height={height != undefined ? height : 400}
        options={ barOptions.options }
        />
    </div>
  )
}
  

