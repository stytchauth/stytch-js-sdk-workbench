const stytch = require("stytch");

function cookieParser(cookieString) {
  if (cookieString === "") return {};

  let pairs = cookieString.split(";");

  let splittedPairs = pairs.map((cookie) => cookie.split("="));

  // Create an object with all key-value pairs
  const cookieObj = splittedPairs.reduce(function (obj, cookie) {
    obj[decodeURIComponent(cookie[0].trim())] = decodeURIComponent(
      cookie[1].trim()
    );
    return obj;
  }, {});
  return cookieObj;
}

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

const stytchClient = new stytch.Client({
  project_id: process.env.STYTCH_PROJECT_ID,
  secret: process.env.STYTCH_PROJECT_SECRET,
  env: stytch.envs.test,
});

const handler = async (event, context) => {
  const cookies = cookieParser(event.headers.cookie);
  try {
    const s = await stytchClient.sessions.authenticate({
      session_token: cookies.session_token,
    });

    console.log(s.session, isMFA(s.session));

    if (isMFA(s.session)) {
      return {
        statusCode: 200,
        body: JSON.stringify({ mfa: true }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: `No MFA` }),
      };
    }
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: `Could not authenticate session` }),
    };
  }
};

module.exports = { handler };
