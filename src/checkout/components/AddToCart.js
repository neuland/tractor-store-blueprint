import data from "../database/index.js";
import { html } from "../utils.js";

export default ({ sku }) => {
  const product = data.variants.find((p) => p.sku === sku);
  const outOfStock = product.inventory === 0;
  return html`<form
    action="/checkout/cart/add"
    method="POST"
    class="c_AddToCart"
    data-boundary="checkout-button"
  >
    <input type="hidden" name="sku" value="${sku}" />
    <div class="c_AddToCart__information">
      <p>${product.price} €</p>
      ${product.inventory > 0
        ? html`<p class="c_AddToCart__stock c_AddToCart__stock--ok">
            ${product.inventory} in stock, free shipping
          </p>`
        : html`<p class="c_AddToCart__stock c_AddToCart__stock--empty">
            out of stock
          </p>`}
    </div>
    <button ${outOfStock ? "disabled" : ""} class="c_AddToCart__button">
      <div class="c_AddToCart__inner">add to basket</div>
    </button>
  </form>`;
};
