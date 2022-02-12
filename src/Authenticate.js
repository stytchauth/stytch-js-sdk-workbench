import React from "react";
import { useNavigate } from "react-router-dom";
import { useStytch } from '@stytch/stytch-react';

const Authenticate = () => {
  const navigate = useNavigate();
  const stytch = useStytch();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const type = params.get('type');

    const authPromise = type === "eml" ?
      stytch.magicLinks.authenticate(token, {session_duration_minutes: 60}) :
      stytch.oauth.authenticate(token, {session_duration_minutes: 60});

    authPromise.then(() => {
      navigate('/home');
    })
    .catch((err) => {
      console.log(err);
      navigate('/login');
    })
  }, [navigate, stytch]);

  return <h1>Authenticating...</h1>;
};

export default Authenticate;
