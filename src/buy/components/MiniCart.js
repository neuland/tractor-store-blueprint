import { readFromCookie } from "../state.js";
import { html } from "../utils.js";

export default ({ req }) => {
  const lineItems = readFromCookie(req);
  const quantity = lineItems.reduce((t, { quantity }) => t + quantity, 0);
  return html`<a
    href="/buy/cart"
    class="buy_MiniCart"
    data-boundary="buy-minicart"
  >
    <div class="buy_MiniCart__icon">🛒 ${quantity}</div>
  </a>`;
};
