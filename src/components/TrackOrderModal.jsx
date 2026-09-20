import React, { useState } from 'react';
import { X, Package, Search, Truck, CheckCircle2, FileText } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const TrackOrderModal = () => {
  const { isTrackOrderOpen, setIsTrackOrderOpen, orders, showToast } = useStore();
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [trackedResult, setTrackedResult] = useState(null);

  if (!isTrackOrderOpen) return null;

  const handleTrack = (e) => {
    e.preventDefault();
    const queryId = orderId.trim().toUpperCase();
    const queryEmail = email.trim().toLowerCase();

    if (!queryId && !queryEmail) return;

    const matchedOrder = orders.find(o => {
      const matchId = (o.id || o.orderNumber || o._id || '').toUpperCase().includes(queryId);
      const matchEmail = (o.customerEmail || o.address?.email || '').toLowerCase() === queryEmail;
      return (queryId && matchId) || (queryEmail && matchEmail);
    });

    if (matchedOrder) {
      const currentStatus = matchedOrder.orderStatus || matchedOrder.status || 'Order Received';
      
      const stepsList = [
        'Order Received',
        'Confirmed',
        'Processing',
        'Packed',
        'Shipped',
        'Out for Delivery',
        'Delivered'
      ];
      
      let activeIndex = stepsList.indexOf(currentStatus);
      if (activeIndex === -1) activeIndex = 1; // Default fallback

      const steps = stepsList.map((st, idx) => ({
        title: st,
        date: idx <= activeIndex ? (idx === activeIndex ? 'Current Status' : 'Completed') : 'Pending',
        done: idx <= activeIndex
      }));

      setTrackedResult({
        id: matchedOrder.id || matchedOrder.orderNumber,
        status: currentStatus,
        paymentStatus: matchedOrder.paymentStatus || 'Pending',
        amount: Number(matchedOrder.totalAmount || matchedOrder.total || 0).toLocaleString('en-IN'),
        expected: matchedOrder.estimatedDelivery || '2-3 Days',
        itemsCount: (matchedOrder.items || matchedOrder.products || []).length,
        isCancelled: currentStatus === 'Cancelled',
        isReturned: currentStatus === 'Returned',
        steps
      });
    } else {
      showToast(`No order found matching "${queryId || queryEmail}". Please verify your order details.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-brand-burgundy text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2.5 rounded-xl">
              <Package className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold">Track Your Order</h2>
              <p className="text-xs text-red-100 font-medium">Real-time express shipment tracking</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsTrackOrderOpen(false);
              setTrackedResult(null);
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!trackedResult ? (
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Enter Your Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="parent@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-burgundy text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Enter Order ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KDG-94821"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-burgundy text-sm uppercase"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-burgundy hover:bg-brand-burgundyDark text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all mt-6"
              >
                <Search className="w-4 h-4" />
                <span>Track Order Now</span>
              </button>
            </form>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-brand-roseTint/60 p-4 rounded-xl border border-brand-burgundy/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-brand-burgundy uppercase tracking-wider">Order #{trackedResult.id}</span>
                  <h3 className="text-sm font-extrabold text-stone-900">{trackedResult.status}</h3>
                  <p className="text-xs text-stone-500 font-medium">Estimated Arrival: {trackedResult.expected}</p>
                </div>
                <div className="bg-brand-burgundy text-white p-2.5 rounded-full shadow">
                  <Truck className="w-5 h-5" />
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4 relative pl-4 border-l-2 border-brand-burgundy/20">
                {trackedResult.steps.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-3">
                    <div className={`absolute -left-[21px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      step.done 
                        ? 'bg-brand-burgundy border-brand-burgundy text-white' 
                        : 'bg-white border-stone-300'
                    }`}>
                      {step.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${step.done ? 'text-stone-900' : 'text-stone-400'}`}>
                        {step.title}
                      </p>
                      <p className="text-[11px] text-stone-500">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-stone-950" />
                  <span>View / Download Bill PDF</span>
                </button>

                <button
                  onClick={() => setTrackedResult(null)}
                  className="px-4 text-xs font-bold text-stone-600 hover:text-brand-burgundy py-2.5 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
                >
                  Track Another
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
