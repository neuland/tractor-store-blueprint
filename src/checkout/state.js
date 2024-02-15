const ITEM_SEP = "|";
const QTY_SEP = "_";
const COOKIE = "c_cart";

export function readFromCookie(req) {
  const cookieStr = req.cookies[COOKIE];

  if (!cookieStr) return [];

  return cookieStr.split(ITEM_SEP).map((item) => {
    const [sku, quantity] = item.split(QTY_SEP);
    return { sku, quantity: parseInt(quantity, 10) };
  });
}

export function writeToCookie(items, res) {
  const cookieStr = items
    .map((item) => `${item.sku}${QTY_SEP}${item.quantity}`)
    .join(ITEM_SEP);
  res.cookie(COOKIE, cookieStr, { httpOnly: true });
}
