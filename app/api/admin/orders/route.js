import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { auth, currentUser } from '@clerk/nextjs/server';

// Admin emails list
const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];

async function isAdmin() {
  const user = await currentUser();
  if (!user) return false;
  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();
  return ADMIN_EMAILS.includes(email);
}

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

    // Check admin access
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const page = parseInt(searchParams.get('page')) || 1;
    const skip = (page - 1) * limit;

    // Build query - no user_id filter for admin
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    // Fetch all orders with pagination
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query)
    ]);

    // Get status counts for all orders
    const statusCounts = await Order.aggregate([
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

    // Calculate total revenue from paid/completed orders
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ['paid', 'processing', 'shipped', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$total_amount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      counts,
      totalRevenue
    });
  } catch (error) {
    console.error('Admin Fetch Orders Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
