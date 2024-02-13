/* globals document */

/* client side javascript */

/* checkout page */
const $storePicker = document.querySelector(".che_Checkout_store");
if ($storePicker) {
  $storePicker.addEventListener("explore:store-selected", function (e) {
    console.log("checkout: store-selected", e.detail);
    document.getElementById("storeId").value = e.detail.storeId;
    document.getElementById("street").value = e.detail.street;
    document.getElementById("city").value = e.detail.city;
  });
}
