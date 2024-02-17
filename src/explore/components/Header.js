import BuyMiniCart from "../../checkout/components/MiniCart.js";
import Navigation from "./Navigation.js";
import { html } from "../utils.js";

export default ({ req }) => {
  return html`<header class="e_Header" data-boundary="explore-header">
    <div class="e_Header__inner">
      <a class="e_Header__link" href="/">
        <img
          class="e_Header__logo"
          src="/cdn/img/logo.svg"
          alt="Micro Frontends - Tractor Store"
        />
      </a>
      ${Navigation()} ${BuyMiniCart({ req })}
    </div>
  </header>`;
};
