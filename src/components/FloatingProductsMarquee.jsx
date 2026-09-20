import React, { useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Eye, Star } from 'lucide-react';

export const FloatingProductsMarquee = () => {
  const { products: storeProducts, addToCart, setQuickViewProduct } = useStore();
  const allProductsList = (storeProducts && storeProducts.length > 0) ? storeProducts : PRODUCTS;

  // Build a diverse list featuring unique items across all categories (Cars, Bikes, Scooters, Cycles, Strollers, Walkers, Toys, Hoverboards)
  const featuredProducts = useMemo(() => {
    const categoryMap = new Map();
    const result = [];

    // Group products by category
    allProductsList.forEach(p => {
      const cat = p.category || 'Ride-ons';
      if (!categoryMap.has(cat)) {
        categoryMap.set(cat, []);
      }
      categoryMap.get(cat).push(p);
    });

    // Pick 1-2 items per category to guarantee a rich, attractive variety
    categoryMap.forEach((items) => {
      result.push(...items.slice(0, 2));
    });

    // Priority sort: Ensure generated HD product images (/images/products/) appear FIRST in the marquee!
    result.sort((a, b) => {
      const aNew = a.image && a.image.includes('/images/products/');
      const bNew = b.image && b.image.includes('/images/products/');
      if (aNew && !bNew) return -1;
      if (!aNew && bNew) return 1;
      return 0;
    });

    // Backfill with other bestsellers if needed to reach 16 items
    if (result.length < 16) {
      allProductsList.forEach(p => {
        if (!result.some(item => item.id === p.id)) {
          result.push(p);
        }
      });
    }

    return result.slice(0, 16);
  }, [allProductsList]);

  // Stacked background color pairings for the 3D layered cards (matches screenshot aesthetic)
  const stackColors = [
    { c1: 'rgba(167, 243, 208, 0.6)', c2: 'rgba(217, 249, 157, 0.5)' }, // Emerald / Lime
    { c1: 'rgba(191, 219, 254, 0.6)', c2: 'rgba(224, 231, 255, 0.5)' }, // Sky / Indigo
    { c1: 'rgba(254, 215, 170, 0.6)', c2: 'rgba(254, 240, 138, 0.5)' }, // Peach / Gold
    { c1: 'rgba(251, 207, 232, 0.6)', c2: 'rgba(243, 232, 255, 0.5)' }, // Pink / Purple
    { c1: 'rgba(153, 246, 228, 0.6)', c2: 'rgba(186, 230, 253, 0.5)' }, // Teal / Cyan
    { c1: 'rgba(233, 213, 255, 0.6)', c2: 'rgba(252, 231, 243, 0.5)' }, // Purple / Rose
  ];

  const handleQuickView = (e, product) => {
    e.stopPropagation();
    if (setQuickViewProduct) {
      setQuickViewProduct(product);
    }
  };


  return (
    <section className="py-10 max-w-[96%] sm:max-w-7xl mx-auto rounded-3xl bg-white/85 backdrop-blur-xl border border-white/80 shadow-2xl overflow-hidden select-none relative my-8 floating-card-elevated">
      
      {/* Background Decorative Blur Highlights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-amber-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-rose-200/20 blur-3xl pointer-events-none" />






      {/* Marquee Track Container */}
      <div className="relative w-full overflow-hidden py-6">
        
        {/* Left & Right Gradient Blur Fade Edges */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#FAF9F6] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#FAF9F6] to-transparent z-20 pointer-events-none" />

        {/* Infinite Moving Marquee Belt */}
        <div className="animate-marquee-left flex gap-6 sm:gap-8 px-4 items-center">
          
          {/* Double the array for seamless infinite looping */}
          {[...featuredProducts, ...featuredProducts].map((product, index) => {
            const colors = stackColors[index % stackColors.length];

            return (
              <div
                key={`${product.id}-${index}`}
                onClick={(e) => handleQuickView(e, product)}
                className="stacked-card-wrapper group cursor-pointer flex-none w-[170px] sm:w-[200px] select-none py-2"
                style={{
                  '--stack-color-1': colors.c1,
                  '--stack-color-2': colors.c2,
                }}
              >
                {/* Main Card Content Layer */}
                <div className="relative z-10 bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-lg border border-stone-200/80 transition-all duration-300 group-hover:border-amber-400 group-hover:shadow-xl">
                  
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 mb-2 flex items-center justify-center p-1.5">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 img-hd-sharp"
                      style={{ imageRendering: '-webkit-optimize-contrast' }}
                    />

                    {/* Category Tag Badge */}
                    <div className="absolute top-1.5 left-1.5 bg-stone-900/80 backdrop-blur-md text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full shadow-2xs border border-white/20">
                      {product.ageTag || 'Featured'}
                    </div>

                    {/* Quick View Floating Button */}
                    <button
                      onClick={(e) => handleQuickView(e, product)}
                      className="absolute bottom-1.5 right-1.5 bg-white/90 hover:bg-amber-400 text-stone-900 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0"
                      title="Quick View"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Product Metadata */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[9px] text-stone-500 font-semibold uppercase tracking-wider">
                      <span className="line-clamp-1">{product.category}</span>
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-[11px] sm:text-xs font-extrabold text-stone-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between pt-0.5">
                      <div>
                        <span className="text-stone-400 text-[9px] line-through block">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                        <span className="text-stone-950 font-black text-xs sm:text-sm">₹{product.price?.toLocaleString('en-IN')}</span>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({ ...product, quantity: 1 });
                        }}
                        className="bg-stone-900 hover:bg-amber-500 text-white hover:text-stone-950 text-[9px] font-extrabold px-2.5 py-1 rounded-lg transition-all duration-300 flex items-center gap-1 active:scale-95 shadow-2xs"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
};
