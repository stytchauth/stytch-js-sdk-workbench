import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {useStytch, useStytchSession, useStytchUser} from "@stytch/stytch-react";

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

  const renderProvider = (title, provider, url) => {
    if (provider) {
      return (<>{title} is linked. Your {title} ID
          is <code>{provider.provider_subject}</code>. <a href={url}>Log in again?</a></>)
    }
    return <a href={url}><button>Link your {title} account.</button></a>
  }

  return (<>
      <h1>OAuth</h1>
      OAuth is a popular authentication framework that delegates authentication to an external identity provider (often
      shortened to IdP) like Google, Facebook, or, Github. A user relies on their membership from that
      provider to sign in instead of creating another password, and developers can enrich their users' experiences with
      the information shared by the providers. Stytch's OAuth product simplifies the process by abstracting the
      implementation details of OAuth for developers. Here's a little demo showing how Stytch can be used to attach
      OAuth providers to existing users.
      See more in our <a href={'https://stytch.com/docs/api/oauth-overview'}>docs.</a>
      <br/>
      <br/>
      {renderProvider('Google', googleProvider, googleUrl)}
      <br/>
      {renderProvider('Facebook', fbProvider, facebookUrl)}
      <br/>
      {renderProvider('Github', githubProvider, githubUrl)}
      <br/>
      <br/>
      <Link to={'/home'}>{'<-Back'}</Link>
      <br/>
      <br/>
      <button onClick={() => stytch.session.revoke()}>Log out.</button>
    </>
  );
}

export const WebAuthn = () => {
  const stytch = useStytch();
  const user = useStytchUser();
  const hasWebAuthnConfigured = user.webauthn_registrations.some(wr => wr.verified)
  return (<>
    <h1>WebAuthn</h1>
    The Web Authentication API (WebAuthn) is a specification that allows web applications on supported browsers to
    authenticate a user via authenticator types such as built-in device biometrics (e.g. facial recognition on mobile
    and fingerprint readers on desktop) or secure hardware keys (e.g. YubiKeys).
    <br/>
    <br/>
    There are two steps during a WebAuthn authentication flow, registration and authentication. The first step handles
    registering a WebAuthn device to a user.&nbsp;&nbsp;&nbsp;
    <button onClick={() => stytch.user.registerWebauthn()}>
      Register.
    </button>
    <br/>
    <br/>
    {
      hasWebAuthnConfigured ?
        <>
          After registration is complete, the WebAuthn device can be used to authenticate the active user, for MFA or
          Step-Up authentication.
          &nbsp;&nbsp;&nbsp;
          <button onClick={() => stytch.webauthn.authenticate()}>
            Authenticate.
          </button>
          <br/>
          <br/>
        </> : null
    }
    <Link to={'/home'}>{'<-Back'}</Link>
  </>)
}


export const Home = () => {
  const stytch = useStytch();
  const user = useStytchUser();

  return (<>
      <h1>Welcome, {user.emails[0].email}</h1>
      You've just logged in via an <a href={'https://stytch.com/docs/api/log-in-or-create-user-by-email'}>Email Magic
      Link</a>.
      What part of the Stytch platform would you like to explore next?
      <br/>
      <Link to={'/webauthn'}>{'WebAuthn'}</Link>
      <br/>
      <Link to={'/oauth'}>{'OAuth'}</Link>
      <br/>
      <Link to={'/session'}>{'Session Management'}</Link>
      <br/>
      <br/>
      <button onClick={() => stytch.session.revoke()}>Log out.</button>
    </>
  );
};

/**
 * Pretty Print JSON Objects.
 * Taken from https://codepen.io/decodigo/pen/amzrF
 */
function prettyPrint(obj) {
  const jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
  const replacer = function (match, pIndent, pKey, pVal, pEnd) {
    let key = '<span class="json-key" style="color: #D4CEFF">',
      val = '<span class="json-value" style="color: #21D7FF">',
      str = '<span class="json-string" style="color: #13E5C0">',
      r = pIndent || '';
    if (pKey)
      r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
    if (pVal)
      r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
    return r + (pEnd || '');
  };

  return JSON.stringify(obj, null, 3)
    .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(jsonLine, replacer);
}

export const SessionManagement = () => {
  const session = useStytchSession();

  const [loggedInRouteStatus, setLoggedInRouteStatus] = useState('...');
  useEffect(() => {
    fetch('/api/logged_in_route').then(res => {
      setLoggedInRouteStatus(`Returned ${res.status} - you are logged in!`);
    })
  }, []);

  const [mfaRouteStatus, setMFARouteStatus] = useState('...');
  useEffect(() => {
    fetch('/api/mfa_route').then(res => {
      res.status === 200 ?
        setMFARouteStatus(`Returned ${res.status} - you are logged in!`) :
        setMFARouteStatus(`Returned ${res.status} - you don't have MFA.`)
    })
  }, []);

  return (<>
      <h4>Session Management</h4>
      Below, you can see your current Stytch session. Your session information will be securely sent to your backend on
      every request in the form of a cookie.
      Try using OAuth or WebAuthn to see how your session changes.
      Making some requests now...
      <br/>
      <code>/api/logged_in_route</code> - {loggedInRouteStatus}
      <br/>
      <code>/api/mfa_route</code> - {mfaRouteStatus}
      <br/>
      <Link to={'/home'}>{'<-Back'}</Link>
      <br/>
      <pre className="results" dangerouslySetInnerHTML={{__html: prettyPrint(session)}}/>
    </>
  );
}