import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  useStytch,
  useStytchSession,
  useStytchUser,
} from "@stytch/stytch-react";
import { Results } from "./Results";

export const LinkOAuth = () => {
  const stytch = useStytch();
  const user = useStytchUser();

  const oauthOpts = {
    login_redirect_url: `${window.location.origin}/authenticate?type=oauth`,
    signup_redirect_url: `${window.location.origin}/authenticate?type=oauth`,
  };

  const googleUrl = stytch.oauth.google.getUrl(oauthOpts);
  const facebookUrl = stytch.oauth.facebook.getUrl(oauthOpts);
  const githubUrl = stytch.oauth.github.getUrl(oauthOpts);

  const googleProvider = user.providers.find(
    (provider) => provider.provider_type === "Google"
  );
  const fbProvider = user.providers.find(
    (provider) => provider.provider_type === "Facebook"
  );
  const githubProvider = user.providers.find(
    (provider) => provider.provider_type === "Github"
  );

  const renderProvider = (title, provider, url) => {
    if (provider) {
      return (
        <>
          You've previously linked {title}. Your {title} ID is{" "}
          <code>{provider.provider_subject}</code>.{" "}
          <a href={url}>Log in again?</a>
        </>
      );
    }
    return (
      <a href={url}>
        <button>Link your {title} account.</button>
      </a>
    );
  };

  return (
    <div className="container">
      <div className="column">
        <h1>OAuth</h1>
        OAuth is a popular authentication framework that delegates
        authentication to an external identity provider (often shortened to IdP)
        like Google, Facebook, or, Github. A user relies on their membership
        from that provider to sign in instead of creating another password, and
        developers can enrich their users' experiences with the information
        shared by the providers. Stytch's OAuth product simplifies the process
        by abstracting the implementation details of OAuth for developers.
        Here's a little demo showing how Stytch can be used to attach OAuth
        providers to existing users. See more in our{" "}
        <a href={"https://stytch.com/docs/api/oauth-overview"}>docs.</a>
        <br />
        <br />
        {renderProvider("Google", googleProvider, googleUrl)}
        <br />
        {renderProvider("Facebook", fbProvider, facebookUrl)}
        <br />
        {renderProvider("Github", githubProvider, githubUrl)}
        <br />
        <br />
        <Link to={"/home"}>{"<-Back"}</Link>
      </div>
    </div>
  );
};

export const WebAuthn = () => {
  const stytch = useStytch();
  const user = useStytchUser();
  const hasWebAuthnConfigured = user.webauthn_registrations.length > 0;
  const [error, setError] = useState(null);
  const [state, setState] = useState("");

  const registerWebauthn = async () => {
    try {
      setState("Authenticating...");
      await stytch.user.registerWebauthn();
      setState("Authentication successful!");
    } catch (e) {
      setError(e);
    }
  };

  const authenticateWebauthn = async () => {
    try {
      setState("Authenticating...");
      await stytch.webauthn.authenticate({ session_duration_minutes: 60 });
      setState("Authentication successful!");
    } catch (e) {
      setError(e);
    }
  };

  return (
    <div className="container">
      <div className="column">
        <h1>WebAuthn</h1>
        The Web Authentication API (WebAuthn) is a specification that allows web
        applications on supported browsers to authenticate a user via
        authenticator types such as built-in device biometrics (e.g. facial
        recognition on mobile and fingerprint readers on desktop) or secure
        hardware keys (e.g. YubiKeys).
        <br />
        <br />
        There are two steps during a WebAuthn authentication flow, registration
        and authentication. The first step handles registering a WebAuthn device
        to a user.&nbsp;&nbsp;&nbsp;
        <button onClick={registerWebauthn}>Register.</button>
        <br />
        <br />
        {hasWebAuthnConfigured ? (
          <>
            After registration is complete, the WebAuthn device can be used to
            authenticate the active user, for MFA or Step-Up authentication.
            &nbsp;&nbsp;&nbsp;
            <button onClick={authenticateWebauthn}>Authenticate.</button>
            <br />
            {state}
            <br />
            {error && (
              <>
                <br />
                <pre>{String(error)}</pre>
              </>
            )}
            <br />
          </>
        ) : null}
        <Link to={"/home"}>{"<-Back"}</Link>
      </div>
    </div>
  );
};

export const OneTimePasscodes = () => {
  const stytch = useStytch();
  const user = useStytchUser();
  const otpPhoneRef = useRef();
  const otpCodeRef = useRef();
  const [error, setError] = useState(null);
  const [state, setState] = useState("starting");

  const phoneFactor = user.phone_numbers[0];

  const sendOneTimePasscode = async () => {
    try {
      setError(null);
      await stytch.otps.sms.loginOrCreate(phoneFactor.phone_number, {
        expiration_minutes: 10,
      });
      setState("in_progress");
    } catch (e) {
      setError(e);
    }
  };

  const authenticateOneTimePasscode = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await stytch.otps.authenticate(
        otpCodeRef.current.value,
        phoneFactor.phone_id,
        {
          session_duration_minutes: 60,
        }
      );
      setState("authenticated");
    } catch (e) {
      setError(e);
    }
  };

  const startOTPFlow = (
    <>
      Let's send a one-time passcode to{" "}
      <strong>{phoneFactor && phoneFactor.phone_number}</strong>.<br />
      <button onClick={sendOneTimePasscode}>Send.</button>
    </>
  );

  const otpCollectionForm = (
    <form onSubmit={authenticateOneTimePasscode}>
      <div className="inputContainer" style={{ "max-width": "50%" }}>
        <label htmlFor="code">Please enter the code:</label>
        <input
          type="tel"
          id="phone"
          name="code"
          placeholder="123456"
          ref={otpCodeRef}
        />
      </div>
      <button type="submit">Send</button>
      <br />
    </form>
  );

  const completeOTPFlow = (
    <>
      Authenticated!
      <br />
      <button onClick={() => setState("starting")}>Start over.</button>
    </>
  );

  const hasPhoneNumberContent = (
    <>
      {state === "starting" ? startOTPFlow : null}
      {state === "in_progress" ? otpCollectionForm : null}
      {state === "authenticated" ? completeOTPFlow : null}
    </>
  );

  const addOneTimePasscodeToUser = async (e) => {
    e.preventDefault();
    const phone_number = otpPhoneRef.current.value;
    try {
      setError(null);
      await stytch.user.update({
        name: {},
        phone_numbers: [{ phone_number }],
      });
    } catch (e) {
      setError(e);
    }
  };

  const doesNotHaveLinkedPhoneNumberContent = (
    <>
      First, let's link a phone number to your account.
      <br />
      <form onSubmit={addOneTimePasscodeToUser}>
        <div className="inputContainer" style={{ maxWidth: 200 }}>
          <label htmlFor="phone">What is your phone number?</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="+1333333333"
            ref={otpPhoneRef}
          />
        </div>
        <button type="submit">Send</button>
        <br />
      </form>
    </>
  );

  return (
    <div className="container">
      <div className="column">
        <h1>SMS One Time Passcodes</h1>
        SMS OTP sends a one-time passcode to the user's phone number. This
        endpoint allows for a quick and seamless login experience on its own or
        it can also be layered on top of another login product, like Email magic
        links, to provide extra security as a multi-factor authentication (MFA)
        method.
        <br />
        <br />
        {phoneFactor
          ? hasPhoneNumberContent
          : doesNotHaveLinkedPhoneNumberContent}
        {error && (
          <>
            <br />
            <pre>{String(error)}</pre>
          </>
        )}
        <br />
        <br />
        <Link to={"/home"}>{"<-Back"}</Link>
      </div>
    </div>
  );
};

export const Home = () => {
  const stytch = useStytch();
  const user = useStytchUser();
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
