/* globals document, window */

const style = document.createElement("style");
style.innerHTML = `
[data-boundary] {
  outline-width: 0;
  outline-style: solid;
  position: relative;
}
[data-boundary]::after {
  display: none;
  content: attr(data-boundary);
  position: absolute;
  top: 0;
  right: 0;
  color: white;
  padding: 0 0.5rem;
  line-height: 1.5;
  font-weight: bold;
  pointer-events: none;
}    
[data-boundary^="explore-"] { outline-color: red; }
[data-boundary^="explore-"]::after { background: red; }
[data-boundary^="decide-"] { outline-color: blue; }
[data-boundary^="decide-"]::after { background: blue; }
[data-boundary^="checkout-"] { outline-color: green; }
[data-boundary^="checkout-"]::after { background: green; }
html.showBoundaries [data-boundary] { outline-width: 2px; }
html.showBoundaries [data-boundary]:after { display: block; }
`;
document.head.appendChild(style);

function toggleBoundaries(active) {
  document.documentElement.classList.toggle("showBoundaries", active);
  window.localStorage.setItem("showBoundaries", active);
}
const showBoundaries = window.localStorage.getItem("showBoundaries") === "true";
toggleBoundaries(showBoundaries);

const checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.checked = showBoundaries;
checkbox.addEventListener("change", (e) => toggleBoundaries(e.target.checked));

const label = document.createElement("label");
label.appendChild(checkbox);
label.appendChild(document.createTextNode(" show team boundaries"));

const container = document.createElement("div");
container.appendChild(label);
container.style.cssText =
  "position: fixed; bottom: 0; left: 0; background-color: rgba(255, 255, 255, 0.8); padding: 10px; -webkit-user-select: none; user-select: none;";
document.body.appendChild(container);
