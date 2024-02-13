import products from "../../products.js";

const inventory = {
  "ST-001-RD": 10,
  "ST-001-BL": 5,
  "ST-001-GN": 3,
  "PT-001-SL": 2,
  "PT-001-GD": 1,
  "PT-001-PT": 0,
  "GC-001-BK": 20,
  "GC-001-GE": 15,
  "LW-001-LG": 10,
  "LW-001-XL": 5,
  "SP-001-BK": 30,
  "SP-001-GE": 25,
};

export default {
  variants: products.flatMap((p) => {
    return p.variants.map((v) => {
      return {
        id: p.id,
        name: `${p.name} ${v.name}`,
        sku: v.sku,
        price: v.price,
        image: v.image,
        inventory: inventory[v.sku] || 0,
      };
    });
  }),
};
