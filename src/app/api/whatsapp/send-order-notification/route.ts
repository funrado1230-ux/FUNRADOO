import { NextRequest, NextResponse } from 'next/server';

/**
 * WhatsApp Business API Order Notification Endpoint
 * Handles dual messaging for Customer & Merchant (7090679912)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerPhone, merchantPhone = '7090679912', order } = body;

    if (!order) {
      return NextResponse.json({ success: false, message: 'Missing order payload' }, { status: 400 });
    }

    console.log(`[WHATSAPP BUSINESS API] Dispatching order ${order.id} confirmation to Customer (${customerPhone}) and Merchant (${merchantPhone})...`);

    // Payload preview for Meta WhatsApp Cloud API / Twilio / 360Dialog
    const customerPayload = {
      messaging_product: 'whatsapp',
      to: customerPhone,
      type: 'template',
      template: {
        name: 'funrado_order_confirmation',
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: order.address?.fullName || 'Customer' },
              { type: 'text', text: order.id },
              { type: 'text', text: `₹${(order.total || 0).toLocaleString('en-IN')}` },
              { type: 'text', text: `${order.address?.street}, ${order.address?.city}` }
            ]
          }
        ]
      }
    };

    const merchantPayload = {
      messaging_product: 'whatsapp',
      to: merchantPhone,
      type: 'text',
      text: {
        body: `🛒 New FUNRADO Order Alert!\nCustomer: ${order.address?.fullName}\nPhone: ${order.address?.phone}\nOrder ID: ${order.id}\nAmount: ₹${order.total}`
      }
    };

    // If WHATSAPP_API_TOKEN is set in .env.local, call Meta WhatsApp Cloud API
    if (process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
      await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerPayload)
      });

      await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(merchantPayload)
      });
    }

    return NextResponse.json({
      success: true,
      message: `WhatsApp notifications triggered for Customer and Business (${merchantPhone})`,
      orderId: order.id
    });
  } catch (error) {
    console.error('WhatsApp API Error:', error);
    return NextResponse.json({ success: false, message: 'WhatsApp API server error' }, { status: 500 });
  }
}
