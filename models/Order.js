import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    index: true,
  },
  user_name: String,
  user_email: String,
  items: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: String,
      price: Number,
      quantity: Number,
      image: String,
      weight: String,
    }
  ],
  total_amount: {
    type: Number,
    required: true,
  },
  subtotal: Number,
  status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'failed', 'cancelled'],
    default: 'pending',
  },
  // Shipping info
  shipping_cost: {
    type: Number,
    default: 0
  },
  shipping_service: String,
  shipping_address: {
    fullName: String,
    phone: String,
    address: String,
    postalCode: String,
    city: String,
    province: String,
  },
  tracking_number: String,
  // Promo
  promo_code: String,
  promo_discount: {
    type: Number,
    default: 0
  },
  // Order notes
  notes: String,
  // Midtrans
  midtrans_token: String,
  midtrans_order_id: {
    type: String,
    unique: true,
  },
  payment_type: String,
  payment_details: Object,
  paid_at: Date,
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Update timestamp on save
OrderSchema.pre('save', function() {
  this.updatedAt = new Date();
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
