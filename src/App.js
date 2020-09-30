import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import { CopsTable } from './cops';

function App() {
  const [cop, setCop] = useState(null);

  useEffect(() => {
    fetch("/cops/id=666")
    .then(result => result.text())
    .then(copName => setCop(copName))
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        {<CopsTable />}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {cop}
        </a>
      </header>
    </div>
  );
}

export default App;
