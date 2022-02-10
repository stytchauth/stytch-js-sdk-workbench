import React, {useEffect} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Authenticate from "./Authenticate";
import Home from "./Home";
import Login from "./Login";

import {RequireLogin, RequireMFA} from './Stytch';



function App() {  
  return (
    <Router>
      <div className="App">
        <header className="App-header" />
        <div className="App-content">
          <Routes>
            <Route
              path="/authenticate"
              element={<Authenticate />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<RequireLogin> <Home /> </RequireLogin>} />
            <Route path="/home" element={<RequireLogin> <Home /> </RequireLogin>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
