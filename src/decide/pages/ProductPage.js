import data from "../data.js";
import Variant from "../components/Variant.js";
import Header from "../../discover/components/Header.js";
import BuyButton from "../../buy/components/BuyButton.js";

export default ({ id, sku, req }) => {
  const { name, variants } = data.products.find((p) => p.id === id);
  const variant = variants.find((v) => v.sku === sku) || variants[0];
  return `<!DOCTYPE html>
<html>
<head>
    <title>Tractor Store</title>
    <link rel="stylesheet" href="/static/discover/discover.css" />
    <link rel="stylesheet" href="/static/decide/decide.css" />
    <link rel="stylesheet" href="/static/buy/buy.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body data-boundary="decide-product">
    <div>
        ${Header(req)}
        <h2>${name}</h2>
        <p>Price ${variant.price} EUR</p>
        <p>Variants:</p>
        <ul>${variants
          .map((v) => Variant({ ...v, selected: v.sku === variant.sku }))
          .join("")}</ul>
        ${BuyButton({ sku: variant.sku })}
    </div>
</body>
</html>`;
};
