import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { UPLOAD_DIR, getImageUrl, ALLOWED_TYPES, MAX_FILE_SIZE } from '@/lib/upload';

// GET /api/products - Get all products with optional filtering
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    let query = {};
    
    if (category && category !== 'all') {
      query.category = category.charAt(0).toUpperCase() + category.slice(1);
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product with file upload
export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    
    // Extract text fields
    const name = formData.get('name');
    const description = formData.get('description');
    const price = formData.get('price');
    const category = formData.get('category');
    const origin = formData.get('origin');
    const weight = formData.get('weight');
    const roast = formData.get('roast');
    const tastingNotes = formData.get('tastingNotes'); // Will be string
    const featured = formData.get('featured') === 'true';
    const stock = parseInt(formData.get('stock') || '0');
    
    // Extract file
    const file = formData.get('image');
    let imageUrl = null;

    if (file && file.size > 0 && file.name !== 'undefined') {
      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: 'Tipe file tidak valid. Gunakan JPG, PNG, WebP, atau GIF.' },
          { status: 400 }
        );
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: 'Ukuran file terlalu besar. Maksimal 5MB.' },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.name).toLowerCase();
      const filename = `product-${uniqueSuffix}${ext}`;
      
      // Ensure upload directory exists
      try {
        await mkdir(UPLOAD_DIR, { recursive: true });
      } catch (error) {
        // Ignore error if directory exists
      }
      const filepath = path.join(UPLOAD_DIR, filename);
      
      await writeFile(filepath, buffer);
      
      // Use helper to get correct URL format
      imageUrl = getImageUrl(filename);
    }

    // Process tasting notes
    const tastingNotesArray = tastingNotes 
      ? tastingNotes.split(',').map(note => note.trim()).filter(n => n)
      : [];

    const product = await Product.create({
      name,
      description,
      price: parseInt(price),
      category,
      origin,
      weight,
      roast,
      tastingNotes: tastingNotesArray,
      featured,
      stock,
      imageUrl
    });

    return NextResponse.json({
      success: true,
      data: product,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 400 }
    );
  }
}
