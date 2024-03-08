import { html } from "../utils.js";

export default ({ sku, name, selected, color }) => {
  return html`<li class="d_Variant">
    <i class="d_Variant__color" style="--background-color: ${color}"></i>
    ${selected
      ? html`<strong>${name}</strong>`
      : html`<a href="?sku=${sku}">${name}</a>`}
  </li>`;
};
