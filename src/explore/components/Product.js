import { html } from "../utils.js";

export default ({ name, url }) => {
  return html`<li><a href="${url}">${name}</a></li>`;
};
