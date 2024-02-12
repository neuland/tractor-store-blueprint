import data from "../data.js";
import { html } from "../utils.js";

export default ({ sku }) => {
  const product = data.variants.find((p) => p.sku === sku);
  const outOfStock = product.inventory === 0;
  return html`<form
    action="/buy/cart/add"
    method="POST"
    class="buy_AddToCart"
    data-boundary="buy-button"
  >
    <input type="hidden" name="sku" value="${sku}" />
    <p>price: ${product.price} Øcken</p>
    <button ${outOfStock ? "disabled" : ""}>add to cart</button>
    ${product.inventory > 0
      ? html`<p class="buy_AddToCart__stock buy_AddToCart__stock--ok">
          ${product.inventory} in stock, free shipping
        </p>`
      : html`<p class="buy_AddToCart__stock buy_AddToCart__stock--empty">
          out of stock
        </p>`}
  </form>`;
};
