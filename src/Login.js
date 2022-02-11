import React, { useEffect } from "react";
import { Stytch } from "@stytch/stytch-react";
import { useNavigate } from "react-router-dom";
import { stytch, useStytchUser } from "./Stytch";

const STYTCH_PUBLIC_TOKEN = process.env.REACT_APP_STYTCH_PUBLIC_TOKEN;

const Login = () => {
  const navigate = useNavigate();
  const stytchUser = useStytchUser();

  useEffect(() => {
    if (stytchUser) {
      navigate("/home");
    }
  }, [stytchUser]);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(e.target, e.target.value);
    stytch.magicLinks.email.loginOrCreate(1, {
      loginRedirectURL:
        "https://kindhearted-longing-woodpecker.glitch.me/authenticate?type=eml",
      loginExpirationMinutes: 30,
      signupRedirectURL:
        "https://kindhearted-longing-woodpecker.glitch.me/authenticate?type=eml",
      signupExpirationMinutes: 30,
    });
  };

  return (
    <div className="Sign-in-container">
      <form onSubmit={onSubmit}>
        <label>
          Email:
          <input name="email" type="email" />
        </label>
        <button type="submit"> Submit </button>
      </form>
    </div>
  );
};

export default Login;
