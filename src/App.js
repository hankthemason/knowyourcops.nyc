import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import { NavBar } from './components/navBar'
import { CopsTable } from './cops';
import { CommandUnitsTable } from './commandUnits'
import { CopPage } from './cop';
import { Search } from './search';
import { CopsProvider } from './context/copsContext';
import { CopProvider } from './context/copContext';
import { ViewConfigProvider } from './context/viewConfigContext';
import { CommandUnitPage } from './commandUnit' 
import { CommandUnitsProvider } from './context/commandUnitsContext'
import { CommandUnitProvider } from './context/commandUnitContext'
import { SearchProvider } from './context/searchContext'
import { ComplaintsProvider } from './context/complaintsContext'
import { ComplaintsTable } from './complaints'
import { ComplaintPage } from './complaint'
import { ComplaintProvider } from './context/complaintContext'
import { MainMap } from './mainPrecinctsMap.js'
import { MapsProvider } from './context/mapsContext'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'

function App() {

  return (
    <ViewConfigProvider>
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/cop/:id">
          <CopsProvider>
            <CopProvider>
              <MapsProvider>
                <CopPage />
              </MapsProvider>
            </CopProvider>
          </CopsProvider>
          </Route>
          <Route path="/cops">
          <CopsProvider>
            <CopsTable />
          </CopsProvider>
          </Route>
          <Route path ="/command_unit/:id">
            <CommandUnitsProvider>
              <CommandUnitProvider>
                <MapsProvider>
                  <CommandUnitPage />
                </MapsProvider>
              </CommandUnitProvider>
            </CommandUnitsProvider>
          </Route>
          <Route path="/command_units">
            <CommandUnitsProvider>
              <CommandUnitsTable />
            </CommandUnitsProvider>
          </Route>
          <Route path="/search/model=:model" >
            <SearchProvider>
              <Search />
            </SearchProvider>
          </Route>
          <Route path="/complaints">
            <ComplaintsProvider>
              <ComplaintsTable />
            </ComplaintsProvider>
          </Route>
          <Route path="/complaint/:id">
            <ComplaintsProvider>
              <ComplaintProvider>
                <ComplaintPage />
              </ComplaintProvider>
            </ComplaintsProvider>
          </Route>
          <Route path="/precinctsMap">
            
            <MapsProvider>
            <CommandUnitsProvider>
              <MainMap />
            </CommandUnitsProvider>
            </MapsProvider>
            
          </Route>
        </Switch>
      </Router>
    </ViewConfigProvider>
  );
}

export default App;
