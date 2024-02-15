import Variant from "../components/Variant.js";
import Header from "../../explore/components/Header.js";
import AddToCart from "../../checkout/components/AddToCart.js";
import Recommendations from "../../explore/components/Recommendations.js";
import { html } from "../utils.js";
import data from "../data.js";

export default ({ id, sku, req }) => {
  const { name, variants } = data.products.find((p) => p.id === id);
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
        <div>
          ${Header({ req })}
          <h2>${name}</h2>
          <div class="d_ProductPage_main">
            <img src="${variant.image}" width="400" />
            <div>
              <p>Price ${variant.price} EUR</p>
              <p>Variants:</p>
              <ul>
                ${variants
                  .map((v) =>
                    Variant({ ...v, selected: v.sku === variant.sku }),
                  )
                  .join("")}
              </ul>
            </div>
            ${AddToCart({ sku: variant.sku })}
          </div>
          ${Recommendations({ skus: [variant.sku] })}
        </div>
        <script src="/explore/scripts.js" async></script>
        <script src="/decide/scripts.js" async></script>
        <script src="/checkout/scripts.js" async></script>
        <script src="/cdn/js/helper.js" async></script>
      </body>
    </html>`;
};
