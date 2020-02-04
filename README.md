# Starter create-react-app and Express

Glitch only serves content on one port. This is typically not an issue, unless you're trying to run both a webpack development server for front-end work and a back-end server in the same project, at the same time — you get one port for serving resources, but both the front-end and back-end servers each want their own port! This is a common scenario when you're building your front end with [create-react-app], and your back end with [Express].

This starter app will get you on your way with this scenario!

## Forwarding requests via a proxy

In **package.json**...

1. if you set your `start` script to `"npm run production"`, it will build the React app and Express will serve the static bundle over port 3000.

2. if you set your `start` script to `"npm run development"`, it will concurrently start the webpack dev server/watcher and the Express server. The latter will be listening on port 3001, but you don't need to change anything in your code because: proxies!

As it stands, the server listens for requests to `/api`; to get this working in `development` mode, we're using [`http-proxy-middleware`] in **src/setupProxy.js** to forward any incoming request to `/api/whatever/endpoint/you/have` over to the `target`, i.e., the Express server.

## Live-reloading and watch.json

There's a **watch.json** file that specifies a couple of conditions to keep Webpack and Glitch from interfering with each others' file watchers:

1. We only want to run `install` scripts when changes are made to the **package.json** and **.env** files. Installation can take a while, so we don't want to trigger it with any other changes.
2. We only want to `restart` the project when changes are made in the **/server** folder, or to the **watch.json** file. We're including **watch.json** in case we need to kick off a restart — a change to the `throttle` value will trigger this. We're also explicitly ignoring any files in the **/public** and **/src** directories from kicking off a restart — we only want the Webpack watcher to handle these files.
3. We're setting a `throttle` of 100, which means that the Glitch watcher will wait 100 milliseconds before restarting anything. If that seems too quick, you can increase it.

## Made with Glitch

Glitch is a collaborative programming environment that lives in your browser and deploys code as you type.

Use Glitch to build anything from a good ol’ static webpage to full-stack Node apps.


[create-react-app]: https://create-react-app.dev
[Express]: https://expressjs.com/
[`http-proxy-middleware`]: https://github.com/chimurai/http-proxy-middleware