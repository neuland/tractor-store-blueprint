import data from "../data.js";
import Header from "../components/Header.js";
import Product from "../components/Product.js";

export default ({ category, search, req }) => {
  let title = "All Products";
  const products = data.categories.flatMap((c) => c.products);
  return `<!DOCTYPE html>
<html>
<head>
    <title>Tractor Store</title>
    <link rel="stylesheet" href="/static/discover/discover.css" />
    <link rel="stylesheet" href="/static/decide/decide.css" />
    <link rel="stylesheet" href="/static/buy/buy.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body data-boundary="discover-list">
    <div>
        ${Header(req)}
        <h2>Products</h2>
        <p>There are ${products.length} products available.</p>
        <ul>${products.map(Product).join("")}</ul>
    </div>
</body>
</html>`;
};
