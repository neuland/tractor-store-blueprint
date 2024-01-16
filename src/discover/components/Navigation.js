import data from "../data.js";
import MenuItem from "./MenuItem.js";

export default () => {
    const categories = data.categories;
    return `<nav class="Navigation">
    <ul>
        <li><a href="/">Home</a></li>
        ${categories.map(MenuItem).join("")}
    </ul>
    </nav>`;
};
