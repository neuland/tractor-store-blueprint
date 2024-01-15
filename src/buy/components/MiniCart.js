import state from "../state.js";

export default () => {
  const quantity = state.lineItems.reduce((t, { quantity }) => t + quantity, 0);
  return `<div class="MiniCart" data-boundary="buy-minicart">
  <div>🛒 ${quantity}</div>
</div>`;
};
