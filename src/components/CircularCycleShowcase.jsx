import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag, RotateCw, Play, Pause, Sparkles, Check, Heart, Zap, ShieldCheck, Truck, Star } from 'lucide-react';
import { useStore } from '../context/StoreContext';

// Dataset featuring Core Product Categories: Cycle, Scooter, Walker, Stroller, Electric Car, Hoverboard, Active Toys
const PRODUCT_CATEGORY_SHOWCASE = [
  {
    id: 'cat-walkers',
    name: 'First-Steps Baby Activity Walker',
    categoryName: 'Baby Walker',
    targetCategory: 'Baby Walkers',
    targetGridId: 'category-grid-baby-walkers',
    title: 'First-Steps',
    headline: 'Choose your baby walker',
    subtitle: '2-in-1 Sit-to-Stand Push Walker with Interactive Music Panel',
    price: 2999,
    formattedPrice: '₹2,999',
    heroImage: '/images/store/walkers/34.jpeg',
    cardImage: '/images/store/walkers/34.jpeg',
    symbol: '👶',
    symbolBg: 'from-purple-500/20 to-indigo-500/30',
    cardTag: '1st: Toddler Steps',
    accentBg: '#2C1E38', // Deep purple violet
    secondaryBg: '#1C1226',
    trackColor: '#52346B',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    badge: '1st: Walkers',
    specs: ['Anti-Flip Stoppers', 'Interactive Panel', 'Non-Toxic ABS']
  },
  {
    id: 'cat-strollers',
    name: 'Urban-Fold Luxury Stroller',
    categoryName: 'Urban Stroller',
    targetCategory: 'Strollers',
    targetGridId: 'category-grid-strollers',
    title: 'Urban Fold',
    headline: 'Choose your baby stroller',
    subtitle: 'One-Hand Fold System, UPF 50+ Canopy & All-Terrain Wheels',
    price: 7999,
    formattedPrice: '₹7,999',
    heroImage: '/images/store/scraller/sta.png',
    cardImage: '/images/store/scraller/sta.png',
    symbol: '🛒',
    symbolBg: 'from-emerald-500/20 to-teal-500/30',
    cardTag: '2nd: Prams & Strollers',
    accentBg: '#1E2D24', // Rich forest emerald
    secondaryBg: '#121D17',
    trackColor: '#34523F',
    glowColor: 'rgba(52, 211, 153, 0.4)',
    badge: '2nd: Strollers',
    specs: ['One-Hand Instant Fold', 'UPF 50+ Sun Canopy', 'Suspension Wheels']
  },
  {
    id: 'cat-scooters',
    name: 'Nitro-Glide 3-Wheel LED Scooter',
    categoryName: 'LED Scooter',
    targetCategory: 'Scooters',
    targetGridId: 'category-grid-scooters',
    title: 'Nitro-Glide',
    headline: 'Choose your glide scooter',
    subtitle: 'Lean-to-Steer Balance Tech with Magnetic Glowing PU Wheels',
    price: 3299,
    formattedPrice: '₹3,299',
    heroImage: '/images/cycles_showcase/led_scooter_glow.png',
    cardImage: '/images/cycles_showcase/led_scooter_glow.png',
    cardFallbackImg: '/images/cycles_showcase/led_scooter_glow.png',
    galleryFrames: [
      { id: 'frame-1', name: 'Full Neon Glow', image: '/images/cycles_showcase/led_scooter_glow.png', label: '⚡ Neon View' },
      { id: 'frame-2', name: 'LED Kinetic Wheels', image: '/images/cycles_showcase/led_scooter_wheels_glow.png', label: '✨ LED Wheels' },
      { id: 'frame-3', name: 'RGB Deck Lighting', image: '/images/cycles_showcase/led_scooter_deck_glow.png', label: '🌈 RGB Deck' }
    ],
    symbol: '🛴',
    symbolBg: 'from-sky-500/20 to-cyan-500/30',
    cardTag: '3rd: Ride-Ons & Scooters',
    accentBg: '#122436', // Midnight electric blue
    secondaryBg: '#0B1724',
    trackColor: '#1E3E5C',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    badge: '3rd: Scooters',
    specs: ['LED Kinetic Wheels', 'Adjustable Height', 'Lean-to-Steer']
  },
  {
    id: 'cat-cycles',
    name: 'FUNRADO Aero-Lite Baby Tricycle & Cycle',
    categoryName: 'Baby Cycle',
    targetCategory: 'Cycles',
    targetGridId: 'category-grid-cycles',
    title: 'Aero-Lite',
    headline: 'Choose your baby cycle',
    subtitle: 'Ergonomic 3-Wheel Push Tricycle with Parent Handle & Safety Seat',
    price: 5499,
    formattedPrice: '₹5,499',
    heroImage: '/images/cycles_showcase/hero_cycle.png',
    cardImage: '/images/cycles_showcase/hero_cycle.png',
    cardFallbackImg: '/images/cycles_showcase/baby_cycle.jpg',
    galleryFrames: [
      { id: 'cycle-frame-1', name: 'Original Baby Cycle', image: '/images/cycles_showcase/hero_cycle.png', label: '🚲 Aero-Lite Cycle' },
      { id: 'cycle-frame-2', name: 'Full Photo Frame', image: '/images/cycles_showcase/baby_cycle.jpg', label: '🖼️ Original Photo' },
      { id: 'cycle-frame-3', name: 'Baby Ride Frame', image: '/images/cycles_showcase/baby_tricycle_cutout.png', label: '👶 Baby Ride' }
    ],
    symbol: '🚲',
    symbolBg: 'from-cyan-500/20 to-teal-500/30',
    cardTag: '4th: Bikes & Cycles',
    accentBg: '#1A2A38', // Deep teal navy
    secondaryBg: '#0F1A24',
    trackColor: '#2B4A61',
    glowColor: 'rgba(45, 212, 191, 0.4)',
    badge: '4th: Bikes',
    specs: ['Parent Push Bar', '3-Wheel Balance', 'Safety Harness']
  },
  {
    id: 'cat-supercar',
    name: 'Lightning-GT 12V Electric Supercar',
    categoryName: 'Ride-On Car',
    targetCategory: 'Kids Cars',
    targetGridId: 'category-grid-kids-cars',
    title: 'Lightning GT',
    headline: 'Choose your electric ride-on',
    subtitle: 'Dual 45W Motors, Leather Seat, Bluetooth Audio & Parental Remote',
    price: 22999,
    formattedPrice: '₹22,999',
    heroImage: '/images/cycles_showcase/hero_supercar.png',
    cardImage: '/images/cycles_showcase/card_remote.png',
    cardFallbackImg: '/images/store/cars/1.jpeg',
    symbol: '🏎️',
    symbolBg: 'from-amber-500/20 to-yellow-500/30',
    cardTag: '5th: Electric Cars',
    accentBg: '#2B2212', // Amber cyber gold
    secondaryBg: '#1A140B',
    trackColor: '#59441D',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    badge: '5th: Cars',
    specs: ['Dual 45W Motors', '2.4G Wireless Remote', 'Leather Bucket Seat']
  },
  {
    id: 'cat-hoverboard',
    name: 'Smart-Glide RGB Bluetooth Hoverboard',
    categoryName: 'Hoverboard',
    targetCategory: 'Hoverboards',
    targetGridId: 'category-grid-hoverboards',
    title: 'Smart Glide',
    headline: 'Choose your hoverboard',
    subtitle: 'Self-Balancing Gyro Sensors, Integrated Wireless Speakers & RGB Lights',
    price: 8999,
    formattedPrice: '₹8,999',
    heroImage: '/images/cycles_showcase/hoverboard_flame.png',
    cardImage: '/images/cycles_showcase/hoverboard_flame.png',
    cardFallbackImg: '/images/cycles_showcase/hoverboard_flame.png',
    symbol: '🛹',
    symbolBg: 'from-indigo-500/20 to-blue-500/30',
    cardTag: '6th: Hoverboards',
    accentBg: '#1B263B', // Cyber indigo
    secondaryBg: '#0F172A',
    trackColor: '#334155',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    badge: '6th: Hoverboard',
    specs: ['Gyro Self-Balance', 'Dual 350W Motors', 'Bluetooth Speaker']
  },
  {
    id: 'cat-toys',
    name: 'Eco-Play Wooden Jungle Activity Gym',
    categoryName: 'Active Toys',
    targetCategory: 'Toys',
    targetGridId: 'category-grid-toys',
    title: 'Eco Play',
    headline: 'Choose your active toys',
    subtitle: 'FSC Certified Non-Toxic Wooden Climber, Slide & Sensory Sensory Set',
    price: 4999,
    formattedPrice: '₹4,999',
    heroImage: '/images/cycles_showcase/active_toy_rhino.png',
    cardImage: '/images/cycles_showcase/active_toy_rhino.png',
    cardFallbackImg: '/images/cycles_showcase/active_toy_rhino.png',
    symbol: '🧸',
    symbolBg: 'from-orange-500/20 to-amber-500/30',
    cardTag: 'Sensory & Active',
    accentBg: '#362419', // Warm wooden terra
    secondaryBg: '#21150E',
    trackColor: '#5E3E2B',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    badge: 'Creative Wooden Toys',
    specs: ['FSC Certified Wood', 'Eco Safe Finishes', 'Sensory Play']
  }
];

export const CircularCycleShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(1); // Default to LED Scooter
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const { addToCart, toggleWishlist, wishlist, setSelectedCategory } = useStore();
  const currentItem = PRODUCT_CATEGORY_SHOWCASE[activeIndex];

  // Continuous background circular rotation every 4.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % PRODUCT_CATEGORY_SHOWCASE.length);
    setActiveFrameIndex(0);
    setRotationAngle((prev) => prev + 60);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + PRODUCT_CATEGORY_SHOWCASE.length) % PRODUCT_CATEGORY_SHOWCASE.length);
    setActiveFrameIndex(0);
    setRotationAngle((prev) => prev - 60);
  };

  const handleSelectCard = (index) => {
    setActiveIndex(index);
    setActiveFrameIndex(0);
    setRotationAngle((index - activeIndex) * 60 + rotationAngle);
  };

  const handleProductClick = (e) => {
    if (e) e.stopPropagation();
    if (setSelectedCategory && currentItem.targetCategory) {
      setSelectedCategory(currentItem.targetCategory);
    }
    const gridEl = currentItem.targetGridId ? document.getElementById(currentItem.targetGridId) : null;
    const fallbackEl = document.getElementById('products-section');
    const el = gridEl || fallbackEl;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAddToCart = () => {
    setIsAutoplay(false);
    addToCart({
      id: currentItem.id,
      name: currentItem.name,
      price: currentItem.price,
      image: currentItem.heroImage,
      category: currentItem.targetCategory || 'Cycles & Toys'
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const isLiked = wishlist.includes(currentItem.id);

  return (
    <section 
      className="relative w-full overflow-hidden text-white py-12 md:py-20 my-8 shadow-2xl transition-colors duration-700 select-none"
      style={{ backgroundColor: currentItem.accentBg }}
    >
      {/* 
        ========================================================================
        1. CIRCULAR MOVING BACKGROUND LAYER (Moves in circular way from Left to Right)
        ========================================================================
      */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Massive Rotating Background Wheel */}
        <motion.div
          animate={{ rotate: rotationAngle }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -top-[50%] -left-[20%] w-[140vw] h-[140vw] max-w-[1600px] max-h-[1600px] rounded-full border border-white/10 opacity-40 flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${currentItem.glowColor} 0%, rgba(0,0,0,0) 75%)`
          }}
        >
          {/* Concentric Circular Race Track Rings */}
          <div className="w-[85%] h-[85%] rounded-full border border-dashed border-white/20 flex items-center justify-center">
            <div className="w-[70%] h-[70%] rounded-full border border-white/10 flex items-center justify-center">
              <div className="w-[50%] h-[50%] rounded-full border border-dashed border-white/15" />
            </div>
          </div>

          {/* Floating Light Glow Orbs */}
          <div className="absolute top-12 left-1/4 w-32 h-32 rounded-full bg-white/5 blur-xl" />
          <div className="absolute bottom-16 right-1/4 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
        </motion.div>

        {/* Ambient Grid Matrix Overlay */}
        <div 
          className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 0)`,
            backgroundSize: '28px 28px'
          }}
        />
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Header & Nav Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8">
          
          {/* Badge */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/20 text-amber-200">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              <span>{currentItem.badge}</span>
            </span>
            <span className="text-xs sm:text-sm text-white/70 font-medium hidden sm:inline">
              Interactive 3D Circular Arc Wheel
            </span>
          </div>

          {/* Category Tabs Pill Bar */}
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/10 overflow-x-auto max-w-full no-scrollbar">
            {PRODUCT_CATEGORY_SHOWCASE.map((cat, idx) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCard(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  idx === activeIndex
                    ? 'bg-white text-stone-950 shadow-md font-bold scale-105'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>

          {/* Autoplay & Arrow Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoplay(!isAutoplay)}
              title={isAutoplay ? 'Pause auto rotation' : 'Start auto rotation'}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer"
            >
              {isAutoplay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 
          ========================================================================
          2. PARABOLIC CIRCULAR ARC CATEGORY CARDS (TOP ARCH WITH SYMBOLS)
          ========================================================================
        */}
        <div className="relative w-full h-[170px] sm:h-[200px] md:h-[230px] flex items-center justify-center">
          <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
            {PRODUCT_CATEGORY_SHOWCASE.map((catItem, idx) => {
              const total = PRODUCT_CATEGORY_SHOWCASE.length;
              
              let diff = idx - activeIndex;
              if (diff > total / 2) diff -= total;
              if (diff < -total / 2) diff += total;

              const isVisible = Math.abs(diff) <= 2;
              if (!isVisible) return null;

              const angleDeg = diff * 22;
              const radiusX = typeof window !== 'undefined' && window.innerWidth < 640 ? 120 : 220; 
              const radiusY = typeof window !== 'undefined' && window.innerWidth < 640 ? 35 : 55;
              
              const rad = (angleDeg * Math.PI) / 180;
              const xPos = Math.sin(rad) * radiusX;
              const yPos = -Math.cos(rad) * radiusY + radiusY;
              const cardRotation = diff * 5;

              const isActive = idx === activeIndex;

              return (
                <motion.div
                  key={catItem.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{
                    x: xPos,
                    y: yPos,
                    rotate: cardRotation,
                    scale: isActive ? 1.12 : 1 - Math.abs(diff) * 0.1,
                    opacity: isActive ? 1 : 0.85 - Math.abs(diff) * 0.15,
                    zIndex: 30 - Math.abs(diff)
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 24
                  }}
                  onClick={() => handleSelectCard(idx)}
                  className="absolute cursor-pointer group"
                >
                  {/* Squircle Tile Card with 3D Symbol Icon inside */}
                  <div className={`relative w-24 h-24 sm:w-30 sm:h-30 md:w-36 md:h-36 rounded-2xl sm:rounded-3xl border shadow-2xl p-2 sm:p-3 flex flex-col items-center justify-between transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#FAF9F5] border-emerald-400/80 shadow-[0_12px_30px_rgba(0,0,0,0.5)] ring-4 ring-emerald-400/30' 
                      : 'bg-[#FAF9F5]/90 border-white/60 hover:bg-[#FAF9F5] hover:scale-105'
                  }`}>
                    
                    {/* Glowing Accent Ring */}
                    <div 
                      className={`absolute inset-0 rounded-2xl sm:rounded-3xl transition-opacity blur-md pointer-events-none ${
                        isActive ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'
                      }`}
                      style={{ backgroundColor: catItem.glowColor }}
                    />

                    {/* 3D Category Symbol Icon (Clean Emojis inside top squircle cards) */}
                    <div className={`relative w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${catItem.symbolBg || 'from-amber-500/20 to-orange-500/30'} shadow-inner border border-stone-200/80 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-2xl sm:text-3xl md:text-4xl drop-shadow-md transform -rotate-6 group-hover:rotate-0 transition-transform">
                        {catItem.symbol || '🚲'}
                      </span>
                    </div>

                    {/* Category Label & Tagline */}
                    <div className="w-full text-center">
                      <span className="block text-[11px] sm:text-xs font-black text-stone-900 tracking-tight leading-tight line-clamp-1">
                        {catItem.categoryName}
                      </span>
                      <span className="block text-[8px] sm:text-[9px] text-stone-500 font-semibold leading-tight line-clamp-1 mt-0.5">
                        {catItem.cardTag}
                      </span>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 
          ========================================================================
          3. RESTRUCTURED LAYOUT:
          - Left Column (lg:col-span-5): Headline, Subtitle, Specs, Price Pill & Action Buttons!
          - Center Column (lg:col-span-4): Product Image & Podium DIRECTLY IN CENTER!
          - Right Column (lg:col-span-3): MODEL NAME ("AERO-LITE", etc.) & Wishlist Heart!
          ========================================================================
        */}
        <div className="mt-2 sm:mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center z-20 relative">
          
          {/* LEFT COLUMN: Headlines, Specs, Price Tag & Action Buttons */}
          <div className="lg:col-span-5 text-center lg:text-left flex flex-col items-center lg:items-start space-y-3.5">
            
            {/* Headline */}
            <motion.h3 
              key={`headline-${currentItem.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-serif drop-shadow-md capitalize leading-tight"
            >
              {currentItem.headline}
            </motion.h3>

            <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed max-w-sm">
              {currentItem.subtitle}
            </p>

            {/* Key Specs Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              {currentItem.specs?.map((spec, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 rounded-lg bg-black/30 border border-white/15 text-[11px] font-semibold text-stone-200"
                >
                  ✓ {spec}
                </span>
              ))}
            </div>

            {/* Price Pill Tag on Left Side */}
            <motion.div 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-[#FAF9F5] text-stone-900 rounded-2xl px-5 py-2.5 shadow-2xl border border-white flex items-center gap-3 cursor-pointer group my-1"
              onClick={handleAddToCart}
            >
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-stone-500">Special Price</span>
                <span className="text-base sm:text-xl font-black tracking-tight text-stone-900">
                  {currentItem.formattedPrice}
                </span>
              </div>

              <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                {addedAnimation ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <ShoppingBag className="w-4 h-4" />
                )}
              </div>
            </motion.div>

            {/* Action Buttons on Left Side */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-1">
              <button
                onClick={handleAddToCart}
                className="w-full sm:flex-1 bg-white hover:bg-emerald-50 text-stone-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-700" />
                <span>Add {currentItem.categoryName} to Bag</span>
              </button>

              <button
                onClick={handleNext}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-full backdrop-blur-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Next Category</span>
              </button>
            </div>

            {/* Delivery Badge */}
            <div className="flex items-center gap-2 text-[11px] text-white/70 pt-1">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Free Express Delivery & Child-Safe Warranty</span>
            </div>
          </div>

          {/* CENTER COLUMN: PRODUCT IMAGE & RACE PODIUM (DIRECTLY IN CENTER!) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative my-4 sm:my-0">
            <div className="relative w-72 sm:w-88 md:w-[380px] h-64 sm:h-72 md:h-80 flex items-center justify-center">
              
              {/* Soft Ambient Light Glow */}
              <motion.div 
                key={`glow-${currentItem.id}-${activeFrameIndex}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 0.6 }}
                transition={{ duration: 0.8 }}
                className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full blur-3xl"
                style={{ backgroundColor: currentItem.glowColor }}
              />

              {/* Centerpiece Hero Product Image */}
              <motion.img
                key={`${currentItem.id}-${activeFrameIndex}`}
                src={
                  currentItem.galleryFrames && currentItem.galleryFrames[activeFrameIndex]
                    ? currentItem.galleryFrames[activeFrameIndex].image
                    : currentItem.heroImage
                }
                alt={currentItem.name}
                onClick={handleProductClick}
                title={`Click to open ${currentItem.targetCategory || currentItem.categoryName} Collection`}
                onError={(e) => {
                  if (currentItem.cardFallbackImg && e.target.src !== currentItem.cardFallbackImg) {
                    e.target.src = currentItem.cardFallbackImg;
                  } else {
                    e.target.src = '/images/cycles_showcase/hero_cycle.png';
                  }
                }}
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: [0, -22, 0, -12, 0] 
                }}
                transition={{ 
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                  y: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' }
                }}
                className="relative z-20 max-h-[250px] sm:max-h-[290px] md:max-h-[330px] w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] cursor-pointer hover:scale-105 transition-transform duration-300"
              />
            </div>



            {/* Podium Track Ground Layer */}
            <div className="relative -mt-14 sm:-mt-18 w-full max-w-sm h-20 sm:h-24 flex items-end justify-center pointer-events-none overflow-hidden">
              <svg 
                className="w-full h-full text-stone-900/60 drop-shadow-xl" 
                viewBox="0 0 1000 200" 
                preserveAspectRatio="none"
                fill="currentColor"
              >
                <path 
                  d="M 0,200 Q 250,50 500,100 T 1000,200 Z" 
                  fill={currentItem.trackColor} 
                  opacity="0.9"
                />
                <path 
                  d="M 0,200 Q 300,120 500,70 T 1000,200 Z" 
                  fill={currentItem.secondaryBg} 
                  opacity="0.8"
                />
              </svg>
            </div>
          </div>

          {/* RIGHT COLUMN: MODEL NAME TEXT (E.G. "AERO-LITE", "NITRO-GLIDE") & WISHLIST HEART */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-end justify-center space-y-4 text-center lg:text-right">
            
            {/* Serif Model Name Title Text on Right Side */}
            <motion.h2 
              key={`title-${currentItem.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 0.9, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white/90 font-serif drop-shadow-[0_6px_16px_rgba(0,0,0,0.7)] uppercase whitespace-nowrap"
            >
              {currentItem.title}
            </motion.h2>

            {/* Wishlist Heart Button */}
            <button
              onClick={() => toggleWishlist(currentItem.id)}
              className={`p-3 rounded-full border transition-all cursor-pointer shadow-lg flex items-center gap-2 ${
                isLiked 
                  ? 'bg-rose-500 text-white border-rose-400 scale-105' 
                  : 'bg-black/40 text-white/80 border-white/20 hover:text-white hover:bg-black/60'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs font-bold">{isLiked ? 'Saved' : 'Save to Wishlist'}</span>
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};
