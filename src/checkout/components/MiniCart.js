import { readFromCookie } from "../state.js";
import { html } from "../utils.js";

export default ({ req }) => {
  const lineItems = readFromCookie(req);
  const quantity = lineItems.reduce((t, { quantity }) => t + quantity, 0);
  return html`<a
    href="/checkout/cart"
    class="che_MiniCart"
    data-boundary="che-minicart"
  >
    <div class="che_MiniCart__icon">🛒 ${quantity}</div>
  </a>`;
};
