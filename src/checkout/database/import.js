// reads product data from a central source and writes the necessary data for this system.
// here we are reading from a js file and writing to a json file.
// in a real world scenario, you would read from a product service and write to a database.

import fs from "fs";
import path from "path";
import products from "../../../products.js";

function getInventory() {
  return Math.floor(Math.random() * 100);
}

const database = {
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

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const databaseFile = path.resolve(__dirname, "./database.json");
console.log("Writing database to", databaseFile);
fs.writeFileSync(databaseFile, JSON.stringify(database, null, 2));
