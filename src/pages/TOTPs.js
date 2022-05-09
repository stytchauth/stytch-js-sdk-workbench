import { useStytch, useStytchUser } from "@stytch/stytch-react";
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

const CreateAndAuthenticateTotp = ({ status, setStatus, setError }) => {
  const stytch = useStytch();
  const totpCodeRef = useRef();
  const [totpQRCode, setTotpQRCode] = useState(null);

  const createTotp = async () => {
    const { qr_code } = await stytch.totps.create({
      expiration_minutes: 10,
    });
    setStatus("Creating...");
    setTotpQRCode(qr_code);
  };

  const authenticateTOTP = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await stytch.totps.authenticate({
        totp_code: totpCodeRef.current.value,
        session_duration_minutes: 60,
      });
      setStatus("Authenticated");
    } catch (e) {
      setError(e);
    }
  };

  return (
    <>
      <button onClick={createTotp}>Create Totp</button>
      <br />
      <br />
      {totpQRCode && status !== "Authenticated" && (
        <>
          <img src={totpQRCode} alt="QR Code" />
          <br />
          <form onSubmit={authenticateTOTP}>
            <div className="inputContainer">
              <label htmlFor="code">Please enter the code:</label>
              <input
                type="tel"
                id="phone"
                name="code"
                placeholder="123456"
                ref={totpCodeRef}
                style={{ maxWidth: 200 }}
              />
            </div>
            <button type="submit">Send</button>
            <br />
          </form>
        </>
      )}

      <br />
      <br />
    </>
  );
};

const AuthenticateTotp = ({ status, setStatus, setError }) => {
  const stytch = useStytch();
  const totpCodeRef = useRef();

  const authenticateTOTP = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await stytch.totps.authenticate({
        totp_code: totpCodeRef.current.value,
        session_duration_minutes: 60,
      });
      setStatus("Authenticated");
    } catch (e) {
      setError(e);
    }
  };

  return (
    <>
      {status !== "Authenticated" && (
        <>
          <form onSubmit={authenticateTOTP}>
            <div className="inputContainer">
              <label htmlFor="code">Please enter the code:</label>
              <input
                type="tel"
                id="phone"
                name="code"
                placeholder="123456"
                ref={totpCodeRef}
                style={{ maxWidth: 200 }}
              />
            </div>
            <button type="submit">Send</button>
            <br />
          </form>
        </>
      )}

      <br />
      <br />
    </>
  );
};

const Authenticated = () => {
  const stytch = useStytch();
  const [codes, setCodes] = useState([]);

  const retrieveRecoveryCodes = async () => {
    const data = await stytch.totps.recoveryCodes();
    setCodes(data.totps[0].recovery_codes);
  };

  return (
    <>
      <p>Recovery Codes</p>
      <button onClick={retrieveRecoveryCodes}>Get Recovery Codes</button>
      <br />
      {codes.map((code) => (
        <div key={code}>
          {code}
          <br />
        </div>
      ))}
    </>
  );
};

export const TOTP = () => {
  const user = useStytchUser();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");

  const hasTotp = user.totps.length > 0;
  const isTotpAuthenticated = status === "Authenticated";
  return (
    <div className="container">
      <div className="column">
        <h1>TOTP</h1>
        Time-based One-time Passcodes (TOTPs) are one-time passcodes that are
        generated based on a shared secret and the current time. TOTPs are also
        often referred to as Authenticator Apps and are a common form of
        secondary authentication. Creating a Stytch instance of a TOTP for a
        User creates a shared secret. This secret is shared by Stytch with the
        end user's authenticator application of choice (e.g. Google
        Authenticator). The authenticator app can then generate TOTPs that are
        valid for a specific amount of time (generally 30 seconds). The end user
        inputs the TOTP and the developer can use the authenticate method to
        verify that the TOTP is valid.
        <br />
        <br />
        {hasTotp ? (
          <AuthenticateTotp
            status={status}
            setStatus={setStatus}
            setError={setError}
          />
        ) : (
          <CreateAndAuthenticateTotp
            status={status}
            setStatus={setStatus}
            setError={setError}
          />
        )}
        {isTotpAuthenticated && <Authenticated />}
        <br />
        {status}
        <br />
        {error && (
          <>
            <br />
            <pre>{String(error)}</pre>
          </>
        )}
        <Link to={"/home"}>{"<-Back"}</Link>
      </div>
    </div>
  );
};
