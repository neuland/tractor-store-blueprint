import { Hono } from "hono";
import { logger } from "hono/logger";
import { ListPage } from "./explore/index.js";
import { ProductPage } from "./decide/index.js";
import {
  MiniCart,
  CartPage,
  Checkout,
  Thanks,
  handleAddToCart,
  handleRemoveFromCart,
  handlePlaceOrder,
} from "./checkout/index.js";

export default function createServer() {
  const app = new Hono();
  app.use(logger());

  /**
   * Team Explore
   */
  app.get("/:category?", async (c) => {
    const category = c.req.param("category");
    return c.html(ListPage({ category, c }));
  });

  /**
   * Team Decide
   */
  app.get("/product/:id", async (c) => {
    const { id } = c.req.param();
    const sku = c.req.query("sku");
    return c.html(ProductPage({ id, sku, c }));
  });

  /**
   * Team Buy
   */
  app.get("/checkout/cart", (c) => c.html(CartPage({ c })));
  app.get("/checkout/checkout", (c) => c.html(Checkout()));
  app.get("/checkout/mini-cart", (c) => c.html(MiniCart({ c })));
  app.post("/checkout/cart/add", async (c) => {
    await handleAddToCart(c);
    return c.redirect("/checkout/cart");
  });
  app.post("/checkout/cart/remove", async (c) => {
    await handleRemoveFromCart(c);
    return c.redirect("/checkout/cart");
  });
  app.post("/checkout/place-order", async (c) => {
    await handlePlaceOrder(c);
    return c.redirect("/checkout/thanks");
  });
  app.get("/checkout/thanks", (c) => c.html(Thanks({ c })));

  return app;
}
