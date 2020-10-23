import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { CopsTable } from './cops';
import { CopPage } from './cop';
import { Search } from './search';
import { CopsProvider } from './context/copsContext';
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
            <CopPage />
          </Route>
          <Route path="/cops">
            <CopsTable setSearchResults={setSearchResults}/>
          </Route>
          <Route path="/allegations">
            {}
          </Route>
          <Route path="/search" >
            <Search results={searchResults} setSearchResults={setSearchResults} />
          </Route>
        </Switch>
      </Router>
    </CopsProvider>
  );
}

export default App;
