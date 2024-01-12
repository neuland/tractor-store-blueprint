// generate as standard express entry file
import express from "express";
import DiscoverListPage from "./discover/pages/ListPage.js";

const app = express();

app.get("/", (req, res) => {
  const html = DiscoverListPage({ search: req.query.search });
  res.send(html);
});

// server one static file
app.get("/discover/styles.css", (req, res) => {
  res.sendFile("styles.css", { root: "src/discover" });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
