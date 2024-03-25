import { html } from "../utils.js";
import Button from "./Button.js";

/**
 * LineItem component.
 * @param {LineItem} props - The line item.
 * @returns {string} The LineItem component markup.
 */
export default ({ sku, id, name, quantity, total, image }) => {
  const url = `/product/${id}?sku=${sku}`;
  return html`<li class="c_LineItem">
    <a href="${url}" class="c_LineItem__image">
      <img src="${image}" alt="${name}" />
    </a>
    <a href="${url}" class="c_LineItem__name">
      <strong>${name}</strong><br />${sku}
    </a>
    <div class="c_LineItem__quantity">${quantity}</div>

    <form action="/checkout/cart/remove" method="post">
      <input type="hidden" name="sku" value="${sku}" />
      ${Button({
        variant: "secondary",
        type: "submit",
        value: "remove",
        children: "Remove",
      })}
    </form>
    <div class="c_LineItem__price">${total} Ø</div>
  </li>`;
};
