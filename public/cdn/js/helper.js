/* globals document, window, XMLSerializer */
import roughjs from "https://cdn.jsdelivr.net/npm/roughjs@4.6.6/+esm";

// team specific styles
const config = {
  explore: {
    fill: "rgba(255, 90, 84, 0.1)",
    stroke: "rgba(255, 90, 84, 1)",
    hachureAngle: 30,
  },
  decide: {
    fill: "rgba(84, 255, 144, 0.1)",
    stroke: "rgba(84, 255, 144, 1)",
    hachureAngle: 60,
  },
  checkout: {
    fill: "rgba(255, 222, 84, 0.1)",
    stroke: "rgba(255, 222, 84, 1)",
    hachureAngle: 90,
  },
};

function setBasicStyles() {
  const style = document.createElement("style");
  style.innerHTML = `
@import url('https://fonts.googleapis.com/css2?family=Pangolin&display=swap');

[data-boundary] {
  position: relative;
  background-size: 100% 100%;
  background-repeat: no-repeat;
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
[data-boundary$="-page"]::after {
  top: 250px;
  left: 0rem;
  bottom: auto;
  right: auto;
  transform: rotate(-90deg);
  transform-origin: 0 0;
}
[data-boundary^="explore-"]::after { background-color: ${config.explore.stroke}; color: white }
[data-boundary^="decide-"]::after { background-color: ${config.decide.stroke}; }
[data-boundary^="checkout-"]::after { background: ${config.checkout.stroke}; }

html:not(.showBoundaries) [data-boundary] { background-image: none !important;}
html:not(.showBoundaries) [data-boundary]:after { display: none; }
html.showBoundaries img { mix-blend-mode: multiply; }
`;
  document.head.appendChild(style);
}

// generates an svg path for a rounded rectangle with defined control points
function generateRoundedRectangle({
  x,
  y,
  width,
  height,
  borderRadius,
  segmentLength,
}) {
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
  const tolerance = 10;
  if (
    Math.abs(entry.width - width) >= tolerance ||
    Math.abs(entry.height - height) >= tolerance
  ) {
    return null;
  }
  const parser = new window.DOMParser();
  return parser.parseFromString(entry.svg, "image/svg+xml").firstChild;
}

// creates or updates a style tag with the svg as background
function setCssBackground(boundary, svgNode) {
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svgNode);
  const encodedSvg = encodeURIComponent(svgStr);
  const url = `url("data:image/svg+xml,${encodedSvg}")`;

  const id = `${boundary}-style`;
  let style = document.getElementById(id);
  if (!style) {
    style = document.createElement("style");
    style.id = id;
    document.head.appendChild(style);
  }
  style.innerHTML = `[data-boundary="${boundary}"] { background-image: ${url}; }`;
}

// generate a white background
function generateWhiteBackground(rectangle) {
  const bgNode = document.createElementNS("http://www.w3.org/2000/svg", "path");
  bgNode.setAttribute("d", rectangle);
  bgNode.setAttribute("fill", "white");
  return bgNode;
}

// generate a rough boundary
function generateBoundary(svg, rectangle, team, isPage) {
  const rc = roughjs.svg(svg);
  return rc.path(rectangle, {
    bowing: 0.5,
    disableMultiStroke: true,
    //fill: config[team].fill,
    //fillStyle: "hachure",
    //fillWeight: 1.5,
    //hachureAngle: config[team].hachureAngle,
    //hachureGap: 12,
    preserveVertices: true,
    roughness: isPage ? 5 : 3,
    stroke: config[team].stroke,
    strokeLineDash: null,
    strokeWidth: isPage ? 20 : 3,
  });
}

function generateRoughBoundary(el) {
  const clientRect = el.getBoundingClientRect();
  const width = Math.round(clientRect.width);
  const height = Math.round(clientRect.height);

  const boundary = el.dataset.boundary;
  const team = boundary.split("-")[0];
  const isPage = boundary.endsWith("-page");

  // basic shape and position of the boundary
  const inset = isPage ? -2 : 10;
  const rectangle = generateRoundedRectangle({
    x: inset,
    y: inset,
    width: width - 2 * inset,
    height: height - 2 * inset,
    borderRadius: 10,
    segmentLength: 150,
  });

  // svg document
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("preserveAspectRatio", "none");

  // white background
  svg.appendChild(generateWhiteBackground(rectangle));

  // rough rectangle
  let node = readBoundaryFromCache(boundary, width, height);
  if (!node) {
    node = generateBoundary(svg, rectangle, team, isPage);
    writeBoundaryToCache(node, boundary, width, height);
  }
  svg.appendChild(node);

  // apply to DOM
  setCssBackground(boundary, svg);
}

function generateRoughBoundaries() {
  const boundaries = document.querySelectorAll("[data-boundary]");
  [...boundaries].forEach(generateRoughBoundary);
}

function toggleBoundaries(active) {
  document.documentElement.classList.toggle("showBoundaries", active);
  window.localStorage.setItem("showBoundaries", active);

  if (!active) {
    return;
  }
  generateRoughBoundaries();
}

function showToggleButton() {
  const showBoundaries =
    window.localStorage.getItem("showBoundaries") === "true";
  toggleBoundaries(showBoundaries);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = showBoundaries;
  checkbox.addEventListener("change", (e) =>
    toggleBoundaries(e.target.checked),
  );

  const label = document.createElement("label");
  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(" show team boundaries"));

  const container = document.createElement("div");
  container.appendChild(label);
  container.style.cssText =
    "position: fixed; bottom: 0; left: 0; background-color: rgba(255, 255, 255, 0.8); padding: 10px; -webkit-user-select: none; user-select: none;";
  document.body.appendChild(container);
}

/**
 * initialize
 */

setBasicStyles();
showToggleButton();
window.addEventListener("resize", () => {
  window.requestAnimationFrame(generateRoughBoundaries);
});
window.addEventListener("click", generateRoughBoundaries);
