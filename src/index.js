import React from "react";
import ReactDOM from "react-dom";
import { StytchProvider } from "@stytch/react";
import { StytchHeadlessClient } from '@stytch/vanilla-js/headless';
import "./index.css";
import App from "./App";

const STYTCH_PUBLIC_TOKEN = process.env.REACT_APP_STYTCH_PUBLIC_TOKEN;

const stytch = new StytchHeadlessClient(STYTCH_PUBLIC_TOKEN);

ReactDOM.render(
  <StytchProvider stytch={stytch}>
    <App />
  </StytchProvider>,
  document.getElementById("root")
);
