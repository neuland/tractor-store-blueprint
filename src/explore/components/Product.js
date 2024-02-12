import { html } from "../utils.js";

export default ({ name, url, image }) => {
  return html`<li>
    <a href="${url}"><img src="${image}" width="200" /><br />${name}</a>
  </li>`;
};
