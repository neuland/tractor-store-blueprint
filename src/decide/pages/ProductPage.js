import Variant from "../components/Variant.js";
import Header from "../../explore/components/Header.js";
import Footer from "../../explore/components/Footer.js";
import AddToCart from "../../checkout/components/AddToCart.js";
import Recommendations from "../../explore/components/Recommendations.js";
import { html } from "../utils.js";
import data from "../database/index.js";

export default ({ id, sku, req }) => {
  const {
    name,
    variants,
    highlights = [],
  } = data.products.find((p) => p.id === id);
  const variant = variants.find((v) => v.sku === sku) || variants[0];
  return html`<!doctype html>
    <html>
      <head>
        <title>Tractor Store</title>
        <link rel="stylesheet" href="/explore/styles.css" />
        <link rel="stylesheet" href="/decide/styles.css" />
        <link rel="stylesheet" href="/checkout/styles.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body data-boundary="decide-page">
        ${Header({ req })}
        <main class="d_ProductPage">
          <div class="d_ProductPage_details">
            <img
              class="d_ProductPage_image"
              src="${variant.image}"
              width="400"
            />
            <div>
              <h2 class="d_ProductPage__title">${name}</h2>
              <ul class="d_ProductPage__highlights">
                ${highlights
                  .map((highlight) => html`<li>${highlight}</li>`)
                  .join("")}
              </ul>
              <ul class="d_ProductPage__variants">
                ${variants
                  .map((v) =>
                    Variant({ ...v, selected: v.sku === variant.sku }),
                  )
                  .join("")}
              </ul>
              ${AddToCart({ sku: variant.sku })}
            </div>
          </div>
        </main>
        ${Recommendations({ skus: [variant.sku] })} ${Footer()}
        <script src="/explore/scripts.js" async></script>
        <script src="/decide/scripts.js" async></script>
        <script src="/checkout/scripts.js" async></script>
        <script src="/cdn/js/helper.js" type="module"></script>
      </body>
    </html>`;
};
