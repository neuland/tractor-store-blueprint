import { html } from "../utils.js";
import Button from "./Button.js";

/**
 * LineItem component.
 * @param {object} props - The properties of the LineItem component.
 * @param {string} props.id - The ID of the product.
 * @param {string} props.sku - The SKU of the variant.
 * @param {string} props.name - The name of the variant.
 * @param {number} props.quantity - The quantity of the variant in the cart.
 * @param {number} props.total - The total price of the variant in the cart.
 * @param {string} props.image - The URL of the variant image.
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
