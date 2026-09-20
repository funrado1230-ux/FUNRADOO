import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import { PRODUCT_CATEGORIES, CATEGORY_COLLECTIONS } from '../data/products';
import { useStore } from '../context/StoreContext';
import { Sparkles, SlidersHorizontal, ChevronLeft, ChevronRight, LayoutGrid, MoveRight, Zap } from 'lucide-react';
import { ImageGallerySection } from './ImageGallerySection';
import { VerticalVideoCategorySection } from './VerticalVideoCategorySection';
import { CategoryWiseProductSection } from './CategoryWiseProductSection';

export const ProductGrid = () => {
  const {
    products,
    categories,
    selectedAge,
    setSelectedAge,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useStore();

  const dynamicCategories = ['All Products', ...new Set((categories && categories.length > 0) ? categories.filter(c => !c.isDisabled).map(c => c.name) : PRODUCT_CATEGORIES.filter(c => c !== 'All Products'))];

  const [viewMode, setViewMode] = useState('scroll'); // 'scroll' | 'grid'

  const scrollGridRow = (direction) => {
    const row = document.getElementById('main-product-scroll-track');
    if (row) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filter products based on age, category, and search query
  const cleanSearch = (searchQuery || '').trim().toLowerCase();
  const filteredProducts = products.filter(p => {
    const matchesAge = selectedAge === 'all' || p.ageGroup === selectedAge || p.ageTag === selectedAge;
    const matchesCat = selectedCategory === 'All Products' || p.category === selectedCategory;
    const matchesSearch = cleanSearch === '' || 
      (p.name || '').toLowerCase().includes(cleanSearch) ||
      (p.category || '').toLowerCase().includes(cleanSearch) ||
      (p.ageGroup || p.ageTag || '').toLowerCase().includes(cleanSearch) ||
      (p.description || '').toLowerCase().includes(cleanSearch) ||
      (p.sku || '').toLowerCase().includes(cleanSearch);

    return matchesAge && matchesCat && matchesSearch;
  });

  return (
    <section id="products-section" className="py-0 px-3 sm:px-6 max-w-7xl mx-auto space-y-1">
      
      {/* 1. Single Line All-5-Videos Vertical Reel Showcase */}
      <VerticalVideoCategorySection />

      {/* 2. Different Category Collections Sliders (Cycles, Scooters, Kids Cars, etc.) */}
      <CategoryWiseProductSection />

      {/* 3. Photo Gallery Wall with Lightbox Modal */}
      <ImageGallerySection />

      {/* 4. All Products Catalog Section */}
      <div id="all-products-catalog" className="pt-0 border-t border-stone-200">
        {/* Compact Single-Line Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1.5 border-b border-stone-200 mb-1">
          <div className="flex items-center gap-2">
            <img src="/images/funrado_mark.png" alt="FUNRADO" className="w-5 h-5 object-contain drop-shadow-xs" />
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-900 text-amber-300 font-bold text-[10px] uppercase tracking-wider">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
              <span>Catalog</span>
            </span>
            <h2 className="text-sm font-extrabold text-stone-900 tracking-tight">
              {selectedCategory === 'All Products' ? 'All Products Collection' : `${selectedCategory}`}
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {dynamicCategories.map(cat => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-[11px] font-extrabold px-3 py-1 rounded-lg whitespace-nowrap transition-all border cursor-pointer ${
                      isActive
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle Controls */}
            <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200">
              <button
                onClick={() => scrollGridRow('left')}
                className="p-1 rounded bg-white text-stone-700 hover:text-stone-900 transition-all cursor-pointer"
                title="Scroll Left"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => scrollGridRow('right')}
                className="p-1 rounded bg-white text-stone-700 hover:text-stone-900 transition-all cursor-pointer"
                title="Scroll Right"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <div className="h-3 w-px bg-stone-300 mx-0.5" />
              <button
                onClick={() => setViewMode(viewMode === 'scroll' ? 'grid' : 'scroll')}
                className={`p-1 rounded transition-all text-[10px] font-bold flex items-center gap-1 cursor-pointer ${
                  viewMode === 'grid' ? 'bg-stone-900 text-white' : 'bg-white text-stone-700'
                }`}
                title={viewMode === 'scroll' ? "Switch to Grid View" : "Switch to Horizontal Scroll View"}
              >
                <LayoutGrid className="w-3 h-3" />
                <span className="hidden sm:inline">{viewMode === 'scroll' ? 'Grid' : 'Slider'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Indicators */}
        {(selectedAge !== 'all' || selectedCategory !== 'All Products' || searchQuery !== '') && (
          <div className="bg-brand-roseTint/60 p-3 rounded-xl border border-brand-burgundy/10 flex items-center justify-between mb-6 text-xs">
            <div className="flex items-center gap-2 font-medium text-stone-700 flex-wrap">
              <SlidersHorizontal className="w-4 h-4 text-brand-burgundy" />
              <span>Active Filters:</span>
              {selectedAge !== 'all' && (
                <span className="bg-brand-burgundy text-white px-2.5 py-0.5 rounded-full font-bold">
                  Age: {selectedAge}
                </span>
              )}
              {selectedCategory !== 'All Products' && (
                <span className="bg-brand-burgundy text-white px-2.5 py-0.5 rounded-full font-bold">
                  Category: {selectedCategory}
                </span>
              )}
              {searchQuery !== '' && (
                <span className="bg-brand-burgundy text-white px-2.5 py-0.5 rounded-full font-bold">
                  Query: "{searchQuery}"
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setSelectedAge('all');
                setSelectedCategory('All Products');
                setSearchQuery('');
              }}
              className="text-brand-burgundy hover:underline font-bold cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Products Presentation */}
        {filteredProducts.length > 0 ? (
          viewMode === 'scroll' ? (
            <div className="relative group/scroll-container">
              <button
                onClick={() => scrollGridRow('left')}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-stone-900 shadow-xl border border-stone-200 flex items-center justify-center transition-all opacity-80 group-hover/scroll-container:opacity-100 hover:scale-110 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => scrollGridRow('right')}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-stone-900 shadow-xl border border-stone-200 flex items-center justify-center transition-all opacity-80 group-hover/scroll-container:opacity-100 hover:scale-110 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <div
                id="main-product-scroll-track"
                className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-1.5 px-2 no-scrollbar"
              >
                {filteredProducts.map(product => (
                  <div key={product.id} className="flex-none w-[200px] sm:w-[240px] md:w-[250px] snap-start">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8">
            <p className="text-base font-bold text-stone-800 mb-2">No matching products found</p>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
              Try adjusting your age filter or search query to explore more items.
            </p>
            <button
              onClick={() => {
                setSelectedAge('all');
                setSelectedCategory('All Products');
                setSearchQuery('');
              }}
              className="bg-brand-burgundy text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-brand-burgundyDark transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

    </section>
  );
};
