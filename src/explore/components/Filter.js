import { html } from "../utils.js";

export default ({ filters }) => {
  return html`<div class="e_Filter">
    Filter:
    <ul>
      ${filters
        .map((f) =>
          f.active
            ? `<li>${f.name}</li>`
            : `<li><a href="${f.url}">${f.name}</a></li>`,
        )
        .join("")}
    </ul>
  </div>`;
};
