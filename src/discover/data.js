import products from "../../products.js";

function convert(product) {
  return {
    name: product.name,
    id: product.id,
    image: product.variants[0].image,
    startPrice: product.variants.reduce((min, variant) => {
      return Math.min(min, variant.price);
    }, Infinity),
  };
}

export default {
  categories: [
    {
      key: "tractors",
      name: "Tractors",
      products: products.filter((p) => p.category === "tractors").map(convert),
    },
    {
      key: "tools",
      name: "Tools",
      products: products.filter((p) => p.category === "tools").map(convert),
    },
  ],
  recommendations: {
    "ST-001-RD": ["GC-001-BK", "SP-001-BK"],
    "ST-001-BL": ["GC-001-BK", "SP-001-BK"],
    "ST-001-GN": ["GC-001-GE", "SP-001-GE"],
    "PT-001-SL": ["LW-001-LG", "SP-001-BK"],
    "PT-001-GD": ["LW-001-XL", "SP-001-BK"],
    "PT-001-PT": ["LW-001-XL", "SP-001-BK"],
    "LW-001-LG": ["LW-001-XL", "PT-001-GD"],
    "LW-001-XL": ["PT-001-GD", "GC-001-BK"],
  },
};
