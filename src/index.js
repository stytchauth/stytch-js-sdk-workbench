import React from 'react';
import ReactDOM from 'react-dom';
import {StytchProvider, useStytch} from './stytch-react'
import './index.css';
import App from './App';

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
