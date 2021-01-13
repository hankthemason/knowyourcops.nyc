import React, { useEffect, useRef, useState } from "react";
import { usePrecinctsMap } from './context/precinctsMapContext'
import { useCommandUnits } from './context/commandUnitsContext'
import { useViewConfig } from './context/viewConfigContext'
import { PrecinctsMap } from './components/map'
import { useMaps } from './context/mapsContext'
import * as d3 from "d3";
import values from 'lodash'

export const MainMap = props => {
  const { setCurrentView } = useViewConfig()
  const componentName = 'precinctsMap'
  setCurrentView(componentName)
  
  const {commandUnits} = useMaps()

  const mapFloat = 'none'
  const pageData = commandUnits
  const mapType = 'heat'
  const dataPoint = 'num_allegations'

	return (
		<div>
      <PrecinctsMap height={500} width={500} type={mapType} float={mapFloat} dataPoint={dataPoint} pageData={pageData}/>
    </div>
	)
}