import React from 'react'
import {useStytchUser, useStytchSession} from './stytch-react'
import {Navigate} from 'react-router-dom'

function RequireLogin({ children }) {
  const session = useStytchSession();
  if (!session) {
    return <Navigate to="/login" />;
  }

  return children;
}

function RequireLoggedOut({ children }) {
  const session = useStytchSession();
  if (session) {
    return <Navigate to="/home" />;
  }

  return children;
}

export { RequireLogin, RequireLoggedOut };
