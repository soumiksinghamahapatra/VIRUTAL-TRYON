const SAMPLE_PRODUCTS = [
  {
    title: "Double-Breasted Tailored Wool Blazer",
    url: "https://www.stories.com/en/clothing/blazers/product.double-breasted-blazer.html",
    image: "/assets/city-look-CO6tnpbW.webp",
    price: "$179",
    store: "& Other Stories",
    brand: "& Other Stories"
  },
  {
    title: "Pleated Wide Leg High-Waist Trousers",
    url: "https://www.cos.com/en/women/trousers/product.wide-leg-pleated.html",
    image: "/assets/brunch-bottom-CZ0x9j6O.webp",
    price: "$135",
    store: "COS",
    brand: "COS"
  },
  {
    title: "Pure Mulberry Silk Camisole Top",
    url: "https://www.arket.com/en/women/tops/product.silk-top.html",
    image: "/assets/brunch-top-DyVfbOn4.webp",
    price: "$89",
    store: "ARKET",
    brand: "ARKET"
  },
  {
    title: "Minimalist Leather Penny Loafers",
    url: "https://www.zara.com/us/en/leather-penny-loafers-p123.html",
    image: "/assets/brunch-shoes-Cu3OZLQ_.webp",
    price: "$119",
    store: "Zara",
    brand: "Zara"
  }
];

async function handleSearchProducts(body) {
  const { query = "" } = body || {};
  const lower = String(query).toLowerCase();

  const filtered = SAMPLE_PRODUCTS.filter(p => {
    return p.title.toLowerCase().includes(lower) ||
           lower.split(' ').some(w => w.length > 3 && p.title.toLowerCase().includes(w));
  });

  return {
    products: filtered.length > 0 ? filtered : SAMPLE_PRODUCTS
  };
}

async function handleSearchProductImage(body) {
  const { query, products } = body || {};
  if (Array.isArray(products)) {
    const results = products.map(p => ({
      query: p,
      imageUrl: SAMPLE_PRODUCTS[Math.floor(Math.random() * SAMPLE_PRODUCTS.length)].image
    }));
    return { results };
  }

  return {
    imageUrl: SAMPLE_PRODUCTS[0].image,
    query: query || "fashion staple"
  };
}

module.exports = {
  handleSearchProducts,
  handleSearchProductImage
};
