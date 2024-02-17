import { html } from "../utils.js";

export default ({ name, key }) => {
  return html`<li class="e_MenuItem"><a href="/${key}">${name}</a></li>`;
};
