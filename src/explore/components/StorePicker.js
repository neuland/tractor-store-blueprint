import data from "../database/index.js";
import { html } from "../utils.js";
import Button from "./Button.js";

export default () => {
  return html`<div class="e_StorePicker">
    <div class="e_StorePicker_control" data-boundary="explore-storepicker">
      <div class="e_StorePicker_selected"></div>
      ${Button({
        className: "e_StorePicker_choose",
        type: "button",
        children: "choose a store",
      })}
    </div>
    <dialog
      class="e_StorePicker_dialog"
      data-boundary="explore-storepicker (dialog)"
    >
      <h2>Stores</h2>
      <ul class="e_StorePicker_list">
        ${data.stores
          .map(
            (s) =>
              html`<li class="e_StorePicker_entry">
                <div class="e_StorePicker_content">
                  <img
                    class="e_StorePicker_image"
                    src="${s.image}"
                    width="200"
                  />
                  <p class="e_StorePicker_address">
                    ${s.name}<br />
                    ${s.street}<br />
                    ${s.city}
                  </p>
                </div>
                ${Button({
                  className: "e_StorePicker_select",
                  type: "button",
                  children: "select",
                  dataId: s.id,
                })}
              </li>`,
          )
          .join("")}
      </ul>
    </dialog>
  </div>`;
};
