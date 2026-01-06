import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { auth } from '@clerk/nextjs/server';
import mongoose from 'mongoose';

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

    // Build query based on ID format
    let query;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id) && 
                            (new mongoose.Types.ObjectId(id)).toString() === id;
    
    if (isValidObjectId) {
      query = {
        $or: [
          { _id: id, user_id: userId },
          { midtrans_order_id: id, user_id: userId }
        ]
      };
    } else {
      query = { midtrans_order_id: id, user_id: userId };
    }

    const order = await Order.findOne(query);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Fetch Order Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}

// DELETE order
export async function DELETE(request, { params }) {
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

    // Build query based on ID format
    let query;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id) && 
                            (new mongoose.Types.ObjectId(id)).toString() === id;
    
    if (isValidObjectId) {
      query = {
        $or: [
          { _id: id, user_id: userId },
          { midtrans_order_id: id, user_id: userId }
        ]
      };
    } else {
      query = { midtrans_order_id: id, user_id: userId };
    }

    // Find order first to check if it can be deleted
    const order = await Order.findOne(query);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Only allow deletion of pending, failed, or cancelled orders
    const deletableStatuses = ['pending', 'failed', 'cancelled'];
    if (!deletableStatuses.includes(order.status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Pesanan dengan status "${order.status}" tidak dapat dihapus. Hanya pesanan dengan status pending, gagal, atau dibatalkan yang dapat dihapus.` 
        },
        { status: 400 }
      );
    }

    // Delete the order
    await Order.deleteOne({ _id: order._id });

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Delete Order Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}

// PATCH - Update order status (for cancellation)
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

    // Build query based on ID format
    let query;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id) && 
                            (new mongoose.Types.ObjectId(id)).toString() === id;
    
    if (isValidObjectId) {
      query = {
        $or: [
          { _id: id, user_id: userId },
          { midtrans_order_id: id, user_id: userId }
        ]
      };
    } else {
      query = { midtrans_order_id: id, user_id: userId };
    }

    const order = await Order.findOne(query);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Only allow cancellation of pending orders
    if (body.status === 'cancelled' && order.status !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Only pending orders can be cancelled' },
        { status: 400 }
      );
    }

    // Update order
    order.status = body.status;
    await order.save();

    return NextResponse.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Update Order Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
