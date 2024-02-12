import data from "../data.js";
import { html } from "../utils.js";

export default () => {
  return html`<div class="exp_StorePicker">
    <dialog>
      <h2>Stores</h2>
      <ul>
        ${data.stores
          .map(
            (s) =>
              html`<li>
                <img src="${s.image}" /><br />
                ${s.name}<br />
                ${s.street}$<br />
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
      <button type="button">cancel</button>
    </dialog>
    <button type="button">Ship to a neaby store</button>
    <script>
      const $el = document.querySelector(".exp_StorePicker");
      const dialog = $el.querySelector("dialog");
      const showButton = $el.querySelector("dialog + button");
      const closeButton = $el.querySelector("dialog > button");
      const selectButtons = $el.querySelectorAll("dialog li button");

      // "Show the dialog" button opens the dialog modally
      showButton.addEventListener("click", () => {
        dialog.showModal();
      });

      // "Close" button closes the dialog
      closeButton.addEventListener("click", (e) => {
        dialog.close();
      });

      // "Select" buttons emit event and close
      [...selectButtons].forEach((button) => {
        button.addEventListener("click", (e) => {
          const storeId = e.target.getAttribute("data-id");
          const street = e.target.getAttribute("data-street");
          const city = e.target.getAttribute("data-city");
          if (storeId) {
            $el.dispatchEvent(
              new CustomEvent("explore:store-selected", {
                bubbles: true,
                detail: { storeId, street, city },
              }),
            );
          }
          dialog.close();
        });
      });
    </script>
  </div>`;
};
