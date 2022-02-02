import React, { useRef, useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

const stytch = window.Stytch(
  "public-token-live-5691c5a7-863e-4241-be93-056ee0756672"
);

function EmailLogin() {
  const emailRef = useRef();

  const onSubmit = (e) => {
    e.preventDefault();
    stytch.client.magicLinks.email.send({
      email: emailRef.current.value,
      signup_magic_link_url: "https://kindhearted-longing-woodpecker.glitch.me",
      login_magic_link_url: "https://kindhearted-longing-woodpecker.glitch.me",
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="email" name="email" ref={emailRef} required />
      <input type="submit" value="Submit" />
    </form>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    stytch.client.sessions
      .authenticate()
      .then((data) => setLoggedIn(true))
      .catch(() => setLoggedIn(false));
  }, []);
  
  useEffect(() => {
    new URL(window.location.href).query
  }, [])

  const content = loggedIn ? (
    "You are logged in. Good for you, pal."
  ) : (
    <EmailLogin />
  );

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{content}</p>
      </header>
    </div>
  );
}

export default App;
