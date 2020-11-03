import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { CopsTable } from './cops';
import { CommandUnitsTable } from './commandUnits'
import { CopPage } from './cop';
import { Search } from './search';
import { CopsProvider } from './context/copsContext';
import { CopProvider } from './context/copContext';
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
  const [allegations, setAllegations] = useState(null);

  useEffect(() => {
    fetch("/allegations")
    .then(result => result.json())
    .then(allegations => setAllegations(allegations))
  }, [])

  //temporary example
  const [searchResults, setSearchResults] = useState([]);

  return (
    <CopsProvider>
      <Router>
        <Switch>
          <Route path="/cop/:id">
            <CopProvider>
              <CopPage />
            </CopProvider>
          </Route>
          <Route path="/cops">
            <CopsTable setSearchResults={setSearchResults}/>
          </Route>
          <CommandUnitsProvider>
            <Route path ="/command_unit/:id">
              <CommandUnitProvider>
                <CommandUnitPage />
              </CommandUnitProvider>
            </Route>
            <Route path="/command_units">
              <CommandUnitsTable />
            </Route>
          </CommandUnitsProvider>
          <Route path="/search" >
            <Search results={searchResults} setSearchResults={setSearchResults} />
          </Route>
        </Switch>
      </Router>
    </CopsProvider>
  );
}

export default App;
