import products from "../../products.js";
import { productUrl } from "./utils.js";

function skuToProduct(sku) {
  const product = products.find((p) => p.variants.some((v) => v.sku === sku));
  const variant = product.variants.find((v) => v.sku === sku);
  return {
    name: `${product.name} ${variant.name}`,
    id: product.id,
    sku: variant.sku,
    image: variant.image,
    price: variant.price,
    url: productUrl(product.id, variant.sku),
  };
}

function idToProduct(id) {
  const product = products.find((p) => p.id === id);
  return {
    name: product.name,
    id: product.id,
    image: product.variants[0].image,
    startPrice: product.variants.reduce((min, variant) => {
      return Math.min(min, variant.price);
    }, Infinity),
    url: productUrl(product.id),
  };
}

export default {
  categories: [
    {
      key: "tractors",
      name: "Tractors",
      products: ["ST-001", "PT-001"].map(idToProduct),
    },
    {
      key: "tools",
      name: "Tools",
      products: ["GC-001", "SP-001", "LW-001"].map(idToProduct),
    },
  ],
  recommendations: {
    "ST-001-RD": ["GC-001-BK", "SP-001-BK"].map(skuToProduct),
    "ST-001-BL": ["GC-001-BK", "SP-001-BK"].map(skuToProduct),
    "ST-001-GN": ["GC-001-GE", "SP-001-GE"].map(skuToProduct),
    "PT-001-SL": ["LW-001-LG", "SP-001-BK"].map(skuToProduct),
    "PT-001-GD": ["LW-001-XL", "SP-001-BK"].map(skuToProduct),
    "PT-001-PT": ["LW-001-XL", "SP-001-BK"].map(skuToProduct),
    "LW-001-LG": ["LW-001-XL", "PT-001-GD"].map(skuToProduct),
    "LW-001-XL": ["PT-001-GD", "GC-001-BK"].map(skuToProduct),
  },
  stores: [
    {
      id: "s1",
      name: "Flagship Store North",
      street: "Main Street 2",
      city: "Harwixts",
      image: "/cdn/img/store/s1.png",
    },
    {
      id: "s2",
      name: "Micro Machines Center",
      street: "Long Field Road 1",
      city: "Weisterwas",
      image: "/cdn/img/store/s2.png",
    },
  ],
};
