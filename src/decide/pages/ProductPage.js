import Variant from "../components/Variant.js";
import Header from "../../explore/components/Header.js";
import AddToCart from "../../buy/components/AddToCart.js";
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
        <link rel="stylesheet" href="/buy/styles.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body data-boundary="decide-page">
        <div>
          ${Header({ req })}
          <h2>${name}</h2>
          <img src="${variant.image}" width="400" />
          <p>Price ${variant.price} EUR</p>
          <p>Variants:</p>
          <ul>
            ${variants
              .map((v) => Variant({ ...v, selected: v.sku === variant.sku }))
              .join("")}
          </ul>
          ${AddToCart({ sku: variant.sku })}
          ${Recommendations({ skus: [variant.sku] })}
        </div>
      </body>
    </html>`;
};
