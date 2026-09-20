import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, Truck, Sparkles, CheckCircle2, Eye } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WishlistDrawer = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlistProducts,
    removeFromWishlist,
    moveToCartFromWishlist,
    setIsCartOpen,
    setQuickViewProduct
  } = useStore();

  const [showBanner, setShowBanner] = useState(true);

  if (!isWishlistOpen) return null;

  // Calculate free shipping threshold progress (e.g. ₹2,499 threshold)
  const wishlistTotal = wishlistProducts.reduce((sum, item) => sum + item.price, 0);
  const targetThreshold = 25000;
  const remainingForFreeShipping = Math.max(0, targetThreshold - wishlistTotal);
  const progressPercent = Math.min(100, (wishlistTotal / targetThreshold) * 100);

  const handleViewProductDetails = (product) => {
    setQuickViewProduct(product);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsWishlistOpen(false)}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">

          {/* Top QuickShip Announcement Banner (As seen in Image 2) */}
          {showBanner && (
            <div className="bg-brand-burgundy text-white text-xs px-4 py-2.5 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1 rounded-full">
                  <Truck className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="font-bold flex items-center gap-1">
                    QuickShip Enabled <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                  </p>
                  <p className="text-[10px] text-red-100">Arrives tomorrow before 2 PM</p>
                </div>
              </div>
              <button 
                onClick={() => setShowBanner(false)}
                className="text-xs bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-stone-200 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Wishlist Header */}
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
            <div className="flex items-center gap-3">
              <div className="bg-brand-roseTint p-2 rounded-xl border border-brand-burgundy/10">
                <Heart className="w-5 h-5 text-brand-burgundy fill-brand-burgundy" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-stone-900 tracking-tight">Your Wishlist</h2>
                <p className="text-xs text-stone-500 font-medium">
                  {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping / Delivery Threshold Banner */}
          <div className="bg-brand-roseTint/60 px-6 py-3 border-b border-brand-burgundy/10">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-brand-burgundy">
                {remainingForFreeShipping > 0 
                  ? `Add ₹${remainingForFreeShipping.toLocaleString('en-IN')} more for free express delivery` 
                  : '🎉 Free express delivery unlocked!'}
              </span>
              <span className="font-bold text-stone-600">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-brand-burgundy to-amber-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-stone-100">
            {wishlistProducts.length > 0 ? (
              wishlistProducts.map(product => (
                <div key={product.id} className="py-4 first:pt-0 last:pb-0 flex gap-4 group">
                  {/* Thumbnail (Clickable to view product) */}
                  <div 
                    onClick={() => handleViewProductDetails(product)}
                    className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200/80 relative cursor-pointer group-hover:border-brand-burgundy/40 transition-colors"
                    title="Click to view product details"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isQuickShip && (
                      <span className="absolute top-1 left-1 bg-brand-burgundy text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                        FAST
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white drop-shadow-md" />
                    </div>
                  </div>

                  {/* Details (Clickable to view product) */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div 
                      onClick={() => handleViewProductDetails(product)}
                      className="cursor-pointer group/title"
                      title="Click to view product details"
                    >
                      <span className="text-[10px] font-bold text-brand-burgundy uppercase tracking-wider bg-brand-roseTint px-2 py-0.5 rounded-full inline-block mb-1">
                        {product.ageTag || product.category}
                      </span>
                      <h3 className="text-xs font-bold text-stone-900 line-clamp-2 leading-snug group-hover/title:text-brand-burgundy transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-xs font-extrabold text-stone-900 mt-1">
                        ₹{product.price.toLocaleString('en-IN')}{' '}
                        {product.originalPrice && (
                          <span className="text-[11px] font-normal text-stone-400 line-through ml-1">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleViewProductDetails(product)}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1 transition-all"
                        title="View product details"
                      >
                        <Eye className="w-3.5 h-3.5 text-brand-burgundy" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => moveToCartFromWishlist(product)}
                        className="flex-1 bg-brand-burgundy hover:bg-brand-burgundyDark text-white text-xs font-bold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              /* Empty Wishlist State (Matching Image 2 Reference) */
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-4 border border-stone-200">
                  <ShoppingBag className="w-10 h-10 text-stone-300" />
                </div>
                <h3 className="text-base font-bold text-stone-800 mb-1">Your wishlist is empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Add something you love while exploring our luxury kids collections.
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="bg-brand-burgundy text-white hover:bg-brand-burgundyDark text-xs font-extrabold px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <span>Explore Shop</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {wishlistProducts.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50">
              <button
                onClick={() => {
                  setIsWishlistOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>View Full Bag & Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
