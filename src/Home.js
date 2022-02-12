import React from "react";
import {Link} from "react-router-dom";
import {useStytch, useStytchUser} from "@stytch/stytch-react";

export const LinkOAuth = () => {
  const stytch = useStytch();
  const user = useStytchUser();

  const oauthOpts = {
    login_redirect_url:
      `${window.location.origin}/authenticate?type=oauth`,
    signup_redirect_url:
      `${window.location.origin}/authenticate?type=eml`,
  };

  const googleUrl = stytch.oauth.google.getUrl(oauthOpts);
  const facebookUrl = stytch.oauth.github.getUrl(oauthOpts);
  const githubUrl = stytch.oauth.github.getUrl(oauthOpts);

  const googleProvider = user.providers.find(provider => provider.provider_type === 'Google');
  const fbProvider = user.providers.some(provider => provider.provider_type === 'Facebook');
  const githubProvider = user.providers.some(provider => provider.provider_type === 'Github');

  const renderProvider = (title, provider, url) => provider ?
    <>You've linked your {title} account already. Your {title} ID
      is <code>{provider.provider_subject}</code>.</> :
    <a href={url}>
      <button>Link your {title} account.</button>
    </a>

  return (<>
      <h1>Welcome, {user.emails[0].email}</h1>
      Did you know that Stytch can be used to link together accounts from many different services?
      See the full list in our <a href={'https://stytch.com/docs/api/oauth-overview'}>docs.</a>
      <br/>
      <br/>
      {renderProvider('Google', googleProvider, googleUrl)}
      <br/>
      {renderProvider('Facebook', fbProvider, facebookUrl)}
      <br/>
      {renderProvider('Github', githubProvider, githubUrl)}
      <br/>
      <br/>
      When we're done here, let's take a look at adding <Link to={'/webauthn'}>WebAuthn</Link> too.
      <br/>
      <br/>
      <button onClick={() => stytch.session.revoke()}>Log out.</button>
    </>
  );
}

export const WebAuthn = () => {
  const stytch = useStytch();
  return (<>
    <h1>WebAuthn</h1>
    The Web Authentication API (WebAuthn) is a specification that allows web applications on supported browsers to
    authenticate a user via authenticator types such as built-in device biometrics (e.g. facial recognition on mobile
    and fingerprint readers on desktop) or secure hardware keys (e.g. YubiKeys).
    <br/>
    <br/>
    There are two steps during a WebAuthn authentication flow, registration and authentication. The first step handles
    registering a WebAuthn device to a user. With the Stytch SDK, it's as easy as calling&nbsp;&nbsp;&nbsp;
    <button onClick={() => stytch.user.registerWebauthn()}>
      <code>stytch.user.registerWebauthn()</code>
    </button>
    <br/>
    <br/>
    <button onClick={() => stytch.session.revoke()}>Log out.</button>
  </>)
}


const Home = () => {
  const user = useStytchUser();
  const stytch = useStytch();

  if (user.webauthn_registrations.length > 0) {
    const deleteRegistrationButtons = user.webauthn_registrations.map((r) => {
      const onClick = () =>
        stytch.user.deleteWebauthnRegistration(r.webauthn_registration_id);
      return (
        <li>
          <button onClick={onClick}>
            {" "}
            Delete Registration {r.webauthn_registration_id}{" "}
          </button>
          {" "}
        </li>
      );
    });

    return (
      <>
        <ul>{deleteRegistrationButtons}</ul>
        <button
          onClick={() =>
            stytch.webauthn.authenticate({session_duration_minutes: 60})
          }
        >
          <code>stytch.webauthn.authenticate()</code>
        </button>
        <button
          onClick={() =>
            stytch.session.revoke()
          }
        >
          <code>Log Out</code>
        </button>
      </>
    );
  }

  return (
    <button onClick={() => stytch.user.registerWebauthn()}>
      <code>stytch.user.registerWebauthn()</code>
    </button>
  );
};

export default Home;
