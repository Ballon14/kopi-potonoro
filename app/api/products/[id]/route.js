import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';
import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';

// GET /api/products/[id] - Get single product
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;

    // Check if ID is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product with file upload
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    
    // Extract fields
    const updateData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseInt(formData.get('price')),
      category: formData.get('category'),
      origin: formData.get('origin'),
      weight: formData.get('weight'),
      roast: formData.get('roast'),
      featured: formData.get('featured') === 'true',
      stock: parseInt(formData.get('stock') || '0'),
    };

    // Handle tasting notes (string -> array)
    const tastingNotes = formData.get('tastingNotes');
    if (tastingNotes) {
      updateData.tastingNotes = tastingNotes.split(',').map(note => note.trim()).filter(n => n);
    }

    // Handle file upload
    const file = formData.get('image');
    if (file && file.size > 0 && file.name !== 'undefined') {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.name).toLowerCase();
      const filename = `product-${uniqueSuffix}${ext}`;
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (error) {
        // Ignore error if directory exists
      }
      const filepath = path.join(uploadDir, filename);
      
      await writeFile(filepath, buffer);
      
      // Delete old image if it exists and is local
      const oldProduct = await Product.findById(id);
      if (oldProduct?.imageUrl?.startsWith('/uploads/')) {
        const oldPath = path.join(process.cwd(), 'public', oldProduct.imageUrl);
        try { await unlink(oldPath); } catch (e) { /* ignore if file doesn't exist */ }
      }
      
      updateData.imageUrl = `/uploads/${filename}`;
    } else if (formData.get('existingImageUrl')) {
      // Keep existing
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update product' },
      { status: 400 }
    );
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete image file if exists
    if (product.imageUrl?.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', product.imageUrl);
      try { await unlink(filePath); } catch (e) { /* ignore if file doesn't exist */ }
    }

    return NextResponse.json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
