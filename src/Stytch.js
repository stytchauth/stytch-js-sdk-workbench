import React from 'react'
import {useStytchUser, useStytchSession} from './stytch-react'
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

export { RequireLogin, RequireLoggedOut };
