const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const stytch = require("stytch");
require("dotenv").config();

const stytchClient = new stytch.Client({
  project_id: process.env.STYTCH_PROJECT_ID,
  secret: process.env.STYTCH_PROJECT_SECRET,
  env: stytch.envs.test,
});

const isMFA = (session) => {
  const hasEmailMagicLink = session.authentication_factors.some(
    (factor) => factor.type === "magic_link"
  );
  const hasWebauthn = session.authentication_factors.some(
    (factor) => factor.type === "webauthn"
  );

  const hasTotp = session.authentication_factors.some(
    (factor) => factor.type === "totp"
  );

  return hasEmailMagicLink && (hasWebauthn || hasTotp);
};

export const AuthenticationMiddleware = ({ mfa_required }) => {
  return function (req, res, next) {
    const session_token = req.cookies["stytch_session"];
    if (!session_token) {
      return next(new Error("No session"));
    }
    stytchClient.sessions
      .authenticate({ session_token })
      .then(({ session }) => {
        req.session = session;
        if (!mfa_required) {
          return next();
        }
        if (isMFA(session)) {
          return next();
        }
        return res.status(401).send("NO MFA");
      })
      .catch((err) => {
        console.error("Could not authenticate session", err);
        return next(new Error("No session"));
      });
  };
};

const app = express();
app.use(cookieParser());

app.get(
  "/api/logged_in_route",
  AuthenticationMiddleware({ mfa_required: false }),
  (request, response) => {
    console.log("❇️ Received GET request to /api/logged_in_route");
    response.json({ logged_in: true, session: request.session });
  }
);

app.get(
  "/api/mfa_route",
  AuthenticationMiddleware({ mfa_required: true }),
  (request, response) => {
    console.log("❇️ Received GET request to /api/mfa_route");
    response.json({ mfa: true });
  }
);

// Express port-switching logic
let port;
console.log("❇️ NODE_ENV is", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  port = process.env.PORT || 3000;
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
  console.log("⚠️ Not seeing your changes as you develop?");
  console.log(
    "⚠️ Do you need to set 'start': 'npm run development' in package.json?"
  );
}

// Start the listener!
const listener = app.listen(port, () => {
  console.log("❇️ Express server is running on port", listener.address().port);
});
