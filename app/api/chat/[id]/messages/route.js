import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Chat from '@/models/Chat';

// Send message to chat
export async function POST(request, { params }) {
  try {
    await connectDB();
    const { id } = await params; // session_id
    const body = await request.json();
    const { content, sender } = body;

    if (!content || !sender) {
      return NextResponse.json(
        { success: false, error: 'content and sender are required' },
        { status: 400 }
      );
    }

    if (!['customer', 'admin'].includes(sender)) {
      return NextResponse.json(
        { success: false, error: 'sender must be customer or admin' },
        { status: 400 }
      );
    }

    const chat = await Chat.findOne({ session_id: id });
    
    if (!chat) {
      return NextResponse.json(
        { success: false, error: 'Chat not found' },
        { status: 404 }
      );
    }

    // Add message
    const newMessage = {
      sender,
      content,
      timestamp: new Date()
    };
    
    chat.messages.push(newMessage);
    chat.last_message = content.substring(0, 100);
    chat.last_message_at = new Date();
    
    // Update unread counts
    if (sender === 'customer') {
      chat.unread_admin += 1;
    } else {
      chat.unread_customer += 1;
    }

    await chat.save();

    return NextResponse.json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error('Send Message Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// Get messages for chat (with polling support)
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params; // session_id
    const { searchParams } = new URL(request.url);
    const after = searchParams.get('after'); // timestamp to get messages after
    const role = searchParams.get('role'); // customer or admin

    const chat = await Chat.findOne({ session_id: id });
    
    if (!chat) {
      return NextResponse.json(
        { success: false, error: 'Chat not found' },
        { status: 404 }
      );
    }

    let messages = chat.messages;
    
    // Filter messages after timestamp if provided
    if (after) {
      const afterDate = new Date(after);
      messages = messages.filter(m => new Date(m.timestamp) > afterDate);
    }

    // Reset unread count based on role
    if (role === 'customer' && chat.unread_customer > 0) {
      chat.unread_customer = 0;
      await chat.save();
    } else if (role === 'admin' && chat.unread_admin > 0) {
      chat.unread_admin = 0;
      await chat.save();
    }

    return NextResponse.json({
      success: true,
      messages,
      chat_status: chat.status
    });
  } catch (error) {
    console.error('Get Messages Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get messages' },
      { status: 500 }
    );
  }
}
