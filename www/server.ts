import express from "express";
const next = require("next");

const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get("/healthz", (_, res) => {
    res.status(200).send("ok");
  });

  server.get("/classes/:id", (req, res) => {
    return app.render(req, res, "/classes", { course_id: req.params.id });
  });

  server.get("/classes/:id/settings", (req, res) => {
    return app.render(req, res, "/classSettings", { course_id: req.params.id });
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err: any) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
