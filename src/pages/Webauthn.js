import {useStytch, useStytchUser} from "@stytch/stytch-react";
import React, {useCallback, useEffect, useState} from "react";
import {Link} from "react-router-dom";

const RegisterWebauthn = ({setStatus, setError}) => {
  const stytch = useStytch();
  const [credCreateOpts, setCredCreateOpts] = useState(null);

  const preloadRegistrationData = useCallback(() =>
    stytch.webauthn.registerStart()
      .then(data => setCredCreateOpts(data.public_key_credential_creation_options))
      .catch(e => setError(e)), [stytch, setError]);

  useEffect(() => {
    preloadRegistrationData()
  }, [preloadRegistrationData]);

  const registerWebauthn = async () => {
    try {
      setStatus("Registering...");
      await stytch.webauthn.register(credCreateOpts);
      setStatus("Registration successful!");
      setCredCreateOpts(null);
      await preloadRegistrationData()
    } catch (e) {
      setError(e);
    }
  };

  return (<>
    There are two steps during a WebAuthn authentication flow, registration
    and authentication. The first step handles registering a WebAuthn device
    to a user.&nbsp;&nbsp;&nbsp;
    <button disabled={!credCreateOpts} onClick={registerWebauthn}>Register.</button>
  </>)
}

const AuthenticateWebauthn = ({setStatus, setError}) => {
  const stytch = useStytch();
  const [credRequestOpts, setCredRequestOpts] = useState(null);

  const preloadAuthenticationData = useCallback(() =>
    stytch.webauthn.authenticateStart()
      .then(data => setCredRequestOpts(data.public_key_credential_request_options))
      .catch(e => setError(e)), [stytch, setError]);

  useEffect(() => {
    preloadAuthenticationData()
  }, [preloadAuthenticationData]);

  const authenticateWebauthn = async () => {
    try {
      setStatus("Authenticating...");
      await stytch.webauthn.authenticate(credRequestOpts, {
        session_duration_minutes: 60,
      });
      setCredRequestOpts(null);
      setStatus("Authentication successful!");
      await preloadAuthenticationData();
    } catch (e) {
      setError(e);
    }
  };

  return (
    <>
      After registration is complete, the WebAuthn device can be used to
      authenticate the active user, for MFA or Step-Up authentication.
      &nbsp;&nbsp;&nbsp;
      <button disabled={!credRequestOpts} onClick={authenticateWebauthn}>Authenticate.</button>
    </>
  )
}

export const WebAuthn = () => {
  const user = useStytchUser();
  const hasWebAuthnConfigured = user.webauthn_registrations.length > 0;
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  return (
    <div className="container">
      <div className="column">
        <h1>WebAuthn</h1>
        The Web Authentication API (WebAuthn) is a specification that allows web
        applications on supported browsers to authenticate a user via
        authenticator types such as built-in device biometrics (e.g. facial
        recognition on mobile and fingerprint readers on desktop) or secure
        hardware keys (e.g. YubiKeys).
        <br/><br/>
        <RegisterWebauthn setStatus={setStatus} setError={setError}/>
        <br/><br/>
        {hasWebAuthnConfigured ?
          <AuthenticateWebauthn setStatus={setStatus} setError={setError}/>
          : null}
        <br />
        {status}
        <br />
        {error && (
          <>
            <br/>
            <pre>{String(error)}</pre>
          </>
        )}
        <Link to={"/home"}>{"<-Back"}</Link>
      </div>
    </div>
  );
};