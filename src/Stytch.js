import React, {useState, useEffect} from 'react'
import {Navigate} from 'react-router-dom'

const stytch = window.Stytch(process.env.REACT_APP_STYTCH_PUBLIC_TOKEN)

const useStytchUser = () => {
  console.log("user get is", stytch.user.getSync());
  const [user, setUser] = useState(stytch.user.getSync());
  
  useEffect(() => {
    return stytch.user.onChange(user => setUser(user))
  }, []);
  
  return user;
}

const useStytchSession = () => {
  const [session, setSession] = useState(stytch.session.getSync());
  useEffect(() => {
    return stytch.session.onChange(sess => setSession(sess))
  }, []);
  
  return session;
}

function RequireLogin({ children }) {
  const user = useStytchUser();
  console.log(user);

  if (!user) {
    
    return <Navigate to="/login" />;
  }

  return children;
}

function RequireMFA({ children }) {
  const session = useStytchSession();

  if (!session) {
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

export { useStytchUser, useStytchSession, RequireLogin, RequireMFA, stytch };
