import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { CopsTable } from './cops';
import { CopPage } from './cop';
import { ViewConfigProvider } from './context/viewConfig'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'

function App() {
  const [cops, setCops] = useState(null);
  const [allegations, setAllegations] = useState(null);

  useEffect(() => {
    fetch("/cops")
    .then(result => result.json())
    .then(cops => setCops(cops))
  }, [])

  useEffect(() => {
    fetch("/allegations")
    .then(result => result.json())
    .then(allegations => setAllegations(allegations))
  }, [])

  return (
    <ViewConfigProvider>
      <Router>
        <Switch>
          <Route path="/cop/:id">
            {cops ? <CopPage cops={cops} /> : null}
          </Route>
          <Route path="/cops">
            {cops ? <CopsTable cops={cops} /> : null}
          </Route>
          <Route path="/allegations">
            {}
          </Route>
        </Switch>
      </Router>
    </ViewConfigProvider>
  );
}

export default App;
