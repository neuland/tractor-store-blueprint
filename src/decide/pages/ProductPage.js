import VariantOption from "../components/VariantOption.js";
import Header from "../../explore/components/Header.js";
import Footer from "../../explore/components/Footer.js";
import AddToCart from "../../checkout/components/AddToCart.js";
import Recommendations from "../../explore/components/Recommendations.js";
import { html } from "../utils.js";
import data from "../database/index.js";

/**
 * ProductPage component.
 * @param {object} props - The properties of the ProductPage component.
 * @param {string} props.id - The ID of the product.
 * @param {string} props.sku - The SKU of the selected variant.
 * @param {object} props.c - The context object.
 * @returns {string} The ProductPage component markup.
 */
export default ({ id, sku, c }) => {
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
        <link rel="stylesheet" href="/explore/static/styles.css" />
        <link rel="stylesheet" href="/decide/static/styles.css" />
        <link rel="stylesheet" href="/checkout/static/styles.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body data-boundary="decide-page">
        ${Header({ c })}
        <main class="d_ProductPage">
          <div class="d_ProductPage__details">
            <img
              class="d_ProductPage__productImage"
              src="${variant.image}"
              width="400"
            />
            <div class="d_ProductPage__productInformation">
              <h2 class="d_ProductPage__title">${name}</h2>
              <ul class="d_ProductPage__highlights">
                ${highlights
                  .map((highlight) => html`<li>${highlight}</li>`)
                  .join("")}
              </ul>
              <ul class="d_ProductPage__variants">
                ${variants
                  .map((v) =>
                    VariantOption({ ...v, selected: v.sku === variant.sku }),
                  )
                  .join("")}
              </ul>
              ${AddToCart({ sku: variant.sku })}
            </div>
          </div>
          ${Recommendations({ skus: [variant.sku] })}
        </main>
        ${Footer()}
        <script src="/explore/static/scripts.js" type="module"></script>
        <script src="/decide/static/scripts.js" type="module"></script>
        <script src="/checkout/static/scripts.js" type="module"></script>
        <script src="/cdn/js/helper.js" type="module"></script>
      </body>
    </html>`;
};
