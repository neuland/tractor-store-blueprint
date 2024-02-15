import { html } from "../utils.js";

export default ({ name, url, image }) => {
  return html`<li class="e_Product">
    <a class="e_Product_link" href="${url}">
      <img class="e_Product_image" src="${image}" width="200" />
      <span class="e_Product_name">${name}</span>
    </a>
  </li>`;
};
