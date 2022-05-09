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

const stytchClient = new stytch.Client({
  project_id: process.env.STYTCH_PROJECT_ID,
  secret: process.env.STYTCH_PROJECT_SECRET,
  env: stytch.envs.test,
});

const handler = async (event, context) => {
  const cookies = cookieParser(event.headers.cookie);
  console.log(cookies);

  try {
    const s = await stytchClient.sessions.authenticate({
      session_token: cookies.stytch_session,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ logged_in: true, session: s.session }),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: `Could not authenticate` }),
    };
  }
};

module.exports = { handler };
