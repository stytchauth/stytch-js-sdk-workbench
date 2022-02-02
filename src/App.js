import React,  {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';


const stytch = Stytch('public-token-live-5691c5a7-863e-4241-be93-056ee0756672')



function App() {
  
  const stytch = useStytch();
  console.log(stytch);
  
  const sendEmail = React.useCallback(() => {
     stytch.client.magicLinks.email.send({
        email: "max@stytch.com",
        signup_magic_link_url: "https://sdk-app.max.dev.stytch.com/workbench",
        login_magic_link_url: "https://sdk-app.max.dev.stytch.com/workbench",
      });
  }, [stytch])
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and your changes will live-update automatically.
        </p>
        <button onClick={sendEmail}> email </button>
      </header>
    </div>
  );
}

export default App;
