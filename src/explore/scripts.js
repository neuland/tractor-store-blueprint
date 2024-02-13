/* globals document */

/* client side javascript */

/* store picker */

const $picker = document.querySelector(".exp_StorePicker");
if ($picker) {
  const dialog = $picker.querySelector("dialog");
  const showButton = $picker.querySelector("dialog + button");
  const selectButtons = $picker.querySelectorAll("dialog button[data-id]");

  showButton.addEventListener("click", () => dialog.showModal());
  [...selectButtons].forEach((button) => {
    button.addEventListener("click", (e) => {
      const detail = {
        storeId: e.currentTarget.getAttribute("data-id"),
        street: e.currentTarget.getAttribute("data-street"),
        city: e.currentTarget.getAttribute("data-city"),
      };
      $picker.dispatchEvent(
        new CustomEvent("explore:store-selected", { bubbles: true, detail }),
      );
      dialog.close();
    });
  });
}
