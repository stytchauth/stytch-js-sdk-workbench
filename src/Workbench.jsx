import {
  withStytch,
  withStytchSession,
  withStytchUser,
} from "@stytch/stytch-react";
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Results } from "./Results";

const Button = ({ name, onClick, glowing }) => (
  <button className={glowing ? "glower" : ""} onClick={onClick}>
    <code>{name}</code>
  </button>
);

const WorkBench = ({ stytch, stytchUser }) => {
  const [result, setResult] = useState(
    "// Click some buttons and run some code!"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLink, setIsLink] = useState(false);

  const emlEmailRef = useRef();
  const otpEmailRef = useRef();
  const otpPhoneRef = useRef();
  const otpMethodIDRef = useRef();
  const otpCodeRef = useRef();

  const firstNameRef = useRef();
  const middleNameRef = useRef();
  const lastNameRef = useRef();
  const newEmailRef = useRef();
  const newPhoneRef = useRef();

  const [wrCredCreateOpts, setCredCreateOpts] = useState(null);
  const [wrCredRequestOpts, setCredRequestOpts] = useState(null);

  const [cryptoWalletChallenge, setCryptoWalletChallenge] = useState(null);
  const [cryptoWalletAddress, setCryptoWalletAddress] = useState(null);

  useEffect(() => {
    if (stytchUser) {
      if (stytchUser.emails.length) {
        emlEmailRef.current.value = stytchUser.emails[0].email;
        otpEmailRef.current.value = stytchUser.emails[0].email;
      }
      if (stytchUser.phone_numbers.length) {
        otpPhoneRef.current.value = stytchUser.phone_numbers[0].phone_number;
      }
      firstNameRef.current.value = stytchUser.name.first_name;
      middleNameRef.current.value = stytchUser.name.middle_name;
      lastNameRef.current.value = stytchUser.name.last_name;
    }
  }, [stytchUser]);

  const getCallbackURL = (type) => {
    return window.location.href.split("?")[0] + "?type=" + type;
  };

  const hasOauth = window.location.search.includes("oauth");
  const hasEml = window.location.search.includes("eml");
  const chompToken = () => {
    const currentLocation = new URL(window.location.href);
    const token = currentLocation.searchParams.get("token");
    if (!token) {
      dispatch(
        Promise.reject(
          new Error(
            "No token detected in URL - do an OAuth or a magic link flow!"
          )
        )
      );
      return null;
    }
    currentLocation.searchParams.delete("token");
    currentLocation.searchParams.delete("type");
    window.history.replaceState({}, document.title, currentLocation.toString());
    return token;
  };

  const dispatch = (prom) => {
    setIsLoading(true);
    return Promise.resolve(prom)
      .then((res) => {
        setIsLink(false);
        setIsError(false);
        setIsLoading(false);
        setResult(res);
        return res;
      })
      .catch((err) => {
        setIsLink(false);
        setIsError(true);
        setIsLoading(false);
        setResult(err);
        throw err;
      });
  };

  const dispatchLink = (link) => {
    setIsLink(true);
    setIsError(false);
    setIsLoading(false);
    setResult(link);
  };

  const sessionGetSync = () => {
    dispatch(stytch.session.getSync());
  };
  const sessionAuthenticate = () => {
    return dispatch(stytch.session.authenticate());
  };
  const sessionRevoke = () => {
    return dispatch(stytch.session.revoke());
  };

  const magicLinksLoginOrCreate = (e) => {
    e.preventDefault();
    const email = emlEmailRef.current.value;
    return dispatch(
      stytch.magicLinks.email.loginOrCreate(email, {
        signup_magic_link_url: getCallbackURL("eml"),
        login_magic_link_url: getCallbackURL("eml"),
      })
    );
  };
  const magicLinksAuthenticate = () => {
    const token = chompToken();
    if (!token) {
      return;
    }
    return dispatch(
      stytch.magicLinks.authenticate(token, {
        session_duration_minutes: 60,
      })
    );
  };

  const otpEmailLoginOrCreate = async (e) => {
    e.preventDefault();
    const email = otpEmailRef.current.value;
    const result = await dispatch(
      stytch.otps.email.loginOrCreate(email, {
        expiration_minutes: 10,
      })
    );
    otpMethodIDRef.current.value = result.method_id;
  };
  const attachPhoneNumber = async (phone_number) => {
    if (
      stytchUser &&
      !stytchUser.phone_numbers.find((pn) => (pn.phone_number = phone_number))
    ) {
      if (
        window.confirm(
          "That phone number is not attached to the logged-in user.\nAdd it?"
        )
      ) {
        await dispatch(
          stytch.user.update({
            phone_numbers: [{ phone_number }],
          })
        );
      }
    }
  };
  const otpSMSLoginOrCreate = async (e) => {
    e.preventDefault();
    const phoneNumber = otpPhoneRef.current.value;
    await attachPhoneNumber(phoneNumber);
    const result = await dispatch(
      stytch.otps.sms.loginOrCreate(phoneNumber, {
        expiration_minutes: 10,
      })
    );
    otpMethodIDRef.current.value = result.method_id;
  };
  const otpWhatsappLoginOrCreate = async () => {
    const phoneNumber = otpPhoneRef.current.value;
    await attachPhoneNumber(phoneNumber);
    const result = await dispatch(
      stytch.otps.whatsapp.loginOrCreate(phoneNumber, {
        expiration_minutes: 10,
      })
    );
    otpMethodIDRef.current.value = result.method_id;
  };
  const otpAuthenticate = async (e) => {
    e.preventDefault();
    const method_id = otpMethodIDRef.current.value;
    const code = otpCodeRef.current.value;
    return dispatch(
      stytch.otps.authenticate(code, method_id, {
        session_duration_minutes: 60,
      })
    );
  };

  const userGetSync = () => {
    dispatch(stytch.user.getSync());
  };
  const userGet = () => {
    return dispatch(stytch.user.get());
  };
  const userUpdate = () => {
    const diff = {
      name: {
        first_name: firstNameRef.current.value,
        middle_name: middleNameRef.current.value,
        last_name: lastNameRef.current.value,
      },
    };

    const phone_number = newPhoneRef.current.value;
    if (phone_number) {
      diff.phone_numbers = [{ phone_number }];
    }

    const email = newEmailRef.current.value;
    if (email) {
      diff.emails = [{ email }];
    }

    return dispatch(stytch.user.update(diff));
  };

  const webauthnRegisterStart = async () => {
    const { public_key_credential_creation_options } = await dispatch(
      stytch.webauthn.registerStart()
    );
    setCredCreateOpts(public_key_credential_creation_options);
  };
  const webauthnRegister = async (e) => {
    if (!wrCredCreateOpts) {
      return dispatch(
        Promise.reject(
          new Error("No creation options loaded. Call registerStart first.")
        )
      );
    }
    await dispatch(stytch.webauthn.register(wrCredCreateOpts));
    setCredCreateOpts(null);
  };

  const webauthnAuthenticateStart = async () => {
    const { public_key_credential_request_options } = await dispatch(
      stytch.webauthn.authenticateStart()
    );
    setCredRequestOpts(public_key_credential_request_options);
  };
  const webauthnAuthenticate = async () => {
    if (!wrCredRequestOpts) {
      return dispatch(
        Promise.reject(
          new Error("No creation options loaded. Call registerStart first.")
        )
      );
    }
    await dispatch(
      stytch.webauthn.authenticate(wrCredRequestOpts, {
        session_duration_minutes: 60,
      })
    );
    setCredRequestOpts(null);
  };

  const cryptoWalletsAuthenticateStart = async () => {
    const [crypto_wallet_address] = await dispatch(
      window.ethereum.request({
        method: "eth_requestAccounts",
      })
    );
    setCryptoWalletAddress(crypto_wallet_address);

    const { challenge } = await dispatch(
      stytch.cryptoWallets.authenticateStart({
        crypto_wallet_address,
        crypto_wallet_type: "ethereum",
      })
    );
    setCryptoWalletChallenge(challenge);
  };
  const cryptoWalletsAuthenticate = async () => {
    if (!cryptoWalletChallenge) {
      return dispatch(
        Promise.reject(
          new Error("No challenge loaded. Call authenticateStart first.")
        )
      );
    }
    const signature = await dispatch(
      window.ethereum.request({
        method: "personal_sign",
        params: [cryptoWalletChallenge, cryptoWalletAddress],
      })
    );
    await dispatch(
      stytch.cryptoWallets.authenticate({
        crypto_wallet_address: cryptoWalletAddress,
        crypto_wallet_type: "ethereum",
        signature,
        session_duration_minutes: 60,
      })
    );
    setCredRequestOpts(null);
  };

  const getUrlForProvider = (provider) => () =>
    dispatchLink(
      stytch.oauth[provider].getUrl({
        signup_redirect_url: getCallbackURL("oauth"),
        login_redirect_url: getCallbackURL("oauth"),
      })
    );

  const oauthAuthenticate = () => {
    const token = chompToken();
    if (!token) {
      return;
    }
    return dispatch(
      stytch.oauth.authenticate(token, {
        session_duration_minutes: 60,
      })
    );
  };

  const userFactorControls = [<br key="factor-brk" />];
  if (stytchUser) {
    for (const emailFactor of stytchUser.emails) {
      const onClick = () => {
        dispatch(stytch.user.deleteEmail(emailFactor.email_id));
      };
      userFactorControls.push(
        <Button
          key={`btn-${emailFactor.email_id}`}
          name={`Delete email: ${emailFactor.email}`}
          onClick={onClick}
        />,
        <br key={`brk-${emailFactor.email_id}`} />
      );
    }

    for (const wr of stytchUser.webauthn_registrations) {
      const onClick = () => {
        dispatch(stytch.user.deleteWebauthn(wr.webauthn_registration_id));
      };
      userFactorControls.push(
        <Button
          key={`btn-${wr.webauthn_registration_id}`}
          name={`Delete Webauthn: ${wr.webauthn_registration_id.slice(27, 35)}`}
          onClick={onClick}
        />,
        <br key={`brk-${wr.webauthn_registration_id}`} />
      );
    }
  }

  return (
    <>
      <div className="container xl">
        <div className="column">
          <h1>SDK Workbench</h1>
          <h3>Session</h3>
          <Button name="stytch.session.getSync()" onClick={sessionGetSync} />
          <br />
          <Button
            name="stytch.session.authenticate()"
            onClick={sessionAuthenticate}
          />
          <br />
          <Button name="stytch.session.revoke()" onClick={sessionRevoke} />
          <br />
          <h3>User</h3>
          <Button name="stytch.user.getSync()" onClick={userGetSync} /> <br />
          <Button name="stytch.user.get()" onClick={userGet} /> <br />
          <h3>Magic Links</h3>
          <form onSubmit={magicLinksLoginOrCreate}>
            <div className="inputContainer">
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                id="email"
                name="email"
                ref={emlEmailRef}
                required
              />
            </div>
            <Button
              name="stytch.magicLinks.email.loginOrCreate()"
              type="submit"
            />
            <br />
          </form>
          <Button
            name="stytch.magicLinks.authenticate()"
            onClick={magicLinksAuthenticate}
            glowing={hasEml}
          />
          <br />
          <h3>One Time Passcodes</h3>
          <form onSubmit={otpSMSLoginOrCreate}>
            <div className="inputContainer">
              <label htmlFor="phone">Phone:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                pattern="\+?[1-9]\d{1,14}"
                ref={otpPhoneRef}
              />
            </div>
            <Button name="stytch.otps.sms.loginOrCreate()" type="submit" />
            <br />
          </form>
          <Button
            name="stytch.otps.whatsapp.loginOrCreate()"
            onClick={otpWhatsappLoginOrCreate}
          />
          <br />
          <form onSubmit={otpEmailLoginOrCreate}>
            <div className="inputContainer">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" ref={otpEmailRef} />
            </div>
            <Button name="stytch.otps.email.loginOrCreate()" type="submit" />
            <br />
          </form>
          <form onSubmit={otpAuthenticate}>
            <div className="inputContainer">
              <label htmlFor="methodID">MethodID:</label>
              <input
                required
                type="text"
                id="phone"
                name="phone"
                ref={otpMethodIDRef}
              />
            </div>
            <div className="inputContainer">
              <label htmlFor="code">Code:</label>
              <input
                required
                type="text"
                id="code"
                name="code"
                ref={otpCodeRef}
              />
            </div>
            <button type="submit">
              <code>stytch.otps.authenticate()</code>
            </button>
          </form>
          <h3>WebAuthn</h3>
          <div>
            <label htmlFor="register_start_data">Register Data Loaded:</label>
            <input
              type="checkbox"
              disabled
              checked={Boolean(wrCredCreateOpts)}
            />
          </div>
          <Button
            name="stytch.webauthn.registerStart()"
            onClick={webauthnRegisterStart}
          />
          <br />
          <Button
            name="stytch.webauthn.register()"
            onClick={webauthnRegister}
          />
          <div>
            <label htmlFor="register_start_data">
              Authenticate Data Loaded:
            </label>
            <input
              type="checkbox"
              disabled
              checked={Boolean(wrCredRequestOpts)}
            />
          </div>
          <Button
            name="stytch.webauthn.authenticateStart()"
            onClick={webauthnAuthenticateStart}
          />
          <br />
          <Button
            name="stytch.webauthn.authenticate()"
            onClick={webauthnAuthenticate}
          />
          <br />
          <h3>Crypto Wallets</h3>
          <div>
            <label>Crypto Wallet Address Shared:</label>
            <input
              type="checkbox"
              disabled
              checked={Boolean(cryptoWalletAddress)}
            />
          </div>
          <div>
            <label>Crypto Wallet Challenge Loaded:</label>
            <input
              type="checkbox"
              disabled
              checked={Boolean(cryptoWalletChallenge)}
            />
          </div>
          <Button
            name="stytch.cryptoWallets.authenticateStart()"
            onClick={cryptoWalletsAuthenticateStart}
          />
          <br />
          <Button
            name="stytch.cryptoWallets.authenticate()"
            onClick={cryptoWalletsAuthenticate}
          />
          <br />
          <h3>OAuth</h3>
          <Button
            name="stytch.oauth.google.getUrl()"
            onClick={getUrlForProvider("google")}
          />
          <br />
          {/*<Button name="stytch.oauth.microsoft.getUrl()" onClick={getUrlForProvider('microsoft')}/><br/>*/}
          {/*<Button name="stytch.oauth.facebook.getUrl()" onClick={getUrlForProvider('facebook')}/><br/>*/}
          <Button
            name="stytch.oauth.github.getUrl()"
            onClick={getUrlForProvider("github")}
          />
          <br />
          {/*<Button name="stytch.oauth.apple.getUrl()" onClick={getUrlForProvider('apple')}/><br/>*/}
          <Button
            name="stytch.oauth.authenticate()"
            onClick={oauthAuthenticate}
            glowing={hasOauth}
          />
          <br />
          <h3>User Management</h3>
          <div className="inputContainer">
            <label htmlFor="first_name">First Name:</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              ref={firstNameRef}
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="middle_name">Middle Name:</label>
            <input
              type="text"
              id="middle_name"
              name="middle_name"
              ref={middleNameRef}
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="last_name">Last Name:</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              ref={lastNameRef}
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="new_email">Add Email:</label>
            <input
              type="text"
              id="new_email"
              name="new_email"
              ref={newEmailRef}
            />
          </div>
          <div className="inputContainer">
            <label htmlFor="new_phone">Add Phone #:</label>
            <input
              type="text"
              id="new_phone"
              name="new_phone"
              ref={newPhoneRef}
            />
          </div>
          <Button name="stytch.user.update()" onClick={userUpdate} />
          <br />
          {userFactorControls.length > 1 ? (
            <strong>Attached Factors</strong>
          ) : null}
          {userFactorControls}
        </div>
        <div className="resultcontainer">
          <h3>You are {stytchUser ? "logged in." : "not logged in."}</h3>
          <h3>Result: {isLoading ? "..." : ""}</h3>
          <Results
            className="results"
            content={result}
            isError={isError}
            isLink={isLink}
          />
          <Link to="/home"> Return to app </Link>
        </div>
      </div>
    </>
  );
};

export default withStytch(withStytchUser(withStytchSession(WorkBench)));
