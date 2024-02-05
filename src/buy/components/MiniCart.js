import { readFromCookie } from "../state.js";

export default (req) => {
  const lineItems = readFromCookie(req);
  const quantity = lineItems.reduce((t, { quantity }) => t + quantity, 0);
  return `<div class="MiniCart" data-boundary="buy-minicart">
  <div class="MiniCart__icon">🛒 ${quantity}</div>
</div>`;
};
