import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Chat from '@/models/Chat';
import { v4 as uuidv4 } from 'uuid';

// Create new chat session or get existing one
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { session_id, user_name, user_email, user_id } = body;

    // If session_id provided, try to find existing chat
    if (session_id) {
      const existingChat = await Chat.findOne({ session_id });
      if (existingChat) {
        return NextResponse.json({
          success: true,
          chat: existingChat
        });
      }
    }

    // Create new chat session
    const newSessionId = session_id || uuidv4();
    const chat = await Chat.create({
      session_id: newSessionId,
      user_name: user_name || 'Pengunjung',
      user_email: user_email || null,
      user_id: user_id || null,
      messages: [],
      status: 'open'
    });

    return NextResponse.json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Create Chat Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create chat session' },
      { status: 500 }
    );
  }
}

// Get chat by session_id
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const session_id = searchParams.get('session_id');

    if (!session_id) {
      return NextResponse.json(
        { success: false, error: 'session_id is required' },
        { status: 400 }
      );
    }

    const chat = await Chat.findOne({ session_id });
    
    if (!chat) {
      return NextResponse.json(
        { success: false, error: 'Chat not found' },
        { status: 404 }
      );
    }

    // Reset unread count for customer
    if (chat.unread_customer > 0) {
      chat.unread_customer = 0;
      await chat.save();
    }

    return NextResponse.json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Get Chat Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get chat' },
      { status: 500 }
    );
  }
}
