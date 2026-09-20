import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, CreditCard, Smartphone, Building2, Wallet, Banknote, 
  CheckCircle2, ArrowRight, ArrowLeft, Lock, Tag, Truck, MapPin, Sparkles, 
  HelpCircle, Copy, Check, Printer, FileText, MessageSquare, QrCode, Loader2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { displayRazorpayCheckout } from '../../services/razorpayService';
import { 
  generateDynamicUpiQrUrl, 
  generateGooglePayQrUrl,
  getGooglePayDeepLink,
  MERCHANT_GPAY_UPI_ID,
  dispatchOrderWhatsAppNotifications, 
  openCustomerWhatsApp, 
  openMerchantWhatsAppAlert,
  MERCHANT_UPI_ID,
  MERCHANT_NAME,
  MERCHANT_WHATSAPP_NUMBER 
} from '../../services/whatsappService';

const VALID_COUPONS = {
  'FUNRADO10': { type: 'percent', value: 10, description: '10% OFF on all luxury items' },
  'KIDDIGO10': { type: 'percent', value: 10, description: '10% OFF on all luxury items' },
  'LUXURY500': { type: 'flat', value: 500, description: '₹500 flat discount' },
  'WELCOME20': { type: 'percent', value: 20, description: '20% OFF Welcome Bonus' }
};

const POPULAR_BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', color: 'from-blue-900 to-blue-700' },
  { id: 'icici', name: 'ICICI Bank', color: 'from-orange-800 to-orange-600' },
  { id: 'sbi', name: 'State Bank of India', color: 'from-sky-700 to-blue-800' },
  { id: 'axis', name: 'Axis Bank', color: 'from-rose-900 to-pink-800' },
  { id: 'kotak', name: 'Kotak Mahindra', color: 'from-red-800 to-red-600' },
];

export const CheckoutModal = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartTotal, 
    placeOrder, 
    setIsTrackOrderOpen, 
    showToast 
  } = useStore();
  const { user } = useAuth();

  // Wizard Steps: 1 = Address, 2 = Order Review & Coupon, 3 = Payment Method, 4 = OTP Verification, 5 = Confirmation/Invoice
  const [step, setStep] = useState(1);

  // Address State
  const [address, setAddress] = useState({
    fullName: user?.displayName || user?.name || '',
    phone: user?.phoneNumber || '',
    whatsappNumber: user?.phoneNumber || '',
    sendWhatsAppUpdates: true,
    email: user?.email || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    type: 'Home',
    saveAddress: true
  });

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Payment Method State: 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Payment Details State
  const [upiOption, setUpiOption] = useState('gpay'); // 'gpay' | 'gpay_qr' | 'phonepe' | 'paytm' | 'vpa' | 'qr'
  const [vpaId, setVpaId] = useState('');
  const [gpayMode, setGpayMode] = useState('qr'); // 'qr' | 'pin'
  const [copiedGpayId, setCopiedGpayId] = useState(false);

  const handleCopyGpayVpa = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(MERCHANT_GPAY_UPI_ID);
    }
    setCopiedGpayId(true);
    showToast('Google Pay UPI ID copied to clipboard! 📋');
    setTimeout(() => setCopiedGpayId(false), 2000);
  };
  
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    saveCard: true
  });

  const [selectedBank, setSelectedBank] = useState('hdfc');
  const [selectedWallet, setSelectedWallet] = useState('amazonpay');

  // OTP Verification Simulation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(30);

  // Final Order State
  const [completedOrder, setCompletedOrder] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  // Reset steps on open
  useEffect(() => {
    if (isCheckoutOpen) {
      setStep(1);
      setOtp('');
      setIsProcessing(false);
      setOtpTimer(30);
    }
  }, [isCheckoutOpen]);

  // Timer countdown for OTP step
  useEffect(() => {
    let interval;
    if (step === 4 && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  if (!isCheckoutOpen) return null;

  // Pricing calculations
  const shippingFee = cartTotal >= 25000 || (appliedCoupon && appliedCoupon.type === 'percent') ? 0 : 250;
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round((cartTotal * appliedCoupon.value) / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const taxAmount = Math.round((cartTotal - discountAmount) * 0.18);
  const grandTotal = Math.max(0, cartTotal - discountAmount + shippingFee + taxAmount);

  // Coupon handling
  const handleApplyCoupon = (e) => {
    e?.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (VALID_COUPONS[cleanCode]) {
      setAppliedCoupon({ code: cleanCode, ...VALID_COUPONS[cleanCode] });
      setCouponError('');
      showToast(`Coupon "${cleanCode}" applied successfully! 🎉`);
    } else {
      setCouponError('Invalid coupon code. Try FUNRADO10 or LUXURY500');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    showToast('Coupon removed');
  };

  // Card input formatters
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
    setCardDetails(prev => ({ ...prev, number: formatted }));
  };

  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardDetails(prev => ({ ...prev, expiry: `${raw.slice(0, 2)}/${raw.slice(2)}` }));
    } else {
      setCardDetails(prev => ({ ...prev, expiry: raw }));
    }
  };

  // Card Brand Detection helper
  const getCardBrand = (num) => {
    const clean = num.replace(/\s/g, '');
    if (clean.startsWith('4')) return { brand: 'VISA', bg: 'from-blue-600 to-indigo-900' };
    if (/^5[1-5]/.test(clean)) return { brand: 'MASTERCARD', bg: 'from-red-600 to-amber-700' };
    if (/^3[47]/.test(clean)) return { brand: 'AMEX', bg: 'from-emerald-600 to-teal-900' };
    if (/^6/.test(clean)) return { brand: 'RUPAY', bg: 'from-cyan-700 to-blue-900' };
    return { brand: 'CARD', bg: 'from-stone-800 to-stone-900' };
  };

  // Initiate Payment Submission -> Opens selected payment app authorization window
  const handleInitiatePayment = () => {
    if (paymentMethod === 'cod') {
      executeOrderPlacement('Cash on Delivery (Pending)');
      return;
    }

    // Open dedicated app payment screen for chosen method (GPay, PhonePe, Paytm, Card, NetBanking, etc.)
    setStep(4);
    setOtpTimer(30);
    setOtp('');
  };

  // Complete OTP Verification
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      executeOrderPlacement('Paid Online (Verified 256-bit SSL)');
    }, 1800);
  };

  // Order Placement Execution
  const executeOrderPlacement = (paymentStatusText) => {
    const formattedPaymentStatus = paymentMethod === 'cod' ? 'Cash on Delivery' : (paymentStatusText.toLowerCase().includes('paid') ? 'Paid' : 'Pending');
    
    const formattedItems = cart.map((item, idx) => ({
      id: item.id || `item_${idx}`,
      name: item.name || 'FUNRADO Luxury Item',
      sku: item.sku || `SKU-${(item.name || 'PROD').slice(0, 3).toUpperCase()}-${item.id || idx + 100}`,
      price: item.price || item.sellingPrice || 0,
      originalPrice: item.originalPrice || Math.round((item.price || 0) * 1.25),
      discount: item.discount || (item.originalPrice ? item.originalPrice - item.price : 0),
      quantity: item.quantity || 1,
      selectedColor: item.selectedColor || 'Standard',
      selectedSize: item.selectedSize || 'One Size',
      image: item.image
    }));

    const newOrder = placeOrder({
      customerName: address.fullName || 'Customer',
      customerPhone: address.phone || 'N/A',
      customerEmail: address.email || 'N/A',
      address,
      shippingAddress: address,
      items: formattedItems,
      products: formattedItems,
      paymentMethod: paymentMethod.toUpperCase(),
      paymentStatus: formattedPaymentStatus,
      orderStatus: 'Order Received',
      status: 'Order Received',
      subtotal: cartTotal,
      discount: discountAmount,
      couponDiscount: discountAmount,
      shippingFee,
      taxAmount,
      totalAmount: grandTotal,
      total: grandTotal,
      couponUsed: appliedCoupon ? appliedCoupon.code : null,
      transactionRef: paymentMethod === 'cod' ? 'COD-PENDING' : `TXN-${Math.floor(100000000000 + Math.random() * 900000000000)}`
    });

    setCompletedOrder(newOrder);
    setStep(5);
    showToast('Payment successful! Order placed 🛍️');

    // Send WhatsApp Invoice if user kept WhatsApp updates enabled
    if (address.sendWhatsAppUpdates) {
      setTimeout(() => {
        openWhatsAppNotification(address.whatsappNumber || address.phone, newOrder);
      }, 600);
    }
  };

  const handleCopyOrderId = () => {
    if (completedOrder) {
      navigator.clipboard.writeText(completedOrder.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
      showToast('Order ID copied to clipboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      {/* Dark Blur Overlay */}
      <div 
        onClick={() => {
          if (step !== 4 && !isProcessing) setIsCheckoutOpen(false);
        }}
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-md transition-opacity animate-fade-in"
      />

      {/* Main Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-stone-200 flex flex-col max-h-[92vh] animate-scale-up">

        {/* Modal Header */}
        <div className="bg-[#581C25] text-white px-6 py-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-wide text-white flex items-center gap-2">
                Funrado Secure Checkout
                <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase">
                  256-Bit Encrypted
                </span>
              </h2>
              <p className="text-xs text-amber-100/70">Luxury express payment gateway</p>
            </div>
          </div>

          {step !== 5 && (
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Stepper Progress Bar */}
        {step <= 3 && (
          <div className="bg-stone-50 border-b border-stone-200 px-6 py-3">
            <div className="flex items-center justify-between max-w-xl mx-auto text-xs font-bold">
              
              {/* Step 1 */}
              <div 
                onClick={() => setStep(1)} 
                className={`flex items-center gap-2 cursor-pointer ${step >= 1 ? 'text-[#581C25]' : 'text-stone-400'}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-[#581C25] text-white font-extrabold' : 'bg-stone-200 text-stone-600'}`}>
                  1
                </div>
                <span className="hidden sm:inline">Address</span>
              </div>

              <div className={`flex-1 h-0.5 mx-3 ${step >= 2 ? 'bg-[#581C25]' : 'bg-stone-200'}`} />

              {/* Step 2 */}
              <div 
                onClick={() => setStep(2)} 
                className={`flex items-center gap-2 cursor-pointer ${step >= 2 ? 'text-[#581C25]' : 'text-stone-400'}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-[#581C25] text-white font-extrabold' : 'bg-stone-200 text-stone-600'}`}>
                  2
                </div>
                <span className="hidden sm:inline">Summary & Offer</span>
              </div>

              <div className={`flex-1 h-0.5 mx-3 ${step >= 3 ? 'bg-[#581C25]' : 'bg-stone-200'}`} />

              {/* Step 3 */}
              <div 
                onClick={() => setStep(3)} 
                className={`flex items-center gap-2 cursor-pointer ${step >= 3 ? 'text-[#581C25]' : 'text-stone-400'}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 3 ? 'bg-[#581C25] text-white font-extrabold' : 'bg-stone-200 text-stone-600'}`}>
                  3
                </div>
                <span className="hidden sm:inline">Payment Method</span>
              </div>

            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FAF9F6]">

          {/* STEP 1: ADDRESS INFORMATION */}
          {step === 1 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2 text-stone-900 font-extrabold text-base">
                  <MapPin className="w-5 h-5 text-[#581C25]" />
                  <h3>Delivery Shipping Address</h3>
                </div>
                <span className="text-xs text-stone-500 font-medium">Step 1 of 3</span>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. John Doe"
                      value={address.fullName} 
                      onChange={e => setAddress({ ...address, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-[#581C25] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                      <span>Mobile Number</span>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        💬 WhatsApp & SMS
                      </span>
                    </label>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. 9876543210"
                      value={address.phone} 
                      onChange={e => setAddress({ ...address, phone: e.target.value, whatsappNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-[#581C25] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. customer@example.com"
                    value={address.email} 
                    onChange={e => setAddress({ ...address, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-[#581C25] outline-none"
                  />
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="sendWhatsApp"
                    checked={address.sendWhatsAppUpdates}
                    onChange={e => setAddress({ ...address, sendWhatsAppUpdates: e.target.checked })}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                  <label htmlFor="sendWhatsApp" className="text-xs text-emerald-950 font-semibold cursor-pointer select-none">
                    Send Order Invoice & Live Delivery Tracking updates to my WhatsApp number 💬
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Flat, House no., Building, Apartment</label>
                  <input 
                    type="text" 
                    required
                    value={address.street} 
                    onChange={e => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-[#581C25] outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Pincode</label>
                    <input 
                      type="text" 
                      required
                      value={address.pincode} 
                      onChange={e => setAddress({ ...address, pincode: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-[#581C25] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
                    <input 
                      type="text" 
                      required
                      value={address.city} 
                      onChange={e => setAddress({ ...address, city: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-[#581C25] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">State</label>
                    <input 
                      type="text" 
                      required
                      value={address.state} 
                      onChange={e => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-[#581C25] outline-none"
                    />
                  </div>
                </div>

                {/* Address Type selection */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Address Type</label>
                  <div className="flex gap-3">
                    {['Home', 'Office', 'Other'].map(t => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setAddress({ ...address, type: t })}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          address.type === t 
                            ? 'bg-[#581C25] text-white border-[#581C25]' 
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#581C25] text-white hover:bg-[#701A28] px-8 py-3.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all"
                  >
                    <span>Proceed to Order Summary</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: ORDER REVIEW & COUPON */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-4xl mx-auto">
              
              {/* Left Column: Items */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <h3 className="font-extrabold text-stone-900 text-sm">Order Items ({cart.length})</h3>
                  <button onClick={() => setStep(1)} className="text-xs text-[#581C25] font-bold hover:underline flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Edit Address
                  </button>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {cart.map(item => (
                    <div key={item.id} className="p-3 bg-white rounded-2xl border border-stone-200 flex gap-3 items-center">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl border border-stone-100 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{item.name}</h4>
                        <p className="text-[11px] text-stone-500 font-medium">Qty: {item.quantity}</p>
                        <p className="text-xs font-extrabold text-stone-900 mt-0.5">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Badge */}
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                  <Truck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-extrabold text-emerald-900">Guaranteed Express Delivery</p>
                    <p className="text-emerald-700 text-[11px]">Dispatches in 12 hrs via Funrado Prime Air</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Pricing & Coupon */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Coupon Code Box */}
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-stone-900">
                    <Tag className="w-4 h-4 text-[#581C25]" />
                    <span>Apply Promo Code / Voucher</span>
                  </div>

                  {appliedCoupon ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-extrabold text-emerald-900">{appliedCoupon.code}</span>
                        <p className="text-[10px] text-emerald-700">{appliedCoupon.description}</p>
                      </div>
                      <button onClick={handleRemoveCoupon} className="text-xs text-red-600 font-bold hover:underline">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. FUNRADO10"
                          value={couponCode}
                          onChange={e => setCouponCode(e.target.value)}
                          className="flex-1 px-3 py-2 border border-stone-300 rounded-xl text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-[#581C25]"
                        />
                        <button
                          type="submit"
                          className="bg-[#581C25] text-white text-xs font-extrabold px-4 py-2 rounded-xl hover:bg-[#701A28] transition-colors"
                        >
                          Apply
                        </button>
                      </form>
                      {couponError && <p className="text-[11px] text-red-600 mt-1 font-semibold">{couponError}</p>}
                      <div className="mt-2 flex gap-1.5">
                        <span 
                          onClick={() => { setCouponCode('FUNRADO10'); handleApplyCoupon(); }} 
                          className="text-[10px] bg-stone-100 hover:bg-stone-200 border border-stone-200 px-2 py-0.5 rounded-md cursor-pointer font-bold text-stone-700"
                        >
                          FUNRADO10 (10% OFF)
                        </span>
                        <span 
                          onClick={() => { setCouponCode('LUXURY500'); handleApplyCoupon(); }} 
                          className="text-[10px] bg-stone-100 hover:bg-stone-200 border border-stone-200 px-2 py-0.5 rounded-md cursor-pointer font-bold text-stone-700"
                        >
                          LUXURY500 (₹500 OFF)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-2 text-xs">
                  <h4 className="font-extrabold text-stone-900 pb-2 border-b border-stone-100">Bill Breakdown</h4>
                  
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-stone-900">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Discount ({appliedCoupon?.code})</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-stone-600">
                    <span>Express Air Shipping</span>
                    <span className="font-bold text-emerald-600">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                  </div>

                  <div className="flex justify-between text-stone-600">
                    <span>GST (18% Itemized)</span>
                    <span className="font-bold text-stone-900">₹{taxAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-3 border-t border-stone-200">
                    <span>Grand Total</span>
                    <span className="text-[#581C25]">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep(3)}
                  className="w-full bg-[#581C25] hover:bg-[#701A28] text-white font-extrabold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <span>Select Payment Method</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: PAYMENT METHOD SELECTION */}
          {step === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-4xl mx-auto">
              
              {/* Left Column: Active Payment Gateway Badge */}
              <div className="lg:col-span-4 space-y-3">
                <h3 className="font-extrabold text-stone-900 text-sm mb-3">Active Payment Gateway</h3>

                <div className="p-4 rounded-2xl bg-[#581C25] text-white border border-[#581C25] shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-amber-300" />
                    <div>
                      <p className="text-xs font-extrabold">UPI / Google Pay / PhonePe</p>
                      <span className="text-[10px] text-amber-100/80">
                        Instant 0% Convenience Fee
                      </span>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full border border-amber-300 bg-amber-300 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#581C25]" />
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    100% Direct UPI Payment
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Supports Google Pay, PhonePe, Paytm, BHIM, and all Indian bank UPI apps with 0% extra fee.
                  </p>
                </div>
              </div>

              {/* Right Column: UPI Options & Dynamic QR */}
              <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between">
                
                <div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                      <h4 className="text-xs font-extrabold text-stone-900 flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        Pay via UPI & Instant QR Scan
                      </h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Zero Convenience Fee
                      </span>
                    </div>

                    {/* Quick UPI Options */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'gpay', name: 'Google Pay App', sub: 'Direct GPay Switch' },
                        { id: 'gpay_qr', name: 'Google Pay QR', sub: 'Scan GPay QR Code' },
                        { id: 'phonepe', name: 'PhonePe', sub: 'Fast & Secure' },
                        { id: 'paytm', name: 'Paytm UPI', sub: 'One Tap Pay' },
                        { id: 'bhim', name: 'BHIM UPI', sub: 'Direct Bank Pay' },
                        { id: 'qr', name: 'Scan Any QR', sub: 'Dynamic UPI QR' },
                        { id: 'vpa', name: 'Enter UPI ID', sub: 'VPA Identifier' },
                      ].map(u => (
                        <div
                          key={u.id}
                          onClick={() => setUpiOption(u.id)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                            upiOption === u.id 
                              ? 'border-blue-600 bg-blue-50/60 shadow-sm font-bold ring-1 ring-blue-500/30' 
                              : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <p className="text-xs font-bold text-stone-900 flex items-center gap-1">
                            {(u.id === 'gpay' || u.id === 'gpay_qr') && (
                              <span className="text-[10px] bg-blue-600 text-white font-extrabold px-1 rounded">G</span>
                            )}
                            {u.name}
                          </p>
                          <p className="text-[9px] text-stone-500">{u.sub}</p>
                        </div>
                      ))}
                    </div>

                    {/* DEDICATED GOOGLE PAY QR CODE BOX */}
                    {(upiOption === 'gpay' || upiOption === 'gpay_qr') && (
                      <div className="p-4 bg-gradient-to-b from-blue-50/80 via-indigo-50/50 to-stone-50 rounded-2xl border border-blue-200 text-center space-y-3 shadow-sm relative overflow-hidden">
                        {/* Top Google Colors Accent Line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />

                        <div className="flex items-center justify-center gap-2 pt-1">
                          <div className="px-2.5 py-1 bg-white text-blue-600 font-extrabold text-xs rounded-lg shadow-sm border border-blue-100 flex items-center gap-1">
                            <span className="font-mono text-sm tracking-tighter text-blue-600">G</span>
                            <span className="font-sans text-xs text-stone-800 font-extrabold">Pay</span>
                          </div>
                          <span className="text-xs font-black text-stone-900">Google Pay Dynamic QR Code</span>
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            0% Fee
                          </span>
                        </div>

                        <div className="bg-white p-3.5 rounded-2xl border border-blue-100 inline-block shadow-md relative group">
                          <img 
                            src={generateGooglePayQrUrl(grandTotal, MERCHANT_GPAY_UPI_ID, 'FUNRADO Luxury Store')} 
                            alt="Google Pay Dynamic QR Code" 
                            className="w-44 h-44 object-contain mx-auto"
                          />
                          <div className="absolute inset-0 bg-blue-900/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                            <span className="bg-blue-600 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-lg">
                              Ready to Scan with GPay
                            </span>
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-stone-200 text-[11px] text-stone-700 space-y-1.5 text-left max-w-xs mx-auto shadow-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-stone-500 font-bold">Merchant Name:</span>
                            <span className="font-extrabold text-stone-900">FUNRADO Luxury Store</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-stone-500 font-bold">Payable Amount:</span>
                            <span className="font-black text-[#581C25] text-xs">₹{grandTotal.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between items-center pt-1 border-t border-stone-100">
                            <span className="text-stone-500 font-bold">Google Pay VPA:</span>
                            <div className="flex items-center gap-1">
                              <span className="font-mono font-bold text-blue-700 text-[10px]">{MERCHANT_GPAY_UPI_ID}</span>
                              <button
                                type="button"
                                onClick={handleCopyGpayVpa}
                                className="text-stone-400 hover:text-blue-600 p-0.5"
                                title="Copy GPay UPI ID"
                              >
                                {copiedGpayId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-1">
                          <a
                            href={getGooglePayDeepLink(grandTotal, MERCHANT_GPAY_UPI_ID, 'FUNRADO Luxury Store')}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all"
                          >
                            <span>Open in Google Pay App</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        </div>

                        <p className="text-[10px] text-stone-500 font-medium">
                          Scan with Google Pay app camera or tap "Pay & Confirm" below to authorize!
                        </p>
                      </div>
                    )}

                    {/* Generic Dynamic UPI QR Code Box for other options */}
                    {upiOption !== 'gpay' && upiOption !== 'gpay_qr' && (
                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-3">
                        <div className="flex items-center justify-center gap-2 text-xs font-extrabold text-stone-900">
                          <QrCode className="w-4 h-4 text-[#581C25]" />
                          <span>Scan Dynamic UPI QR Code</span>
                        </div>

                        <div className="bg-white p-3 rounded-2xl border border-stone-200 inline-block shadow-md">
                          <img 
                            src={generateDynamicUpiQrUrl(grandTotal, MERCHANT_UPI_ID, MERCHANT_NAME)} 
                            alt="Dynamic FUNRADO UPI QR Code" 
                            className="w-40 h-40 object-contain mx-auto"
                          />
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-stone-200 text-[11px] text-stone-700 space-y-1 text-left max-w-xs mx-auto">
                          <div className="flex justify-between">
                            <span className="text-stone-500 font-bold">Merchant Name:</span>
                            <span className="font-extrabold text-stone-900">{MERCHANT_NAME}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-500 font-bold">Payable Amount:</span>
                            <span className="font-black text-[#581C25]">₹{grandTotal.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-500 font-bold">UPI ID:</span>
                            <span className="font-mono font-bold text-emerald-700">{MERCHANT_UPI_ID}</span>
                          </div>
                        </div>

                        <p className="text-[10px] text-stone-500 font-medium">
                          Scan with GPay, PhonePe, Paytm or BHIM. Merchant name & amount fill automatically!
                        </p>
                      </div>
                    )}

                    {/* VPA ID Input if chosen */}
                    {upiOption === 'vpa' && (
                      <div className="pt-1">
                        <label className="block text-xs font-bold text-stone-700 mb-1">Enter your UPI ID (VPA)</label>
                        <input
                          type="text"
                          placeholder="e.g. funrado@upi or 9876543210@ybl"
                          value={vpaId}
                          onChange={e => setVpaId(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#581C25]"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Final Pay Button */}
                <div className="pt-6 border-t border-stone-200 space-y-2">
                  <button
                    onClick={handleInitiatePayment}
                    className={`w-full text-white font-extrabold text-sm py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all ${
                      upiOption === 'gpay' || upiOption === 'gpay_qr'
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                        : 'bg-[#581C25] hover:bg-[#701A28]'
                    }`}
                  >
                    {upiOption === 'gpay' || upiOption === 'gpay_qr' ? (
                      <>
                        <QrCode className="w-4 h-4 text-amber-300" />
                        <span>Proceed with Google Pay QR (₹{grandTotal.toLocaleString('en-IN')})</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-amber-400" />
                        <span>Pay ₹{grandTotal.toLocaleString('en-IN')} via UPI & Confirm Order</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Protected by 256-Bit Bank Level Encryption</span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* STEP 4: DEDICATED PAYMENT APP AUTHORIZATION WINDOW */}
          {step === 4 && (
            <div className="max-w-md mx-auto py-2 space-y-4">
              
              {/* GOOGLE PAY APP & QR CODE GATEWAY WINDOW */}
              {paymentMethod === 'upi' && (upiOption === 'gpay' || upiOption === 'gpay_qr') && (
                <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden animate-scale-up">
                  {/* Google Pay Header with GPay Multi-color accent */}
                  <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white p-5 text-center relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />
                    <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-md mx-auto mb-2 border border-blue-100">
                      GPay
                    </div>
                    <h3 className="text-base font-extrabold flex items-center justify-center gap-1.5">
                      <span>Google Pay Gateway</span>
                      <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">UPI Verified</span>
                    </h3>
                    <p className="text-xs text-blue-100 opacity-90">FUNRADO Luxury Store Official Merchant</p>
                    <span className="text-[10px] bg-white/20 px-2.5 py-0.5 rounded-full mt-2 inline-block font-mono tracking-wider">
                      {MERCHANT_GPAY_UPI_ID}
                    </span>
                  </div>

                  {/* Mode Switcher: QR Code vs PIN */}
                  <div className="flex border-b border-stone-200 bg-stone-50">
                    <button
                      type="button"
                      onClick={() => setGpayMode('qr')}
                      className={`flex-1 py-3 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all border-b-2 ${
                        gpayMode === 'qr' 
                          ? 'border-blue-600 text-blue-600 bg-white shadow-xs' 
                          : 'border-transparent text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Scan Google Pay QR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGpayMode('pin')}
                      className={`flex-1 py-3 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all border-b-2 ${
                        gpayMode === 'pin' 
                          ? 'border-blue-600 text-blue-600 bg-white shadow-xs' 
                          : 'border-transparent text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Enter GPay UPI PIN</span>
                    </button>
                  </div>

                  <div className="p-6 space-y-5">
                    <div className="text-center pb-3 border-b border-stone-100 flex items-center justify-between">
                      <div className="text-left">
                        <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">Total Payable Amount</span>
                        <span className="text-2xl font-black text-stone-900">₹{grandTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        0% Fee
                      </span>
                    </div>

                    {/* MODE 1: GOOGLE PAY QR CODE SCAN */}
                    {gpayMode === 'qr' && (
                      <div className="space-y-4">
                        <div className="bg-gradient-to-b from-blue-50/70 to-stone-50 p-4 rounded-2xl border border-blue-200 text-center space-y-3">
                          <div className="inline-block p-3 bg-white rounded-2xl border-2 border-blue-500/30 shadow-lg relative">
                            <img
                              src={generateGooglePayQrUrl(grandTotal, MERCHANT_GPAY_UPI_ID, 'FUNRADO Luxury Store')}
                              alt="Google Pay QR Code"
                              className="w-48 h-48 object-contain mx-auto"
                            />
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md tracking-wider flex items-center gap-1">
                              <span>GPay QR Code</span>
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-stone-200 text-left text-xs space-y-1.5 shadow-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-stone-500 font-bold">Merchant UPI ID:</span>
                              <div className="flex items-center gap-1">
                                <span className="font-mono font-bold text-blue-700 text-[11px]">{MERCHANT_GPAY_UPI_ID}</span>
                                <button
                                  type="button"
                                  onClick={handleCopyGpayVpa}
                                  className="text-stone-400 hover:text-blue-600 p-0.5"
                                  title="Copy GPay UPI ID"
                                >
                                  {copiedGpayId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center pt-1 border-t border-stone-100">
                              <span className="text-stone-500 font-bold">Payment Status:</span>
                              <span className="font-extrabold text-amber-600 text-[11px] flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                                Waiting for GPay Scan
                              </span>
                            </div>
                          </div>

                          {/* Steps to Pay */}
                          <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-200/70 text-[11px] text-blue-900 text-left space-y-1">
                            <p className="font-extrabold text-blue-950">How to Pay with Google Pay QR:</p>
                            <ol className="list-decimal list-inside space-y-0.5 text-blue-900 font-medium">
                              <li>Open <strong>Google Pay</strong> app on your mobile device.</li>
                              <li>Tap <strong>"Scan any QR code"</strong> on the home screen.</li>
                              <li>Scan this code & authorize <strong>₹{grandTotal.toLocaleString('en-IN')}</strong>.</li>
                            </ol>
                          </div>
                        </div>

                        {isProcessing ? (
                          <div className="py-6 text-center space-y-3">
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-xs font-extrabold text-stone-800">Verifying Google Pay Payment Authorization...</p>
                            <p className="text-[10px] text-stone-500">Communicating with Google Pay node</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <button
                              type="button"
                              onClick={() => {
                                setIsProcessing(true);
                                setTimeout(() => {
                                  setIsProcessing(false);
                                  executeOrderPlacement('Paid via Google Pay QR (Verified 256-bit SSL)');
                                }, 1800);
                              }}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                              <span>I've Completed Payment via GPay QR</span>
                            </button>

                            <a
                              href={getGooglePayDeepLink(grandTotal, MERCHANT_GPAY_UPI_ID, 'FUNRADO Luxury Store')}
                              className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                            >
                              <span>Open Google Pay App Directly</span>
                              <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* MODE 2: ENTER GOOGLE PAY PIN */}
                    {gpayMode === 'pin' && (
                      <div className="space-y-4">
                        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-stone-500 text-[10px] font-bold block">Payment Account</span>
                            <span className="font-extrabold text-stone-900">HDFC Bank Savings •••• 5821</span>
                          </div>
                          <span className="text-emerald-600 font-bold text-[10px] bg-emerald-100 px-2 py-0.5 rounded-md">Primary</span>
                        </div>

                        {isProcessing ? (
                          <div className="py-6 text-center space-y-3">
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                            <p className="text-xs font-extrabold text-stone-800">Connecting to Google Pay UPI Server...</p>
                          </div>
                        ) : (
                          <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-stone-700 text-center mb-2">
                                Enter 4-Digit Google Pay UPI PIN
                              </label>
                              <input
                                type="password"
                                maxLength={4}
                                required
                                placeholder="••••"
                                value={otp}
                                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="w-full text-center tracking-[0.8em] text-2xl font-mono font-extrabold px-4 py-3 rounded-2xl border border-stone-300 outline-none focus:ring-2 focus:ring-blue-600"
                              />
                            </div>

                            <button
                              type="submit"
                              disabled={otp.length < 4}
                              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                              <span>PAY ₹{grandTotal.toLocaleString('en-IN')} WITH GOOGLE PAY</span>
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    <div className="text-center pt-2">
                      <button onClick={() => setStep(3)} className="text-xs text-stone-400 hover:text-stone-700 font-semibold">
                        ← Change Payment Method
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* PHONEPE APP WINDOW */}
              {paymentMethod === 'upi' && upiOption === 'phonepe' && (
                <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden animate-scale-up">
                  <div className="bg-[#5f259f] text-white p-5 text-center relative">
                    <div className="w-12 h-12 bg-white text-[#5f259f] rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-md mx-auto mb-2">
                      पे
                    </div>
                    <h3 className="text-base font-extrabold">PhonePe Direct Pay</h3>
                    <p className="text-xs text-purple-200">Merchant: FUNRADO STORE</p>
                  </div>

                  <div className="p-6 space-y-5">
                    <div className="text-center pb-3 border-b border-stone-100">
                      <span className="text-xs text-stone-500 font-bold uppercase tracking-wider block">Paying Amount</span>
                      <span className="text-2xl font-black text-stone-900">₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-purple-700 text-[10px] font-bold block">Debit From</span>
                        <span className="font-extrabold text-stone-900">State Bank of India •••• 9814</span>
                      </div>
                      <span className="text-purple-900 font-bold text-[10px] bg-purple-200 px-2 py-0.5 rounded-md">UPI Bank</span>
                    </div>

                    {isProcessing ? (
                      <div className="py-6 text-center space-y-3">
                        <div className="w-10 h-10 border-4 border-[#5f259f] border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-xs font-extrabold text-stone-800">Processing PhonePe Instant Payment...</p>
                      </div>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 text-center mb-2">
                            Enter 4-Digit UPI PIN
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            required
                            placeholder="••••"
                            value={otp}
                            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full text-center tracking-[0.8em] text-2xl font-mono font-extrabold px-4 py-3 rounded-2xl border border-purple-300 outline-none focus:ring-2 focus:ring-[#5f259f]"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={otp.length < 4}
                          className="w-full bg-[#5f259f] hover:bg-purple-900 disabled:opacity-50 text-white font-extrabold text-xs py-4 rounded-2xl transition-all shadow-lg"
                        >
                          PAY ₹{grandTotal.toLocaleString('en-IN')} ON PHONEPE
                        </button>
                      </form>
                    )}

                    <div className="text-center">
                      <button onClick={() => setStep(3)} className="text-xs text-stone-400 hover:text-stone-700 font-semibold">
                        ← Choose Another Payment App
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* PAYTM UPI APP WINDOW */}
              {paymentMethod === 'upi' && upiOption === 'paytm' && (
                <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden animate-scale-up">
                  <div className="bg-[#002e6e] text-white p-5 text-center relative">
                    <div className="w-12 h-12 bg-white text-[#002e6e] rounded-2xl flex items-center justify-center font-black text-xs shadow-md mx-auto mb-2">
                      Paytm
                    </div>
                    <h3 className="text-base font-extrabold">Paytm Instant Checkout</h3>
                    <p className="text-xs text-sky-200">Merchant: FUNRADO RETAIL PVT LTD</p>
                  </div>

                  <div className="p-6 space-y-5">
                    <div className="text-center pb-3 border-b border-stone-100">
                      <span className="text-xs text-stone-500 font-bold uppercase tracking-wider block">Payable Amount</span>
                      <span className="text-2xl font-black text-stone-900">₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-sky-800 text-[10px] font-bold block">Payment Source</span>
                        <span className="font-extrabold text-stone-900">Paytm Payments Bank •••• 1042</span>
                      </div>
                      <span className="text-sky-900 font-bold text-[10px] bg-sky-200 px-2 py-0.5 rounded-md">Verified</span>
                    </div>

                    {isProcessing ? (
                      <div className="py-6 text-center space-y-3">
                        <div className="w-10 h-10 border-4 border-[#002e6e] border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-xs font-extrabold text-stone-800">Authorizing via Paytm Secure Node...</p>
                      </div>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 text-center mb-2">
                            Enter 4-Digit Paytm Security PIN
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            required
                            placeholder="••••"
                            value={otp}
                            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full text-center tracking-[0.8em] text-2xl font-mono font-extrabold px-4 py-3 rounded-2xl border border-sky-300 outline-none focus:ring-2 focus:ring-[#002e6e]"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={otp.length < 4}
                          className="w-full bg-[#002e6e] hover:bg-sky-950 disabled:opacity-50 text-white font-extrabold text-xs py-4 rounded-2xl transition-all shadow-lg"
                        >
                          PAY SECURELY ₹{grandTotal.toLocaleString('en-IN')}
                        </button>
                      </form>
                    )}

                    <div className="text-center">
                      <button onClick={() => setStep(3)} className="text-xs text-stone-400 hover:text-stone-700 font-semibold">
                        ← Change Payment Method
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* VPA / UPI COLLECT REQUEST WINDOW */}
              {paymentMethod === 'upi' && upiOption === 'vpa' && (
                <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 text-center space-y-5 animate-scale-up">
                  <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto border border-amber-300">
                    <Smartphone className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-stone-900">UPI Collect Request Dispatched</h3>
                    <p className="text-xs text-stone-600 mt-1">
                      A payment request of <strong>₹{grandTotal.toLocaleString('en-IN')}</strong> has been sent to VPA ID:
                    </p>
                    <span className="inline-block mt-2 font-mono font-bold text-xs bg-stone-100 px-3 py-1 rounded-xl text-[#581C25] border border-stone-200">
                      {vpaId || 'alexander@okaxis'}
                    </span>
                  </div>

                  {isProcessing ? (
                    <div className="py-6 text-center space-y-3">
                      <div className="w-10 h-10 border-4 border-[#581C25] border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs font-extrabold text-stone-800">Payment approved on your mobile app! Verifying...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-semibold">
                        Open Google Pay / PhonePe / BHIM on your phone and accept the collect request before timer expires ({otpTimer}s).
                      </div>

                      <button
                        onClick={handleVerifyOtp}
                        className="w-full bg-[#581C25] hover:bg-[#701A28] text-white font-extrabold text-xs py-4 rounded-2xl shadow-lg transition-all"
                      >
                        Simulate Approval from App
                      </button>
                    </div>
                  )}

                  <div className="text-center">
                    <button onClick={() => setStep(3)} className="text-xs text-stone-400 hover:text-stone-700 font-semibold">
                      ← Cancel Request
                    </button>
                  </div>
                </div>
              )}

              {/* Razorpay SDK Direct Popup Option */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    displayRazorpayCheckout({
                      amount: grandTotal,
                      orderId: `KDG-${Date.now()}`,
                      customerName: address.fullName,
                      customerEmail: address.email,
                      customerPhone: address.phone,
                      onSuccess: (paymentData) => {
                        showToast('Razorpay Payment Authorized! 💳');
                        executeOrderPlacement(`Paid via Razorpay (${paymentData.razorpayPaymentId})`);
                      },
                      onDismiss: () => showToast('Razorpay modal closed'),
                      onError: (err) => showToast(`Razorpay Note: ${err}`)
                    });
                  }}
                  className="text-[11px] text-[#581C25] font-extrabold hover:underline"
                >
                  ⚡ Or Open Razorpay Standard SDK Popup
                </button>
              </div>

            </div>
          )}

          {/* STEP 5: ORDER SUCCESS & OFFICIAL TAX INVOICE WITH PDF DOWNLOAD */}
          {step === 5 && completedOrder && (
            <div className="max-w-3xl mx-auto space-y-6 py-2">
              
              {/* Success Notification Bar & PDF Download Bar */}
              <div className="bg-emerald-900/90 text-white p-5 rounded-3xl border border-emerald-700/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 no-print animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500 text-stone-950 rounded-2xl flex items-center justify-center font-extrabold shadow-md flex-shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <span>Payment Successful ✅</span>
                      <span className="text-xs bg-emerald-700/60 font-mono text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                        #{completedOrder.id}
                      </span>
                    </h3>
                    <p className="text-xs text-emerald-100/90">
                      Your official product bill invoice is generated and ready to download.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 sm:flex-initial bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-stone-950" />
                    <span>Print / Save PDF Bill</span>
                  </button>

                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="bg-emerald-800 hover:bg-emerald-700 text-emerald-100 p-3 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
                    title="Close Checkout"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* OFFICIAL TAX INVOICE SHEET (Matching User Screenshot Reference) */}
              <div className="printable-invoice bg-white text-stone-900 p-8 rounded-3xl border border-stone-200 shadow-2xl space-y-6 select-text font-sans">
                
                {/* Invoice Header */}
                <div className="flex justify-between items-start border-b border-stone-200 pb-6">
                  <div>
                    <div className="text-2xl font-black text-[#581C25] tracking-tight">FUNRADO</div>
                    <p className="text-xs text-stone-500 font-semibold mt-0.5">Luxury Kids Ride-Ons & Toys</p>
                    <p className="text-[11px] text-stone-500 mt-1">GSTIN: 27AAAAA0000A1Z5 • Support: care@funrado.com</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black uppercase text-stone-400 tracking-wider">TAX INVOICE</div>
                    <div className="text-lg font-extrabold font-mono text-stone-900">#{completedOrder.id || completedOrder.orderNumber}</div>
                    <p className="text-xs text-stone-500 mt-1">Date: {new Date(completedOrder.createdAt || Date.now()).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>

                {/* Customer & Destination Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  
                  {/* Customer Billing Info */}
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1">
                    <h5 className="font-extrabold uppercase text-[10px] tracking-wider text-stone-500">CUSTOMER & BILLING INFO</h5>
                    <p className="font-extrabold text-stone-900 text-sm leading-tight">
                      {completedOrder.address?.fullName || completedOrder.customerName || 'Valued Customer'}
                    </p>
                    <p className="text-stone-600 font-mono">{completedOrder.address?.phone || completedOrder.customerPhone || 'N/A'}</p>
                    <p className="text-stone-600 truncate">{completedOrder.address?.email || completedOrder.customerEmail || ''}</p>
                  </div>

                  {/* Shipping Destination */}
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1">
                    <h5 className="font-extrabold uppercase text-[10px] tracking-wider text-stone-500">SHIPPING DESTINATION</h5>
                    <p className="font-extrabold text-stone-900 leading-tight">
                      {completedOrder.address?.street || completedOrder.shippingAddress?.street || 'Address Street'}
                    </p>
                    <p className="text-stone-600">
                      {completedOrder.address?.city || completedOrder.shippingAddress?.city || 'City'}, {completedOrder.address?.state || completedOrder.shippingAddress?.state || 'State'}
                    </p>
                    <p className="font-mono text-stone-900 font-bold">
                      Pincode: {completedOrder.address?.pincode || completedOrder.shippingAddress?.pincode || 'N/A'}
                    </p>
                  </div>

                </div>

                {/* Products Table */}
                <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-50 text-stone-600 uppercase font-bold text-[10px] border-b border-stone-200">
                        <th className="py-3.5 px-4">ITEM & SKU</th>
                        <th className="py-3.5 px-4 text-center">COLOR / SIZE</th>
                        <th className="py-3.5 px-4 text-center">QTY</th>
                        <th className="py-3.5 px-4 text-right">UNIT PRICE</th>
                        <th className="py-3.5 px-4 text-right">AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-800 font-medium">
                      {(completedOrder.items || completedOrder.products || []).map((item, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-extrabold text-stone-900 text-xs">{item.name}</div>
                            <div className="text-[10px] font-mono text-stone-400 mt-0.5">
                              {item.sku || `SKU-FUN-${item.id || idx + 100}`}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center text-stone-600 text-[11px]">
                            {item.selectedColor || 'Standard'} / {item.selectedSize || 'One Size'}
                          </td>
                          <td className="py-3.5 px-4 text-center font-black font-mono text-stone-900">
                            {item.quantity || 1}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-stone-700">
                            ₹{(item.price || item.sellingPrice || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4 text-right font-black font-mono text-stone-900">
                            ₹{((item.price || item.sellingPrice || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bottom Breakdown & Payment Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="text-xs space-y-2">
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl font-medium">
                      <span className="font-black text-emerald-950 block text-xs mb-1">Payment Verification Info:</span>
                      <p>Method: <strong className="text-stone-900">{completedOrder.paymentMethod || 'UPI'}</strong></p>
                      <p>Status: <strong className="text-emerald-700 bg-emerald-200/60 px-2 py-0.5 rounded text-[10px] uppercase">{completedOrder.paymentStatus || 'Paid'}</strong></p>
                      <p className="font-mono text-[10px] text-emerald-800 mt-1">Transaction Ref: {completedOrder.transactionRef || 'N/A'}</p>
                    </div>
                    <p className="text-[10px] text-stone-400 italic">
                      This is an official computer generated Tax Invoice issued by FUNRADO Luxury Store.
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-stone-700 font-medium">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-extrabold text-stone-900">₹{Number(completedOrder.subtotal || completedOrder.totalAmount || 0).toLocaleString('en-IN')}</span>
                    </div>

                    {completedOrder.discount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Discount {completedOrder.couponUsed ? `(${completedOrder.couponUsed})` : ''}:</span>
                        <span className="font-extrabold">-₹{Number(completedOrder.discount).toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Delivery Charges:</span>
                      <span className="font-extrabold text-emerald-600">{completedOrder.shippingFee === 0 ? 'FREE' : `₹${completedOrder.shippingFee}`}</span>
                    </div>

                    {completedOrder.taxAmount > 0 && (
                      <div className="flex justify-between">
                        <span>GST (18% Itemized):</span>
                        <span className="font-extrabold text-stone-800">₹{Number(completedOrder.taxAmount).toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm font-black text-[#581C25] pt-3 border-t border-stone-300">
                      <span>Grand Total Amount:</span>
                      <span className="font-mono text-base">₹{Number(completedOrder.totalAmount || completedOrder.total || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Navigation & Messaging Toolbar (Hidden when printing) */}
              <div className="pt-2 flex flex-col gap-2.5 no-print">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-stone-950" />
                    <span>Download / Save Bill PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      openCustomerWhatsApp(completedOrder.address?.whatsappNumber || completedOrder.address?.phone, completedOrder);
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-100" />
                    <span>WhatsApp Receipt 💬</span>
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setIsTrackOrderOpen(true);
                    }}
                    className="flex-1 bg-[#581C25] hover:bg-[#701A28] text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Truck className="w-4 h-4 text-amber-300" />
                    <span>Track Order Live</span>
                  </button>

                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="bg-stone-100 border border-stone-300 hover:bg-stone-200 text-stone-800 font-extrabold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
