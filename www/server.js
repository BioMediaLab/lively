const express = require("express");
const next = require("next");

const routes = require("./routes");
const { handleServerRequest } = require("./makeRouter");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get("/healthz", (req, res) => {
    res.status(200).send("ok");
  });

  handleServerRequest(routes, server, app);

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
