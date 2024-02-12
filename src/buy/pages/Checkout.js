import Page from "../components/Page.js";
import CompactHeader from "../components/CompactHeader.js";
import { html } from "../utils.js";
import StorePicker from "../../explore/components/StorePicker.js";

// imports from other teams -> fragments
import Footer from "../../explore/components/Footer.js";

export default () => {
  const content = html`
    ${CompactHeader()}
    <h2>Checkout</h2>
    <form action="/buy/thanks" method="post">
      <h3>Personal Data</h3>
      <fieldset>
        <label for="email">E-Mail</label>
        <input type="email" id="email" name="email" required />
      </fieldset>
      <h3>Shipping Address</h3>
      <fieldset>
        <div class="buy_Checkout_store">${StorePicker()}</div>
        <input type="hidden" id="storeId" name="storeId" />
        <label for="street">Street</label>
        <input type="text" id="street" name="street" required /><br />
        <label for="city">City</label>
        <input type="text" id="city" name="city" required />
      </fieldset>
      <button>place order</button>
    </form>
    <a href="/buy/cart">back to cart</a>
    ${Footer()}
    <script>
      const $storePicker = document.querySelector(".buy_Checkout_store");
      $storePicker.addEventListener("explore:store-selected", function (e) {
        document.getElementById("storeId").value = e.detail.storeId;
        document.getElementById("street").value = e.detail.street;
        document.getElementById("city").value = e.detail.city;
        console.log(e);
      });
    </script>
  `;
  return Page({ content });
};
