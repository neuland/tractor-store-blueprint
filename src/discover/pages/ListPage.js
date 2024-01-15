import data from "../data.js";
import Header from "../components/Header.js";
import Product from "../components/Product.js";

export default ({ search }) => {
  const products = data.products.filter(
    (p) => !search || p.name.includes(search)
  );
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
        ${Header()}
        <h2>Products</h2>
        <p>There are ${products.length} products available.</p>
        <ul>${products.map(Product).join("")}</ul>
    </div>
</body>
</html>`;
};
