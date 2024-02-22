import data from "../database/index.js";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import Product from "../components/Product.js";
import { html } from "../utils.js";

export default ({ category, req }) => {
  const cat = category && data.categories.find((c) => c.key === category);

  const title = cat ? cat.name : "All Products";
  const products = cat
    ? cat.products
    : data.categories.flatMap((c) => c.products);

  return html`<!doctype html>
    <html>
      <head>
        <title>Tractor Store</title>
        <link rel="stylesheet" href="/explore/styles.css" />
        <link rel="stylesheet" href="/decide/styles.css" />
        <link rel="stylesheet" href="/checkout/styles.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body data-boundary="explore-page">
        ${Header({ req })}
        <main class="e_ListPage">
          <h2>${title}</h2>
          <p>${products.length} products</p>
          <ul class="e_ListPage_list">
            ${products.map(Product).join("")}
          </ul>
        </main>
        ${Footer()}
        <script src="/explore/scripts.js" type="module"></script>
        <script src="/decide/scripts.js" type="module"></script>
        <script src="/checkout/scripts.js" type="module"></script>
        <script src="/cdn/js/helper.js" type="module"></script>
      </body>
    </html>`;
};
