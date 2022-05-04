import { useStytch, useStytchUser } from "@stytch/stytch-react";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

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
      <div className="inputContainer">
        <label htmlFor="code">Please enter the code:</label>
        <input
          type="tel"
          id="phone"
          name="code"
          placeholder="123456"
          ref={otpCodeRef}
          style={{ maxWidth: 200 }}
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
        <div className="inputContainer">
          <label htmlFor="phone">What is your phone number?</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="+1333333333"
            ref={otpPhoneRef}
            style={{ maxWidth: 200 }}
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
