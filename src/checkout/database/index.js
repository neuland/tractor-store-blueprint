/**
 * @type {Database}
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const data = require("./database.json");

export default data;
