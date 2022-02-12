import React from 'react';
import ReactDOM from 'react-dom';
import {StytchProvider, useStytch} from '@stytch/stytch-react'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const STYTCH_PUBLIC_TOKEN = process.env.REACT_APP_STYTCH_PUBLIC_TOKEN;

function WaitForStytch({children}) {
  return useStytch() ? children : null;
}

ReactDOM.render(
  <StytchProvider publicToken={STYTCH_PUBLIC_TOKEN}>
    <WaitForStytch>
      <App />
    </WaitForStytch>
  </StytchProvider>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
