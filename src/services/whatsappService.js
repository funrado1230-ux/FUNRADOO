/**
 * FUNRADO WhatsApp Business & Dynamic UPI Service
 */

// Merchant Business WhatsApp Number
export const MERCHANT_WHATSAPP_NUMBER = '7090679912';
export const MERCHANT_UPI_ID = 'funrado@upi';
export const MERCHANT_GPAY_UPI_ID = 'funrado.gpay@okaxis';
export const MERCHANT_NAME = 'FUNRADO';

/**
 * Generate Dynamic UPI Pay String & QR Code Image URL
 */
export const generateDynamicUpiQrUrl = (amount, upiId = MERCHANT_UPI_ID, merchantName = MERCHANT_NAME) => {
  const upiPayload = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR`;
  // Use standard Google/QRServer API to render dynamic QR Code
  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(upiPayload)}`;
};

/**
 * Generate Dedicated Google Pay QR Code Image URL with GPay params
 */
export const generateGooglePayQrUrl = (amount, upiId = MERCHANT_GPAY_UPI_ID, merchantName = 'FUNRADO Luxury Store') => {
  const gpayPayload = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=FUNRADO%20Order`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(gpayPayload)}`;
};

/**
 * Get Google Pay Deep Link for mobile app switching
 */
export const getGooglePayDeepLink = (amount, upiId = MERCHANT_GPAY_UPI_ID, merchantName = 'FUNRADO Luxury Store') => {
  return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=FUNRADO%20Order`;
};

/**
 * Format Customer Confirmation WhatsApp Message
 */
export const generateCustomerWhatsAppMessage = (order) => {
  const addressStr = `${order.address?.street || 'Main Road'},\n${order.address?.city || 'City'}, ${order.address?.state || 'State'} - ${order.address?.pincode || ''}`;
  
  return `🎉 *Thank you for shopping with FUNRADO!*

Hello *${order.address?.fullName || 'Valued Customer'}*,

Your order has been placed successfully.

*Order ID:*
${order.id}

*Amount:*
₹${(order.total || 0).toLocaleString('en-IN')}

*Delivery Address:*
${addressStr}

We will dispatch your order soon.

Thank you ❤️
*Team FUNRADO*`;
};

/**
 * Format Merchant Alert WhatsApp Message for 7090679912
 */
export const generateMerchantWhatsAppMessage = (order) => {
  const itemsText = order.items && order.items.length > 0
    ? order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')
    : 'FUNRADO Luxury Products';

  return `🛒 *New Order Alert*

*Customer:*
${order.address?.fullName || 'Customer'}

*Phone:*
${order.address?.phone || 'N/A'}

*Order:*
${itemsText}

*Amount:*
₹${(order.total || 0).toLocaleString('en-IN')}

*Payment:*
Successful

*Address:*
${order.address?.city || 'City'}, ${order.address?.state || 'State'}`;
};

/**
 * Open Customer WhatsApp Deep Link
 */
export const openCustomerWhatsApp = (phone, order) => {
  let cleanPhone = phone ? String(phone).replace(/\D/g, '') : '';
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }
  const message = generateCustomerWhatsAppMessage(order);
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

/**
 * Open Merchant Order Alert WhatsApp Deep Link to 7090679912
 */
export const openMerchantWhatsAppAlert = (order) => {
  const merchantPhone = '91' + MERCHANT_WHATSAPP_NUMBER;
  const message = generateMerchantWhatsAppMessage(order);
  const url = `https://wa.me/${merchantPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

/**
 * Send Dual Notifications (Customer + Merchant 7090679912) via Backend API & Web Fallback
 */
export const dispatchOrderWhatsAppNotifications = async (order) => {
  try {
    // 1. Trigger Backend WhatsApp API endpoint if configured
    fetch('/api/whatsapp/send-order-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerPhone: order.address?.whatsappNumber || order.address?.phone,
        merchantPhone: MERCHANT_WHATSAPP_NUMBER,
        order
      })
    }).catch(err => console.log('Backend API notice:', err));

    // 2. Open Customer WhatsApp Confirmation Deep Link
    openCustomerWhatsApp(order.address?.whatsappNumber || order.address?.phone, order);

    // 3. Trigger Merchant Alert for 7090679912 after brief delay
    setTimeout(() => {
      openMerchantWhatsAppAlert(order);
    }, 1200);

  } catch (error) {
    console.error('WhatsApp Dispatch Error:', error);
  }
};

/**
 * Send General Custom WhatsApp Notification to Customer & Merchant
 */
export const sendWhatsAppNotification = ({ customerPhone, message }) => {
  let cleanPhone = customerPhone ? String(customerPhone).replace(/\D/g, '') : '';
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }
  const url = `https://wa.me/${cleanPhone || ('91' + MERCHANT_WHATSAPP_NUMBER)}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};
