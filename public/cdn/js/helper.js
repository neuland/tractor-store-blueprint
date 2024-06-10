import roughjs from "https://cdn.jsdelivr.net/npm/roughjs@4.6.6/+esm";

// team specific styles
const config = {
  explore: {
    fill: "rgba(255, 90, 84, 0.1)",
    stroke: "rgba(255, 90, 84, 1)",
  },
  decide: {
    fill: "rgba(84, 255, 144, 0.1)",
    stroke: "rgba(84, 255, 144, 1)",
  },
  checkout: {
    fill: "rgba(255, 222, 84, 0.1)",
    stroke: "rgba(255, 222, 84, 1)",
  },
};

/**
 * Sets the basic styles.
 */
function setBasicStyles() {
  const style = document.createElement("style");
  style.innerHTML = `
@import url('https://fonts.googleapis.com/css2?family=Pangolin&display=swap');

[data-boundary],
[data-boundary-page] {
  position: relative;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
[data-boundary]::after,
[data-boundary-page]::after {
  display: block;
  content: attr(data-boundary);
  position: absolute;
  bottom: -0.8rem;
  right: 50%;
  transform: translateX(50%);
  padding: 0 0.5rem;
  line-height: 1.5;
  font-weight: bold;
  pointer-events: none;
  font-family: "Pangolin", cursive;
  font-weight: 400;
  font-style: normal;
}
[data-boundary-page]::after {
  top: 250px;
  left: 0rem;
  bottom: auto;
  right: auto;
  transform: rotate(-90deg);
  transform-origin: 0 0;
  content: attr(data-boundary-page);
}
[data-boundary=explore]::after,
[data-boundary-page=explore]::after {
  background-color: ${config.explore.stroke};
  color: white;
}
[data-boundary=decide]::after,
[data-boundary-page=decide]::after {
  background-color: ${config.decide.stroke};
}
[data-boundary=checkout]::after,
[data-boundary-page=checkout]::after {
  background: ${config.checkout.stroke};
}

html:not(.showBoundaries) [data-boundary],
html:not(.showBoundaries) [data-boundary-page] {
  background-image: none !important;
}
html:not(.showBoundaries) [data-boundary]:after,
html:not(.showBoundaries) [data-boundary-page]:after{
  display: none;
}
html.showBoundaries img {
  mix-blend-mode: multiply;
}
`;
  document.head.appendChild(style);
}

/**
 * Generates a rounded rectangle SVG path.
 * @param {object} options - The options for generating the rounded rectangle.
 * @param {number} options.x - The x-coordinate of the top-left corner of the rectangle.
 * @param {number} options.y - The y-coordinate of the top-left corner of the rectangle.
 * @param {number} options.width - The width of the rectangle.
 * @param {number} options.height - The height of the rectangle.
 * @param {number} options.borderRadius - The border radius of the rectangle.
 * @param {number} options.segmentLength - The length of each line segment.
 * @returns {string} The SVG path representing the rounded rectangle.
 */
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

  /**
   * Generates line segments between two points.
   * @param {number} startX - The x-coordinate of the starting point.
   * @param {number} startY - The y-coordinate of the starting point.
   * @param {number} endX - The x-coordinate of the ending point.
   * @param {number} endY - The y-coordinate of the ending point.
   * @param {number} segmentLength - The length of each line segment.
   * @returns {string} The points representing the line segments.
   */
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

/**
 * Writes the SVG node to the cache for the given boundary, width, and height.
 * @param {SVGElement} svgNode - The SVG node to be cached.
 * @param {string} pathId - The boundary identifier.
 * @param {number} width - The width of the boundary.
 * @param {number} height - The height of the boundary.
 */
function writeBoundaryToCache(svgNode, pathId, width, height) {
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svgNode);
  const entry = { width, height, svg: svgStr };
  window.sessionStorage.setItem(pathId, JSON.stringify(entry));
}

/**
 * Reads the SVG string from the cache for the given boundary, width, and height.
 * @param {string} pathId - The boundary identifier.
 * @param {number} width - The width of the boundary.
 * @param {number} height - The height of the boundary.
 * @returns {SVGElement|null} - The parsed SVG element or null if not found or dimensions don't match.
 */
function readBoundaryFromCache(pathId, width, height) {
  const svgStr = window.sessionStorage.getItem(pathId);
  if (!svgStr) {
    return null;
  }
  const entry = JSON.parse(svgStr);
  const tolerance = 30;
  if (
    Math.abs(entry.width - width) >= tolerance ||
    Math.abs(entry.height - height) >= tolerance
  ) {
    return null;
  }
  const parser = new window.DOMParser();
  return parser.parseFromString(entry.svg, "image/svg+xml").firstChild;
}

/**
 * Sets the CSS background for the given boundary using the SVG node.
 * @param {SVGElement} svgNode - The SVG node.
 * @param {string} path - The CSS path.
 * @param {string} pathId - The boundary identifier.
 */
function setCssBackground(svgNode, path, pathId) {
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(svgNode);
  const encodedSvg = encodeURIComponent(svgStr);
  const url = `url("data:image/svg+xml,${encodedSvg}")`;

  let style = document.getElementById(pathId);
  if (!style) {
    style = document.createElement("style");
    style.id = pathId;
    document.head.appendChild(style);
  }
  style.innerHTML = `${path} { background-image: ${url}; }`;
}

/**
 * Generates a white background for the given rectangle.
 * @param {string} rectangle - The rectangle coordinates.
 * @returns {SVGElement} The generated white background SVG element.
 */
function generateWhiteBackground(rectangle) {
  const bgNode = document.createElementNS("http://www.w3.org/2000/svg", "path");
  bgNode.setAttribute("d", rectangle);
  bgNode.setAttribute("fill", "white");
  return bgNode;
}

/**
 * Generates a short hash for the given selector.
 * @param {string} selector - The selector to generate the hash for.
 * @returns {string} The generated hash.
 */
function generateHash(selector) {
  // eslint-disable-next-line jsdoc/require-jsdoc
  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  function toHex(hash) {
    return ("00000000" + (hash >>> 0).toString(16)).slice(-8);
  }

  return "id-" + toHex(simpleHash(selector));
}

/**
 * Generates a boundary for the given SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @param {string} rectangle - The rectangle coordinates.
 * @param {string} team - The team name.
 * @param {boolean} isPage - Indicates if it's a page boundary.
 * @returns {string} The generated boundary.
 */
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

/**
 * Generate a unique CSS selector path for a given element
 * @param {Element} element - The element to generate the path for
 * @returns {string} - The unique CSS path
 */
function generateUniqueCSSPath(element) {
  if (!(element instanceof Element)) return "";

  let path = [];

  while (element) {
    let selector = element.nodeName.toLowerCase();

    if (element.id) {
      selector += `#${element.id}`;
      path.unshift(selector);
      break;
    } else {
      let sibling = element;
      let nth = 1;

      while (sibling.previousElementSibling) {
        sibling = sibling.previousElementSibling;
        if (sibling.nodeName.toLowerCase() === selector) nth++;
      }

      if (nth !== 1) selector += `:nth-of-type(${nth})`;
    }

    path.unshift(selector);
    element = element.parentElement;
  }

  return path.join(" > ");
}

/**
 * Generates a rough boundary for the given element.
 * @param {HTMLElement} el - The element to generate the boundary for.
 */
function generateRoughBoundary(el) {
  const clientRect = el.getBoundingClientRect();
  const width = Math.round(clientRect.width);
  const height = Math.round(clientRect.height);

  const path = generateUniqueCSSPath(el);
  const isPage = el.hasAttribute("data-boundary-page");
  const team = isPage
    ? el.getAttribute("data-boundary-page")
    : el.getAttribute("data-boundary");

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
  let pathId = generateHash(path);
  let node = readBoundaryFromCache(pathId, width, height);
  if (!node) {
    node = generateBoundary(svg, rectangle, team, isPage);
    writeBoundaryToCache(node, pathId, width, height);
  }
  svg.appendChild(node);

  // apply to DOM
  setCssBackground(svg, path, pathId);
}

/**
 * Generate rough boundaries for all elements with the data-boundary attribute.
 */
function generateRoughBoundaries() {
  const boundaries = document.querySelectorAll(
    "[data-boundary], [data-boundary-page]",
  );
  [...boundaries].forEach(generateRoughBoundary);
}

/**
 * Toggle the boundaries based on the active state.
 * @param {boolean} active - The active state of the boundaries.
 */
function toggleBoundaries(active) {
  document.documentElement.classList.toggle("showBoundaries", active);
  window.localStorage.setItem("showBoundaries", active);

  if (!active) {
    return;
  }
  generateRoughBoundaries();
}

/**
 * Show toggle button.
 */
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

  const checkboxView = document.createElement("div");
  checkboxView.classList.add("toggleView");

  const label = document.createElement("label");
  label.appendChild(checkbox);
  label.appendChild(checkboxView);
  label.appendChild(document.createTextNode(" show team boundaries"));

  const container = document.createElement("div");
  container.classList.add("showBoundariesToggle");

  const style = document.createElement("style");
  style.innerHTML = `
    .showBoundariesToggle {
      position: fixed; 
      bottom: 10px; 
      left: 10px; 
      border-radius: 10px;
      display: flex;
      background-color: rgba(255, 255, 255, 0.8); 
      -webkit-user-select: none; 
      user-select: none;
      box-shadow: 0 0 20px 10px rgba(235, 91, 89, 0.05);  
      border: 1px solid #eeebe2;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      margin-right: 10px;
    }

    .showBoundariesToggle input {
      display: none;
    }

    .showBoundariesToggle label {
      cursor: pointer;
      padding: 20px; 
      display: flex;
    }

    .toggleView {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 20px;
      border: 1px solid #ccc;
      border-radius: 10px;
      margin-right: 10px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
      background-color: #fff;
      flex-shrink: 0;
    }

    .toggleView::before {
      content: "";
      display: block;
      width: 18px;
      height: 18px;
      border-radius: 10px;
      background-color: #fff;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s, width 0.3s;
    }

    .toggleView::after {
      top: 1px;
      left: 1px;
      position: absolute;
      content: "";
      display: block;
      width: 16px;
      height: 16px;
      border-radius: 10px;
      background-color: #000;
      opacity: 0.5;
      transition: transform 0.3s;
    }

    .showBoundariesToggle label:hover .toggleView::after {
      opacity: 1;
    }

    .showBoundariesToggle input:checked + .toggleView::before {
      width: 38px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
      background-color: rgba(255, 90, 85, 1);
    }

    .showBoundariesToggle input:checked + .toggleView::after {
      transform: translateX(20px);
      opacity: 1;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    }
  `;
  container.appendChild(style);
  container.appendChild(label);
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
