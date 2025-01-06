/**
 * @type {Database}
 */
let data = null;
if (typeof process === "undefined") {
  // cloudflare worker (remove once syntax is supported)
  data = await import("./database.json", { assert: { type: "json" } });
} else {
  // node 23+
  data = await import("./database.json", { with: { type: "json" } });
}
export default data.default;
