import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, CATEGORY_COLLECTIONS } from '../data/products';
import { db } from '../services/db';

const DEFAULT_WEBSITE_IMAGES = [
  { id: 'img-hero-banner', name: 'Main Hero Showcase Banner', type: 'Promotional Banners', location: 'Hero Showcase Section', image: '/images/cycles_showcase/hero_cycle.png' },
  { id: 'img-vespa-banner', name: 'Vespa Collection Banner', type: 'Category Images', location: 'Top Vespa Category Row', image: '/images/store/vespa/24.jpeg' },
  { id: 'img-cycles-banner', name: 'Cycles Collection Banner', type: 'Category Images', location: 'Cycles Category Row', image: '/images/store/cycles/73.jpeg' },
  { id: 'img-scooters-banner', name: 'Scooters Collection Banner', type: 'Category Images', location: 'Scooters Category Row', image: '/images/store/scooter/70.jpeg' },
  { id: 'img-cars-banner', name: 'Kids Cars Collection Banner', type: 'Category Images', location: 'Kids Cars Category Row', image: '/images/store/cars/6.jpeg' },
  { id: 'img-strollers-banner', name: 'Strollers Collection Banner', type: 'Category Images', location: 'Strollers Category Row', image: '/images/store/scraller/sta.jpeg' },
  { id: 'img-sale-popup', name: 'Summer Flash Sale Poster', type: 'Offer/Sale Images', location: 'Homepage Offer Modal', image: '/images/cycles_showcase/hero_supercar.png' },
  { id: 'img-mobile-hero', name: 'Mobile App Header Banner', type: 'Mobile Images', location: 'Mobile View Navigation', image: '/images/store/vespa/54.jpeg' },
  { id: 'img-photo-wall-1', name: 'Kids Outdoor Action Wall Photo 1', type: 'Collection Images', location: 'Photo Gallery Wall', image: '/images/store/scooter/led_scooter_neon_blue.png' },
  { id: 'img-photo-wall-2', name: 'Kids Supercar Action Wall Photo 2', type: 'Collection Images', location: 'Photo Gallery Wall', image: '/images/store/cars/22.jpeg' },
  { id: 'img-footer-glow', name: 'Store Ambient Glow Overlay', type: 'Website Background Images', location: 'Footer Section', image: '/images/store/bikes/poster/Gemini_Generated_Image_akg0d0akg0d0akg0.png' }
];

const DEFAULT_OFFERS = [
  { id: 'off-1', name: 'Summer Flash Sale 25% OFF', couponCode: 'SUMMER25', discountPercent: 25, offerPrice: 13999, offerText: '25% OFF', startDate: '2026-06-01', endDate: '2026-08-31', isActive: true, bannerImage: '/images/cycles_showcase/hero_supercar.png', description: 'Get 25% off on all premium kids ride-on supercars & scooters!' },
  { id: 'off-2', name: 'Vespa Special Launch Deal', couponCode: 'VESPA1000', discountPercent: 20, offerPrice: 14499, offerText: 'Launch Special', startDate: '2026-07-01', endDate: '2026-12-31', isActive: true, bannerImage: '/images/store/vespa/24.jpeg', description: 'Flat ₹1,000 discount on flagship vintage 12V Vespa electric scooters.' },
  { id: 'off-3', name: 'Kid Stroller Care Bundle', couponCode: 'STROLLER15', discountPercent: 15, offerPrice: 169.99, offerText: '15% OFF', startDate: '2026-08-01', endDate: '2026-09-30', isActive: true, bannerImage: '/images/store/scraller/sta.jpeg', description: 'Complimentary sun canopy & travel harness with every Urban Stroller.' }
];

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // 1. Reactive Products State with Persistence
  const [products, setProductsState] = useState(() => {
    try {
      const saved = localStorage.getItem('funrado_admin_products_v7') || localStorage.getItem('funzee_admin_products_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed.map(p => ({
            ...p,
            name: (p.name || '').replace(/kiddigo/gi, 'FUNRADO').replace(/funzee/gi, 'FUNRADO'),
            brand: (p.brand || '').replace(/kiddigo/gi, 'FUNRADO').replace(/funzee/gi, 'FUNRADO') || 'FUNRADO',
            description: (p.description || '').replace(/kiddigo/gi, 'FUNRADO').replace(/funzee/gi, 'FUNRADO'),
            stock: (p.stock !== undefined && p.stock !== null && Number(p.stock) > 0) ? Number(p.stock) : 25,
            status: (p.status && p.status !== 'Out of Stock') ? p.status : 'In Stock'
          }));
          const savedMap = new Map(sanitized.map(p => [p.id, p]));
          const merged = PRODUCTS.map(p => {
            const savedItem = savedMap.get(p.id);
            return savedItem ? {
              ...p,
              ...savedItem,
              stock: (savedItem.stock !== undefined && savedItem.stock !== null && Number(savedItem.stock) > 0) ? Number(savedItem.stock) : 25,
              status: (savedItem.status && savedItem.status !== 'Out of Stock') ? savedItem.status : 'In Stock',
              image: p.image,
              secondaryImages: p.secondaryImages || savedItem.secondaryImages
            } : p;
          });
          const productIds = new Set(PRODUCTS.map(p => p.id));
          const customAdminProducts = sanitized.filter(p => !productIds.has(p.id));
          return [...merged, ...customAdminProducts];
        }
      }
    } catch (e) {
      console.error('Failed to load saved products:', e);
    }
    return PRODUCTS;
  });

  // 2. Reactive Categories State with Persistence
  const [categories, setCategoriesState] = useState(() => {
    try {
      const saved = localStorage.getItem('funrado_admin_categories_v2') || localStorage.getItem('funzee_admin_categories_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load saved categories:', e);
    }
    return CATEGORY_COLLECTIONS;
  });

  // 3. Reactive Website Images State with Persistence
  const [websiteImages, setWebsiteImagesState] = useState(() => {
    try {
      const saved = localStorage.getItem('funrado_website_images_v2') || localStorage.getItem('funzee_website_images_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load saved website images:', e);
    }
    return DEFAULT_WEBSITE_IMAGES;
  });

  // 4. Reactive Offers State with Persistence
  const [offers, setOffersState] = useState(() => {
    try {
      const saved = localStorage.getItem('funrado_admin_offers_v2') || localStorage.getItem('funzee_admin_offers_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load saved offers:', e);
    }
    return DEFAULT_OFFERS;
  });

  // Pre-seed wishlist & cart
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('funrado_wishlist') || localStorage.getItem('funzee_wishlist') || localStorage.getItem('kiddigo_wishlist');
    return saved ? JSON.parse(saved) : [products[0]?.id || 'cycle-1', products[2]?.id || 'scooter-1'];
  });

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('funrado_cart') || localStorage.getItem('funzee_cart') || localStorage.getItem('kiddigo_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved cart:', e);
    }
    const defaultProduct = products[0];
    return defaultProduct ? [{
      id: defaultProduct.id,
      name: defaultProduct.name,
      price: defaultProduct.price,
      image: defaultProduct.image,
      quantity: 1
    }] : [];
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAge, setSelectedAge] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Mumbai, 400001');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync states with localStorage
  useEffect(() => {
    localStorage.setItem('funrado_admin_products_v7', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('funrado_admin_categories_v2', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('funrado_website_images_v2', JSON.stringify(websiteImages));
  }, [websiteImages]);

  useEffect(() => {
    localStorage.setItem('funrado_admin_offers_v2', JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem('funrado_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('funrado_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // -------------------------------------------------------------
  // DYNAMIC PRODUCT CRUD HANDLERS
  // -------------------------------------------------------------
  const addProduct = (prodData) => {
    const newId = `prod-${Date.now()}`;
    const newProduct = {
      id: newId,
      _id: newId,
      sku: prodData.sku || `FND-${Math.floor(1000 + Math.random() * 9000)}`,
      name: prodData.name || 'New FUNRADO Product',
      category: prodData.category || 'Vespa',
      subcategory: prodData.subcategory || 'Electric Ride-on',
      brand: prodData.brand || 'FUNRADO',
      price: Number(prodData.price || prodData.sellingPrice || 1999),
      sellingPrice: Number(prodData.sellingPrice || prodData.price || 1999),
      originalPrice: Number(prodData.originalPrice || prodData.mrp || 2999),
      mrp: Number(prodData.mrp || prodData.originalPrice || 2999),
      discountPercent: Number(prodData.discountPercent || 20),
      offerPrice: prodData.offerPrice ? Number(prodData.offerPrice) : null,
      offerText: prodData.offerText || '',
      rating: prodData.rating || 5.0,
      reviewsCount: prodData.reviewsCount || 1,
      stock: Number(prodData.stock ?? 25),
      status: prodData.status || 'In Stock',
      ageGroup: prodData.ageGroup || '12 To 36 Months',
      ageTag: prodData.ageTag || '1-6 Yrs',
      colors: prodData.colors || [],
      availableColours: prodData.availableColours || ['Red', 'Blue', 'White'],
      image: prodData.image || prodData.mainImage || '/images/cycles_showcase/hero_cycle.png',
      secondaryImages: prodData.secondaryImages || prodData.galleryImages || [],
      galleryImages: prodData.galleryImages || prodData.secondaryImages || [],
      shortDescription: prodData.shortDescription || '',
      description: prodData.description || 'Premium FUNRADO kids store product with child safety guarantee.',
      specs: prodData.specs || ['Safety Certified', 'Heavy-Duty Build', 'Parent Remote Option'],
      isBestSeller: Boolean(prodData.isBestSeller || prodData.bestseller),
      isQuickShip: true,
      isFeatured: Boolean(prodData.isFeatured || prodData.featured),
      isNewArrival: Boolean(prodData.isNewArrival),
      isTrending: Boolean(prodData.isTrending),
      isHidden: Boolean(prodData.isHidden),
      createdAt: new Date().toISOString()
    };

    setProductsState(prev => [newProduct, ...prev]);
    showToast(`Product "${newProduct.name}" added successfully! 🎉`);
    return newProduct;
  };

  const updateProduct = (id, updatedFields) => {
    setProductsState(prev => prev.map(p => {
      if (p.id === id || p._id === id) {
        return {
          ...p,
          ...updatedFields,
          price: updatedFields.sellingPrice !== undefined ? Number(updatedFields.sellingPrice) : (updatedFields.price !== undefined ? Number(updatedFields.price) : p.price),
          originalPrice: updatedFields.originalPrice !== undefined ? Number(updatedFields.originalPrice) : (updatedFields.mrp !== undefined ? Number(updatedFields.mrp) : p.originalPrice),
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));
    showToast(`Product updated live on website! ⚡`);
  };

  const deleteProduct = (id) => {
    setProductsState(prev => prev.filter(p => p.id !== id && p._id !== id));
    showToast(`Product deleted from database & website.`);
  };

  const duplicateProduct = (id) => {
    const target = products.find(p => p.id === id || p._id === id);
    if (!target) return;
    const cloned = {
      ...target,
      id: `prod-copy-${Date.now()}`,
      _id: `prod-copy-${Date.now()}`,
      name: `${target.name} (Copy)`,
      sku: `${target.sku || 'FNZ'}-COPY`,
      createdAt: new Date().toISOString()
    };
    setProductsState(prev => [cloned, ...prev]);
    showToast(`Product duplicated! 📋`);
  };

  const toggleHideProduct = (id) => {
    setProductsState(prev => prev.map(p => {
      if (p.id === id || p._id === id) {
        const nextState = !p.isHidden;
        showToast(nextState ? `Product hidden from customer store 👁️‍🗨️` : `Product visible on website 👁️`);
        return { ...p, isHidden: nextState };
      }
      return p;
    }));
  };

  // -------------------------------------------------------------
  // DYNAMIC CATEGORY CRUD HANDLERS
  // -------------------------------------------------------------
  const addCategory = (catData) => {
    const newId = (catData.name || 'Category').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
    const pIds = Array.isArray(catData.productIds) ? catData.productIds : [];

    let image = catData.bannerImage || catData.thumbnail || '';
    if (!image && pIds.length > 0) {
      const firstProd = products.find(p => p.id === pIds[0] || p._id === pIds[0]);
      if (firstProd && firstProd.image) {
        image = firstProd.image;
      }
    }
    if (!image) {
      image = '/images/store/cycles/73.jpeg';
    }

    const newCategory = {
      id: newId,
      name: catData.name,
      emoji: catData.emoji || '🚗',
      description: catData.description || catData.tagline || '',
      tagline: catData.description || catData.tagline || '',
      bannerImage: image,
      thumbnail: image,
      badge: catData.badge || '',
      isDisabled: catData.isDisabled !== undefined ? catData.isDisabled : false,
      productIds: pIds
    };

    // Update product-category association in products state
    if (pIds.length > 0) {
      setProductsState(prev => prev.map(p => {
        if (pIds.includes(p.id) || pIds.includes(p._id)) {
          const currentCats = Array.isArray(p.categories) ? p.categories : (p.category ? [p.category] : []);
          const updatedCats = Array.from(new Set([...currentCats, catData.name]));
          return { ...p, category: p.category || catData.name, categories: updatedCats };
        }
        return p;
      }));
    }

    setCategoriesState(prev => [newCategory, ...prev]);
    showToast(`Category created successfully! 🎉`);
    return newCategory;
  };

  const updateCategory = (id, updatedFields) => {
    setCategoriesState(prev => prev.map(c => {
      if (c.id === id || c.name === id) {
        const pIds = updatedFields.productIds !== undefined ? updatedFields.productIds : (c.productIds || []);
        let image = updatedFields.bannerImage || updatedFields.thumbnail || c.bannerImage || c.thumbnail || '';
        
        if (!image && pIds.length > 0) {
          const firstProd = products.find(p => p.id === pIds[0] || p._id === pIds[0]);
          if (firstProd && firstProd.image) {
            image = firstProd.image;
          }
        }
        if (!image) {
          image = '/images/store/cycles/73.jpeg';
        }

        return {
          ...c,
          ...updatedFields,
          bannerImage: image,
          thumbnail: image,
          productIds: pIds
        };
      }
      return c;
    }));

    if (updatedFields.productIds !== undefined && Array.isArray(updatedFields.productIds)) {
      const catObj = categories.find(c => c.id === id || c.name === id);
      const catName = updatedFields.name || (catObj ? catObj.name : id);
      const catNameLower = catName.toLowerCase().trim();
      const newProductIds = new Set(updatedFields.productIds);

      setProductsState(prev => prev.map(p => {
        const pId = p.id || p._id;
        const matches = newProductIds.has(pId);
        const currentCats = Array.isArray(p.categories) ? p.categories : (p.category ? [p.category] : []);
        
        if (matches) {
          const updatedCats = Array.from(new Set([...currentCats, catName]));
          return { 
            ...p, 
            category: (p.category && p.category.toLowerCase().trim() !== catNameLower) ? p.category : catName, 
            categories: updatedCats 
          };
        } else {
          const updatedCats = currentCats.filter(cat => (cat || '').toLowerCase().trim() !== catNameLower);
          let primaryCat = p.category;
          if ((p.category || '').toLowerCase().trim() === catNameLower) {
            primaryCat = updatedCats[0] || 'Vespa';
          }
          return { 
            ...p, 
            category: primaryCat, 
            categories: updatedCats 
          };
        }
      }));
    }

    showToast(`Category updated live on website! 🎨`);
  };

  const setCategoryProducts = (categoryId, productIds) => {
    updateCategory(categoryId, { productIds });
  };

  const deleteCategory = (id) => {
    setCategoriesState(prev => prev.filter(c => c.id !== id && c.name !== id));
    showToast(`Category deleted.`);
  };

  const toggleCategoryStatus = (id) => {
    setCategoriesState(prev => prev.map(c => {
      if (c.id === id || c.name === id) {
        const nextState = c.isDisabled ? false : true;
        showToast(nextState ? `Category hidden from store` : `Category visible on store`);
        return { ...c, isDisabled: nextState };
      }
      return c;
    }));
  };

  // -------------------------------------------------------------
  // WEBSITE IMAGE MANAGER HANDLERS
  // -------------------------------------------------------------
  const updateWebsiteImage = (id, newImageUrl) => {
    setWebsiteImagesState(prev => prev.map(img => {
      if (img.id === id) {
        return { ...img, image: newImageUrl, updatedAt: new Date().toISOString() };
      }
      return img;
    }));
    showToast(`Website image replaced live! 🖼️`);
  };

  const addWebsiteImage = (imageData) => {
    const newImg = {
      id: `img-${Date.now()}`,
      name: imageData.name || 'New Custom Image',
      type: imageData.type || 'Promotional Banners',
      location: imageData.location || 'Website Custom Asset',
      image: imageData.image,
      createdAt: new Date().toISOString()
    };
    setWebsiteImagesState(prev => [newImg, ...prev]);
    showToast(`New website image asset saved! 📸`);
  };

  const deleteWebsiteImage = (id) => {
    setWebsiteImagesState(prev => prev.filter(img => img.id !== id));
    showToast(`Image asset deleted.`);
  };

  // -------------------------------------------------------------
  // DYNAMIC OFFERS CRUD HANDLERS
  // -------------------------------------------------------------
  const addOffer = (offerData) => {
    const newOffer = {
      id: `off-${Date.now()}`,
      name: offerData.name || 'Special Promotional Offer',
      couponCode: offerData.couponCode || 'FUNRADO10',
      discountPercent: Number(offerData.discountPercent || 10),
      offerPrice: offerData.offerPrice ? Number(offerData.offerPrice) : null,
      offerText: offerData.offerText || `${offerData.discountPercent}% OFF`,
      startDate: offerData.startDate || new Date().toISOString().split('T')[0],
      endDate: offerData.endDate || '2026-12-31',
      isActive: offerData.isActive !== false,
      bannerImage: offerData.bannerImage || '/images/cycles_showcase/hero_supercar.png',
      description: offerData.description || 'Exclusive deal on selected FUNRADO products.',
      targetCategories: offerData.targetCategories || [],
      targetProducts: offerData.targetProducts || []
    };
    setOffersState(prev => [newOffer, ...prev]);
    showToast(`Offer "${newOffer.name}" created! 🏷️`);
  };

  const updateOffer = (id, updatedFields) => {
    setOffersState(prev => prev.map(o => {
      if (o.id === id) {
        return { ...o, ...updatedFields };
      }
      return o;
    }));
    showToast(`Offer updated! 🏷️`);
  };

  const deleteOffer = (id) => {
    setOffersState(prev => prev.filter(o => o.id !== id));
    showToast(`Offer deleted.`);
  };

  const toggleOfferStatus = (id) => {
    setOffersState(prev => prev.map(o => {
      if (o.id === id) {
        const nextState = !o.isActive;
        showToast(nextState ? `Offer activated` : `Offer deactivated`);
        return { ...o, isActive: nextState };
      }
      return o;
    }));
  };

  // Wishlist Handlers
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter(id => id !== productId) : [...prev, productId];
      showToast(exists ? "Item removed from your Wishlist" : "Item added to your Wishlist ❤️");
      return updated;
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(id => id !== productId));
    showToast("Removed from Wishlist");
  };

  const moveToCartFromWishlist = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  // Cart Handlers
  const addToCart = (product, quantity = 1) => {
    if (!product) return;

    // Check if product is out of stock or coming soon
    const isOutOfStock = product.status === 'Out of Stock' || (product.stock !== undefined && Number(product.stock) <= 0);
    if (isOutOfStock) {
      showToast(`Sorry, "${(product.name || 'Product').slice(0, 25)}" is currently Out of Stock! ⚠️`);
      return;
    }

    setCart(prev => {
      const targetId = product.id;
      const targetColor = product.selectedColor || null;

      const existingIndex = prev.findIndex(item => 
        item.id === targetId && (item.selectedColor === targetColor || (!item.selectedColor && !targetColor))
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }

      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price || product.sellingPrice,
        image: product.image || product.colors?.[0]?.image,
        selectedColor: targetColor,
        quantity
      }];
    });

    showToast(`Added "${(product.name || 'Product').slice(0, 20)}..." to Bag 🛒`);
    setIsCartOpen(true);
  };

  const buyNow = (product, quantity = 1) => {
    if (!product) return;

    const isOutOfStock = product.status === 'Out of Stock' || (product.stock !== undefined && Number(product.stock) <= 0);
    if (isOutOfStock) {
      showToast(`Sorry, "${(product.name || 'Product').slice(0, 25)}" is currently Out of Stock! ⚠️`);
      return;
    }

    setCart(prev => {
      const targetId = product.id;
      const targetColor = product.selectedColor || null;

      const existingIndex = prev.findIndex(item => 
        item.id === targetId && (item.selectedColor === targetColor || (!item.selectedColor && !targetColor))
      );

      if (existingIndex > -1) {
        return prev;
      }

      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price || product.sellingPrice,
        image: product.image || product.colors?.[0]?.image,
        selectedColor: targetColor,
        quantity
      }];
    });

    setIsCartOpen(false);
    setIsWishlistOpen(false);
    if (quickViewProduct) setQuickViewProduct(null);
    setIsCheckoutOpen(true);
  };

  const updateCartQuantity = (cartItemId, delta) => {
    setCart(prev => {
      const targetIndex = prev.findIndex((item, idx) => {
        const computedKey = item.cartKey || `${item.id}-${item.selectedColor || 'default'}-${idx}`;
        return (
          item.cartKey === cartItemId ||
          computedKey === cartItemId ||
          item.id === cartItemId ||
          String(item.id) === String(cartItemId) ||
          idx === cartItemId ||
          String(idx) === String(cartItemId)
        );
      });

      if (targetIndex !== -1) {
        const updated = [...prev];
        const newQty = (updated[targetIndex].quantity || 1) + delta;
        if (newQty <= 0) {
          updated.splice(targetIndex, 1);
        } else {
          updated[targetIndex] = {
            ...updated[targetIndex],
            quantity: newQty
          };
        }
        return updated;
      }
      return prev;
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => {
      const targetIndex = prev.findIndex((item, idx) => {
        const computedKey = item.cartKey || `${item.id}-${item.selectedColor || 'default'}-${idx}`;
        return (
          item.cartKey === cartItemId ||
          computedKey === cartItemId ||
          item.id === cartItemId ||
          String(item.id) === String(cartItemId) ||
          idx === cartItemId ||
          String(idx) === String(cartItemId)
        );
      });

      if (targetIndex !== -1) {
        const updated = [...prev];
        updated.splice(targetIndex, 1);
        return updated;
      }
      return prev.filter(item => item.id !== cartItemId && item.cartKey !== cartItemId);
    });
    showToast("Item removed from Bag");
  };

  // Derived values
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));
  
  const cartItemsWithDetails = cart.map((item, idx) => {
    const matchedProduct = products.find(p => p.id === item.id);
    const cartKey = `${item.id}-${item.selectedColor || 'default'}-${idx}`;
    if (matchedProduct) {
      return {
        ...matchedProduct,
        ...item,
        cartKey,
        image: item.image || matchedProduct.image,
        quantity: item.quantity
      };
    }
    if (item.name && item.price) {
      return {
        ...item,
        cartKey
      };
    }
    return null;
  }).filter(Boolean);

  const cartTotal = cartItemsWithDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cartItemsWithDetails.reduce((sum, item) => sum + item.quantity, 0);

  // Checkout & Orders state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orders, setOrders] = useState(() => {
    try {
      const dbOrders = db.orders.find();
      if (dbOrders && dbOrders.length > 0) return dbOrders;
    } catch (e) {
      console.error('Failed to load DB orders:', e);
    }
    const saved = localStorage.getItem('funrado_orders') || localStorage.getItem('kiddigo_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentOrder, setCurrentOrder] = useState(null);

  useEffect(() => {
    localStorage.setItem('funrado_orders', JSON.stringify(orders));
  }, [orders]);

  const clearCart = () => {
    setCart([]);
  };

  const updateOrderStatus = (orderId, newStatus, newPaymentStatus = null) => {
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === orderId || o._id === orderId || o.orderNumber === orderId) {
          return {
            ...o,
            orderStatus: newStatus,
            status: newStatus,
            ...(newPaymentStatus ? { paymentStatus: newPaymentStatus } : {}),
            updatedAt: new Date().toISOString()
          };
        }
        return o;
      });
      localStorage.setItem('funrado_orders', JSON.stringify(updated));
      return updated;
    });

    try {
      db.orders.update(orderId, {
        orderStatus: newStatus,
        status: newStatus,
        ...(newPaymentStatus ? { paymentStatus: newPaymentStatus } : {})
      });
    } catch (e) {
      console.error('Error updating order status in db:', e);
    }
    showToast(`Order #${orderId} status updated to ${newStatus}`);
  };

  const archiveOrder = (orderId) => {
    let nextArchivedState = false;
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === orderId || o._id === orderId || o.orderNumber === orderId) {
          nextArchivedState = !o.isArchived;
          return {
            ...o,
            isArchived: !o.isArchived,
            updatedAt: new Date().toISOString()
          };
        }
        return o;
      });
      localStorage.setItem('funrado_orders', JSON.stringify(updated));
      return updated;
    });

    try {
      db.orders.archive(orderId);
    } catch (e) {
      console.error('Error archiving order in db:', e);
    }
    showToast(`Order #${orderId} ${nextArchivedState ? 'archived' : 'unarchived'}`);
  };

  const placeOrder = (orderData) => {
    const orderIdGenerated = orderData.id || `FND${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrderObj = {
      id: orderIdGenerated,
      orderNumber: orderIdGenerated,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      orderStatus: orderData.orderStatus || orderData.status || 'Order Received',
      status: orderData.status || orderData.orderStatus || 'Order Received',
      paymentStatus: orderData.paymentStatus || 'Pending',
      paymentMethod: orderData.paymentMethod || 'UPI',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
      isArchived: false,
      ...orderData
    };

    let createdDbOrder = newOrderObj;
    try {
      createdDbOrder = db.orders.create(newOrderObj);
    } catch (err) {
      console.error('Error recording order in database:', err);
    }

    setOrders(prev => [createdDbOrder, ...prev.filter(o => o.id !== createdDbOrder.id && o.orderNumber !== createdDbOrder.id)]);
    setCurrentOrder(createdDbOrder);

    clearCart();
    return createdDbOrder;
  };

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      websiteImages,
      offers,
      wishlist,
      wishlistProducts,
      cart: cartItemsWithDetails,
      cartTotal,
      cartItemCount,
      isWishlistOpen,
      setIsWishlistOpen,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      orders,
      setOrders,
      updateOrderStatus,
      archiveOrder,
      currentOrder,
      setCurrentOrder,
      placeOrder,
      clearCart,
      isSearchOpen,
      setIsSearchOpen,
      searchQuery,
      setSearchQuery,
      selectedAge,
      setSelectedAge,
      selectedCategory,
      setSelectedCategory,
      isTrackOrderOpen,
      setIsTrackOrderOpen,
      isLocationOpen,
      setIsLocationOpen,
      selectedLocation,
      setSelectedLocation,
      quickViewProduct,
      setQuickViewProduct,
      toggleWishlist,
      removeFromWishlist,
      moveToCartFromWishlist,
      addToCart,
      buyNow,
      updateCartQuantity,
      removeFromCart,
      toastMessage,
      showToast,
      // Admin CRUD Methods
      addProduct,
      updateProduct,
      deleteProduct,
      duplicateProduct,
      toggleHideProduct,
      addCategory,
      updateCategory,
      setCategoryProducts,
      deleteCategory,
      toggleCategoryStatus,
      updateWebsiteImage,
      addWebsiteImage,
      deleteWebsiteImage,
      addOffer,
      updateOffer,
      deleteOffer,
      toggleOfferStatus
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
