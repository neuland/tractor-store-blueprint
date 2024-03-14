import { readFromCookie, writeToCookie } from "./state.js";

export async function handleAddToCart(c) {
  const body = await c.req.parseBody();
  const sku = body.sku;

  const items = readFromCookie(c);

  const lineItem = items.find((i) => i.sku === sku);
  if (lineItem) {
    lineItem.quantity++;
  } else {
    items.push({ sku, quantity: 1 });
  }
  writeToCookie(items, c);
}

export async function handleRemoveFromCart(c) {
  const body = await c.req.parseBody();
  const sku = body.sku;

  const items = readFromCookie(c);

  const lineItem = items.find((i) => i.sku === sku);
  if (lineItem) {
    const index = items.indexOf(lineItem);
    items.splice(index, 1);
  }

  writeToCookie(items, c);
}

export async function handlePlaceOrder(c) {
  writeToCookie([], c);
}
