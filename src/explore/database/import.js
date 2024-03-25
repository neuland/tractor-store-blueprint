// reads product data from a central source and writes the necessary data for this system.
// here we are reading from a js file and writing to a json file.
// in a real world scenario, you would read from a product service and write to a database.

import fs from "fs";
import path from "path";
import products from "../../../products.js";

/**
 * Generates the URL for a product.
 * @param {string} id - The ID of the product.
 * @param {string} sku - The SKU of the product variant.
 * @returns {string} The URL of the product.
 */
export function productUrl(id, sku) {
  const query = sku ? `?sku=${sku}` : "";
  return `/product/${id}${query}`;
}

/**
 * Calculates the starting price of a product's variants.
 * @param {Variant[]} variants - The variants of the product.
 * @returns {number} The starting price.
 */
function startPrice(variants) {
  return variants.reduce((min, variant) => {
    return Math.min(min, variant.price);
  }, Infinity);
}

/**
 * Converts a product object to a formatted product.
 * @param {Product} product - The product object.
 * @returns {Product} The formatted product.
 */
function toProduct(product) {
  return {
    name: product.name,
    id: product.id,
    image: product.variants[0].image,
    startPrice: startPrice(product.variants),
    url: productUrl(product.id),
  };
}

/**
 * Converts a product object and a variant object to a formatted recommendation item.
 * @param {Product} product - The product object.
 * @param {Variant} variant - The variant object.
 * @returns {RecoItem} The formatted recommendation item.
 */
function toRecoItem(product, variant) {
  return {
    name: `${product.name} ${variant.name}`,
    sku: variant.sku,
    image: variant.image,
    url: productUrl(product.id, variant.sku),
  };
}

/**
 * @type {Database}
 */
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
    relations: {
      "AU-01-SI": ["AU-02-GG", "AU-04-BK"],
      "AU-04-RD": ["AU-03-RD", "AU-02-OG", "AU-05-ZH"],
      "AU-05-ZH": ["AU-07-MT", "AU-01-SI", "AU-02-GG"],
      "AU-03-YE": ["AU-06-CZ", "AU-07-YE"],
    },
    // object of sku to variant for lookup
    variants: products
      .flatMap((product) =>
        product.variants.map((variant) => toRecoItem(product, variant)),
      )
      .reduce((res, variant) => {
        res[variant.sku] = variant;
        return res;
      }, {}),
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
