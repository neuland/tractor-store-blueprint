import { html } from "../utils.js";

/**
 * Product component.
 * @param {Product} props - The properties of the Product component.
 * @returns {string} The Product component markup.
 */
export default ({ name, url, image, startPrice }) => {
  return html`<li class="e_Product">
    <a class="e_Product_link" href="${url}">
      <img class="e_Product_image" src="${image}" width="200" />
      <span class="e_Product_name">${name}</span>
      <span class="e_Product_price">${startPrice},00 Ø</span>
    </a>
  </li>`;
};
