import BuyMiniCart from "../../buy/components/MiniCart.js";
import Navigation from "./Navigation.js";

export default () => {
  return `<header data-boundary="discover-header">
      <h1>The Tractor Store</h1>
      <div class="NavigationBar">
      ${Navigation()}
      ${BuyMiniCart()}
    </header>`;
};
