import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['customer', 'admin'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatSchema = new mongoose.Schema({
  session_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user_id: {
    type: String,
    default: null
  },
  user_name: {
    type: String,
    required: true
  },
  user_email: {
    type: String,
    default: null
  },
  messages: [MessageSchema],
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  unread_admin: {
    type: Number,
    default: 0
  },
  unread_customer: {
    type: Number,
    default: 0
  },
  last_message: {
    type: String,
    default: ''
  },
  last_message_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
ChatSchema.index({ status: 1, last_message_at: -1 });

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
