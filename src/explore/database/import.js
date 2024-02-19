// reads product data from a central source and writes the necessary data for this system.
// here we are reading from a js file and writing to a json file.
// in a real world scenario, you would read from a product service and write to a database.

import fs from "fs";
import path from "path";
import products from "../../../products.js";

export function productUrl(id, sku) {
  const query = sku ? `?sku=${sku}` : "";
  return `/product/${id}${query}`;
}

function startPrice(variants) {
  return variants.reduce((min, variant) => {
    return Math.min(min, variant.price);
  }, Infinity);
}

function toProduct(product) {
  return {
    name: product.name,
    id: product.id,
    image: product.variants[0].image,
    startPrice: startPrice(product.variants),
    url: productUrl(product.id),
  };
}

const database = {
  categories: [
    {
      key: "classic",
      name: "Classics",
      products: products.filter((p) => p.category === "classic").map(toProduct),
    },
    {
      key: "autonomous",
      name: "Autonomous",
      products: products
        .filter((p) => p.category === "autonomous")
        .map(toProduct),
    },
  ],
  recommendations: {
    /*
    "ST-001-RD": ["GC-001-BK", "SP-001-BK"].map(skuToProduct),
    "ST-001-BL": ["GC-001-BK", "SP-001-BK"].map(skuToProduct),
    "ST-001-GN": ["GC-001-GE", "SP-001-GE"].map(skuToProduct),
    "PT-001-SL": ["LW-001-LG", "SP-001-BK"].map(skuToProduct),
    "PT-001-GD": ["LW-001-XL", "SP-001-BK"].map(skuToProduct),
    "PT-001-PT": ["LW-001-XL", "SP-001-BK"].map(skuToProduct),
    "LW-001-LG": ["LW-001-XL"].map(skuToProduct),
    "LW-001-XL": ["GC-001-BK"].map(skuToProduct),
    */
  },
  stores: [
    {
      id: "s1",
      name: "Flagship Store North",
      street: "Main Street 2",
      city: "Harwixts",
      image: "/cdn/img/store/s1.png",
    },
    {
      id: "s2",
      name: "Micro Machines Center",
      street: "Long Field Road 1",
      city: "Weisterwas",
      image: "/cdn/img/store/s2.png",
    },
  ],
};

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const databaseFile = path.resolve(__dirname, "./database.json");
console.log("Writing database to", databaseFile);
fs.writeFileSync(databaseFile, JSON.stringify(database, null, 2));
