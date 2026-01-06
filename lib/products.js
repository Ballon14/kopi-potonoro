// Sample coffee products data
export const products = [
  {
    id: 1,
    name: "Arabica Gayo",
    category: "Arabica",
    price: 85000,
    origin: "Aceh, Indonesia",
    roast: "Medium",
    description: "Kopi Arabica dari dataran tinggi Gayo dengan cita rasa yang kaya dan aroma yang menggoda. Memiliki tingkat keasaman yang seimbang dengan sentuhan rasa cokelat dan karamel.",
    tastingNotes: ["Cokelat", "Karamel", "Kacang"],
    weight: "200g",
    featured: true,
    stock: 50
  },
  {
    id: 2,
    name: "Robusta Lampung",
    category: "Robusta",
    price: 65000,
    origin: "Lampung, Indonesia",
    roast: "Dark",
    description: "Robusta pilihan dari perkebunan Lampung dengan karakter kuat dan body yang tebal. Cocok untuk pecinta kopi dengan rasa yang bold dan kandungan kafein tinggi.",
    tastingNotes: ["Earthy", "Dark Chocolate", "Spicy"],
    weight: "200g",
    featured: false,
    stock: 75
  },
  {
    id: 3,
    name: "Toraja Kalosi",
    category: "Arabica",
    price: 120000,
    origin: "Toraja, Sulawesi",
    roast: "Medium-Dark",
    description: "Kopi premium dari tanah Toraja yang legendaris. Memiliki kompleksitas rasa yang tinggi dengan body yang penuh dan aftertaste yang panjang.",
    tastingNotes: ["Buah Berry", "Rempah", "Dark Chocolate"],
    weight: "200g",
    featured: true,
    stock: 30
  },
  {
    id: 4,
    name: "Java Preanger",
    category: "Arabica",
    price: 95000,
    origin: "Jawa Barat, Indonesia",
    roast: "Medium",
    description: "Warisan kopi Nusantara dari dataran tinggi Priangan. Cita rasa klasik dengan keseimbangan sempurna antara keasaman dan kemanisan.",
    tastingNotes: ["Floral", "Citrus", "Honey"],
    weight: "200g",
    featured: false,
    stock: 45
  },
  {
    id: 5,
    name: "Bali Kintamani",
    category: "Arabica",
    price: 105000,
    origin: "Kintamani, Bali",
    roast: "Light-Medium",
    description: "Kopi organik dari lereng Gunung Batur dengan proses pengolahan basah. Memiliki keasaman yang cerah dan aroma bunga yang khas.",
    tastingNotes: ["Citrus", "Floral", "Tropical Fruit"],
    weight: "200g",
    featured: true,
    stock: 40
  },
  {
    id: 6,
    name: "Mandailing Reserve",
    category: "Arabica",
    price: 110000,
    origin: "Mandailing, Sumatera",
    roast: "Dark",
    description: "Kopi spesial dari Mandailing dengan karakter Sumatera yang khas. Body yang berat dengan tingkat keasaman rendah dan rasa earthy yang kompleks.",
    tastingNotes: ["Earthy", "Herbal", "Cedar"],
    weight: "200g",
    featured: false,
    stock: 35
  },
  {
    id: 7,
    name: "House Blend",
    category: "Blend",
    price: 75000,
    origin: "Multi-Origin",
    roast: "Medium",
    description: "Racikan spesial dari berbagai origin terbaik Indonesia. Dirancang untuk memberikan pengalaman kopi yang seimbang dan nikmat setiap hari.",
    tastingNotes: ["Balanced", "Chocolate", "Nutty"],
    weight: "200g",
    featured: false,
    stock: 100
  },
  {
    id: 8,
    name: "Espresso Blend",
    category: "Blend",
    price: 80000,
    origin: "Multi-Origin",
    roast: "Dark",
    description: "Blend khusus untuk espresso dengan crema yang sempurna. Kombinasi Arabica dan Robusta untuk menghasilkan shot espresso yang kaya dan creamy.",
    tastingNotes: ["Caramel", "Dark Chocolate", "Bold"],
    weight: "200g",
    featured: true,
    stock: 60
  }
];

export const categories = [
  { id: "all", name: "Semua Kopi", count: products.length },
  { id: "arabica", name: "Arabica", count: products.filter(p => p.category === "Arabica").length },
  { id: "robusta", name: "Robusta", count: products.filter(p => p.category === "Robusta").length },
  { id: "blend", name: "Blend", count: products.filter(p => p.category === "Blend").length }
];

export function getProductById(id) {
  return products.find(p => p.id === parseInt(id));
}

export function getProductsByCategory(category) {
  if (category === "all") return products;
  return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
}

export function getFeaturedProducts() {
  return products.filter(p => p.featured);
}

export function formatPrice(price) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);
}
