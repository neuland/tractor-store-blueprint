import createServer from "./server.js";
import { serveStatic } from "hono/cloudflare-workers";
import manifest from "__STATIC_CONTENT_MANIFEST";

const app = createServer();

const setCacheAndCors = async (c, next) => {
  await next();
  c.res.headers.append("Cache-Control", "public, max-age=3600"); // 1 hour cache
  c.res.headers.append("Access-Control-Allow-Origin", "*");
  c.res.headers.append("Access-Control-Allow-Methods", "GET,OPTIONS");
};

app.use("/cdn/*", setCacheAndCors);
app.use("/cdn/*", serveStatic({ root: "./", manifest }));
["explore", "decide", "checkout"].forEach((team) => {
  app.use(`/${team}/static/*`, setCacheAndCors);
  app.use(`/${team}/static/*`, serveStatic({ root: `./`, manifest }));
});

export default app;
