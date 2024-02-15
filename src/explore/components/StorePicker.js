import data from "../data.js";
import { html } from "../utils.js";

export default () => {
  return html`<div class="e_StorePicker">
    <dialog>
      <h2>Stores</h2>
      <ul>
        ${data.stores
          .map(
            (s) =>
              html`<li>
                <img src="${s.image}" width="200" /><br />
                ${s.name}<br />
                ${s.street}<br />
                ${s.city}<br />
                <button
                  type="button"
                  data-id="${s.id}"
                  data-street="${s.street}"
                  data-city="${s.city}"
                >
                  select
                </button>
              </li>`,
          )
          .join("")}
      </ul>
      <button type="button" data-id="" data-street="" data-city="">
        no store
      </button>
    </dialog>
    <button type="button">Ship to a neaby store</button>
  </div>`;
};
