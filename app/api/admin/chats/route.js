import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Chat from '@/models/Chat';
import { auth, currentUser } from '@clerk/nextjs/server';

// Admin emails list
const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];

async function isAdmin() {
  const user = await currentUser();
  if (!user) return false;
  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase();
  return ADMIN_EMAILS.includes(email);
}

// Get all chat sessions for admin
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

    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    // Build query
    const query = {};
    if (status !== 'all') {
      query.status = status;
    }

    // Fetch chats sorted by last message
    const chats = await Chat.find(query)
      .sort({ last_message_at: -1 })
      .select('-messages') // Don't include messages in list
      .lean();

    // Get total unread count
    const totalUnread = await Chat.aggregate([
      { $group: { _id: null, total: { $sum: '$unread_admin' } } }
    ]);

    return NextResponse.json({
      success: true,
      chats,
      totalUnread: totalUnread[0]?.total || 0
    });
  } catch (error) {
    console.error('Admin Get Chats Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chats' },
      { status: 500 }
    );
  }
}
