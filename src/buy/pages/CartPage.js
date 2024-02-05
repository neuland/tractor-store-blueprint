import Header from "../../discover/components/Header.js";
import LineItem from "../components/LineItem.js";
import { readFromCookie } from "../state.js";
import data from "../data.js";
import Recommendations from "../../discover/components/Recommendations.js";

export default (req) => {
  const lineItems = readFromCookie(req).map(({ sku, quantity }) => {
    const variant = data.variants.find((p) => p.sku === sku);
    return { ...variant, quantity };
  });
  const skus = lineItems.map(({ sku }) => sku);
  return `<!DOCTYPE html>
<html>
<head>
    <title>Tractor Store</title>
    <link rel="stylesheet" href="/static/discover/discover.css" />
    <link rel="stylesheet" href="/static/decide/decide.css" />
    <link rel="stylesheet" href="/static/buy/buy.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body data-boundary="buy-product">
    <div>
        ${Header(req)}
        <h2>Warenkorb</h2>
        <p>${lineItems.length} Produkte im Warenkorb</p>
        <ul class="CartPage__lineItems">
            ${lineItems.map(LineItem).join("")}
        </ul>
        ${Recommendations({ skus })}
    </div>
</body>
</html>`;
};
