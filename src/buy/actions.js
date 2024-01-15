import state from "./state.js";

export function handleAddToCart({ sku }) {
  const lineItem = state.lineItems.find((lineItem) => lineItem.sku === sku);
  if (lineItem) {
    lineItem.quantity++;
  } else {
    state.lineItems.push({ sku, quantity: 1 });
  }
}
