import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { auth, currentUser } from '@clerk/nextjs/server';
import mongoose from 'mongoose';

// Admin emails list
const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];

async function isAdmin() {
  const user = await currentUser();
  if (!user) return false;
  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();
  return ADMIN_EMAILS.includes(email);
}

// GET single order
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Build query based on ID format
    let query;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id) && 
                            (new mongoose.Types.ObjectId(id)).toString() === id;
    
    if (isValidObjectId) {
      query = { $or: [{ _id: id }, { midtrans_order_id: id }] };
    } else {
      query = { midtrans_order_id: id };
    }

    const order = await Order.findOne(query);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Admin Fetch Order Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH - Admin update order
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { userId } = await auth();
    const body = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Build query based on ID format
    let query;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id) && 
                            (new mongoose.Types.ObjectId(id)).toString() === id;
    
    if (isValidObjectId) {
      query = { $or: [{ _id: id }, { midtrans_order_id: id }] };
    } else {
      query = { midtrans_order_id: id };
    }

    const order = await Order.findOne(query);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update allowed fields
    const allowedUpdates = ['status', 'tracking_number', 'notes'];
    const updates = {};
    
    for (const field of allowedUpdates) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    // Validate status transitions
    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'failed', 'cancelled'];
    if (updates.status && !validStatuses.includes(updates.status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Apply updates
    Object.assign(order, updates);
    order.updatedAt = new Date();
    await order.save();

    return NextResponse.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Admin Update Order Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
