import React, { useEffect, useRef, useState } from 'react';
import Chartjs from 'chart.js';
import { Bar } from 'react-chartjs-2'
import { keys, values } from 'lodash'

export const BarChart = (props) => {
  const {data, title} = props;

  let chartLabels = keys(data)
  let chartData = values(data)
  const yScaleMax = Math.max(...chartData) % 2 === 1 ? Math.max(...chartData) + 5 : Math.max(...chartData) + 4
  
  //set data
  const [barData, setBarData] = useState({
    labels: [...chartLabels],
    datasets: [
      {
        label: '',
        data: [...chartData],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderWidth: 3
      }
    ]
  });
  //set options
  const [barOptions, setBarOptions] = useState({
    options: {
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
});

  return (
    <div className="BarChart">
      <Bar 
        data={barData}
        width={600}
        height={400}
        options={ barOptions.options }
        />
    </div>
  )
}
  

