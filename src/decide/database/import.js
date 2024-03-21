// reads product data from a central source and writes the necessary data for this system.
// here we are reading from a js file and writing to a json file.
// in a real world scenario, you would read from a product service and write to a database.

import fs from "fs";
import path from "path";
import products from "../../../products.js";

/**
 * @typedef {object} Variant
 * @property {string} name - The name of the variant.
 * @property {string} image - The URL of the variant image.
 * @property {string} sku - The SKU of the variant.
 * @property {string} color - The color of the variant.
 * @property {number} price - The price of the variant.
 */

/**
 * @typedef {object} Product
 * @property {string} name - The name of the product.
 * @property {string} id - The ID of the product.
 * @property {string} category - The category of the product.
 * @property {string[]} highlights - The highlights of the product.
 * @property {Variant[]} variants - The variants of the product.
 */

/**
 * @typedef {object} Database
 * @property {Product[]} products - The products in the database.
 */

/**
 * @type {Database}
 */
const database = {
  products,
};

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const databaseFile = path.resolve(__dirname, "./database.json");
console.log("Writing database to", databaseFile);
fs.writeFileSync(databaseFile, JSON.stringify(database, null, 2));
