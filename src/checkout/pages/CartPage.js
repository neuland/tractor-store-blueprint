import Page from "../components/Page.js";
import LineItem from "../components/LineItem.js";
import data from "../database/index.js";
import { readFromCookie } from "../state.js";
import { html } from "../utils.js";
import Header from "../../explore/components/Header.js";
import Footer from "../../explore/components/Footer.js";
import Recommendations from "../../explore/components/Recommendations.js";
import Button from "../components/Button.js";

function getLineItems(c) {
  return readFromCookie(c).reduce((res, { sku, quantity }) => {
    const variant = data.variants.find((p) => p.sku === sku);
    if (variant) {
      res.push({ ...variant, quantity, total: variant.price * quantity });
    }
    return res;
  }, []);
}

export default ({ c }) => {
  const lineItems = getLineItems(c);
  const total = lineItems.reduce((res, { total }) => res + total, 0);
  const skus = lineItems.map(({ sku }) => sku);
  const content = html`
    ${Header({ c })}
    <main class="c_CartPage">
      <h2>Warenkorb</h2>
      <ul class="c_CartPage__lineItems">
        ${lineItems.map(LineItem).join("")}
      </ul>
      <hr />
      <p class="c_CartPage__total">Total: ${total} Ø</p>

      <div class="c_CartPage__buttons">
        ${Button({
          href: "/",
          children: "Continue Shopping",
          variant: "secondary",
        })}
        ${Button({
          href: "/checkout/checkout",
          children: "Checkout",
          variant: "primary",
        })}
      </div>

      ${Recommendations({ skus })} ${Footer()}
    </main>
  `;
  return Page({ content });
};
