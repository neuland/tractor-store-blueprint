import data from "../data.js";
import MenuItem from "./MenuItem.js";
import { html } from "../utils.js";

export default () => {
  const categories = data.categories;
  return html`<nav class="exp_Navigation">
    <ul>
      <li><a href="/">Home</a></li>
      ${categories.map(MenuItem).join("")}
    </ul>
  </nav>`;
};
