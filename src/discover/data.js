export default {
  products: [
    { name: "Super Tractor", price: 1000, id: "ST-001", category: "tractors" },
    { name: "Mega Tractor", price: 2000, id: "MT-001", category: "tractors" },
    { name: "Ultra Tractor", price: 3000, id: "UT-001", category: "tractors" },
    { name: "Super Plow", price: 100, id: "SP-001", category: "plows" },
    { name: "Mega Plow", price: 200, id: "MP-001", category: "plows" },
    { name: "Ultra Plow", price: 300, id: "UP-001", category: "plows" },
    { name: "Super Harvester", price: 10000, id: "SH-001", category: "harvesters" },
    { name: "Mega Harvester", price: 20000, id: "MH-001", category: "harvesters" },
    { name: "Ultra Harvester", price: 30000, id: "UH-001", category: "harvesters" },
    { name: "Super Seeder", price: 1000, id: "SS-001", category: "seeders" },
    { name: "Mega Seeder", price: 2000, id: "MS-001", category: "seeders" },
    { name: "Ultra Seeder", price: 3000, id: "US-001", category: "seeders" },
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
