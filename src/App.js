import React, {useEffect} from "react";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import "./App.css";
import line from './line.svg'
import Authenticate from "./Authenticate";
import {LinkOAuth, WebAuthn} from "./Home";
import Login from "./Login";

import {RequireLogin, RequireLoggedOut} from './Stytch';

function Secret() {
  return (<h1> You are MFA'd </h1>);
}

function App() {
  return (
    <Router>
      <div className="page" style={{backgroundImage: `url(${line})`}}>
        <div className="container">
          <div className="column">
            <Routes>
              <Route
                path="/authenticate"
                element={<Authenticate/>}
              />
              <Route path="/login" element={<RequireLoggedOut><Login/></RequireLoggedOut>}/>
              <Route path="/link" element={<RequireLogin> <LinkOAuth/> </RequireLogin>}/>
              <Route path="/webauthn" element={<RequireLogin> <WebAuthn /> </RequireLogin>} />
              {/*<Route path="/secret" element={<RequireMFA> <Secret /> </RequireMFA>} />*/}
              <Route path="*" element={<Navigate to="/login" replace/>}/>
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
