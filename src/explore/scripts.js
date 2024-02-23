/* globals document */

/* client side javascript */

/* store picker */

const $picker = document.querySelector(".e_StorePicker");
if ($picker) {
  const dialog = $picker.querySelector(".e_StorePicker dialog");
  const chooseButton = $picker.querySelector(".e_StorePicker_choose");
  const selectButtons = $picker.querySelectorAll(".e_StorePicker_select");
  const selected = $picker.querySelector(".e_StorePicker_selected");

  chooseButton.addEventListener("click", () => dialog.showModal());
  [...selectButtons].forEach((button) => {
    button.addEventListener("click", (e) => {
      const detail = e.currentTarget.getAttribute("data-id");
      $picker.dispatchEvent(
        new CustomEvent("explore:store-selected", { bubbles: true, detail }),
      );
      dialog.close();
      selected.innerHTML = e.currentTarget.previousElementSibling.innerHTML;
    });
  });
}
