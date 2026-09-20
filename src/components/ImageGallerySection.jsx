import React, { useState } from 'react';
import { Camera, Eye, X, ChevronLeft, ChevronRight, ShoppingBag, Check, ZoomIn, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

export const ImageGallerySection = () => {
  const { addToCart, buyNow, setQuickViewProduct, products } = useStore();
  const { requireAuth } = useAuth();
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Gallery items - Every single item has a 100% UNIQUE image path with ZERO repetition!
  const GALLERY_ITEMS = [
    {
      id: 'g-vespa',
      title: 'Retro Vintage Italia Vespa Electric Scooter',
      category: 'Luxury Superbikes & Vespa Scooters',
      tag: 'ITALIAN VINTAGE',
      image: '/images/ride-ons/retro-mint-vespa.jpg',
      productId: 'rideon-vespa-mint',
      price: 11999,
      description: 'Charming classic Italian Vespa design in pastel cream and mint green with plush tan leather backrest seat, chrome rearview mirrors, vintage round LED lamp, and MP3 tunes.'
    },
    {
      id: 'g-hoverboard',
      title: 'Smart 8.5" All-Terrain Bluetooth Hoverboard',
      category: 'Hoverboards & Smart Wheels',
      tag: 'GRAFFITI ART',
      image: '/images/ride-ons/smart-hoverboards.jpg',
      productId: 'rideon-smart-hoverboard',
      price: 12499,
      description: 'High-performance 8.5-inch wide-wheel self-balancing hoverboard featuring graffiti art shell, dual 350W motors, auto-balancing gyro tech, Bluetooth stereo speaker, and LED arch lights.'
    },
    {
      id: 'g-hummer-orange',
      title: 'Mini Motion MM-1188 4x4 Off-Road Hummer',
      category: 'Electric Ride-On Cars & 4x4s',
      tag: 'MONSTER HUMMER',
      image: '/images/ride-ons/hummer-black-orange.jpg',
      productId: 'rideon-hummer-orange',
      price: 19499,
      description: 'Limited Edition 4x4 Monster Hummer with aggressive black and orange styling, quad roof searchlights, white-wall monster wheels, front winch hook, and 2.4G parental remote.'
    },
    {
      id: 'g-rhino-walker',
      title: 'TOI TOYS Pastel Pink Rhino Push Walker Car',
      category: 'Toddler Push Cars & Walkers',
      tag: 'TODDLER WALKER',
      image: '/images/ride-ons/rhino-toddler-walker.jpg',
      productId: 'rideon-rhino-walker',
      price: 2499,
      description: 'Cute pastel pink Rhino push-along walker car with squeaker horn steering wheel, under-seat secret toy storage, anti-flip safety rear stopper, and silent rubber wheels.'
    },
    {
      id: 'g-crimson-g',
      title: 'Crimson Red Mercedes G-Wagon RK-411 LED',
      category: 'Electric Ride-On Cars & 4x4s',
      tag: 'LED MATRIX SCREEN',
      image: '/images/ride-ons/crimson-g-wagon-led.jpg',
      productId: 'rideon-g-crimson-led',
      price: 18999,
      description: 'Spectacular Crimson Red & Gloss Black Mercedes G-Wagon equipped with a revolutionary green star LED matrix windshield screen, twin overhead searchlights, and 2.4G remote.'
    },
    {
      id: 'g-rr-1',
      title: 'Rolls-Royce Phantom Two-Tone Roadster',
      category: 'Electric Ride-On Cars & 4x4s',
      tag: 'LUXURY CONVERTIBLE',
      image: '/images/ride-ons/rolls-royce-phantom.jpg',
      productId: 'rideon-rolls-phantom',
      price: 22999,
      description: 'Iconic black and silver two-tone Rolls-Royce Phantom ride-on with chrome grille, Spirit of Ecstasy emblem, plush double leather seats, soft-start pedal, and 2.4G parental remote.'
    },
    {
      id: 'g-rr-2',
      title: 'Rolls-Royce Vision Concept Roadster',
      category: 'Electric Ride-On Cars & 4x4s',
      tag: 'CONCEPT SUPERCAR',
      image: '/images/ride-ons/rolls-royce-futuristic.jpg',
      productId: 'rideon-rolls-futuristic',
      price: 24999,
      description: 'Futuristic luxury concept coupe with silver metallic body, illuminated matrix mesh front grille, deep burgundy leather interior, dual 12V motors, and silent-glide EVA whisper tires.'
    },
    {
      id: 'g-g63-police',
      title: 'Mercedes-AMG G63 Police Patrol 4x4 (BH-80A)',
      category: 'Electric Ride-On Cars & 4x4s',
      tag: 'G-WAGON POLICE',
      image: '/images/ride-ons/mercedes-g63-police.jpg',
      productId: 'rideon-g63-police',
      price: 19999,
      description: 'G-Wagon 4x4 Police Edition with vertical Panamericana chrome grille, roof searchlight bar, working police siren, opening side doors, all-terrain suspension, and 2.4G remote.'
    },
    {
      id: 'g-wrangler',
      title: 'Jeep Wrangler Rubicon 4x4 Trail Edition (BH-826)',
      category: 'Electric Ride-On Cars & 4x4s',
      tag: 'TRAIL RATED 4X4',
      image: '/images/ride-ons/black-wrangler-jeep.jpg',
      productId: 'rideon-wrangler-black',
      price: 17999,
      description: 'Rugged Jeep Wrangler Rubicon with yellow halo DRL headlights, bumper tow hooks, overhead LED light bar, tube doors, dual high-torque motors, and 4-wheel spring shocks.'
    },
    {
      id: 'g-blue-buggy',
      title: 'Mountain Explorer 4x4 UTV Buggy (Blue & Orange)',
      category: 'Electric Ride-On Cars & 4x4s',
      tag: '4X4 MONSTER BUGGY',
      image: '/images/ride-ons/blue-orange-buggy.jpg',
      productId: 'rideon-blue-buggy',
      price: 21999,
      description: 'Extreme 2-seater Mountain Explorer Buggy with ocean blue paint, orange roll cage accents, projector headlights, roof strobes, knobby tread tires, and quad-motor drive.'
    },
    {
      id: 'g-1',
      title: 'Neon Green 4x4 Off-Road Monster Truck',
      category: 'Electric Ride-On Cars & 4x4s',
      tag: 'NEON LED TRUCK',
      image: '/images/ride-ons/green-monster-truck.jpg',
      productId: 'rideon-green-truck',
      price: 18999,
      description: 'Heavy-duty 4x4 Off-Road Monster Truck featuring neon green front LED grille, roof searchlights, oversized monster wheels, dual 12V motors, and 2.4G parental remote.'
    },
    {
      id: 'g-2',
      title: 'Police Patrol Special Forces SUV Patrol Jeep',
      category: 'Electric Ride-On Cars & 4x4s',
      tag: 'PATROL SUV',
      image: '/images/ride-ons/black-police-jeep.jpg',
      productId: 'rideon-police-jeep',
      price: 16999,
      description: 'Official Special Edition Police Patrol 4x4 Ride-On Jeep with working police siren lights, twin searchlights, PA megaphone speaker horn, and spring suspension.'
    },
    {
      id: 'g-3',
      title: 'Royal Enfield Classic 350 Hunter Edition',
      category: 'Luxury Superbikes & Vespa Scooters',
      tag: '126 CM SCALE',
      image: '/images/ride-ons/royal-enfield-bike.jpg',
      productId: 'rideon-royal-enfield',
      price: 14999,
      description: 'Authentic Royal Enfield Classic 350 electric ride-on motorcycle with retro teardrop tank, tan leather seat, key start engine rev sound, and dual training wheels.'
    },
    {
      id: 'g-4',
      title: 'R1250 GS Adventure 3-Wheel Trike (Stealth Black)',
      category: 'Luxury Superbikes & Vespa Scooters',
      tag: 'STEALTH GS',
      image: '/images/ride-ons/black-gs-motorbike.jpg',
      productId: 'rideon-gs-black',
      price: 12999,
      description: 'High-performance stealth black 3-wheel electric tourer motorbike with bright LED headlights, metal crash bar protection, digital battery gauge, and foot pedal.'
    },
    {
      id: 'g-5',
      title: 'R1250 GS Sport 3-Wheel Trike (Racing Red)',
      category: 'Luxury Superbikes & Vespa Scooters',
      tag: 'RACING RED',
      image: '/images/ride-ons/red-gs-motorbike.jpg',
      productId: 'rideon-gs-red',
      price: 12999,
      description: 'Dynamic Racing Red 3-wheel adventure motorbike with red rim stripes, wind deflector, hand guards, built-in music, and forward/reverse gear.'
    }
  ];

  const categories = [
    'All',
    'Electric Ride-On Cars & 4x4s',
    'Luxury Superbikes & Vespa Scooters',
    'Hoverboards & Smart Wheels',
    'Toddler Push Cars & Walkers'
  ];

  const filteredItems = activeCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  const handlePrevLightbox = (e) => {
    e?.stopPropagation();
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
    setIsZoomed(false);
  };

  const handleNextLightbox = (e) => {
    e?.stopPropagation();
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
    setIsZoomed(false);
  };

  const activeItem = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  return (
    <section id="gallery-section" className="py-0 px-3 sm:px-6 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-2 space-y-1">
        <div className="inline-flex items-center gap-2 bg-brand-roseTint text-brand-burgundy px-3 py-0.5 rounded-full text-[11px] font-extrabold tracking-wider uppercase border border-brand-burgundy/15 animate-pulse">
          <Camera className="w-3.5 h-3.5 text-brand-burgundy" />
          <span>Interactive HD Photo Gallery</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
          Explore Our High-Resolution Ride-On & Vehicle Showcase
        </h2>
        <p className="text-xs text-stone-600 font-medium">
          Filter by vehicle category, inspect high-resolution photos, examine specs, and experience smooth interactive previews!
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap mb-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs font-extrabold px-5 py-2.5 rounded-2xl transition-all duration-300 transform active:scale-95 border ${
                isActive
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xl scale-105 ring-2 ring-stone-900/20'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900 hover:shadow-md'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Masonry / Responsive Animated Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => {
              setActiveLightboxIndex(idx);
              setIsZoomed(false);
            }}
            className="group relative bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col justify-between"
          >
            {/* Tag Badge */}
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-stone-900/90 backdrop-blur text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                {item.tag}
              </span>
            </div>

            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-[#FAF6F0] to-[#EFE7DC] p-3 flex items-center justify-center">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 img-hd-sharp drop-shadow-sm"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
              />

              {/* Hover Overlay - Crystal Clear Image without Blur */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 pointer-events-none">
                <span className="bg-white/95 backdrop-blur-md text-stone-900 text-xs font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform border border-stone-200/80">
                  <Eye className="w-3.5 h-3.5 text-brand-burgundy" />
                  <span>Inspect HD</span>
                </span>
              </div>
            </div>

            {/* Product Card Details */}
            <div className="p-3.5 bg-white space-y-2 flex-1 flex flex-col justify-between z-10">
              <div>
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block line-clamp-1">
                  {item.category}
                </span>
                <h3 className="text-xs font-bold text-stone-900 line-clamp-1 group-hover:text-brand-burgundy transition-colors">
                  {item.title}
                </h3>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <span className="text-sm font-extrabold text-stone-900">
                  ₹{item.price.toLocaleString('en-IN')}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const targetProduct = products.find(p => p.id === item.productId) || {
                      id: item.productId,
                      name: item.title,
                      price: item.price,
                      image: item.image,
                      category: item.category,
                      ageGroup: '12 To 36 Months'
                    };
                    buyNow(targetProduct);
                  }}
                  className="bg-brand-burgundy hover:bg-brand-burgundyDark text-white p-1.5 px-2.5 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1 text-[11px] font-bold"
                  title="Add to Cart"
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>Buy</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Lightbox High-Res Animated Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          
          {/* Main Lightbox Box */}
          <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-stone-200 relative grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] animate-slide-in-right">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setActiveLightboxIndex(null);
                setIsZoomed(false);
              }}
              className="absolute top-4 right-4 z-20 bg-stone-900/80 hover:bg-stone-900 text-white p-2.5 rounded-full shadow-lg transition-all hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left/Prev Control */}
            <button
              onClick={handlePrevLightbox}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-stone-800 p-3 rounded-full shadow-xl transition-all hover:scale-110"
              title="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right/Next Control */}
            <button
              onClick={handleNextLightbox}
              className="absolute right-16 lg:right-4 top-4 lg:top-1/2 lg:-translate-y-1/2 z-20 bg-white/90 hover:bg-white text-stone-800 p-3 rounded-full shadow-xl transition-all hover:scale-110"
              title="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Left Image View Area (7 cols) */}
            <div className="lg:col-span-7 bg-gradient-to-b from-[#FAF6F0] via-[#EFE7DC] to-[#E5DACB] p-6 flex flex-col justify-center items-center relative overflow-hidden min-h-[340px] sm:min-h-[450px]">
              
              <div 
                onClick={() => setIsZoomed(!isZoomed)}
                className={`relative w-full h-full flex items-center justify-center cursor-zoom-in transition-transform duration-500 ${
                  isZoomed ? 'scale-150 z-10' : 'scale-100'
                }`}
              >
                <img
                  src={activeItem.image}
                  alt={activeItem.title}
                  className="max-h-[380px] w-full object-contain img-hd-sharp drop-shadow-md transition-all duration-300"
                  style={{ imageRendering: '-webkit-optimize-contrast' }}
                />
              </div>

              {/* Zoom hint toggle button */}
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="absolute bottom-4 left-4 bg-stone-900/80 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur flex items-center gap-1.5"
              >
                <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                <span>{isZoomed ? 'Click to Reset Zoom' : 'Click Photo to Zoom In'}</span>
              </button>

              {/* Photo counter */}
              <div className="absolute top-4 left-4 bg-white/90 text-stone-800 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-sm">
                Photo {activeLightboxIndex + 1} of {filteredItems.length}
              </div>
            </div>

            {/* Right Information Area (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-brand-roseTint text-brand-burgundy text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-brand-burgundy/15">
                    {activeItem.tag}
                  </span>
                  <span className="text-xs font-bold text-stone-500 line-clamp-1">{activeItem.category}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                  {activeItem.title}
                </h3>

                <div className="text-2xl font-black text-brand-burgundy">
                  ₹{activeItem.price.toLocaleString('en-IN')}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed font-medium">
                  {activeItem.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-stone-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Official FUNRADO High-Resolution HD Inspection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Parental Remote Control & Safety Certification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Free Nationwide Express Doorstep Delivery</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 space-y-2.5">
                <button
                  onClick={() => {
                    const targetProduct = products.find(p => p.id === activeItem.productId) || {
                      id: activeItem.productId,
                      name: activeItem.title,
                      price: activeItem.price,
                      image: activeItem.image,
                      category: activeItem.category,
                      ageGroup: '12 To 36 Months'
                    };
                    buyNow(targetProduct);
                    setActiveLightboxIndex(null);
                  }}
                  className="w-full bg-brand-burgundy hover:bg-brand-burgundyDark text-white font-extrabold text-xs sm:text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy Now / Add to Cart</span>
                </button>

                <button
                  onClick={() => {
                    const targetProduct = products.find(p => p.id === activeItem.productId);
                    if (targetProduct) {
                      setQuickViewProduct(targetProduct);
                      setActiveLightboxIndex(null);
                    }
                  }}
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs py-2.5 rounded-2xl transition-all"
                >
                  View Full Product Specifications
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </section>
  );
};
