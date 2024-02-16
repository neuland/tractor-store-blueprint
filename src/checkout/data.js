import products from "../../products.js";

function getInventory() {
  return Math.floor(Math.random() * 100);
}

export default {
  variants: products.flatMap((p) => {
    return p.variants.map((v) => {
      return {
        id: p.id,
        name: `${p.name} ${v.name}`,
        sku: v.sku,
        price: v.price,
        image: v.image,
        inventory: getInventory(),
      };
    });
  }),
};
