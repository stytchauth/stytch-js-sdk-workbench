import React from "react";
import { useNavigate } from "react-router-dom";
import { stytch } from './Stytch';

const Authenticate = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const type = params.get('type');
    
    const authPromise = type === "eml" ?
      stytch.magicLinks.authenticate(token, {session_duration_minutes: 60}) :
      stytch.oauth.authenticate(token, {session_duration_minutes: 60});
    
    authPromise.then(() => {
      navigate('/')
    })
    .catch(() => navigate('/login'))
  }, [navigate]);

  return <React.Fragment />;
};

export default Authenticate;
