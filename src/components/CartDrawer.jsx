import React from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    showToast,
    setIsCheckoutOpen
  } = useStore();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 25000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);
  const progressPercent = Math.min(100, (cartTotal / freeShippingThreshold) * 100);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">

          {/* Top QuickShip Banner */}
          <div className="bg-brand-burgundy text-white text-xs px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-bold">QuickShip Enabled — Arrives tomorrow</span>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="text-stone-300 hover:text-white text-[11px]">
              Cancel
            </button>
          </div>

          {/* Cart Header */}
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-3">
              <div className="bg-brand-burgundy text-white p-2 rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-stone-900">Your Cart</h2>
                <p className="text-xs text-stone-500 font-medium">{cart.length} unique items</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Express Delivery Threshold */}
          <div className="bg-brand-roseTint/60 px-6 py-3 border-b border-brand-burgundy/10">
            <div className="flex items-center justify-between text-xs mb-1.5 font-semibold text-brand-burgundy">
              <span>
                {remainingForFreeShipping > 0 
                  ? `Add ₹${remainingForFreeShipping.toLocaleString('en-IN')} more for free shipping` 
                  : '🎉 You qualified for FREE Express Shipping!'}
              </span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-brand-burgundy h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-stone-100">
            {cart.length > 0 ? (
              cart.map((item, idx) => {
                const itemKey = item.cartKey || item.id || idx;
                return (
                  <div key={itemKey} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 rounded-xl object-contain bg-stone-50 border border-stone-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-stone-900 line-clamp-2">{item.name}</h3>
                        {item.selectedColor && (
                          <span className="text-[10px] font-bold text-brand-burgundy bg-brand-roseTint/80 px-2 py-0.5 rounded-md inline-block mt-1">
                            Color: {item.selectedColor}
                          </span>
                        )}
                        <p className="text-xs font-extrabold text-stone-900 mt-1">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                          <button 
                            onClick={() => updateCartQuantity(itemKey, -1)}
                            className="px-2 py-1 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-bold text-stone-800">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(itemKey, 1)}
                            className="px-2 py-1 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(itemKey)}
                          className="text-stone-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-4 border border-stone-200">
                  <ShoppingBag className="w-10 h-10 text-stone-300" />
                </div>
                <h3 className="text-base font-bold text-stone-800 mb-1">Your bag is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">Add luxury essentials to your bag.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-brand-burgundy text-white hover:bg-brand-burgundyDark text-xs font-extrabold px-6 py-3 rounded-xl transition-all shadow-md"
                >
                  Explore Shop
                </button>
              </div>
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="font-bold text-emerald-600">
                    {remainingForFreeShipping === 0 ? 'FREE' : '₹250'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total</span>
                  <span className="text-brand-burgundy">
                    ₹{(cartTotal + (remainingForFreeShipping === 0 ? 0 : 250)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Primary Express Checkout Button - Coral on Cream Combo */}
              <button
                onClick={handleCheckout}
                className="w-full bg-[#E05A47] hover:bg-[#C84836] text-[#FFFDF9] font-extrabold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-coral hover:shadow-xl active:scale-98"
              >
                <span>Proceed to Express Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Secure 256-Bit SSL Checkout • 14-Day Easy Returns</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
