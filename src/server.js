// generate as standard express entry file
import express from "express";
import cookieParser from "cookie-parser";
import { ListPage } from "./discover/index.js";
import { ProductPage } from "./decide/index.js";
import {
  CartPage,
  handleAddToCart,
  handleRemoveFromCart,
} from "./buy/index.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/:category?", (req, res) => {
  res.send(ListPage({ category: req.params.category, req }));
});

app.get("/product/:id", (req, res) => {
  res.send(ProductPage({ id: req.params.id, sku: req.query.sku, req }));
});

app.get("/buy/cart", (req, res) => {
  res.send(CartPage({ req }));
});

app.get("/buy/checkout", (req, res) => {
  res.send("checkout");
});

app.post("/buy/cart/add", (req, res) => {
  handleAddToCart(req, res);
  res.redirect("/buy/cart");
});

app.post("/buy/cart/remove", (req, res) => {
  handleRemoveFromCart(req, res);
  res.redirect("/buy/cart");
});

["discover", "decide", "buy"].forEach((team) => {
  app.use(`/static/${team}`, express.static(`src/${team}`));
});

app.listen(3000, () => {
  console.log("Server is listening on port http://localhost:3000/");
});
