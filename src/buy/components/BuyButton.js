import data from "../data.js";

export default ({ sku }) => {
  const product = data.variants.find((p) => p.sku === sku);
  const outOfStock = product.inventory === 0;
  return `<form action="/buy/cart/add" method="POST" class="BuyButton" data-boundary="buy-button">
  <input type="hidden" name="sku" value="${sku}" />
  <p>price: ${product.price} Øcken</p>
  <button${outOfStock ? ` disabled` : ``}>add to cart</button>
  ${
    product.inventory > 0
      ? `<p class="BuyButton__Inventory BuyButton__Inventory--instock">${product.inventory} in stock, free shipping</p>`
      : `<p class="BuyButton__Inventory BuyButton__Inventory--outofstock">out of stock</p>`
  }
</form>`;
};
