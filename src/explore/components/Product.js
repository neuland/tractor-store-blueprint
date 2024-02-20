import { html } from "../utils.js";

export default ({ name, url, image, startPrice }) => {
  return html`<li class="e_Product">
    <a class="e_Product_link" href="${url}">
      <img class="e_Product_image" src="${image}" width="200" />
      <span class="e_Product_name">${name}</span>
      <span class="e_Product_price">${startPrice},00 €</span>
    </a>
  </li>`;
};
