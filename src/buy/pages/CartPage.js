import Header from "../../explore/components/Header.js";
import Recommendations from "../../explore/components/Recommendations.js";
import LineItem from "../components/LineItem.js";
import data from "../data.js";
import { readFromCookie } from "../state.js";
import { html } from "../utils.js";

export default ({ req }) => {
  const lineItems = readFromCookie(req).map(({ sku, quantity }) => {
    const variant = data.variants.find((p) => p.sku === sku);
    return { ...variant, quantity };
  });
  const skus = lineItems.map(({ sku }) => sku);
  return html`<!doctype html>
    <html>
      <head>
        <title>Tractor Store</title>
        <link rel="stylesheet" href="/explore/styles.css" />
        <link rel="stylesheet" href="/decide/styles.css" />
        <link rel="stylesheet" href="/buy/styles.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body data-boundary="buy-page">
        <div>
          ${Header({ req })}
          <h2>Warenkorb</h2>
          <p>${lineItems.length} Produkte im Warenkorb</p>
          <ul class="CartPage__lineItems">
            ${lineItems.map(LineItem).join("")}
          </ul>
          <form action="/buy/checkout" method="get">
            <button>checkout</button>
          </form>
          ${Recommendations({ skus })}
        </div>
      </body>
    </html>`;
};
