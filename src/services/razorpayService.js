/**
 * Razorpay Payment Gateway Integration Service
 */

// Dynamically load Razorpay SDK script if not already present
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Open Razorpay Standard Checkout Popup
 */
export const displayRazorpayCheckout = async ({
  amount, // amount in INR
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onDismiss,
  onError
}) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    if (onError) onError('Failed to load Razorpay SDK. Please check your internet connection.');
    return;
  }

  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_FunradoDemoKey';

  const options = {
    key: razorpayKey,
    amount: Math.round(amount * 100), // convert to paise
    currency: 'INR',
    name: 'FUNRADO Luxury Store',
    description: 'Payment for Order #' + (orderId || 'FND-' + Date.now()),
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=120&h=120&fit=crop',
    order_id: orderId && orderId.startsWith('order_') ? orderId : undefined,
    handler: function (response) {
      console.log('Razorpay Payment Authorized:', response);
      if (onSuccess) {
        onSuccess({
          razorpayPaymentId: response.razorpay_payment_id || `pay_${Math.random().toString(36).substring(2, 14)}`,
          razorpayOrderId: response.razorpay_order_id || orderId || `order_${Math.random().toString(36).substring(2, 14)}`,
          razorpaySignature: response.razorpay_signature || `sig_${Math.random().toString(36).substring(2, 18)}`
        });
      }
    },
    prefill: {
      name: customerName || 'Valued Customer',
      email: customerEmail || 'customer@funrado.com',
      contact: customerPhone || '9876543210'
    },
    notes: {
      address: 'Funrado Luxury Express Delivery'
    },
    theme: {
      color: '#581C25',
      backdrop_color: 'rgba(20, 20, 20, 0.8)'
    },
    modal: {
      ondismiss: function () {
        if (onDismiss) onDismiss();
      }
    }
  };

  try {
    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', function (response) {
      console.error('Razorpay Payment Failed:', response.error);
      if (onError) onError(response.error.description || 'Payment transaction failed.');
    });
    paymentObject.open();
  } catch (err) {
    console.error('Razorpay Initialization Error:', err);
    if (onError) onError(err.message || 'Razorpay Gateway error.');
  }
};
