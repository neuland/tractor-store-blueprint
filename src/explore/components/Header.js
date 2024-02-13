import BuyMiniCart from "../../checkout/components/MiniCart.js";
import Navigation from "./Navigation.js";
import { html } from "../utils.js";

export default ({ req }) => {
  return html`<header data-boundary="explore-header">
    <h1 class="exp_Header__title"><a href="/">The Tractor Store</a></h1>
    <div class="exp_Header__inner">${Navigation()} ${BuyMiniCart({ req })}</div>
  </header>`;
};
