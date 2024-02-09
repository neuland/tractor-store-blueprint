import { html } from "../utils.js";

export default ({ name, key }) => {
  return html`<li><a href="/${key}">${name}</a></li>`;
};
