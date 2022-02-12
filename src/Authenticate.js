import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useStytch} from '@stytch/stytch-react';

const Authenticate = () => {
  const navigate = useNavigate();
  const stytch = useStytch();
  const [error, setError] = useState(null)

  useEffect(() => {
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
        setError(err);
        setTimeout(() => navigate('/login'), 10000);
      })
  }, [navigate, stytch]);

  return (
    <div className="container">
      <div className="column">
        <h1>Authenticating...</h1>
        {error ? <> An error has occurred: <br/><pre>{String(error)}</pre> </> : null}
      </div>
    </div>
  );
};

export default Authenticate;
