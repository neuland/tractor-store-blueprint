export default {
  products: [
    { name: "Super Tractor", price: 1000, sku: "ST-001" },
    { name: "Mega Tractor", price: 2000, sku: "MT-001" },
    { name: "Ultra Tractor", price: 3000, sku: "UT-001" },
    { name: "Super Plow", price: 100, sku: "SP-001" },
    { name: "Mega Plow", price: 200, sku: "MP-001" },
    { name: "Ultra Plow", price: 300, sku: "UP-001" },
    { name: "Super Harvester", price: 10000, sku: "SH-001" },
    { name: "Mega Harvester", price: 20000, sku: "MH-001" },
    { name: "Ultra Harvester", price: 30000, sku: "UH-001" },
    { name: "Super Seeder", price: 1000, sku: "SS-001" },
    { name: "Mega Seeder", price: 2000, sku: "MS-001" },
    { name: "Ultra Seeder", price: 3000, sku: "US-001" },
  ],
  recommendations: {
    "SH-001": ["ST-001", "SP-001", "SS-001"],
    "MH-001": ["MT-001", "MP-001", "MS-001"],
    "UH-001": ["UT-001", "UP-001", "US-001"],
    "ST-001": ["SP-001", "SS-001"],
    "MT-001": ["MP-001", "MS-001"],
  },
  categories: [
    {
      key: "tractors",
      name: "Tractors",
      products: ["ST-001", "MT-001", "UT-001"],
    },
    {
      key: "plows",
      name: "Plows",
      products: ["SP-001", "MP-001", "UP-001"],
    },
    {
      key: "harvesters",
      name: "Harvesters",
      products: ["SH-001", "MH-001", "UH-001"],
    },
    {
      key: "seeders",
      name: "Seeders",
      products: ["SS-001", "MS-001", "US-001"],
    },
  ],
};
