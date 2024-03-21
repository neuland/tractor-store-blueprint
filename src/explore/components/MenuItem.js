import { html } from "../utils.js";

/**
 * MenuItem component.
 * @param {object} props - The properties of the MenuItem component.
 * @param {string} props.name - The name of the menu item.
 * @param {string} props.key - The key of the menu item.
 * @returns {string} The MenuItem component markup.
 */
export default ({ name, key }) => {
  return html`<li class="e_MenuItem"><a href="/${key}">${name}</a></li>`;
};
