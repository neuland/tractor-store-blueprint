export default {
  products: [
    {
      name: "Super Tractor",
      price: 1000,
      id: "ST-001",
      description: "This is a super tractor",
      variants: [
        { name: "Red", image: "st001-red.webp", sku: "ST-001-RD" },
        { name: "Blue", image: "st001-blue.webp", sku: "ST-001-BL" },
        { name: "Green", image: "st001-green.webp", sku: "ST-001-GN" },
      ],
      rating: 4.5,
    },
    {
      name: "Mega Tractor",
      price: 2000,
      id: "MT-001",
      description: "This is a mega tractor",
      variants: [{ name: "Basic", image: "mt001.webp", sku: "MT-001-BS" }],
      rating: 4.5,
    },
    {
      name: "Ultra Tractor",
      price: 3000,
      id: "UT-001",
      description: "This is an ultra tractor",
      variants: [{ name: "Basic", image: "ut001.webp", sku: "UT-001-BS" }],
      rating: 4.5,
    },
  ],
};
