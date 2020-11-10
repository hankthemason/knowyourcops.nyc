import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
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
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'

function App() {

  //temporary example
  const [searchResults, setSearchResults] = useState([]);

  return (
    <ViewConfigProvider>
      
        <Router>
          <Switch>
            <Route exact path="/cop/:id">
            <CopsProvider>
              <CopProvider>
                <CopPage />
              </CopProvider>
              </CopsProvider>
            </Route>
            <Route path="/cops">
            <CopsProvider>
              <CopsTable setSearchResults={setSearchResults}/>
            </CopsProvider>
            </Route>
                <Route path ="/command_unit/:id">
                <CommandUnitsProvider>
                  <CommandUnitProvider>
                    <CommandUnitPage />
                  </CommandUnitProvider>
                </CommandUnitsProvider>
                </Route>
                <Route path="/command_units">
                <CommandUnitsProvider>
                  <CommandUnitsTable />
                </CommandUnitsProvider>
                </Route>
            <Route path="/search/model=:model" >
              <Search results={searchResults} setSearchResults={setSearchResults} />
            </Route>
          </Switch>
        </Router>
    </ViewConfigProvider>
  );
}

export default App;
