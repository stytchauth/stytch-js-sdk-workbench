import React,  {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import {loadStytch} from '@stytch/stytch-js'

const StytchPromise = loadStytch().then(Stytch => Stytch('public-token-live-5691c5a7-863e-4241-be93-056ee0756672'));

const useStytch = () => {
  const [s, setS] = useState()
  useEffect(() => { StytchPromise.then(s => setS(s)) })
  return s
}

function App() {
  
  const stytch = useStytch();
  console.log(stytch);
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and your changes will live-update automatically.
        </p>
        <button onClick={() => stytch.client.magicLinks.email.send("max@stytch.com")}> email </button>
      </header>
    </div>
  );
}

export default App;
