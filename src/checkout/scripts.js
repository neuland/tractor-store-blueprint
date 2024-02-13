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

/* mini cart */
document.addEventListener("checkout:cart-updated", async function () {
  const $miniCart = document.querySelector(".che_MiniCart");
  if ($miniCart) {
    // update mini cart
    const res = await fetch("/checkout/mini-cart");
    const html = await res.text();
    $miniCart.outerHTML = html;

    // highlight updated mini cart
    const $newMiniCart = document.querySelector(".che_MiniCart");
    $newMiniCart.classList.add("che_MiniCart--highlight");
    setTimeout(() => {
      $newMiniCart.classList.remove("che_MiniCart--highlight");
    }, 5000);
  }
});

/* add to cart */
const $addToCart = document.querySelector(".che_AddToCart");
if ($addToCart) {
  console.log("init");
  $addToCart.addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new URLSearchParams(new FormData($addToCart));
    const res = await fetch("/checkout/cart/add", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      document.dispatchEvent(new Event("checkout:cart-updated"));
    }
  });
}
