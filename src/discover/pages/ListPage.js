import data from "../data.js";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";
import Product from "../components/Product.js";
import { escapeHtml } from "../utils.js";

export default ({ category, req }) => {
  let products, title;
  const search = req.query.q;
  console.log({ search });
  if (category) {
    const cat = data.categories.find((c) => c.key === category);
    products = cat.products;
    title = cat.name;
  } else if (search) {
    products = data.categories
      .flatMap((c) => c.products)
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    title = `Search Results for "${escapeHtml(search)}"`;
  } else {
    products = data.categories.flatMap((c) => c.products);
    title = "All Products";
  }
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
        ${Header({ req })}
        <h2>${title}</h2>
        <p>${products.length} products</p>
        <ul>${products.map(Product).join("")}</ul>
        ${Footer()}
    </div>
</body>
</html>`;
};
