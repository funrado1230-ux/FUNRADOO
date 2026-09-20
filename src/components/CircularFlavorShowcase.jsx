import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag, RotateCw, Play, Pause, Sparkles, Check, Heart, Leaf } from 'lucide-react';
import { useStore } from '../context/StoreContext';

// Dataset of Flavors & Ingredients matching reference image aesthetic
const FLAVOR_DATA = [
  {
    id: 'strawberry-matcha',
    name: 'Strawberry Matcha',
    title: 'Strawberry',
    headline: 'Choose your matcha tea',
    subtitle: 'Creamy Ceremonial Matcha & Fresh Wild Strawberry Puree',
    price: 19.33,
    image: '/images/flavors/strawberry_matcha.png',
    accentBg: '#324021', // Dark organic olive green
    secondaryBg: '#232d17',
    powderColor: '#4a5d32',
    glowColor: 'rgba(235, 87, 87, 0.4)',
    badge: 'Popular Choice',
    ingredients: [
      { id: 'ing-1', name: 'Cranberries', emoji: '🍒', color: '#E63946', desc: 'Fresh Wild Cranberries' },
      { id: 'ing-2', name: 'Raspberries', emoji: '🍇', color: '#D62828', desc: 'Organic Raspberries' },
      { id: 'ing-3', name: 'Tea Leaves', emoji: '🍃', color: '#2A9D8F', desc: 'Ceremonial Matcha Leaves' },
      { id: 'ing-4', name: 'Blueberry', emoji: '🫐', color: '#457B9D', desc: 'Handpicked Blueberries' },
      { id: 'ing-5', name: 'Strawberry', emoji: '🍓', color: '#F72585', desc: 'Ripe Sweet Strawberries' }
    ]
  },
  {
    id: 'mango-matcha',
    name: 'Mango Passion Matcha',
    title: 'Mango Passion',
    headline: 'Tropical Matcha Infusion',
    subtitle: 'Golden Mango Coulis Layered with Velvety Oat Foam & Matcha',
    price: 18.50,
    image: '/images/flavors/mango_matcha.png',
    accentBg: '#3a2d18', // Deep warm amber olive
    secondaryBg: '#281f0f',
    powderColor: '#634e26',
    glowColor: 'rgba(244, 162, 97, 0.4)',
    badge: 'Summer Special',
    ingredients: [
      { id: 'ing-m1', name: 'Ripe Mango', emoji: '🥭', color: '#F4A261', desc: 'Alphonso Mango Puree' },
      { id: 'ing-m2', name: 'Passionfruit', emoji: '💛', color: '#E9C46A', desc: 'Zesty Passion Seeds' },
      { id: 'ing-m3', name: 'Matcha Foam', emoji: '🍵', color: '#2A9D8F', desc: 'Whisked Ceremonial Powder' },
      { id: 'ing-m4', name: 'Oat Milk', emoji: '🥛', color: '#E76F51', desc: 'Organic Barista Blend' },
      { id: 'ing-m5', name: 'Coconut Cream', emoji: '🥥', color: '#FFFFFF', desc: 'Cold Pressed Cream' }
    ]
  },
  {
    id: 'blueberry-matcha',
    name: 'Blueberry Velvet Matcha',
    title: 'Blueberry',
    headline: 'Antioxidant Rich Blend',
    subtitle: 'Wild Mountain Blueberry Preserve with Uji Ceremonial Matcha',
    price: 20.10,
    image: '/images/flavors/blueberry_matcha.png',
    accentBg: '#1f2538', // Midnight blue tint
    secondaryBg: '#151926',
    powderColor: '#343f5e',
    glowColor: 'rgba(106, 76, 147, 0.4)',
    badge: 'Limited Reserve',
    ingredients: [
      { id: 'ing-b1', name: 'Blueberry', emoji: '🫐', color: '#457B9D', desc: 'Wild Mountain Berry' },
      { id: 'ing-b2', name: 'Blackberry', emoji: '🍇', color: '#3A0CA3', desc: 'Juicy Dark Blackberry' },
      { id: 'ing-b3', name: 'Matcha Leaf', emoji: '🌿', color: '#2A9D8F', desc: 'Shade-Grown Tencha' },
      { id: 'ing-b4', name: 'Vanilla Cream', emoji: '🍦', color: '#E0E1DD', desc: 'Madagascar Vanilla' },
      { id: 'ing-b5', name: 'Acai Extract', emoji: '🔮', color: '#7209B7', desc: 'Superfood Boost' }
    ]
  }
];

export const CircularFlavorShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const currentFlavor = FLAVOR_DATA[activeIndex];

  // Auto spin timer for background circular motion
  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoplay, activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % FLAVOR_DATA.length);
    setRotationAngle((prev) => prev + 120);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + FLAVOR_DATA.length) % FLAVOR_DATA.length);
    setRotationAngle((prev) => prev - 120);
  };

  const handleAddToCart = () => {
    addToCart({
      id: `matcha-drink-${currentFlavor.id}`,
      name: `${currentFlavor.name} Tea`,
      price: currentFlavor.price,
      image: currentFlavor.image,
      category: 'Beverages'
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const isLiked = wishlist.includes(`matcha-drink-${currentFlavor.id}`);

  return (
    <section className="relative w-full overflow-hidden bg-[#2C381E] text-white py-12 md:py-20 my-8 shadow-2xl transition-colors duration-700 select-none"
      style={{ backgroundColor: currentFlavor.accentBg }}
    >
      {/* 
        ========================================================================
        1. CIRCULAR MOVING BACKGROUND LAYER (Rotates & translate from Left to Right)
        ========================================================================
      */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Massive Rotating Background Disk / Wheel */}
        <motion.div
          animate={{ rotate: rotationAngle }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -top-[50%] -left-[20%] w-[140vw] h-[140vw] max-w-[1600px] max-h-[1600px] rounded-full border border-white/10 opacity-40 flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${currentFlavor.glowColor} 0%, rgba(0,0,0,0) 70%)`
          }}
        >
          {/* Concentric Decorative Circular Orbit Lines */}
          <div className="w-[85%] h-[85%] rounded-full border border-dashed border-white/20 flex items-center justify-center">
            <div className="w-[70%] h-[70%] rounded-full border border-white/10 flex items-center justify-center">
              <div className="w-[50%] h-[50%] rounded-full border border-dashed border-white/15" />
            </div>
          </div>

          {/* Floating Organic Circular Orbs on the Rotating Rim */}
          <div className="absolute top-10 left-1/4 w-32 h-32 rounded-full bg-white/5 blur-xl" />
          <div className="absolute bottom-16 right-1/4 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
        </motion.div>

        {/* Ambient Subtle Particle Grid */}
        <div 
          className="absolute inset-0 opacity-15 mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Header & Flavor Navigator Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-10">
          
          {/* Badge & Subtitle */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{currentFlavor.badge}</span>
            </span>
            <span className="text-xs sm:text-sm text-white/70 font-medium hidden sm:inline">
              Interactive 3D Circular Arc View
            </span>
          </div>

          {/* Flavor Tabs Selector */}
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md p-1.5 rounded-full border border-white/10">
            {FLAVOR_DATA.map((flavor, idx) => (
              <button
                key={flavor.id}
                onClick={() => {
                  setActiveIndex(idx);
                  setRotationAngle((idx - activeIndex) * 120 + rotationAngle);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  idx === activeIndex
                    ? 'bg-white text-stone-950 shadow-md font-bold scale-105'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {flavor.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Autoplay & Wheel Nav Controls */}
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
          2. CIRCULAR ARC INGREDIENTS CARDS (Matching Reference Screenshot)
          ========================================================================
        */}
        <div className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] flex items-center justify-center">
          <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
            {currentFlavor.ingredients.map((ing, idx) => {
              // Calculate curved arc trajectory along a parabola / semi-circle
              const total = currentFlavor.ingredients.length;
              const centerIdx = (total - 1) / 2;
              const offsetFromCenter = idx - centerIdx; // e.g. -2, -1, 0, 1, 2
              
              // Arc curvature parameters
              const angleDeg = offsetFromCenter * 20; // degree spacing
              const radiusX = typeof window !== 'undefined' && window.innerWidth < 640 ? 120 : 210; 
              const radiusY = typeof window !== 'undefined' && window.innerWidth < 640 ? 35 : 55;
              
              const rad = (angleDeg * Math.PI) / 180;
              const xPos = Math.sin(rad) * radiusX;
              const yPos = -Math.cos(rad) * radiusY + radiusY; // downward arc curves at ends
              const cardRotation = offsetFromCenter * 6; // tilt along curvature

              return (
                <motion.div
                  key={ing.id}
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{
                    x: xPos,
                    y: yPos,
                    rotate: cardRotation,
                    scale: 1 - Math.abs(offsetFromCenter) * 0.08,
                    opacity: 1 - Math.abs(offsetFromCenter) * 0.15,
                    zIndex: 20 - Math.abs(offsetFromCenter)
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 24
                  }}
                  className="absolute cursor-pointer group"
                  onClick={() => {
                    // Slight wiggle or focus effect on click
                  }}
                >
                  {/* Ingredient Squircle Tile Card */}
                  <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-2xl sm:rounded-3xl bg-[#F4F5E6] border border-white/60 shadow-xl p-2 sm:p-4 flex flex-col items-center justify-center group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300">
                    {/* Glowing Shadow underneath */}
                    <div 
                      className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-40 transition-opacity blur-md"
                      style={{ backgroundColor: ing.color }}
                    />
                    
                    {/* Emoji / Ingredient Icon */}
                    <span className="text-3xl sm:text-4xl md:text-5xl transform group-hover:scale-115 transition-transform duration-300 drop-shadow-md">
                      {ing.emoji}
                    </span>

                    {/* Label */}
                    <span className="mt-1 sm:mt-2 text-[10px] sm:text-xs font-bold text-stone-800 text-center line-clamp-1">
                      {ing.name}
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-stone-500 font-medium hidden md:block">
                      {ing.desc}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 
          ========================================================================
          3. CENTERPIECE PRODUCT (Layered Iced Glass on Powder Mountain)
          ========================================================================
        */}
        <div className="relative w-full flex flex-col items-center justify-center -mt-8 sm:-mt-12 z-20">
          
          {/* Glass Drink Showcase */}
          <div className="relative w-64 sm:w-80 md:w-96 aspect-[3/4] flex items-center justify-center">
            
            {/* Soft Ambient Light Glow Behind Glass */}
            <motion.div 
              key={`glow-${currentFlavor.id}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.6 }}
              transition={{ duration: 0.8 }}
              className="absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full blur-3xl"
              style={{ backgroundColor: currentFlavor.glowColor }}
            />

            {/* Overlaid Title Text Across Drink (Like "Strawberry" in screenshot) */}
            <motion.h2 
              key={`title-${currentFlavor.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 0.9, y: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight text-white/90 font-bold z-30 pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] text-center whitespace-nowrap"
            >
              {currentFlavor.title}
            </motion.h2>

            {/* Beverage Glass Image */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentFlavor.id}
                src={currentFlavor.image}
                alt={currentFlavor.name}
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: [0, -8, 0] 
                }}
                exit={{ opacity: 0, scale: 0.85, y: -20 }}
                transition={{ 
                  opacity: { duration: 0.4 },
                  scale: { duration: 0.4 },
                  y: { repeat: Infinity, duration: 4, ease: 'easeInOut' }
                }}
                className="relative z-20 max-h-[280px] sm:max-h-[360px] md:max-h-[420px] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]"
              />
            </AnimatePresence>

            {/* Floating Heart / Like Button on Top Right of Glass */}
            <button
              onClick={() => toggleWishlist(`matcha-drink-${currentFlavor.id}`)}
              className={`absolute top-4 right-4 z-40 p-2.5 rounded-full backdrop-blur-md border transition-all cursor-pointer shadow-lg ${
                isLiked 
                  ? 'bg-rose-500 text-white border-rose-400 scale-110' 
                  : 'bg-black/40 text-white/80 border-white/20 hover:text-white hover:bg-black/60'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* 
            Powder Mountain Pedestal Layer (Bottom Hills matching reference screenshot)
          */}
          <div className="relative -mt-16 sm:-mt-20 w-full max-w-3xl h-24 sm:h-32 flex items-end justify-center pointer-events-none overflow-hidden">
            {/* SVG Powder Hill Texture Path */}
            <svg 
              className="w-full h-full text-stone-900/60 drop-shadow-xl" 
              viewBox="0 0 1000 200" 
              preserveAspectRatio="none"
              fill="currentColor"
            >
              <path 
                d="M 0,200 Q 250,50 500,100 T 1000,200 Z" 
                fill={currentFlavor.powderColor} 
                opacity="0.9"
              />
              <path 
                d="M 0,200 Q 300,120 500,70 T 1000,200 Z" 
                fill={currentFlavor.secondaryBg} 
                opacity="0.8"
              />
            </svg>
          </div>

          {/* Floating Price Pill Card & Add to Cart Button (Matching screenshot) */}
          <div className="relative -mt-12 sm:-mt-16 z-30 flex flex-col items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#F4F5E6] text-stone-900 rounded-2xl px-4 py-2 shadow-2xl border border-white flex flex-col items-center justify-center gap-1 font-sans cursor-pointer group"
              onClick={handleAddToCart}
            >
              <span className="text-xs sm:text-sm font-black tracking-tight text-stone-900">
                ${currentFlavor.price.toFixed(2)}
              </span>

              <div className="w-7 h-7 rounded-xl bg-stone-900 text-white flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                {addedAnimation ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <ShoppingBag className="w-3.5 h-3.5" />
                )}
              </div>
            </motion.div>
          </div>

          {/* 
            ========================================================================
            4. MAIN DISPLAY HEADLINE & ACTION (e.g., "Choose your matcha tea")
            ========================================================================
          */}
          <div className="mt-8 sm:mt-12 text-center max-w-xl px-4 z-20">
            <motion.h3 
              key={`headline-${currentFlavor.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white font-serif drop-shadow-md"
            >
              {currentFlavor.headline}
            </motion.h3>

            <p className="mt-2 text-xs sm:text-base text-white/80 font-medium max-w-md mx-auto">
              {currentFlavor.subtitle}
            </p>

            {/* Quick Action Button Bar */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                onClick={handleAddToCart}
                className="bg-white hover:bg-emerald-50 text-stone-950 font-black text-xs sm:text-sm px-6 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-700" />
                <span>Add {currentFlavor.name.split(' ')[0]} to Bag</span>
              </button>

              <button
                onClick={handleNext}
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-full backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Next Flavor</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
