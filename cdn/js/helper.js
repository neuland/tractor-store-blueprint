/* globals document, window, XMLSerializer */
import roughjs from "https://cdn.jsdelivr.net/npm/roughjs@4.6.6/+esm";

const style = document.createElement("style");
style.innerHTML = `
[data-boundary] {
  position: relative;
  background-size: 100% 100%;
}
[data-boundary]::after {
  display: block;
  content: attr(data-boundary);
  position: absolute;
  top: 0;
  right: 0;
  color: black;
  padding: 0 0.5rem;
  line-height: 1.5;
  font-weight: bold;
  pointer-events: none;
}
/*
body[data-boundary]::after {
  top: auto;
  bottom: 0;
}
[data-boundary^="explore-"] {
  outline-color: red;
  background-color: #ffe5e5;
}
[data-boundary^="explore-"]::after { background: red; }
[data-boundary^="decide-"] {
  outline-color: blue;
  background-color: #e5e5ff;
}
[data-boundary^="decide-"]::after { background: blue; }
[data-boundary^="checkout-"] {
  outline-color: green;
  background-color: #e5f2e5;
}
[data-boundary^="checkout-"]::after { background: green; }
*/
html:not(.showBoundaries) [data-boundary] { background-image: none !important;}
html:not(.showBoundaries) [data-boundary]:after { display: none; }
`;
document.head.appendChild(style);

function roundedRectanglePath(x, y, width, height, borderRadius) {
  const maxRadius = Math.min(width / 2, height / 2);
  borderRadius = Math.min(borderRadius, maxRadius);

  return `M${x + borderRadius},${y} 
          H${x + width - borderRadius} 
          Q${x + width},${y} ${x + width},${y + borderRadius} 
          V${y + height - borderRadius} 
          Q${x + width},${y + height} ${x + width - borderRadius},${y + height} 
          H${x + borderRadius} 
          Q${x},${y + height} ${x},${y + height - borderRadius} 
          V${y + borderRadius} 
          Q${x},${y} ${x + borderRadius},${y} 
          Z`;
}

function toggleBoundaries(active) {
  document.documentElement.classList.toggle("showBoundaries", active);
  window.localStorage.setItem("showBoundaries", active);

  if (!active) {
    return;
  }
  generateRoughBoundaries();
}

//setInterval(generateRoughBoundaries, 100);

// call generateRoughBoundaries() when viewports are resized
window.addEventListener("resize", generateRoughBoundaries);

function generateRoughBoundaries() {
  window.requestAnimationFrame(() => {
    [...document.querySelectorAll("[data-boundary]")].forEach((el) => {
      const { width, height } = el.getBoundingClientRect();
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", width);
      svg.setAttribute("height", height);
      const rc = roughjs.svg(svg);
      const inset = 5;

      const team = el.dataset.boundary.split("-")[0];
      //const isPage = el.dataset.boundary.split("-")[1] === "page";

      const config = {
        explore: {
          fill: "rgb(255, 255, 0, 0.5)",
          hachureAngle: 33,
        },
        decide: {
          fill: "rgb(0, 255, 255, 0.5)",
          hachureAngle: 66, // angle of hachure,
        },
        checkout: {
          fill: "rgb(255, 0, 255, 0.5)",
          hachureAngle: 99, // angle of hachure,
        },
      };

      const node = rc.path(
        roundedRectanglePath(
          inset,
          inset,
          width - 2 * inset,
          height - 2 * inset,
          20,
        ),
        {
          roughness: 1,
          stroke: "black",
          strokeWidth: 3,
          fillStyle: "cross-hatch",
          fill: "rgb(10,150,10,0.5)",
          fillWeight: 5,
          hachureGap: 15,
          bowing: 1,
          ...config[team],
        },
      );

      // add gausien blur filter to node
      const filter = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "filter",
      );
      filter.setAttribute("id", "blur");
      const feGaussianBlur = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "feGaussianBlur",
      );
      feGaussianBlur.setAttribute("in", "SourceGraphic");
      feGaussianBlur.setAttribute("stdDeviation", "1");
      filter.appendChild(feGaussianBlur);
      svg.appendChild(filter);
      node.setAttribute("filter", "url(#blur)");

      svg.appendChild(node);

      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(svg);
      const encodedSvg = encodeURIComponent(svgStr);
      const url = `url("data:image/svg+xml,${encodedSvg}")`;
      //el.style.backgroundColor = "white";
      el.style.backgroundImage = url;
    });
  });
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
