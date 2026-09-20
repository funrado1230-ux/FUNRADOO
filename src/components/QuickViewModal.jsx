import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Star, ShieldCheck, Truck, Sparkles, Play } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Product3DViewer } from './Product3DViewer';

export const QuickViewModal = () => {
  const { quickViewProduct, setQuickViewProduct, toggleWishlist, wishlist, addToCart, buyNow } = useStore();
  const { requireAuth } = useAuth();

  if (!quickViewProduct) return null;

  const isLiked = wishlist.includes(quickViewProduct.id);
  const images = [quickViewProduct.image, ...(quickViewProduct.secondaryImages || [])];
  const isOutOfStock = quickViewProduct.status === 'Out of Stock' || (quickViewProduct.stock !== undefined && Number(quickViewProduct.stock) <= 0);
  const isComingSoon = quickViewProduct.status === 'Coming Soon';

  const handleBuyNow = () => {
    if (isOutOfStock || isComingSoon) return;
    buyNow(quickViewProduct);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-stone-200 overflow-y-auto relative grid grid-cols-1 md:grid-cols-12">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-stone-900 shadow-md backdrop-blur transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Interactive Large Image & Video Viewer */}
        <div className="md:col-span-6 p-5 sm:p-6 bg-stone-50 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-stone-200">
          <div className="w-full max-w-[380px]">
            <Product3DViewer product={quickViewProduct} images={images} />
          </div>
        </div>

        {/* Right: Product Info & Actions */}
        <div className="md:col-span-6 p-5 sm:p-7 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-brand-burgundy text-white text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {quickViewProduct.category}
              </span>
              {quickViewProduct.ageTag && (
                <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200">
                  {quickViewProduct.ageTag}
                </span>
              )}
              {isOutOfStock ? (
                <span className="bg-rose-100 text-rose-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-rose-200">
                  Out of Stock
                </span>
              ) : isComingSoon ? (
                <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200">
                  Coming Soon
                </span>
              ) : (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  In Stock
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-xl font-extrabold text-stone-900 leading-tight mb-2">
              {quickViewProduct.name}
            </h3>

            {/* Price & Rating */}
            <div className="flex items-center justify-between my-3 pb-3 border-b border-stone-100">
              <div className="flex items-baseline gap-2.5">
                <span className="text-xl sm:text-2xl font-black text-brand-burgundy">
                  ₹{quickViewProduct.price.toLocaleString('en-IN')}
                </span>
                {quickViewProduct.originalPrice && (
                  <span className="text-sm text-stone-400 line-through font-medium">
                    ₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs sm:text-sm font-extrabold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/60">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{quickViewProduct.rating || 5.0}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
              {quickViewProduct.description}
            </p>

            {/* Specs list */}
            {quickViewProduct.specs && (
              <div className="space-y-2 mb-4">
                <p className="text-xs font-extrabold text-stone-700 uppercase tracking-wider">Highlights & Features</p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {quickViewProduct.specs.map((spec, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-brand-burgundy flex-shrink-0" />
                      <span className="line-clamp-1">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-3 border-t border-stone-100">
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock || isComingSoon}
              className={`flex-1 font-extrabold text-xs sm:text-sm py-3 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all ${
                isOutOfStock
                  ? 'bg-stone-400 text-white cursor-not-allowed opacity-80'
                  : isComingSoon
                  ? 'bg-amber-500 text-white cursor-not-allowed opacity-80'
                  : 'bg-brand-burgundy hover:bg-brand-burgundyDark text-white hover:shadow-xl cursor-pointer'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isOutOfStock ? 'Out of Stock' : isComingSoon ? 'Coming Soon' : 'Buy / Add to Bag'}</span>
            </button>

            <button
              onClick={() => toggleWishlist(quickViewProduct.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                isLiked
                  ? 'bg-brand-roseTint border-brand-burgundy text-brand-burgundy shadow-sm'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-white hover:text-brand-burgundy'
              }`}
              title="Toggle Wishlist"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-brand-burgundy' : ''}`} />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
