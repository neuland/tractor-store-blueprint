import fs from "fs";
import express from "express";
import cookieParser from "cookie-parser";
import postcss from "postcss";
import atImport from "postcss-import";
import { ListPage } from "./explore/index.js";
import { ProductPage } from "./decide/index.js";
import {
  CartPage,
  handleAddToCart,
  handleRemoveFromCart,
} from "./buy/index.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// inline @import rules to deliver a single CSS file
async function inlinedCss(path) {
  const css = fs.readFileSync(path, "utf8");
  const result = await postcss().use(atImport()).process(css, { from: path });
  return result.css;
}

/**
 * Team Explore
 */

app.get("/:category?", (req, res) => {
  res.send(ListPage({ category: req.params.category, req }));
});

app.get("/explore/styles.css", async (req, res) => {
  res.setHeader("Content-Type", "text/css");
  res.send(await inlinedCss("./src/explore/styles.css"));
});

/**
 * Team Decide
 */

app.get("/product/:id", (req, res) => {
  res.send(ProductPage({ id: req.params.id, sku: req.query.sku, req }));
});

app.get("/decide/styles.css", async (req, res) => {
  res.setHeader("Content-Type", "text/css");
  res.send(await inlinedCss("./src/decide/styles.css"));
});

/**
 * Team Buy
 */

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

app.get("/buy/styles.css", async (req, res) => {
  res.setHeader("Content-Type", "text/css");
  res.send(await inlinedCss("./src/buy/styles.css"));
});

app.listen(3000, () => {
  console.log("Server is listening on port http://localhost:3000/");
});
