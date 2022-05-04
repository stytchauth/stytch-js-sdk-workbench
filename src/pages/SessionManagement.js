import { useStytchSession } from "@stytch/stytch-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Results } from "../Results";

export const SessionManagement = () => {
  const session = useStytchSession();

  const [loggedInRouteStatus, setLoggedInRouteStatus] = useState("...");
  useEffect(() => {
    fetch("/api/logged_in_route", { credentials: "same-origin" }).then(
      (res) => {
        setLoggedInRouteStatus(`Returned ${res.status} - you are logged in!`);
      }
    );
  }, []);

  const [mfaRouteStatus, setMFARouteStatus] = useState("...");
  useEffect(() => {
    fetch("/api/mfa_route", { credentials: "same-origin" }).then((res) => {
      res.status === 200
        ? setMFARouteStatus(
            `Returned ${res.status} - you have multiple factors!`
          )
        : setMFARouteStatus(`Returned ${res.status} - Try adding WebAuthn!`);
    });
  }, []);

  return (
    <div className="container xl">
      <div className="column">
        <h1>Session Management</h1>
        Here you can see your current Stytch session. Your session information
        will be securely sent to your backend on every request in the form of a
        cookie. Your backend should validate the session using a Stytch client
        library. See how we do it{" "}
        <a
          href={
            "https://glitch.com/edit/#!/stytch-sdk-beta?path=server%2Fserver.js%3A30%3A0"
          }
        >
          here
        </a>
        .
        <br />
        <br />
        <code>/api/logged_in_route</code>
        <br />
        {loggedInRouteStatus}
        <br />
        <br />
        <code>/api/mfa_route</code>
        <br />
        {mfaRouteStatus}
        <br />
        <br />
        Try using OAuth or WebAuthn to see how your session changes.
        <br />
        <Link to={"/home"}>{"<-Back"}</Link>
        <br />
        <Results content={session} />
      </div>
    </div>
  );
};
