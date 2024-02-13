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
    <form action="/checkout/thanks" method="post">
      <h3>Personal Data</h3>
      <fieldset>
        <label for="email">E-Mail</label>
        <input type="email" id="email" name="email" required />
      </fieldset>
      <h3>Shipping Address</h3>
      <fieldset>
        <div class="che_Checkout_store">${StorePicker()}</div>
        <input type="hidden" id="storeId" name="storeId" />
        <label for="street">Street</label>
        <input type="text" id="street" name="street" required /><br />
        <label for="city">City</label>
        <input type="text" id="city" name="city" required />
      </fieldset>
      <button>place order</button>
    </form>
    <a href="/checkout/cart">back to cart</a>
    ${Footer()}
  `;
  return Page({ content });
};
