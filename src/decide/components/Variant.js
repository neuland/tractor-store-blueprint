import { html } from "../utils.js";

export default ({ sku, name, selected }) => {
  return html`<li>
    ${selected
      ? html`<strong>${name}</strong>`
      : html`<a href="?sku=${sku}">${name}</a>`}
  </li>`;
};
