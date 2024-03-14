import data from "../database/index.js";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import Product from "../components/Product.js";
import { html } from "../utils.js";

export default ({ category, c }) => {
  const cat = category && data.categories.find((c) => c.key === category);

  const title = cat ? cat.name : "All Products";
  const products = cat
    ? cat.products
    : data.categories.flatMap((c) => c.products);

  return html`<!doctype html>
    <html>
      <head>
        <title>Tractor Store</title>
        <link rel="stylesheet" href="/explore/static/styles.css" />
        <link rel="stylesheet" href="/decide/static/styles.css" />
        <link rel="stylesheet" href="/checkout/static/styles.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body data-boundary="explore-page">
        ${Header({ c })}
        <main class="e_ListPage">
          <h2>${title}</h2>
          <p>${products.length} products</p>
          <ul class="e_ListPage_list">
            ${products.map(Product).join("")}
          </ul>
        </main>
        ${Footer()}
        <script src="/explore/static/scripts.js" type="module"></script>
        <script src="/decide/static/scripts.js" type="module"></script>
        <script src="/checkout/static/scripts.js" type="module"></script>
        <script src="/cdn/js/helper.js" type="module"></script>
      </body>
    </html>`;
};
