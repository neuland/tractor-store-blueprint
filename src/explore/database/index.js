import { readFile } from "node:fs/promises";
const fileUrl = new URL("./database.json", import.meta.url);
export default JSON.parse(await readFile(fileUrl, "utf8"));
