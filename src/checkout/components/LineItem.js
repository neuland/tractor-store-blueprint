import { html } from "../utils.js";

export default ({ sku, id, name, quantity, image }) => {
  const url = `/product/${id}?sku=${sku}`;
  return html`<li class="che_LineItem">
    <a href="${url}" class="che_LineItem__image">
      <img src="${image}" alt="${name}" />
    </a>
    <a href="${url}" class="che_LineItem__name">
      <strong>${name}</strong><br />${sku}
    </a>
    <div class="che_LineItem__quantity">${quantity}</div>
    <form action="/checkout/cart/remove" method="post">
      <input type="hidden" name="sku" value="${sku}" />
      <input type="submit" value="remove" />
    </form>
  </li>`;
};
