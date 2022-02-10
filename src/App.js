import React, {useEffect} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Authenticate from "./Authenticate";
import Home from "./Home";
import Login from "./Login";

import stytch from './Stytch';

function App() {
  const [user, setUser] = React.useState(stytch.user.getSync());
  useEffect(() => {
    return stytch.user.onChange(user => setUser(user))
  }, []);
  
  const [session, setSession] = React.useState(stytch.session.getSync());
  useEffect(() => {
    return stytch.session.onChange(sess => setSession(sess))
  }, []);
  
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
            <Route path="/" element={<Home session={session} user={user} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
