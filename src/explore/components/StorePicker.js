import data from "../database/index.js";
import { html } from "../utils.js";

export default () => {
  return html`<div class="e_StorePicker" data-boundary="explore-storepicker">
    <div class="e_StorePicker_selected"></div>
    <button class="e_StorePicker_choose" type="button">choose a store</button>
    <dialog
      class="e_StorePicker_dialog"
      data-boundary="explore-storepicker-dialog"
    >
      <h2>Stores</h2>
      <ul>
        ${data.stores
          .map(
            (s) =>
              html`<li>
                <div class="e_StorePicker_entry">
                  <img src="${s.image}" width="200" /><br />
                  ${s.name}<br />
                  ${s.street}<br />
                  ${s.city}
                </div>
                <button
                  class="e_StorePicker_select"
                  type="button"
                  data-id="${s.id}"
                >
                  select
                </button>
              </li>`,
          )
          .join("")}
      </ul>
    </dialog>
  </div>`;
};
