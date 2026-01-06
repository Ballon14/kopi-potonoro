import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { auth } from '@clerk/nextjs/server';

export async function GET(request) {
  try {
    await connectDB();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    // Build query
    const query = { user_id: userId };
    if (status && status !== 'all') {
      query.status = status;
    }

    // Fetch orders with pagination
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query)
    ]);

    // Get status counts
    const statusCounts = await Order.aggregate([
      { $match: { user_id: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const counts = {
      all: total,
      pending: 0,
      paid: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      failed: 0,
      cancelled: 0
    };
    
    statusCounts.forEach(s => {
      if (counts.hasOwnProperty(s._id)) {
        counts[s._id] = s.count;
      }
    });

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      counts
    });
  } catch (error) {
    console.error('Fetch Orders Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
