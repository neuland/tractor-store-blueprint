import Header from "../../discover/components/Header.js";
import LineItem from "../components/LineItem.js";
import { readFromCookie } from "../state.js";

export default (req) => {
  const lineItems = readFromCookie(req);
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
        <ul>
            ${lineItems.map(LineItem).join("")}
        </ul>
    </div>
</body>
</html>`;
};
