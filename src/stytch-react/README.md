# Stytch-React

Stytch's React Library

## Install

With `npm`
`npm install @stytch/stytch-react --save`

## Documentation

For full documentation please refer to Stytch's javascript SDK documentation on https://stytch.com/docs/sdks.

## Example Usage

```javascript
import { Stytch } from "@stytch/stytch-react";

const App = () => {
  const stytchProps = {
    loginOrSignupView: {
      products: ["emailMagicLinks"],
      emailMagicLinksOptions: {
        loginRedirectURL: "https://example.com/authenticate",
        loginExpirationMinutes: 30,
        signupRedirectURL: "https://example.com/authenticate",
        signupExpirationMinutes: 30,
        createUserAsPending: true,
      },
    },
    style: {
      fontFamily: '"Helvetica New", Helvetica, sans-serif',
      width: "321px",
      primaryColor: "#0577CA",
    },
    publicToken: "public-token-111-111-1234",
    callbacks: {
      onEvent: (message) => console.log(message),
      onSuccess: (message) => console.log(message),
      onError: (message) => console.log(message),
    },
  };

  return (
    <div id="login">
      <Stytch
        publicToken={stytchProps.publicToken}
        loginOrSignupView={stytchProps.loginOrSignupView}
        style={stytchProps.style}
        callbacks={stytchProps.callbacks}
      />
    </div>
  );
};
```

## Typescript Support

There are built in typescript definitions in the npm package.

### Changelog
**[3.0.1] - 2020-8-25**
- `@stytch/stytch-js` has been bumped to include new OAuth types
- `SDKProductTypes` and `OAuthProvidersTypes` are now re-exported for convenience
- Dependency bumps

**[3.0.0] - 2020-8-1**
- This package now uses the [@stytch/stytch-js](https://www.npmjs.com/package/@stytch/stytch-js) library to load stytch.js
