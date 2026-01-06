import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import midtransClient from 'midtrans-client';
import { auth, currentUser } from '@clerk/nextjs/server';

const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function POST(request) {
  try {
    await connectDB();
    
    // Get authenticated user
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { 
      items, 
      total,
      subtotal,
      shippingCost,
      shippingService,
      promoCode,
      promoDiscount,
      customerAddress,
      orderNotes
    } = await request.json();

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Keranjang kosong' },
        { status: 400 }
      );
    }

    // Create unique order ID
    const orderId = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Prepare item details for Midtrans
    const itemDetails = items.map(item => ({
      id: item._id || item.id,
      price: item.price,
      quantity: item.quantity,
      name: item.name.substring(0, 50), // Midtrans name limit
    }));

    // Add shipping cost as item if exists
    if (shippingCost && shippingCost > 0) {
      itemDetails.push({
        id: 'SHIPPING',
        price: shippingCost,
        quantity: 1,
        name: shippingService ? `Ongkir: ${shippingService.substring(0, 40)}` : 'Ongkos Kirim'
      });
    }

    // Add discount as negative item if exists
    if (promoDiscount && promoDiscount > 0) {
      itemDetails.push({
        id: 'DISCOUNT',
        price: -promoDiscount,
        quantity: 1,
        name: `Diskon: ${promoCode || 'Promo'}`
      });
    }

    // Calculate gross amount (must match total)
    const grossAmount = itemDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Prepare parameter for Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      item_details: itemDetails,
      customer_details: {
        first_name: customerAddress?.fullName || user.firstName,
        last_name: user.lastName || '',
        email: user.emailAddresses[0].emailAddress,
        phone: customerAddress?.phone || '',
        shipping_address: customerAddress ? {
          first_name: customerAddress.fullName,
          phone: customerAddress.phone,
          address: customerAddress.address,
          postal_code: customerAddress.postalCode,
          country_code: 'IDN'
        } : undefined
      },
    };

    // Create transaction token
    const transaction = await snap.createTransaction(parameter);
    const token = transaction.token;

    // Save order to database with all details
    const newOrder = await Order.create({
      user_id: userId,
      user_name: customerAddress?.fullName || `${user.firstName} ${user.lastName}`,
      user_email: user.emailAddresses[0].emailAddress,
      items: items.map(item => ({
        product_id: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.imageUrl,
        weight: item.weight
      })),
      subtotal: subtotal || items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      total_amount: total,
      status: 'pending',
      // Shipping
      shipping_cost: shippingCost || 0,
      shipping_service: shippingService || null,
      shipping_address: customerAddress ? {
        fullName: customerAddress.fullName,
        phone: customerAddress.phone,
        address: customerAddress.address,
        postalCode: customerAddress.postalCode
      } : null,
      // Promo
      promo_code: promoCode || null,
      promo_discount: promoDiscount || 0,
      // Notes
      notes: orderNotes || null,
      // Midtrans
      midtrans_order_id: orderId,
      midtrans_token: token,
    });

    return NextResponse.json({
      success: true,
      token,
      order: newOrder,
    });
  } catch (error) {
    console.error('Checkout Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Checkout failed' },
      { status: 500 }
    );
  }
}
