import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// Seed data from existing static products
const seedProducts = [
  {
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

// POST /api/seed - Seed database with initial products
export async function POST(request) {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});

    // Insert seed products
    const products = await Product.insertMany(seedProducts);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${products.length} products`,
      data: products,
    }, { status: 201 });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to seed database' },
      { status: 500 }
    );
  }
}

// GET /api/seed - Get seed status
export async function GET() {
  try {
    await connectDB();
    
    const count = await Product.countDocuments();

    return NextResponse.json({
      success: true,
      message: `Database has ${count} products`,
      count,
    });
  } catch (error) {
    console.error('Error checking seed status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check seed status' },
      { status: 500 }
    );
  }
}
