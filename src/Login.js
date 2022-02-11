import React, { useEffect, useRef } from "react";
import { Stytch } from "@stytch/stytch-react";
import { useNavigate } from "react-router-dom";
import { stytch, useStytchUser } from "./Stytch";

const STYTCH_PUBLIC_TOKEN = process.env.REACT_APP_STYTCH_PUBLIC_TOKEN;

const Login = () => {
  const navigate = useNavigate();
  const stytchUser = useStytchUser();
  const emailRef = useRef();

  useEffect(() => {
    if (stytchUser) {
      navigate("/home");
    }
  }, [stytchUser]);

  const onSubmit = (e) => {
    e.preventDefault();
    stytch.magicLinks.email.loginOrCreate(emailRef.current.value, {
      login_magic_link_url:
        "https://kindhearted-longing-woodpecker.glitch.me/authenticate?type=eml",
      signup_magic_link_url:
        "https://kindhearted-longing-woodpecker.glitch.me/authenticate?type=eml",
    });
  };
  
  const googleUrl = stytch.oauth.google.getUrl();

  return (
    <div className="Sign-in-container">
      <a href={googleUrl}> OAuth </a>
      <form onSubmit={onSubmit}>
        <label>
          Email:
          <input ref={emailRef} name="email" type="email" />
        </label>
        <button type="submit"> Submit </button>
      </form>
    </div>
  );
};

export default Login;
