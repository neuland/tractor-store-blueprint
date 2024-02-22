/* globals document */

/* client side javascript */

/* checkout page store select */
const $storePicker = document.querySelector(".c_Checkout_store");
if ($storePicker) {
  $storePicker.addEventListener("explore:store-selected", function (e) {
    console.log("checkout: store-selected", e.detail);
    document.getElementById("storeId").value = e.detail;
  });
}

/* checkout page address */
const $tabs = document.querySelectorAll(".c_Checkout_delivery details");
$tabs.forEach((detail) => {
  detail.querySelector("summary").addEventListener("click", (e) => {
    e.preventDefault();
    const wasOpen = detail.hasAttribute("open");
    $tabs.forEach((d) => {
      d.removeAttribute("open");
    });
    if (!wasOpen) {
      detail.setAttribute("open", true);
    }
  });
});

/* mini cart */
document.addEventListener("checkout:cart-updated", async function () {
  const $miniCart = document.querySelector(".c_MiniCart");
  if ($miniCart) {
    // update mini cart
    const res = await fetch("/checkout/mini-cart");
    const html = await res.text();
    $miniCart.outerHTML = html;

    // highlight updated mini cart
    const $newMiniCart = document.querySelector(".c_MiniCart");
    $newMiniCart.classList.add("c_MiniCart--highlight");
    setTimeout(() => {
      $newMiniCart.classList.remove("c_MiniCart--highlight");
    }, 600);
  }
});

/* add to cart */
const $addToCart = document.querySelector(".c_AddToCart");
if ($addToCart) {
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
