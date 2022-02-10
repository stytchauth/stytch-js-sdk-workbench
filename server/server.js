const express = require("express");
const path = require("path");
const stytch = require("stytch");
const cookieParser = require("cookie-parser");

const stytchClient = new stytch.Client({
  project_id: process.env.STYTCH_PROJECT_ID,
  secret: process.env.STYTCH_PROJECT_SECRET,
  env: stytch.envs.test,
});

const app = express();
app.use(cookieParser);

// PWAs want HTTPS!
function checkHttps(request, response, next) {
  // Check the protocol — if http, redirect to https.
  if (request.get("X-Forwarded-Proto").indexOf("https") != -1) {
    return next();
  } else {
    response.redirect("https://" + request.hostname + request.url);
  }
}

app.all("*", checkHttps);

function AuthenticationMiddleware(req, res, next) {
  const session_token = req.cookies["stytch_session_cookie"];
  if (!session_token) {
    return next(new Error("No session"));
  }
  stytchClient.sessions
    .authenticate({ session_token })
    .then(({ session }) => {
      req.user = session;
      return next();
    })
    .catch((err) => {
      console.error("Could not authenticate session", err);
      return next(new Error("No session"));
    });
}

app.get("/api/public", (request, response) => {
  console.log("❇️ Received GET request to /api/public");
  response.send("OK!");
});

app.get(
  "/api/logged_in_route",
  AuthenticationMiddleware,
  (request, response) => {
    console.log("❇️ Received GET request to /api/logged_in_route");
    response.send("OK!");
  }
);

app.get("/api/mfa_route", (request, response) => {
  console.log("❇️ Received GET request to /api/mfa_route");
  console.log("❇️ Received GET request to /api/logged_in_route");
  response.send("OK!");
});

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
