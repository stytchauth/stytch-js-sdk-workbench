import { Stytch } from "@stytch/stytch-react";
import React from "react";

const STYTCH_PUBLIC_TOKEN = process.env.REACT_APP_STYTCH_PUBLIC_TOKEN;

const Login = () => {
  const stytchProps = {
    loginOrSignupView: {
      products: ['oauth', 'emailMagicLinks'],
      oauthOptions:{
        providers:[{type:"google"}],
        loginRedirectURL: "https://kindhearted-longing-woodpecker.glitch.me/authenticate?type=oauth",
        signupRedirectURL: "https://kindhearted-longing-woodpecker.glitch.me/authenticate?type=oauth",
      },
      emailMagicLinksOptions: {
        loginRedirectURL: "https://kindhearted-longing-woodpecker.glitch.me/authenticate?type=eml",
        loginExpirationMinutes:30,
        signupRedirectURL: "https://kindhearted-longing-woodpecker.glitch.me/authenticate?type=eml",
        signupExpirationMinutes: 30,
      }
    },
    style: {
      fontFamily: '"Helvetica New", Helvetica, sans-serif',
      width: "321px",
      primaryColor: "#0577CA",
      primaryTextColor: "#090909",
    },
    publicToken: STYTCH_PUBLIC_TOKEN
  };

  return (
    <div className="Sign-in-container">
      <Stytch
        publicToken={stytchProps.publicToken}
        loginOrSignupView={stytchProps.loginOrSignupView}
        style={stytchProps.style}
      />
    </div>
  );
};

export default Login;
