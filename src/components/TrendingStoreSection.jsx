import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Compass, Zap } from 'lucide-react';



export const TrendingStoreSection = () => {
  const { setSelectedCategory } = useStore();
  const [activeHoverId, setActiveHoverId] = useState(null);

  const TRENDING_CATEGORIES = [
    {
      id: 'baby-walkers',
      title: 'Baby Walkers',
      categoryFilter: 'Baby Walkers',
      image: '/images/categories/trending_fashion.png',
      alt: 'Baby Walkers & Toddler Steps',
      badge: '1st: Walkers'
    },
    {
      id: 'strollers',
      title: 'Strollers',
      categoryFilter: 'Strollers',
      image: '/images/categories/trending_gears.png',
      alt: 'Luxury Strollers & Mobility',
      badge: '2nd: Strollers'
    },
    {
      id: 'ride-ons',
      title: 'Ride-Ons & Vespa',
      categoryFilter: 'Vespa',
      image: '/images/categories/trending_basics.png',
      alt: 'Ride-Ons & Vintage Vespa',
      badge: '3rd: Ride-Ons'
    },
    {
      id: 'scooters',
      title: 'Kick Scooters',
      categoryFilter: 'Scooters',
      image: '/images/categories/trending_kids.png',
      alt: '3-Wheel Glowing Kick Scooters',
      badge: '3rd: Scooters'
    },
    {
      id: 'cycles',
      title: 'Bikes & Cycles',
      categoryFilter: 'Cycles',
      image: '/images/categories/trending_organic.png',
      alt: 'Balance Bikes & Cycles',
      badge: '4th: Bikes'
    },
    {
      id: 'kids-cars',
      title: 'Electric Cars',
      categoryFilter: 'Kids Cars',
      image: '/images/categories/trending_toys.png',
      alt: '12V Electric Ride-on Cars',
      badge: '5th: Cars'
    },
    {
      id: 'hoverboards',
      title: 'Hoverboards',
      categoryFilter: 'Hoverboards',
      image: '/images/categories/trending_snd_care.png',
      alt: 'Smart Bluetooth Hoverboards',
      badge: '6th: Hoverboard'
    }
  ];

  const handleCategoryClick = (categoryFilter) => {
    if (setSelectedCategory) {
      setSelectedCategory(categoryFilter);
    }
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-3 px-3 sm:px-6 max-w-7xl mx-auto select-none relative my-2">
      {/* Font imports for handwritten "Store" script */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Playfair+Display:ital,wght@1,700&display=swap');
        .font-trending-script {
          font-family: 'Caveat', 'Playfair Display', cursive, serif;
        }

        @keyframes shimmerSweep {
          0% { transform: translateX(-100%) rotate(25deg); }
          100% { transform: translateX(200%) rotate(25deg); }
        }

        .animate-shimmer-pass {
          animation: shimmerSweep 2.5s infinite ease-in-out;
        }

        .card-3d-wrapper {
          perspective: 1000px;
        }

        .card-3d-content {
          transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease;
          transform-style: preserve-3d;
        }

        .card-3d-wrapper:hover .card-3d-content {
          transform: rotateX(6deg) rotateY(-4deg) translateZ(12px) scale(1.05);
        }
      `}</style>

      {/* Glassmorphic 3D Card Floating Background Container */}
      <div className="relative rounded-[2.8rem] bg-white/85 backdrop-blur-xl p-6 sm:p-10 shadow-2xl border-2 border-white/90 overflow-hidden floating-card-elevated">
        
        {/* Dynamic Animated Ambient Background Orbs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-[#B37864]/15 blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-64 h-64 rounded-full bg-[#E5B584]/20 blur-3xl animate-float-reverse pointer-events-none" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-[#D4A373]/15 blur-3xl animate-float-slow pointer-events-none" />



        {/* Header Title Section */}
        <div className="text-center mb-10 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight flex items-baseline justify-center gap-2.5">
            <span className="uppercase tracking-wide font-black text-stone-900 drop-shadow-xs">TRENDING</span>
            <span className="font-trending-script text-[#A05545] font-bold text-4xl sm:text-5xl lg:text-6xl italic transform -rotate-3 inline-block drop-shadow-sm">
              Store
            </span>
          </h2>
          <p className="text-stone-700 font-medium text-sm sm:text-base lg:text-lg tracking-wide mt-2 max-w-xl mx-auto">
            Love, Care, Comfort Everything Baby Truly Need
          </p>
        </div>




        {/* 7 Category 3D Cards Grid (Touch snap scroll on mobile, grid on desktop) */}
        <div className="flex sm:grid overflow-x-auto sm:overflow-visible snap-x snap-mandatory gap-3.5 sm:gap-4 lg:gap-5 relative z-10 pb-4 sm:pb-0 no-scrollbar sm:grid-cols-4 lg:grid-cols-7">
          {TRENDING_CATEGORIES.map((item) => {
            const isHovered = activeHoverId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleCategoryClick(item.categoryFilter)}
                onMouseEnter={() => setActiveHoverId(item.id)}
                onMouseLeave={() => setActiveHoverId(null)}
                className="card-3d-wrapper group cursor-pointer flex flex-col items-center select-none flex-none w-[135px] sm:w-auto snap-start"
              >

                {/* 3D Content Box */}
                <div className="card-3d-content w-full flex flex-col items-center">
                  
                  {/* Image Card Box */}
                  <div className="relative w-full aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-100 border-2 border-white shadow-lg group-hover:shadow-2xl transition-all duration-500">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="w-full h-full object-cover group-hover:scale-112 transition-transform duration-700 img-hd-sharp"
                      style={{ imageRendering: '-webkit-optimize-contrast' }}
                    />
                    
                    {/* Soft Shimmer Pass Animation on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none overflow-hidden">
                      <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-shimmer-pass" />
                    </div>

                    {/* Category Floating Pill Badge */}
                    <div className="absolute top-2.5 left-2.5 bg-stone-900/80 backdrop-blur-md text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-md border border-white/20 opacity-90 group-hover:opacity-100 transition-opacity">
                      {item.badge}
                    </div>

                    {/* Bottom Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* 3D Metallic Brass Hanging Ring Connectors */}
                  <div className="flex justify-between w-2/3 px-3 -mt-1.5 z-20 pointer-events-none">
                    <div className="w-2 h-4 bg-gradient-to-b from-amber-200 via-[#8C5D4D] to-[#5C3B30] rounded-full shadow-md group-hover:translate-y-0.5 transition-transform duration-300" />
                    <div className="w-2 h-4 bg-gradient-to-b from-amber-200 via-[#8C5D4D] to-[#5C3B30] rounded-full shadow-md group-hover:translate-y-0.5 transition-transform duration-300" />
                  </div>

                  {/* 3D Embossed Leather Tag Label */}
                  <div className="w-full bg-[#B37864] group-hover:bg-gradient-to-r group-hover:from-[#C58470] group-hover:to-[#9E6350] text-white font-black text-xs sm:text-sm py-2 px-2 rounded-xl text-center shadow-[0_8px_16px_rgba(179,120,100,0.35)] group-hover:shadow-[0_12px_24px_rgba(179,120,100,0.5)] border-b-4 border-r-2 border-[#7A4535] group-hover:border-[#6B3B2D] transition-all duration-300 tracking-wide mt-[-2px] flex items-center justify-center gap-1">
                    <span className="drop-shadow-sm line-clamp-1">{item.title}</span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner Indicator */}
        <div className="mt-8 pt-4 border-t border-[#B37864]/15 flex items-center justify-between text-xs text-stone-700 font-bold px-2 relative z-10">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce-subtle" />
            <span>Click any category card to filter collection</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[#7A4535] font-serif italic text-xs">
            <span>✦ Premium Toddler Essentials</span>
          </div>
        </div>

      </div>
    </section>
  );
};
