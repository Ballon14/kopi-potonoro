import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Arabica', 'Robusta', 'Blend'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  origin: {
    type: String,
    required: [true, 'Origin is required'],
  },
  roast: {
    type: String,
    required: [true, 'Roast level is required'],
    enum: ['Light', 'Light-Medium', 'Medium', 'Medium-Dark', 'Dark'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  tastingNotes: {
    type: [String],
    default: [],
  },
  weight: {
    type: String,
    default: '200g',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  imageUrl: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// Add indexes for better query performance
ProductSchema.index({ category: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ name: 'text', description: 'text' });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
