import data from "../database/index.js";
import { html } from "../utils.js";
import Button from "./Button.js";

export default () => {
  return html`<div class="e_StorePicker" data-boundary="explore-storepicker">
    <div class="e_StorePicker_selected"></div>
    ${Button({
      className: "e_StorePicker_choose",
      type: "button",
      children: "choose a store",
    })}
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
                ${Button({
                  className: "e_StorePicker_select",
                  type: "button",
                  children: "select",
                })}
              </li>`,
          )
          .join("")}
      </ul>
    </dialog>
  </div>`;
};
