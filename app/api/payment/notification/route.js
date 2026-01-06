import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import midtransClient from 'midtrans-client';

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function POST(request) {
  try {
    await connectDB();
    
    // Parse the notification data
    const notificationJson = await request.json();
    
    // Validate signature/notification through SDK
    const statusResponse = await snap.transaction.notification(notificationJson);
    
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    
    console.log(`Transaction notification received. Order ID: ${orderId}. Transaction Status: ${transactionStatus}. Fraud Status: ${fraudStatus}`);

    // Determine new status
    let newStatus = 'pending';
    let paidAt = null;
    
    if (transactionStatus == 'capture') {
      if (fraudStatus == 'challenge') {
        newStatus = 'pending'; // Manual review needed
      } else if (fraudStatus == 'accept') {
        newStatus = 'paid';
        paidAt = new Date();
      }
    } else if (transactionStatus == 'settlement') {
      newStatus = 'paid';
      paidAt = new Date();
    } else if (transactionStatus == 'cancel' ||
      transactionStatus == 'deny' ||
      transactionStatus == 'expire') {
      newStatus = 'failed';
    } else if (transactionStatus == 'pending') {
      newStatus = 'pending';
    } else if (transactionStatus == 'refund') {
      newStatus = 'cancelled';
    }

    // Build update object
    const updateData = { 
      status: newStatus,
      payment_type: statusResponse.payment_type,
      payment_details: statusResponse,
      updatedAt: new Date()
    };

    // Add paid_at if payment is successful
    if (paidAt) {
      updateData.paid_at = paidAt;
    }

    // Update order in database
    const order = await Order.findOneAndUpdate(
      { midtrans_order_id: orderId },
      updateData,
      { new: true }
    );

    if (!order) {
      console.error(`Order not found for notification: ${orderId}`);
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    console.log(`Order ${orderId} updated to status: ${newStatus}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Notification handler failed' },
      { status: 500 }
    );
  }
}
