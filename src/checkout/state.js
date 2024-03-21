import { getCookie, setCookie } from "hono/cookie";

const ITEM_SEP = "|";
const QTY_SEP = "_";
const COOKIE = "c_cart";

/**
 * @typedef {object} LineItem
 * @property {string} sku - The SKU of the line item.
 * @property {number} quantity - The quantity of the line item in the cart.
 */

/**
 * Reads the line items from the cookie.
 * @param {object} c - The hono context.
 * @returns {LineItem[]} An array of items read from the cookie.
 */
export function readFromCookie(c) {
  const cookieStr = getCookie(c, COOKIE);

  if (!cookieStr) return [];

  return cookieStr.split(ITEM_SEP).map((item) => {
    const [sku, quantity] = item.split(QTY_SEP);
    return { sku, quantity: parseInt(quantity, 10) };
  });
}

/**
 * Writes the line items to the cookie.
 * @param {LineItem[]} items - An array of items to write to the cookie.
 * @param {object} c - The hono context.
 */
export function writeToCookie(items, c) {
  const cookieStr = items
    .map((item) => `${item.sku}${QTY_SEP}${item.quantity}`)
    .join(ITEM_SEP);
  console.log("writeToCookie", cookieStr);
  setCookie(c, COOKIE, cookieStr, { httpOnly: true });
}
