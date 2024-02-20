/* globals document, window, XMLSerializer */
import roughjs from "https://cdn.jsdelivr.net/npm/roughjs@4.6.6/+esm";

const config = {
  explore: {
    fill: "rgba(255, 90, 84, 0.3)",
    stroke: "rgba(255, 90, 84, 1)",
    hachureAngle: 30 + Math.random() * 10,
  },
  decide: {
    fill: "rgba(84, 255, 144, 0.3)",
    stroke: "rgba(84, 255, 144, 1)",
    hachureAngle: 60 + Math.random() * 10, // angle of hachure,
  },
  checkout: {
    fill: "rgba(255, 222, 84, 0.3)",
    stroke: "rgba(255, 222, 84, 1)",
    hachureAngle: 90 + Math.random() * 10, // angle of hachure,
  },
};

const style = document.createElement("style");
style.innerHTML = `
@import url('https://fonts.googleapis.com/css2?family=Pangolin&display=swap');

[data-boundary] {
  position: relative;
  background-size: 100% 100%;
}
[data-boundary]::after {
  display: block;
  content: attr(data-boundary);
  position: absolute;
  bottom: -1.2rem;
  right: 1rem;
  padding: 0 0.5rem;
  line-height: 1.5;
  font-weight: bold;
  pointer-events: none;
  color: rgba(0,0,0,0.5);
  font-family: "Pangolin", cursive;
  font-weight: 400;
  font-style: normal;
}
body[data-boundary]::after {
  top: auto;
  bottom: 0.3rem;
}
[data-boundary^="explore-"]::after { background-color: ${config.explore.stroke}; color: white }
[data-boundary^="decide-"]::after { background-color: ${config.decide.stroke}; }
[data-boundary^="checkout-"]::after { background: ${config.checkout.stroke}; }

html:not(.showBoundaries) [data-boundary] { background-image: none !important;}
html:not(.showBoundaries) [data-boundary]:after { display: none; }
`;
document.head.appendChild(style);

function createRoundedRectanglePathWithControlPoints(
  x,
  y,
  width,
  height,
  borderRadius,
  segmentLength,
) {
  const maxRadius = Math.min(width / 2, height / 2);
  borderRadius = Math.min(borderRadius, maxRadius);

  // Adjusts line segments to include control points every `segmentLength` pixels
  function generateLineSegments(startX, startY, endX, endY, segmentLength) {
    let points = "";
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.floor(distance / segmentLength);
    const stepX = dx / steps;
    const stepY = dy / steps;

    for (let i = 1; i <= steps; i++) {
      const nextX = startX + stepX * i;
      const nextY = startY + stepY * i;
      points += `L${nextX},${nextY} `;
    }

    return points;
  }

  const pathData = [
    `M${x + borderRadius},${y}`,
    generateLineSegments(
      x + borderRadius,
      y,
      x + width - borderRadius,
      y,
      segmentLength,
    ),
    `Q${x + width},${y} ${x + width},${y + borderRadius}`,
    generateLineSegments(
      x + width,
      y + borderRadius,
      x + width,
      y + height - borderRadius,
      segmentLength,
    ),
    `Q${x + width},${y + height} ${x + width - borderRadius},${y + height}`,
    generateLineSegments(
      x + width - borderRadius,
      y + height,
      x + borderRadius,
      y + height,
      segmentLength,
    ),
    `Q${x},${y + height} ${x},${y + height - borderRadius}`,
    generateLineSegments(
      x,
      y + height - borderRadius,
      x,
      y + borderRadius,
      segmentLength,
    ),
    `Q${x},${y} ${x + borderRadius},${y}`,
    "Z",
  ];

  return pathData.join(" ");
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

function writeBoundaryToCache(svgNode, boundary, width, height) {
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svgNode);
  const entry = { width, height, svg: svgStr };
  window.sessionStorage.setItem(`boundary-${boundary}`, JSON.stringify(entry));
}

function readBoundaryFromCache(boundary, width, height) {
  const svgStr = window.sessionStorage.getItem(`boundary-${boundary}`);
  if (!svgStr) {
    return null;
  }
  const entry = JSON.parse(svgStr);
  if (entry.width !== width || entry.height !== height) {
    return null;
  }
  const parser = new window.DOMParser();
  return parser.parseFromString(entry.svg, "image/svg+xml").firstChild;
}

function generateRoughBoundaries() {
  window.requestAnimationFrame(() => {
    [...document.querySelectorAll("[data-boundary]")].forEach((el) => {
      const clientRect = el.getBoundingClientRect();
      const width = Math.round(clientRect.width);
      const height = Math.round(clientRect.height);
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", width);
      svg.setAttribute("height", height);

      const boundary = el.dataset.boundary;
      const team = boundary.split("-")[0];
      const isPage = boundary.split("-")[1] === "page";

      const inset = isPage ? 0 : 10;
      const strokeWidth = isPage ? 0 : 2;

      const rectangle = createRoundedRectanglePathWithControlPoints(
        inset,
        inset,
        width - 2 * inset,
        height - 2 * inset,
        10,
        150,
      );

      // white background rectangle without rough.js
      const bgNode = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      bgNode.setAttribute("d", rectangle);
      bgNode.setAttribute("fill", "white");
      svg.appendChild(bgNode);

      // rough rectangle
      const rc = roughjs.svg(svg);
      let node = readBoundaryFromCache(boundary, width, height);
      if (!node) {
        node = rc.path(rectangle, {
          roughness: 3,
          strokeWidth,
          fillStyle: "sunburst",
          fill: "rgb(10,150,10,0.5)",
          fillWeight: 0.5,
          hachureGap: 10,
          disableMultiStroke: true,
          strokeLineDash: [10, 5],
          preserveVertices: true,
          bowing: 0.5,
          ...config[team],
        });
        console.log(node);
        writeBoundaryToCache(node, boundary, width, height);
      }

      // add gausien blur filter to node
      //const filter = document.createElementNS(
      //  "http://www.w3.org/2000/svg",
      //  "filter",
      //);
      //filter.setAttribute("id", "blur");
      //const feGaussianBlur = document.createElementNS(
      //  "http://www.w3.org/2000/svg",
      //  "feGaussianBlur",
      //);
      //feGaussianBlur.setAttribute("in", "SourceGraphic");
      //feGaussianBlur.setAttribute("stdDeviation", "1");
      //filter.appendChild(feGaussianBlur);
      //svg.appendChild(filter);
      //node.setAttribute("filter", "url(#blur)");

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
