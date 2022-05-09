// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Ok!` }),
  };
};

module.exports = { handler };
