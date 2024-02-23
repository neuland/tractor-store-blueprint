import { html } from "../utils.js";

export default ({ sku, id, name, quantity, price, image }) => {
  const url = `/product/${id}?sku=${sku}`;
  return html`<li class="c_LineItem">
    <a href="${url}" class="c_LineItem__image">
      <img src="${image}" alt="${name}" />
    </a>
    <a href="${url}" class="c_LineItem__name">
      <strong>${name}</strong><br />${sku}
    </a>
    <div class="c_LineItem__quantity">${quantity}</div>
    <div class="c_LineItem__price">${price * quantity} Ø</div>
    <form action="/checkout/cart/remove" method="post">
      <input type="hidden" name="sku" value="${sku}" />
      <input type="submit" value="remove" />
    </form>
  </li>`;
};
