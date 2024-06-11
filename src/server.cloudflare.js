import createServer from "./server.js";
import { serveStatic } from "hono/cloudflare-workers";
import manifest from "__STATIC_CONTENT_MANIFEST";

const app = createServer();

const setCacheAndCors = (req, res, next) => {
  res.setHeader("Cache-Control", "public, max-age=3600"); // 1 hour cache
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
};

app.use("/cdn/*", setCacheAndCors);
app.use("/cdn/*", serveStatic({ root: "./", manifest }));
["explore", "decide", "checkout"].forEach((team) => {
  app.use(`/${team}/static/*`, setCacheAndCors);
  app.use(`/${team}/static/*`, serveStatic({ root: `./`, manifest }));
});

export default app;
