import { useStytch, useStytchUser } from "@stytch/react";
import { Link } from "react-router-dom";
import React from "react";

export const Home = () => {
  const stytch = useStytch();
  const { user } = useStytchUser();
  const header = user.emails.length ? (
    <h1>Welcome, {user.emails[0].email}</h1>
  ) : (
    <h1> Welcome!</h1>
  );

  return (
    <div className="container">
      <div className="column">
        {header}
        You've just logged in via an{" "}
        <a href={"https://stytch.com/docs/api/log-in-or-create-user-by-email"}>
          Email Magic Link
        </a>
        . What part of the Stytch platform would you like to explore next?
        <br />
        <Link to={"/otps"}>{"One Time Passcodes"}</Link>
        <br />
        <Link to={"/webauthn"}>{"WebAuthn"}</Link>
        <br />
        <Link to={"/totp"}>{"TOTPs"}</Link>
        <br />
        <Link to={"/crypto-wallets"}>{"Crypto Wallets"}</Link>
        <br />
        <Link to={"/oauth"}>{"OAuth"}</Link>
        <br />
        <Link to={"/session"}>{"Session Management"}</Link>
        <br />
        <Link to={"/workbench"}>{"All Products Workbench"}</Link>
        <br />
        <button onClick={() => stytch.session.revoke()}>Log out.</button>
      </div>
    </div>
  );
};
