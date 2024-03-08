import Page from "../components/Page.js";
import CompactHeader from "../components/CompactHeader.js";
import { html } from "../utils.js";
import StorePicker from "../../explore/components/StorePicker.js";

// imports from other teams -> fragments
import Footer from "../../explore/components/Footer.js";
import Button from "../components/Button.js";

export default () => {
  const content = html`
    ${CompactHeader()}
    <main class="c_Checkout">
      <h2>Checkout</h2>
      <form action="/checkout/place-order" method="post">
        <h3>Personal Data</h3>
        <fieldset>
          <label for="name">Name</label>
          <input type="text" id="name" name="name" required />
        </fieldset>

        <h3>Store Pickup</h3>
        <fieldset>
          <div class="c_Checkout_store">${StorePicker()}</div>
          <label for="street">Store ID</label>
          <input type="text" id="storeId" name="storeId" readonly /><br />
        </fieldset>

        <div class="c_Checkout__buttons">
          ${Button({
            children: "place order",
            variant: "primary",
          })}
          ${Button({
            href: "/checkout/cart",
            children: "back to cart",
            variant: "secondary",
          })}
        </div>
      </form>

      ${Footer()}
    </main>
  `;
  return Page({ content });
};
