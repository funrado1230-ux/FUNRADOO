import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart, Eye, ShoppingCart } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ScooterShowcaseBanner = () => {
  const { addToCart, setQuickViewProduct, wishlist, toggleWishlist } = useStore();
  const sliderRef = useRef(null);

  const FEATURED_BANNERS = [
    {
      id: 'nasa-banner',
      title: 'NASA Edition',
      subtitle: 'Space Explorer Scooter Series',
      image: '/images/store/wespa/24.jpeg',
      badgeLogo: 'NASA',
      badgeBg: 'bg-red-600 text-white font-extrabold',
      stickerEmoji: '🪐',
      colorTheme: 'from-[#0B3D91] to-[#FC3D21]'
    },
    {
      id: 'peppa-banner',
      title: 'Peppa Pig Edition',
      subtitle: 'Fun & Playful Toddler Scooter',
      image: '/images/store/scooter/70.jpeg',
      badgeLogo: 'Peppa Pig',
      badgeBg: 'bg-sky-500 text-white font-bold',
      stickerEmoji: '🐷',
      colorTheme: 'from-[#FFB6C1] to-[#FF69B4]'
    },
    {
      id: 'hellokitty-banner',
      title: 'Hello Kitty Edition',
      subtitle: 'Cute & Stylish Ride-On',
      image: '/images/store/scooter/led_scooter_neon_blue.png',
      badgeLogo: 'Hello Kitty',
      badgeBg: 'bg-pink-600 text-white font-serif',
      stickerEmoji: '🎀',
      colorTheme: 'from-[#FFC0CB] to-[#E6007E]'
    }
  ];

  const SLIDER_PRODUCTS = [
    {
      id: 'scooter-nasa-1',
      name: 'StarAndDaisy X Nasa Kids Scooter, 3-Wheel Triangular...',
      category: 'Scooters',
      price: 1424,
      originalPrice: 1999,
      discount: '-29%',
      rating: 4.8,
      reviewsCount: 142,
      image: '/images/store/wespa/24.jpeg',
      isBestSeller: false
    },
    {
      id: 'scooter-hk-1',
      name: 'StarAndDaisy X Hello Kitty Blaze Kids Scooter with Sturd...',
      category: 'Scooters',
      price: 1358,
      originalPrice: 1850,
      discount: '-27%',
      rating: 4.8,
      reviewsCount: 96,
      image: '/images/store/scooter/led_scooter_neon_blue.png',
      isBestSeller: false
    },
    {
      id: 'scooter-rise-1',
      name: 'StarAndDaisy Rise \'n\' Shine Kids Scooter with LED Light...',
      category: 'Scooters',
      price: 2184,
      originalPrice: 5999,
      discount: '-64%',
      rating: 4.8,
      reviewsCount: 165,
      image: '/images/store/scooter/70.jpeg',
      isBestSeller: false
    },
    {
      id: 'scooter-rise-2',
      name: 'StarAndDaisy Rise \'n\' Shine 3 Wheel Scooter for Kids, LED...',
      category: 'Scooters',
      price: 2184,
      originalPrice: 5999,
      discount: '-64%',
      rating: 4.8,
      reviewsCount: 120,
      image: '/images/store/wespa/54.jpeg',
      isBestSeller: false
    },
    {
      id: 'scooter-glider-1',
      name: 'StarAndDaisy Glider Toddler Scooter for Kids – Foldable 3...',
      category: 'Scooters',
      price: 2849,
      originalPrice: 5999,
      discount: '-53%',
      rating: 4.7,
      reviewsCount: 210,
      image: '/images/store/wespa/5.jpeg',
      isBestSeller: true
    }
  ];

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -280, behavior: 'smooth' });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 280, behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-6 bg-[#FAFAF7] rounded-3xl p-4 sm:p-6 border border-[#EAEAEA] shadow-sm">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP 3 FEATURED THEME BANNERS                                  */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {FEATURED_BANNERS.map((banner) => (
          <div
            key={banner.id}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm group border border-[#EAEAEA] bg-white flex items-center justify-center p-3"
          >
            {/* Sticker Decor */}
            <div className="absolute top-2 left-4 text-2xl z-10 filter drop-shadow animate-bounce">
              {banner.stickerEmoji}
            </div>

            {/* Background Image */}
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />

            {/* Bottom Character Logo Overlay */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
              <span className={`px-4 py-1 rounded-full text-xs font-black tracking-wider uppercase shadow-md ${banner.badgeBg}`}>
                {banner.badgeLogo}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM SLIDER WITH PREV / NEXT NAV BUTTONS                    */}
      {/* ------------------------------------------------------------- */}
      <div className="relative group/slider">
        
        {/* Left Arrow Button */}
        <button
          onClick={scrollLeft}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white text-[#1F2937] shadow-md border border-[#EAEAEA] flex items-center justify-center hover:bg-[#FAFAF7] hover:scale-110 transition-all cursor-pointer"
          title="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={scrollRight}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white text-[#1F2937] shadow-md border border-[#EAEAEA] flex items-center justify-center hover:bg-[#FAFAF7] hover:scale-110 transition-all cursor-pointer"
          title="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Horizontal Scroll Track */}
        <div
          ref={sliderRef}
          className="flex items-stretch gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1"
        >
          {SLIDER_PRODUCTS.map((product) => {
            const isWishlisted = wishlist.includes(product.id);
            return (
              <div
                key={product.id}
                className="min-w-[220px] max-w-[240px] bg-white rounded-2xl border border-[#EAEAEA] shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden flex-shrink-0 group relative"
              >
                {/* Image Container */}
                <div className="relative aspect-square bg-[#FAFAF7] p-3 flex items-center justify-center overflow-hidden">
                  
                  {/* Red Discount Ribbon (-29%, -64%) */}
                  <span className="absolute bottom-2.5 left-2.5 z-10 bg-[#D72638] text-white text-[11px] font-extrabold px-2 py-0.5 rounded shadow-sm">
                    {product.discount}
                  </span>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full transition-all ${
                      isWishlisted
                        ? 'bg-rose-50 text-[#D72638]'
                        : 'text-[#6B7280] hover:text-[#D72638] bg-white/80'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#D72638]' : ''}`} />
                  </button>

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => setQuickViewProduct(product)}
                  />

                  {/* Quick View Button */}
                  <div className="absolute inset-x-2 bottom-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="w-full py-1.5 bg-white/95 text-[#1F2937] font-bold text-xs rounded-lg shadow-sm border border-[#EAEAEA] flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-600" />
                      <span>View</span>
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2 bg-white">
                  <div>
                    {/* Best Seller Tag / Rating */}
                    <div className="flex items-center justify-between gap-1 mb-1">
                      {product.isBestSeller ? (
                        <span className="bg-amber-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                          Best Seller
                        </span>
                      ) : <span />}
                      
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#6B7280] ml-auto">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <h4
                      onClick={() => setQuickViewProduct(product)}
                      className="text-xs font-bold text-[#1F2937] line-clamp-2 hover:text-[#D72638] cursor-pointer transition-colors leading-snug"
                    >
                      {product.name}
                    </h4>
                  </div>

                  {/* Pricing & Add to Cart */}
                  <div className="pt-2 border-t border-[#EAEAEA] flex items-center justify-between">
                    <div>
                      <span className="text-sm font-black text-[#D72638]">
                        ₹{product.price.toLocaleString('en-IN')}.00
                      </span>
                      <div className="text-[10px] text-[#6B7280] line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}.00
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.status === 'Out of Stock' || (product.stock !== undefined && Number(product.stock) <= 0)}
                      className={`p-2 rounded-xl text-white shadow-sm transition-all ${
                        product.status === 'Out of Stock' || (product.stock !== undefined && Number(product.stock) <= 0)
                          ? 'bg-stone-400 cursor-not-allowed opacity-75'
                          : 'bg-[#D72638] hover:bg-[#B71C2B] cursor-pointer'
                      }`}
                      title={product.status === 'Out of Stock' || (product.stock !== undefined && Number(product.stock) <= 0) ? "Out of Stock" : "Add to Cart"}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
