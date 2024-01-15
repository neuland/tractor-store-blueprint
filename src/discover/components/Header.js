import BuyMiniCart from "../../buy/components/MiniCart.js";

export default () => {
  return `<header data-boundary="discover-header">
      <h1>The Tractor Store</h1>
      <nav>navigation goes here</nav>
      ${BuyMiniCart()}
    </header>`;
};
