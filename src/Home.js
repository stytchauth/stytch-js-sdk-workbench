import React from "react";
import { Link } from "react-router-dom";
import { stytch } from './Stytch';

const LoggedOut = () => {
  return (
    <div>
      <h2>Welcome to the Headless SDK Demo! </h2>
      <Link class="Button" to="/login">
        Login
      </Link>
    </div>
  );
};

const LoggedIn = () => {
  return <h2>Welcome back! 🎉</h2>;
};

const Home = ({ user, session }) => {
  return (
    <div class="container">
      <div class="column">
        <h1>SDK Workbench</h1>

        <button onClick ={() => stytch.user.registerWebauthn()}>
          <code>stytch.user.registerWebauthn()</code>
        </button>
        <br />
        <button onClick ={() => stytch.webauthn.authenticate()}>
          <code>stytch.webauthn.authenticate()</code>
        </button>
        <br />
        <button onClick ={() => stytch.session.revoke()}>
          <code>stytchSDK.session.revoke() (logout)</code>
        </button>
        <br />
      </div>
    </div>
  );
};

export default Home;
