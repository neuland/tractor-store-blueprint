import Page from "../components/Page.js";
import LineItem from "../components/LineItem.js";
import data from "../data.js";
import { readFromCookie } from "../state.js";
import { html } from "../utils.js";

// imports from other teams -> fragments
import Header from "../../explore/components/Header.js";
import Footer from "../../explore/components/Footer.js";
import Recommendations from "../../explore/components/Recommendations.js";

export default ({ req }) => {
  const lineItems = readFromCookie(req).map(({ sku, quantity }) => {
    const variant = data.variants.find((p) => p.sku === sku);
    return { ...variant, quantity };
  });
  const skus = lineItems.map(({ sku }) => sku);
  const content = html`
    ${Header({ req })}
    <h2>Warenkorb</h2>
    <p>${lineItems.length} Produkte im Warenkorb</p>
    <ul class="CartPage__lineItems">
      ${lineItems.map(LineItem).join("")}
    </ul>
    <form action="/checkout/checkout" method="get">
      <button>checkout</button>
    </form>
    ${Recommendations({ skus })} ${Footer()}
  `;
  return Page({ content });
};
