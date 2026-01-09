import path from 'path';

// Upload configuration for production
// Change UPLOAD_DIR to match your server's upload directory
// Example: /var/www/kopiku/uploads or /home/user/kopiku-uploads

const isProduction = process.env.NODE_ENV === 'production';

// In production: use external directory (outside project)
// In development: use public/uploads for convenience
export const UPLOAD_DIR = isProduction 
  ? process.env.UPLOAD_DIR || '/var/www/kopi-potonoro/uploads'
  : path.join(process.cwd(), 'public', 'uploads');

// URL path to access images
// In production: use API route
// In development: use static path
export const getImageUrl = (filename) => {
  if (!filename) return null;
  return isProduction 
    ? `/api/uploads/${filename}`
    : `/uploads/${filename}`;
};

// Extract filename from stored imageUrl
export const getFilenameFromUrl = (imageUrl) => {
  if (!imageUrl) return null;
  // Handle both formats: /uploads/file.jpg and /api/uploads/file.jpg
  const parts = imageUrl.split('/');
  return parts[parts.length - 1];
};

// Allowed image types
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Max file size (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
