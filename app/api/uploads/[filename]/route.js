import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { UPLOAD_DIR } from '@/lib/upload';

// GET /api/uploads/[filename] - Serve uploaded images
export async function GET(request, { params }) {
  try {
    const { filename } = await params;
    
    // Security: prevent directory traversal
    const sanitizedFilename = path.basename(filename);
    const filepath = path.join(UPLOAD_DIR, sanitizedFilename);
    
    // Read file
    const file = await readFile(filepath);
    
    // Determine content type
    const ext = path.extname(sanitizedFilename).toLowerCase();
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
    };
    const contentType = contentTypes[ext] || 'application/octet-stream';
    
    // Return image with caching headers
    return new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json(
      { success: false, error: 'Image not found' },
      { status: 404 }
    );
  }
}
