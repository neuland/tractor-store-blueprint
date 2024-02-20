import fs from "fs";
import * as url from "url";
import express from "express";
import cookieParser from "cookie-parser";
import postcss from "postcss";
import atImport from "postcss-import";
import { ListPage } from "./explore/index.js";
import { ProductPage } from "./decide/index.js";
import {
  CartPage,
  Checkout,
  MiniCart,
  handleAddToCart,
  handleRemoveFromCart,
} from "./checkout/index.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

let __rootDir = url.fileURLToPath(new URL("..", import.meta.url));

// fix render.com path resolution
if (__rootDir.endsWith("src/")) {
  __rootDir = __rootDir.slice(0, -4);
}

// inline @import rules to deliver a single CSS file
async function inlinedCss(cssFile) {
  const cssPath = `${__rootDir}${cssFile}`;

  const css = fs.readFileSync(cssPath, "utf8");
  const result = await postcss()
    .use(atImport())
    .process(css, { from: cssPath });
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
  res.send(await inlinedCss("src/explore/styles.css"));
});

app.get("/explore/scripts.js", (req, res) => {
  res.sendFile("src/explore/scripts.js", { root: "." });
});

/**
 * Team Decide
 */

app.get("/product/:id", (req, res) => {
  res.send(ProductPage({ id: req.params.id, sku: req.query.sku, req }));
});

app.get("/decide/styles.css", async (req, res) => {
  res.setHeader("Content-Type", "text/css");
  res.send(await inlinedCss("src/decide/styles.css"));
});

app.get("/decide/scripts.js", (req, res) => {
  res.sendFile("src/decide/scripts.js", { root: "." });
});

/**
 * Team Buy
 */

app.get("/checkout/cart", (req, res) => {
  res.send(CartPage({ req }));
});

app.get("/checkout/checkout", (req, res) => {
  res.send(Checkout());
});

app.get("/checkout/mini-cart", (req, res) => {
  res.send(MiniCart({ req }));
});

app.post("/checkout/cart/add", (req, res) => {
  handleAddToCart(req, res);
  res.redirect("/checkout/cart");
});

app.post("/checkout/cart/remove", (req, res) => {
  handleRemoveFromCart(req, res);
  res.redirect("/checkout/cart");
});

app.get("/checkout/styles.css", async (req, res) => {
  res.setHeader("Content-Type", "text/css");
  res.send(await inlinedCss("src/checkout/styles.css"));
});

app.get("/checkout/scripts.js", (req, res) => {
  res.sendFile("src/checkout/scripts.js", { root: "." });
});

app.use("/cdn", express.static("cdn"));

app.listen(3000, () => {
  console.log("Server is listening on port http://localhost:3000/");
});
