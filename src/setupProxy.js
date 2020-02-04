const proxy = require("http-proxy-middleware");

// This proxy redirects requests to /api endpoints to
// the Express server running on port 3001 when we're
// in `NODE_ENV=development` mode.
module.exports = function(app) {
  app.use(
    "/api",
    proxy({
      target: "http://localhost:3001"
    })
  );
};
