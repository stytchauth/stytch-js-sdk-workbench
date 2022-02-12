import React from 'react'
import {useStytchUser, useStytchSession} from '@stytch/stytch-react'
import {Navigate} from 'react-router-dom'

function RequireLogin({ children }) {
  const user = useStytchUser();
  const session = useStytchSession();
  if (!session || !user) {
    return <Navigate to="/login" />;
  }

  return children;
}

function RequireLoggedOut({ children }) {
  const user = useStytchUser();
  const session = useStytchSession();
  if (session || user) {
    return <Navigate to="/home" />;
  }

  return children;
}

function RequireMFA({ children }) {
  const user = useStytchUser();
  const session = useStytchSession();
  if (!session || !user) {
    return <Navigate to="/login" />;
  }
  
  console.log(session);
  
  const hasEmailMagicLink = session.authentication_factors.some(factor => factor.type === 'email');
  const hasOAuth = session.authentication_factors.some(factor => factor.type === 'oauth');
  const hasWebauthn = session.authentication_factors.some(factor => factor.type === 'webauthn_registration');
  
  const hasMFA = (hasEmailMagicLink || hasOAuth) && hasWebauthn;
  if(!hasMFA) {
    return <Navigate to="/home" />;
  }

  return children;
}

export { useStytchUser, useStytchSession, RequireLogin, RequireMFA, RequireLoggedOut };
