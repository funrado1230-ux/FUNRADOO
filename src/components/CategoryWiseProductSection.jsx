import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Eye, 
  Heart, 
  ShoppingCart, 
  Star, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
  SlidersHorizontal,
  Zap,
  Check,
  ShieldCheck
} from 'lucide-react';
import { CATEGORY_COLLECTIONS, PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';

const CATEGORY_THEMES = {
  'baby-walkers': {
    gradient: 'from-slate-950 via-fuchsia-950 to-purple-950',
    border: 'border-fuchsia-500/30',
    badgeBg: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
    accentText: 'from-fuchsia-200 via-pink-100 to-white'
  },
  strollers: {
    gradient: 'from-slate-950 via-emerald-950 to-teal-950',
    border: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    accentText: 'from-emerald-200 via-teal-100 to-white'
  },
  vespa: {
    gradient: 'from-amber-950 via-emerald-950 to-stone-950',
    border: 'border-emerald-500/30',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    accentText: 'from-emerald-200 via-amber-100 to-white'
  },
  scooters: {
    gradient: 'from-slate-950 via-indigo-950 to-sky-950',
    border: 'border-sky-500/30',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    accentText: 'from-sky-200 via-cyan-100 to-white'
  },
  cycles: {
    gradient: 'from-slate-950 via-teal-950 to-slate-900',
    border: 'border-teal-500/30',
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    accentText: 'from-cyan-200 via-teal-100 to-white'
  },
  'electric-bikes': {
    gradient: 'from-zinc-950 via-rose-950 to-stone-950',
    border: 'border-rose-500/30',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    accentText: 'from-rose-200 via-pink-100 to-white'
  },
  'kids-cars': {
    gradient: 'from-stone-950 via-amber-950 to-neutral-950',
    border: 'border-amber-500/30',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    accentText: 'from-amber-200 via-yellow-100 to-white'
  },
  hoverboards: {
    gradient: 'from-slate-950 via-purple-950 to-indigo-950',
    border: 'border-purple-500/30',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    accentText: 'from-purple-200 via-indigo-100 to-white'
  },
  'high-chairs': {
    gradient: 'from-zinc-950 via-blue-950 to-slate-950',
    border: 'border-blue-500/30',
    badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    accentText: 'from-blue-200 via-cyan-100 to-white'
  },
  toys: {
    gradient: 'from-stone-950 via-orange-950 to-amber-950',
    border: 'border-orange-500/30',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    accentText: 'from-orange-200 via-amber-100 to-white'
  }
};

export const CategoryWiseProductSection = () => {
  const { categories, products, wishlist, toggleWishlist, addToCart, buyNow, setQuickViewProduct, searchQuery, setSearchQuery } = useStore();
  const [activeCategoryModal, setActiveCategoryModal] = useState(null);
  const [activeCategoryKey, setActiveCategoryKey] = useState('all');

  const storeCategories = (categories && categories.length > 0) ? categories : CATEGORY_COLLECTIONS;
  const storeProducts = (products && products.length > 0) ? products : PRODUCTS;

  const scrollToCategorySection = (catId) => {
    setActiveCategoryKey(catId);
    if (catId === 'all') {
      const element = document.getElementById('category-collections-wrapper');
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      const element = document.getElementById(`category-grid-${catId}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollCategoryRow = (catId, direction) => {
    const row = document.getElementById(`category-scroll-${catId}`);
    if (row) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="category-collections-wrapper" className="w-full bg-[#FAFAFA] py-0 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-1.5">

        {/* ------------------------------------------------------------- */}
        {/* TOP CATEGORY NAVIGATION MENU                                  */}
        {/* ------------------------------------------------------------- */}
        <div className="sticky top-20 z-30 bg-[#FFFFFF]/95 backdrop-blur-md rounded-xl p-2.5 sm:p-3 shadow-xs border border-[#E5E7EB]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1F2937] text-white text-[10px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#F7E7CE]" />
                <span>FUNRADO Store Collections</span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#1F2937] tracking-tight mt-0.5">
                Category Collections Navigation
              </h2>
            </div>

            <div className="text-[11px] text-[#6B7280] font-semibold hidden sm:block">
              Click any collection to jump directly to its product slider
            </div>
          </div>

          {/* Sticky Category Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-t border-[#E5E7EB] pt-2">
            <button
              onClick={() => scrollToCategorySection('all')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap ${
                activeCategoryKey === 'all'
                  ? 'bg-[#E63946] text-white shadow-2xs scale-102'
                  : 'bg-[#FAFAFA] text-[#1F2937] hover:bg-[#F8FAFC] border border-[#E5E7EB]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>All {storeCategories.filter(c => !c.isDisabled).length} Collections</span>
            </button>

            {storeCategories.filter(c => !c.isDisabled).map((cat) => {
              const isSelected = activeCategoryKey === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategorySection(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap border ${
                    isSelected
                      ? 'bg-[#E63946] text-white border-[#E63946] shadow-2xs scale-102'
                      : 'bg-[#FFFFFF] text-[#1F2937] border-[#E5E7EB] hover:bg-[#F8FAFC] hover:border-[#E63946]'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Search Query Filter Alert */}
        {searchQuery && searchQuery.trim() && (
          <div className="flex items-center justify-between p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200 text-stone-900 text-xs font-bold mb-2 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <span>Filtering Collection Categories for: <span className="text-[#6B0F1A] font-black underline">"{searchQuery}"</span></span>
            </div>
            <button 
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-red-600 hover:text-red-800 font-black hover:underline cursor-pointer flex items-center gap-1"
            >
              ✕ Clear Search
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* DEDICATED CATEGORY PRODUCT SLIDERS (HORIZONTAL LEFT-TO-RIGHT) */}
        {/* ------------------------------------------------------------- */}
        {storeCategories.filter(c => !c.isDisabled).map((category, index) => {
          const cleanQuery = (searchQuery || '').trim().toLowerCase();
          const categoryProducts = storeProducts.filter((p) => {
            if (p.isHidden) return false;
            if (Array.isArray(category.productIds)) {
              const pSet = new Set(category.productIds);
              if (!pSet.has(p.id) && !pSet.has(p._id)) return false;
            } else {
              const catNameLower = (category.name || '').toLowerCase().trim();
              const pCatLower = (p.category || '').toLowerCase().trim();
              const hasCat = pCatLower === catNameLower || (Array.isArray(p.categories) && p.categories.some(c => (c || '').toLowerCase().trim() === catNameLower));
              if (!hasCat) return false;
            }
            if (cleanQuery) {
              const matchesSearch = (p.name || '').toLowerCase().includes(cleanQuery) ||
                (p.category || '').toLowerCase().includes(cleanQuery) ||
                (p.ageGroup || p.ageTag || '').toLowerCase().includes(cleanQuery) ||
                (p.description || '').toLowerCase().includes(cleanQuery);
              if (!matchesSearch) return false;
            }
            return true;
          });
          const isAlternate = index % 2 !== 0;
          const theme = CATEGORY_THEMES[category.id] || CATEGORY_THEMES.cycles;

          if (categoryProducts.length === 0) return null;

          return (
            <motion.div
              key={category.id}
              id={`category-grid-${category.id}`}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`rounded-2xl p-4 sm:p-6 border border-[#E5E7EB] shadow-md scroll-mt-28 transition-all duration-300 ${
                isAlternate ? 'bg-[#F8FAFC]' : 'bg-[#FFFFFF]'
              }`}
            >
              {/* Animated Attractive Category Header Card */}
              <div className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 mb-5 bg-gradient-to-r ${theme.gradient} text-white shadow-xl border ${theme.border}`}>
                {/* Background Ambient Blur Circle */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 rounded-full bg-white/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    {/* Category Animated Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black backdrop-blur-md border shadow-sm ${theme.badgeBg}`}>
                        <Zap className="w-3.5 h-3.5 animate-pulse fill-current" />
                        <span>{category.badge || 'Official Collection'}</span>
                      </span>

                      <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/20 text-xs font-bold backdrop-blur-md">
                        ✓ {categoryProducts.length} Items Available
                      </span>

                      <span className="text-xs text-stone-300 font-semibold hidden lg:inline">
                        Arranged Strictly by Category
                      </span>
                    </div>

                    {/* Animated Heading */}
                    <motion.h3 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.15 }}
                      className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3 drop-shadow-md"
                    >
                      <span className="text-3xl sm:text-4xl p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
                        {category.emoji}
                      </span>
                      <span className={`bg-gradient-to-r ${theme.accentText} bg-clip-text text-transparent`}>
                        {category.name} Collection
                      </span>
                    </motion.h3>

                    {/* Tagline */}
                    <p className="text-xs sm:text-sm text-stone-200 font-medium max-w-2xl leading-relaxed">
                      {category.tagline} • <span className="text-amber-300 font-bold">Category Filtered</span>
                    </p>
                  </div>

                  {/* Right Action Controls */}
                  <div className="flex items-center gap-2 self-start md:self-center">
                    {/* Scroll Left */}
                    <button
                      onClick={() => scrollCategoryRow(category.id, 'left')}
                      className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-md backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                      title="Scroll Left"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Scroll Right */}
                    <button
                      onClick={() => scrollCategoryRow(category.id, 'right')}
                      className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-md backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                      title="Scroll Right"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* View All Button */}
                    <button
                      onClick={() => setActiveCategoryModal(category)}
                      className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-xl hover:shadow-2xl transition-all cursor-pointer group active:scale-95 ml-1"
                    >
                      <span>Explore All ({categoryProducts.length})</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Horizontal Scrollable Product Track (Scroll Left to Right) */}
              <div className="relative group/slider mb-4">
                <div
                  id={`category-scroll-${category.id}`}
                  className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-1 no-scrollbar"
                >
                  {categoryProducts.map((product) => (
                    <div key={product.id} className="flex-none w-[150px] sm:w-[175px] md:w-[190px] snap-start">
                      <ScreenshotStyleProductCard
                        product={product}
                        onQuickView={() => setQuickViewProduct(product)}
                        onAddToCart={() => addToCart(product)}
                        onBuyNow={() => buyNow(product)}
                        isWishlisted={wishlist.includes(product.id)}
                        onToggleWishlist={() => toggleWishlist(product.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* View All Button at bottom of section */}
              <div className="pt-2 border-t border-[#E5E7EB] flex justify-between items-center text-[11px] text-stone-500 font-semibold">
                <span>👈 Swipe left or use arrows to see all products 👉</span>
                <button
                  onClick={() => setActiveCategoryModal(category)}
                  className="px-4 py-1.5 bg-[#E63946] hover:bg-[#C1121F] text-white font-extrabold text-[11px] rounded-lg transition-all shadow-2xs flex items-center justify-center gap-1.5 group cursor-pointer"
                >
                  <span>View All {category.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

            </motion.div>
          );
        })}

        {/* ------------------------------------------------------------- */}
        {/* VIEW ALL CATEGORY MODAL                                       */}
        {/* ------------------------------------------------------------- */}
        {activeCategoryModal && (
          <ViewAllCategoryModal
            category={activeCategoryModal}
            products={PRODUCTS.filter((p) => p.category === activeCategoryModal.name)}
            onClose={() => setActiveCategoryModal(null)}
            onQuickView={(p) => {
              setActiveCategoryModal(null);
              setQuickViewProduct(p);
            }}
            onAddToCart={(p) => addToCart(p)}
            onBuyNow={(p) => {
              setActiveCategoryModal(null);
              buyNow(p);
            }}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
          />
        )}

      </div>
    </section>
  );
};

// ----------------------------------------------------------------------
// PRODUCT CARD COMPONENT (Using Requested English Palette Tokens)
// ----------------------------------------------------------------------
const ScreenshotStyleProductCard = ({
  product,
  onQuickView,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist
}) => {
  const mrp = product.originalPrice || Math.round(product.price * 1.25);
  const discountPercent = Math.round(((mrp - product.price) / mrp) * 100);
  const isOutOfStock = product.status === 'Out of Stock' || (product.stock !== undefined && Number(product.stock) <= 0);
  const isComingSoon = product.status === 'Coming Soon';

  return (
    <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E7EB] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group relative text-stone-900">
      
      {/* Product Image Container */}
      <div className="relative aspect-square bg-[#FAFAFA] overflow-hidden p-2 flex items-center justify-center">
        
        {/* Red Ribbon Discount Badge (#E63946) */}
        {discountPercent > 0 && !isOutOfStock && (
          <div className="absolute bottom-1.5 left-1.5 z-10 bg-[#E63946] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-2xs">
            -{discountPercent}%
          </div>
        )}

        {/* Out of Stock Ribbon / Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[#1F2937]/50 backdrop-blur-[1px] z-20 flex items-center justify-center p-1">
            <span className="bg-[#E63946] text-white font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-wider shadow-md border border-rose-300">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist Heart Icon (Top-Right of Image) */}
        <button
          onClick={onToggleWishlist}
          className={`absolute top-1.5 right-1.5 z-10 p-1 rounded-full transition-all ${
            isWishlisted
              ? 'bg-rose-50 text-[#E63946] shadow-2xs'
              : 'text-[#6B7280] hover:text-[#E63946] bg-[#FFFFFF]/80 backdrop-blur hover:bg-[#FFFFFF]'
          }`}
          title="Add to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#E63946]' : ''}`} />
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-out cursor-pointer"
          onClick={onQuickView}
          loading="lazy"
        />

        {/* Quick View Hover Button */}
        <div className="absolute inset-x-2 bottom-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={onQuickView}
            className="w-full py-1 bg-[#FFFFFF]/95 hover:bg-[#FFFFFF] text-[#1F2937] font-extrabold text-[10px] rounded-lg shadow-2xs backdrop-blur border border-[#E5E7EB] flex items-center justify-center gap-1 transition-all"
          >
            <Eye className="w-3 h-3 text-amber-600" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-2.5 flex flex-col flex-1 justify-between space-y-1.5 bg-[#FFFFFF]">
        
        <div>
          {/* Tag / Best Seller Badge if available */}
          <div className="flex items-center gap-1 mb-1">
            {isOutOfStock ? (
              <span className="bg-rose-100 text-[#E63946] text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-rose-200 uppercase">
                Out of Stock
              </span>
            ) : isComingSoon ? (
              <span className="bg-amber-100 text-amber-800 text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-amber-200 uppercase">
                Coming Soon
              </span>
            ) : product.isBestSeller ? (
              <span className="bg-amber-500 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                Best Seller
              </span>
            ) : null}
            {product.ageTag && (
              <span className="bg-[#F7E7CE]/60 text-[#1F2937] text-[8px] font-bold px-1.5 py-0.5 rounded border border-[#F7E7CE]">
                {product.ageTag}
              </span>
            )}
          </div>

          {/* Product Name (Primary Text #1F2937) */}
          <h4
            onClick={onQuickView}
            className="text-[11px] sm:text-xs font-extrabold text-[#1F2937] line-clamp-2 hover:text-[#E63946] cursor-pointer transition-colors leading-tight mb-1"
          >
            {product.name}
          </h4>

          {/* Rating (Secondary Text #6B7280) */}
          <div className="flex items-center gap-1 text-[10px] font-bold text-[#6B7280]">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{product.rating || 5.0}</span>
            <span className="text-[#6B7280] font-medium">({product.reviewsCount || 120})</span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-1.5 border-t border-[#E5E7EB] space-y-1.5">
          {/* Price (#E63946) & MRP (#6B7280) */}
          <div>
            <div className="text-xs sm:text-sm font-black text-[#E63946]">
              ₹{product.price.toLocaleString('en-IN')}.00
            </div>
            {mrp && (
              <div className="text-[10px] text-[#6B7280] line-through font-medium">
                M.R.P.: ₹{mrp.toLocaleString('en-IN')}.00
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            <button
              onClick={onQuickView}
              className="w-full py-1.5 px-1 bg-[#FAFAFA] hover:bg-[#F8FAFC] text-[#1F2937] font-extrabold text-[10px] rounded-lg border border-[#E5E7EB] transition-all text-center cursor-pointer"
            >
              Details
            </button>
            <button
              onClick={onBuyNow || onAddToCart}
              disabled={isOutOfStock || isComingSoon}
              className={`w-full py-1.5 px-1 font-extrabold text-[10px] rounded-lg transition-all shadow-2xs flex items-center justify-center gap-1 ${
                isOutOfStock || isComingSoon
                  ? 'bg-stone-300 text-stone-600 cursor-not-allowed opacity-80'
                  : 'bg-[#E63946] hover:bg-[#C1121F] text-white cursor-pointer'
              }`}
            >
              <ShoppingCart className="w-3 h-3" />
              <span>{isOutOfStock ? 'Out of Stock' : isComingSoon ? 'Coming Soon' : 'Buy'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// VIEW ALL CATEGORY MODAL COMPONENT
// ----------------------------------------------------------------------
const ViewAllCategoryModal = ({
  category,
  products,
  onClose,
  onQuickView,
  onAddToCart,
  onBuyNow,
  wishlist,
  toggleWishlist
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1F2937]/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-[#FFFFFF] w-full max-w-5xl rounded-3xl shadow-2xl border border-[#E5E7EB] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 bg-[#FAFAFA] border-b border-[#E5E7EB] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E63946] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                Collection Grid
              </span>
              <span className="text-xs text-[#6B7280] font-semibold">
                {products.length} Products
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#1F2937] tracking-tight mt-1 flex items-center gap-2">
              <span>{category.emoji}</span>
              <span>All {category.name}</span>
            </h3>
            <p className="text-xs text-[#6B7280]">{category.tagline}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-[#FFFFFF] text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8FAFC] transition-all border border-[#E5E7EB] shadow-2xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Grid */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-[#FAFAFA]">
          {products.map((product) => (
            <ScreenshotStyleProductCard
              key={product.id}
              product={product}
              onQuickView={() => onQuickView(product)}
              onAddToCart={() => onAddToCart(product)}
              onBuyNow={() => onBuyNow ? onBuyNow(product) : onAddToCart(product)}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={() => toggleWishlist(product.id)}
            />
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FFFFFF] border-t border-[#E5E7EB] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#E63946] hover:bg-[#C1121F] text-white font-bold text-xs rounded-xl transition-all shadow-md"
          >
            Close View
          </button>
        </div>

      </div>
    </div>
  );
};
