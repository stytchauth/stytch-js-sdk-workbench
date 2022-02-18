import React from "react";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import "./App.css";
import line from './line.svg'
import Authenticate from "./Authenticate";
import {Home, LinkOAuth, WebAuthn, SessionManagement} from "./Pages";
import Login from "./Login";

import {RequireLogin, RequireLoggedOut} from './Stytch';

function App() {
  return (
    <Router>
      <div className="page" style={{backgroundImage: `url(${line})` }}>
        <Routes>
          <Route
            path="/authenticate"
            element={<Authenticate/>}
          />
          <Route path="/login" element={<RequireLoggedOut><Login/></RequireLoggedOut>}/>
          <Route path="/home" element={<RequireLogin> <Home/> </RequireLogin>}/>
          <Route path="/oauth" element={<RequireLogin> <LinkOAuth/> </RequireLogin>}/>
          <Route path="/webauthn" element={<RequireLogin> <WebAuthn/> </RequireLogin>}/>
          <Route path="/session" element={<RequireLogin> <SessionManagement/> </RequireLogin>}/>
          <Route path="*" element={<Navigate to="/login" replace/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
