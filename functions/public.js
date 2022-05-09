// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event, context) => {
  console.log("❇️ Received GET request to /api/public");
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Ok!` }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
