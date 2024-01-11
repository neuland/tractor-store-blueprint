export default {
  products: [
    {
      name: "Super Tractor",
      price: 1000,
      sku: "ST-001",
      description: "This is a super tractor",
      image: "st001.webp",
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
      sku: "MT-001",
      description: "This is a mega tractor",
      image: "mt001.webp",
      rating: 4.5,
    },
    {
      name: "Ultra Tractor",
      price: 3000,
      sku: "UT-001",
      description: "This is an ultra tractor",
      image: "ut001.webp",
      rating: 4.5,
    },
  ],
};
