import BuyMiniCart from "../../buy/components/MiniCart.js";
import Navigation from "./Navigation.js";
import { escapeHtml, html } from "../utils.js";

export default ({ req }) => {
  const search = req.query.q || "";
  return html`<header data-boundary="explore-header">
    <h1>The Tractor Store</h1>
    <div class="NavigationBar">
      ${Navigation()}
      <form action="/" method="get">
        <input
          type="search"
          value="${escapeHtml(search)}"
          placeholder="Search"
          name="q"
        />
        <button>🔍</button>
      </form>
      ${BuyMiniCart({ req })}
    </div>
  </header>`;
};
