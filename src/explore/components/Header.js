import BuyMiniCart from "../../checkout/components/MiniCart.js";
import Navigation from "./Navigation.js";
import { html } from "../utils.js";

export default ({ req }) => {
  return html`<header class="e_Header" data-boundary="explore-header">
    <div class="e_Header__inner">
      <h1 class="e_Header__title">
        <a class="e_Header__link" href="/">
          <small>Micro Frontends</small><br />
          Tractor Store
        </a>
      </h1>
      ${Navigation()} ${BuyMiniCart({ req })}
    </div>
  </header>`;
};
