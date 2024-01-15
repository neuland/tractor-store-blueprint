// generate as standard express entry file
import express from "express";
import { ListPage } from "./discover/index.js";
import { ProductPage } from "./decide/index.js";
import { CartPage, handleAddToCart } from "./buy/index.js";

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(ListPage({ search: req.query.search }));
});

app.get("/product/:id", (req, res) => {
  res.send(ProductPage({ id: req.params.id, sku: req.query.sku }));
});

app.get("/buy/cart", (req, res) => {
  res.send(CartPage());
});

app.post("/buy/addtocart", (req, res) => {
  handleAddToCart({ sku: req.body.sku });
  res.redirect("/buy/cart");
});

["discover", "decide", "buy"].forEach((team) => {
  app.use(`/static/${team}`, express.static(`src/${team}`));
});

app.listen(3000, () => {
  console.log("Server is listening on port http://localhost:3000/");
});
