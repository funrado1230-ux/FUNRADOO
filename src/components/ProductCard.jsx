import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingCart, 
  Star, 
  Eye, 
  Heart, 
  Check, 
  Sparkles,
  Clock,
  Users,
  TrendingUp,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';

// Animation Variants
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
      duration: 0.6
    }
  },
  hover: {
    y: -12,
    scale: 1.02,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 300
    }
  }
};

const imageVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.15,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const shimmerVariants = {
  initial: { x: "-100%" },
  animate: {
    x: "200%",
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: "linear"
    }
  }
};

export const ProductCard = ({ product, index = 0 }) => {
  const { wishlist, toggleWishlist, addToCart, setQuickViewProduct } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  // Available colors or fallback preset colors
  const defaultColors = [
    { name: 'Royal Blue', hex: '#2563EB', image: product.image },
    { name: 'Rhino', hex: '#374151', image: product.colors?.[1]?.image || product.image },
    { name: 'Arctic Silver', hex: '#CBD5E1', image: product.colors?.[2]?.image || product.image },
    { name: 'RED', hex: '#EF4444', image: product.colors?.[3]?.image || product.image },
    { name: 'Powder Rose', hex: '#F472B6', image: product.colors?.[4]?.image || product.image }
  ];

  const colorsList = (product.colors && product.colors.length >= 2) ? product.colors : defaultColors;
  const [selectedColor, setSelectedColor] = useState(colorsList[0]);
  const [isInCart, setIsInCart] = useState(false);
  const isWishlisted = wishlist ? wishlist.includes(product.id) : false;
  const cardRef = useRef(null);

  const activeImage = selectedColor?.image || product.image;
  const mrpPrice = product.mrp || product.originalPrice || Math.round(product.price * 1.25);

  const isOutOfStock = product.status === 'Out of Stock' || (product.stock !== undefined && Number(product.stock) <= 0);
  const isComingSoon = product.status === 'Coming Soon';

  // Badge configuration
  const getBadge = () => {
    if (product.isBestSeller) {
      return {
        label: '⭐ BEST SELLER',
        color: 'bg-gradient-to-r from-amber-500 to-orange-500',
        icon: <Sparkles className="w-3 h-3 text-white" />
      };
    }
    if (product.isNew) {
      return {
        label: '✨ NEW',
        color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
        icon: <Sparkles className="w-3 h-3 text-white" />
      };
    }
    const discount = product.discount || (mrpPrice > product.price ? Math.round(((mrpPrice - product.price) / mrpPrice) * 100) : 0);
    if (discount > 20) {
      return {
        label: `🔥 ${discount}% OFF`,
        color: 'bg-gradient-to-r from-red-500 to-rose-500',
        icon: <Gift className="w-3 h-3 text-white" />
      };
    }
    return null;
  };

  const badge = getBadge();

  // Add to cart / Buy Now handler
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock || isComingSoon) return;
    setIsInCart(true);

    const productWithColor = {
      ...product,
      selectedColor: selectedColor?.name || 'Royal Blue',
      image: activeImage
    };
    addToCart(productWithColor);

    // Trigger cart pop animation
    const cartButton = cardRef.current?.querySelector('.add-to-cart-btn');
    if (cartButton) {
      cartButton.classList.add('cart-pop');
      setTimeout(() => {
        cartButton.classList.remove('cart-pop');
      }, 600);
    }
    setTimeout(() => setIsInCart(false), 2000);
  };

  // Calculate discount percentage
  const discountPercentage = product.discount || (mrpPrice > product.price
    ? Math.round(((mrpPrice - product.price) / mrpPrice) * 100)
    : 0);

  const ratingVal = product.rating || 4.9;
  const reviewsVal = product.reviewsCount || product.reviews || 240;
  const ageLabel = product.ageTag || product.ageGroup || '1-5 Yrs';

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => setQuickViewProduct(product)}
      className="group relative bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/40 hover:border-blue-200/60 cursor-pointer flex flex-col justify-between"
      style={{
        boxShadow: isHovered 
          ? '0 20px 60px rgba(37, 99, 235, 0.15), 0 10px 20px rgba(0,0,0,0.05)' 
          : '0 4px 20px rgba(0,0,0,0.05)'
      }}
    >
      {/* Shimmer Effect on Hover */}
      <motion.div
        variants={shimmerVariants}
        initial="initial"
        animate={isHovered ? "animate" : "initial"}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none z-20"
      />

      {/* Top Section Header Container */}
      <div>
        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`absolute top-3 left-3 z-30 flex items-center gap-1.5 ${badge.color} text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-lg`}
          >
            {badge.icon}
            {badge.label}
          </motion.div>
        )}

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05 + 0.1, type: "spring" }}
            className="absolute top-3 right-14 z-30 bg-red-500 text-white text-[10px] font-bold w-10 h-10 rounded-full flex flex-col items-center justify-center shadow-lg"
          >
            <span className="text-xs font-black leading-none">{discountPercentage}%</span>
            <span className="text-[8px] font-extrabold leading-none">OFF</span>
          </motion.div>
        )}

        {/* Quick View Eye Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          className="absolute top-3 right-3 z-30 bg-white/95 backdrop-blur-md text-stone-700 p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 cursor-pointer"
          title="Quick View"
        >
          <Eye className="w-4 h-4 text-blue-600" />
        </motion.button>

        {/* Image Section (4:3 Aspect Ratio) */}
        <div className="relative overflow-hidden aspect-[4/3] bg-gradient-to-br from-stone-50 via-blue-50/20 to-stone-100 p-3 flex items-center justify-center rounded-t-2xl">
          <motion.img
            key={activeImage}
            variants={imageVariants}
            initial="initial"
            animate={isHovered ? "hover" : "initial"}
            src={activeImage}
            alt={product.name}
            className="w-full h-full object-contain img-hd-sharp"
          />
          
          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[1px] z-20 flex items-center justify-center p-2">
              <span className="bg-rose-600 text-white font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-lg border border-rose-400">
                Out of Stock
              </span>
            </div>
          )}

          {/* Age Badge */}
          {ageLabel && (
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-300" />
              {ageLabel}
            </div>
          )}


        </div>

        {/* Content Section */}
        <div className="p-2.5 sm:p-3 space-y-1.5 bg-white rounded-b-xl">
          {/* Category */}
          <motion.p 
            className="text-[9px] font-black text-blue-600 uppercase tracking-wider block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 + 0.1 }}
          >
            {product.category || 'ELECTRIC RIDE-ON CARS'}
          </motion.p>

          {/* Product Name */}
          <motion.h3 
            className="text-[11px] sm:text-xs font-extrabold text-stone-900 line-clamp-1 leading-tight group-hover:text-blue-600 transition-colors"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.15 }}
          >
            {product.name}
          </motion.h3>

          {/* Rating */}
          <motion.div 
            className="flex items-center gap-1 pt-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 + 0.2 }}
          >
            <div className="flex items-center gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(ratingVal)
                      ? 'fill-amber-400 text-amber-400'
                      : i < ratingVal
                      ? 'fill-amber-400/50 text-amber-400/50'
                      : 'text-stone-200 fill-stone-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold text-stone-800">{ratingVal}</span>
            <span className="text-[10px] text-stone-400 font-medium">({reviewsVal})</span>
          </motion.div>

          {/* Price */}
          <motion.div 
            className="flex items-center gap-1.5 flex-wrap pt-0.5"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.25 }}
          >
            <span className="text-xs sm:text-sm font-black text-stone-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {mrpPrice && mrpPrice > product.price && (
              <>
                <span className="text-[10px] text-stone-400 line-through font-medium">
                  ₹{mrpPrice.toLocaleString('en-IN')}
                </span>
              </>
            )}
          </motion.div>

          {/* Actions */}
          <motion.div 
            className="flex items-center gap-1.5 pt-1"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.3 }}
          >
            {/* Add to Cart Button */}
            <motion.button
              whileTap={isOutOfStock || isComingSoon ? {} : { scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={isOutOfStock || isComingSoon}
              className={`add-to-cart-btn flex-1 text-white font-black text-[10px] py-1.5 px-2 rounded-lg transition-all duration-300 shadow-xs flex items-center justify-center gap-1 group relative overflow-hidden ${
                isOutOfStock 
                  ? 'bg-stone-400 cursor-not-allowed opacity-80' 
                  : isComingSoon 
                  ? 'bg-amber-600 cursor-not-allowed opacity-80' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 cursor-pointer'
              }`}
            >
              <span className="relative z-10 flex items-center gap-1">
                {isOutOfStock ? (
                  'Out of Stock'
                ) : isComingSoon ? (
                  'Coming Soon'
                ) : isInCart ? (
                  <>
                    <Check className="w-3.5 h-3.5 animate-in zoom-in" />
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3 h-3 group-hover:scale-110 transition-transform" />
                    Add
                  </>
                )}
              </span>
              {!isOutOfStock && !isComingSoon && (
                <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              )}
            </motion.button>

            {/* Wishlist Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              className={`p-1.5 rounded-lg transition-all duration-300 cursor-pointer ${
                isWishlisted 
                  ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                  : 'bg-stone-100 text-stone-400 hover:bg-rose-50 hover:text-rose-500'
              }`}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-3.5 h-3.5 transition-all ${isWishlisted ? 'fill-rose-600' : ''}`} />
            </motion.button>
          </motion.div>

          {/* Stock Status */}
          <motion.div 
            className="flex items-center gap-1.5 text-[11px] pt-1 text-stone-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 + 0.35 }}
          >
            <div className="flex items-center gap-1.5">
              {isOutOfStock ? (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span className="text-rose-600 font-extrabold">Out of Stock</span>
                </>
              ) : isComingSoon ? (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-amber-600 font-extrabold">Coming Soon</span>
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-600 font-extrabold">In Stock</span>
                </>
              )}
            </div>
            {product.soldCount && (
              <>
                <span className="text-stone-300">•</span>
                <div className="flex items-center gap-1 text-stone-500 font-medium">
                  <Users className="w-3 h-3" />
                  {product.soldCount}+ sold
                </div>
              </>
            )}
            {product.isBestSeller && (
              <>
                <span className="text-stone-300">•</span>
                <div className="flex items-center gap-1 text-amber-600 font-bold">
                  <TrendingUp className="w-3 h-3" />
                  Trending
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Grid Container Component
export const ProductGrid = ({ products, title, subtitle }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Section Header with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-block px-4 py-1.5 bg-blue-100 text-blue-600 text-xs font-bold rounded-full mb-3"
        >
          {subtitle || 'Premium Collection'}
        </motion.span>
        <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
          {title || 'Featured Products'}
        </h2>
        <p className="text-stone-500 max-w-2xl mx-auto">
          Discover our handpicked collection of premium products
        </p>
      </motion.div>

      {/* Product Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </motion.div>
    </div>
  );
};

export default ProductCard;
