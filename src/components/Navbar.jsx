import React, { useState, useRef, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User, Package, Menu, X, Sparkles, Eye, ShoppingCart, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import { useStore } from '../context/StoreContext';

const POPULAR_SEARCH_TAGS = [
  { label: '🛵 Vespa Scooters', query: 'Vespa' },
  { label: '🚲 Kids Cycles', query: 'Cycles' },
  { label: '🛝 Slides & Swings', query: 'Toys' },
  { label: '🏎️ Electric Cars', query: 'Kids Cars' },
  { label: '🛴 Kick Scooters', query: 'Scooters' },
  { label: '👶 Strollers', query: 'Strollers' },
  { label: '🪑 High Chairs', query: 'High Chairs' },
  { label: '⚡ Hoverboards', query: 'Hoverboards' },
];

export const Navbar = ({ onOpenAdmin }) => {
  const {
    wishlist,
    cartItemCount,
    cartTotal,
    setIsWishlistOpen,
    setIsCartOpen,
    setIsTrackOrderOpen,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setQuickViewProduct,
    buyNow,
    products
  } = useStore();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  // Filter products for search autocomplete preview
  const cleanQuery = (searchQuery || '').trim().toLowerCase();
  const matchingProducts = cleanQuery === '' ? [] : products.filter(p => {
    const name = (p.name || '').toLowerCase();
    const category = (p.category || '').toLowerCase();
    const ageGroup = (p.ageGroup || p.ageTag || '').toLowerCase();
    const description = (p.description || '').toLowerCase();
    const sku = (p.sku || '').toLowerCase();
    return name.includes(cleanQuery) ||
      category.includes(cleanQuery) ||
      ageGroup.includes(cleanQuery) ||
      description.includes(cleanQuery) ||
      sku.includes(cleanQuery);
  });

  const searchResults = matchingProducts.slice(0, 5);

  const scrollToCatalog = () => {
    setIsSearchFocused(false);
    setTimeout(() => {
      const catalogEl = document.getElementById('all-products-catalog') || document.getElementById('products-section');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    scrollToCatalog();
  };

  const handleSelectTag = (query) => {
    setSearchQuery(query);
    scrollToCatalog();
  };

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current && !searchRef.current.contains(e.target) &&
        (!mobileSearchRef.current || !mobileSearchRef.current.contains(e.target))
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#6B0F1A] text-white shadow-md transition-all duration-300">
      {/* 🎨 DARK BURGUNDY NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">

          {/* LEFT: Logo Design */}
          <div className="flex items-center gap-6">
            <Logo light={true} size="md" />
          </div>

          {/* CENTER: Search Bar */}
          <div className="flex-1 max-w-xl relative hidden md:block" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className={`relative flex items-center bg-white text-stone-800 rounded-xl overflow-hidden transition-all duration-200 border ${
                isSearchFocused ? 'ring-2 ring-amber-400 border-amber-400 shadow-xl' : 'border-stone-200 shadow-sm'
              }`}>
                <Search className="w-4 h-4 text-stone-400 ml-3.5 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search for products, cribs, high chairs, age groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full py-2.5 px-3 text-xs sm:text-sm font-medium focus:outline-none placeholder-stone-400 bg-transparent"
                />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="mr-2 text-stone-400 hover:text-stone-700 text-xs bg-stone-100 hover:bg-stone-200 rounded-full w-5 h-5 flex items-center justify-center transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs px-4 py-2.5 m-0.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Search</span>
                </button>
              </div>
            </form>

            {/* Live Search Autocomplete Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50 animate-fade-in max-h-[480px] flex flex-col">
                {cleanQuery === '' ? (
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-700 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Popular Collections & Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCH_TAGS.map(tag => (
                        <button
                          key={tag.query}
                          type="button"
                          onClick={() => handleSelectTag(tag.query)}
                          className="text-xs bg-stone-100 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 border border-stone-200 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="flex flex-col">
                    <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs font-bold text-stone-500">
                      <span>Matching Products ({matchingProducts.length})</span>
                      <span className="text-[11px] text-stone-400">Click item to view details</span>
                    </div>

                    <div className="p-2 divide-y divide-stone-100 overflow-y-auto max-h-[340px]">
                      {searchResults.map(prod => (
                        <div
                          key={prod.id}
                          onClick={() => {
                            setQuickViewProduct(prod);
                            setIsSearchFocused(false);
                          }}
                          className="flex items-center justify-between gap-3 p-2.5 hover:bg-amber-50/50 rounded-xl cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <img 
                              src={prod.image} 
                              alt={prod.name} 
                              className="w-12 h-12 object-cover rounded-xl border border-stone-200 flex-shrink-0 group-hover:scale-105 transition-transform" 
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-stone-900 truncate group-hover:text-[#6B0F1A] transition-colors">
                                {prod.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] bg-stone-100 text-stone-600 font-bold px-1.5 py-0.5 rounded">
                                  {prod.category}
                                </span>
                                {prod.ageTag && (
                                  <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-200">
                                    {prod.ageTag}
                                  </span>
                                )}
                                <span className="text-xs font-black text-[#E63946]">
                                  ₹{prod.price.toLocaleString('en-IN')}
                                </span>
                                {prod.originalPrice && (
                                  <span className="text-[10px] text-stone-400 line-through">
                                    ₹{prod.originalPrice.toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setQuickViewProduct(prod);
                                setIsSearchFocused(false);
                              }}
                              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-white rounded-lg border border-stone-200 transition-colors text-xs font-bold"
                              title="Quick View"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsSearchFocused(false);
                                buyNow(prod);
                              }}
                              className="bg-[#E63946] hover:bg-[#C1121F] text-white text-[11px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                              title="Buy Now"
                            >
                              <ShoppingCart className="w-3 h-3" />
                              <span>Buy</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer View All Bar */}
                    <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
                      <span className="text-xs text-stone-600 font-medium">
                        Showing top {searchResults.length} of {matchingProducts.length} items
                      </span>
                      <button
                        type="button"
                        onClick={scrollToCatalog}
                        className="text-xs text-[#6B0F1A] font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View all in catalog</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center space-y-3">
                    <p className="text-xs font-extrabold text-stone-800">
                      No products found matching "{searchQuery}"
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Try searching for Vespa, Cycle, Swing, Slide, Car, or Scooter.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-4 py-1.5 rounded-xl transition-colors cursor-pointer"
                    >
                      Clear Search & View All
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold uppercase tracking-wider">
            
            {/* Wishlist */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg hover:bg-white/10 transition-colors group relative"
              title="Open Wishlist"
            >
              <div className="relative">
                <Heart className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  wishlist.length > 0 ? "fill-amber-400 text-amber-400" : "text-white"
                }`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-400 text-brand-burgundy font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline text-[11px] font-bold">Wishlist</span>
            </button>

            <span className="text-white/20 hidden sm:inline">|</span>

            {/* Account / Direct Admin Dashboard Link */}
            <button 
              onClick={() => onOpenAdmin ? onOpenAdmin() : (window.location.hash = '#admin')}
              className="hidden sm:flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-amber-300 font-bold"
              title="Click to Open Admin Dashboard Direct Link"
            >
              <User className="w-4.5 h-4.5 text-amber-400" />
              <span className="hidden xl:inline text-[11px] uppercase tracking-wider">Admin Dashboard</span>
            </button>

            <span className="text-white/20 hidden sm:inline">|</span>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-400 text-brand-burgundy font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold">
                CART / ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </button>

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search */}
        <div className="mt-3 md:hidden" ref={mobileSearchRef}>
          <form onSubmit={handleSearchSubmit}>
            <div className={`relative flex items-center bg-white text-stone-800 rounded-xl overflow-hidden border ${
              isSearchFocused ? 'ring-2 ring-amber-400 border-amber-400 shadow-md' : 'border-stone-200'
            }`}>
              <Search className="w-4 h-4 text-stone-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search products, bikes, cars, slides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full py-2.5 px-3 text-xs font-medium focus:outline-none bg-transparent"
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mr-2 text-stone-400 hover:text-stone-700 text-xs bg-stone-100 rounded-full w-5 h-5 flex items-center justify-center transition-colors cursor-pointer"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs px-3.5 py-2 m-0.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
              >
                Go
              </button>
            </div>
          </form>
        </div>

      </div>
    </header>
  );
};