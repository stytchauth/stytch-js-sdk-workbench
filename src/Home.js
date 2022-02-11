import React from "react";
import { Link } from "react-router-dom";
import { stytch, useStytchUser } from "./Stytch";

const LoggedOut = () => {
  return (
    <div>
      <h2>Welcome to the Headless SDK Demo!</h2>
      <Link class="Button" to="/login">
        Login
      </Link>
    </div>
  );
};

const LoggedIn = () => {
  return <h2>Welcome back!🎉</h2>;
};

const Home = () => {
  const user = useStytchUser();
  console.log('home')

  if (
    user.webauthn_registrations.length > 0
  ) {
    return (
      <button onClick={() => stytch.webauthn.authenticate({session_duration_minutes: 60})}>
        <code>stytch.webauthn.authenticate()</code>
      </button>
    );
  }

  return (
    <button onClick={() => stytch.user.registerWebauthn()}>
      <code>stytch.user.registerWebauthn()</code>
    </button>
  );
};

export default Home;
