# Starter create-react-app and Express

Glitch only serves content on one port. This is typically not an issue, unless you're trying to run both a webpack development server for front-end work and a back-end server in the same project, at the same time — you get one port for serving resources, but both the front-end and back-end servers each want their own port! This is a common scenario when you're building your front end with [create-react-app], and your back end with [Express].

This starter app will get you on your way! Here's how to do it:

In **package.json**...

1. if you set your `start` script to `"npm run production"`, it will build the React app and Express will serve the static bundle over port 3000.
2. if you set your `start` script to `"npm run development"`, it will concurrently start the webpack dev server/watcher and the Express server. The latter will be listening on port 3001, but you don't need to change anything in your code because: proxies!

As it stands, the server listens for requests to `/api/some/endpoint`; to get this working in `development` mode, we're using [`http-proxy-middleware`] in **src/setupProxy.js** to forward any incoming request to `/a`



[create-react-app]: https://create-react-app.dev
[Express]: https://expressjs.com/
[`http-proxy-middleware`]: https://github.com/chimurai/http-proxy-middleware