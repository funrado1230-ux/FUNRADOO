import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Plus, Edit, Trash2, Eye, EyeOff, Copy, Image as ImageIcon, Search, Filter, 
  ArrowUpDown, Check, X, Shield, Sparkles, Tag, CheckCircle2, AlertTriangle, 
  Upload, Layers, Save, Package, RefreshCw, Star, Flame, Zap
} from 'lucide-react';

export const ProductManager = () => {
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    duplicateProduct, 
    toggleHideProduct, 
    showToast 
  } = useStore();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [featuredFilter, setFeaturedFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [previewProductModal, setPreviewProductModal] = useState(null);
  const [deleteConfirmProd, setDeleteConfirmProd] = useState(null);

  // Form State
  const initialFormState = {
    name: '',
    category: 'Vespa',
    subcategory: 'Electric Ride-on',
    brand: 'FUNRADO',
    image: '/images/store/vespa/24.jpeg',
    galleryImages: [],
    mrp: '',
    sellingPrice: '',
    discountPercent: '',
    offerPrice: '',
    offerText: '',
    shortDescription: '',
    description: '',
    specsStr: 'Rechargeable 12V Motor, Leather Seat, Working Headlights',
    coloursStr: 'Sage Green, Cream, White',
    ageGroup: '12 To 36 Months',
    stock: 25,
    sku: `FNZ-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'In Stock',
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: true,
    isTrending: false,
    isHidden: false
  };

  const [prodForm, setProdForm] = useState(initialFormState);

  // Unique list of categories
  const categoryNames = useMemo(() => {
    const fromCats = categories.map(c => c.name);
    const fromProds = products.map(p => p.category);
    return Array.from(new Set([...fromCats, ...fromProds, 'Vespa', 'Cycles', 'Scooters', 'Kids Cars', 'Electric Bikes', 'Hoverboards', 'Toys', 'Strollers', 'Baby Walkers', 'High Chairs']));
  }, [categories, products]);

  // Calculate pricing, discount %, and offer tags reactively across all fields
  const handlePricingChange = (field, val) => {
    const num = Number(val);
    let updated = { ...prodForm, [field]: val };

    const mrpVal = field === 'mrp' ? num : Number(updated.mrp || 0);
    const sellVal = field === 'sellingPrice' ? num : Number(updated.sellingPrice || 0);
    const discVal = field === 'discountPercent' ? (val === '' ? '' : num) : Number(updated.discountPercent || 0);
    const offerVal = field === 'offerPrice' ? num : Number(updated.offerPrice || 0);

    if (field === 'mrp') {
      if (mrpVal > 0 && sellVal > 0 && mrpVal >= sellVal) {
        const calcDiscount = Math.round(((mrpVal - sellVal) / mrpVal) * 100);
        updated.discountPercent = calcDiscount;
        if (!updated.offerText || updated.offerText.trim() === '' || /^\d+%\s*OFF$/i.test(updated.offerText.trim())) {
          updated.offerText = `${calcDiscount}% OFF`;
        }
      } else if (mrpVal > 0 && typeof discVal === 'number' && discVal > 0) {
        const calcSelling = Math.round(mrpVal * (1 - discVal / 100));
        updated.sellingPrice = calcSelling;
        if (!updated.offerText || updated.offerText.trim() === '' || /^\d+%\s*OFF$/i.test(updated.offerText.trim())) {
          updated.offerText = `${discVal}% OFF`;
        }
      }
    } else if (field === 'sellingPrice') {
      if (mrpVal > 0 && sellVal > 0 && mrpVal >= sellVal) {
        const calcDiscount = Math.round(((mrpVal - sellVal) / mrpVal) * 100);
        updated.discountPercent = calcDiscount;
        if (!updated.offerText || updated.offerText.trim() === '' || /^\d+%\s*OFF$/i.test(updated.offerText.trim())) {
          updated.offerText = `${calcDiscount}% OFF`;
        }
      } else if (sellVal > 0 && typeof discVal === 'number' && discVal > 0 && (!mrpVal || mrpVal < sellVal)) {
        const calcMrp = Math.round(sellVal / (1 - discVal / 100));
        updated.mrp = calcMrp;
        if (!updated.offerText || updated.offerText.trim() === '' || /^\d+%\s*OFF$/i.test(updated.offerText.trim())) {
          updated.offerText = `${discVal}% OFF`;
        }
      }
    } else if (field === 'discountPercent') {
      if (val === '') {
        updated.discountPercent = '';
      } else if (!isNaN(num) && num >= 0 && num <= 100) {
        updated.discountPercent = num;
        if (mrpVal > 0) {
          const calcSelling = Math.round(mrpVal * (1 - num / 100));
          updated.sellingPrice = calcSelling;
        } else if (sellVal > 0) {
          const calcMrp = num < 100 ? Math.round(sellVal / (1 - num / 100)) : sellVal;
          updated.mrp = calcMrp;
        }
        if (!updated.offerText || updated.offerText.trim() === '' || /^\d+%\s*OFF$/i.test(updated.offerText.trim())) {
          updated.offerText = num > 0 ? `${num}% OFF` : '';
        }
      }
    } else if (field === 'offerPrice') {
      if (offerVal > 0 && mrpVal > 0 && mrpVal >= offerVal) {
        const offerDisc = Math.round(((mrpVal - offerVal) / mrpVal) * 100);
        if (!updated.offerText || updated.offerText.trim() === '' || /^\d+%\s*OFF$/i.test(updated.offerText.trim())) {
          updated.offerText = `${offerDisc}% OFF`;
        }
      }
    }

    setProdForm(updated);
  };

  // Open Form Modal for Create
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setProdForm({
      ...initialFormState,
      sku: `FNZ-${Math.floor(1000 + Math.random() * 9000)}`
    });
    setIsFormModalOpen(true);
  };

  // Open Form Modal for Edit with Pre-filled Product Details
  const handleOpenEditModal = (prod) => {
    setEditingProductId(prod.id || prod._id);
    const mrpVal = Number(prod.mrp || prod.originalPrice || 0);
    const sellVal = Number(prod.sellingPrice || prod.price || 0);
    
    let calcDiscount = prod.discountPercent;
    if (mrpVal > 0 && sellVal > 0 && mrpVal >= sellVal) {
      calcDiscount = Math.round(((mrpVal - sellVal) / mrpVal) * 100);
    } else if (calcDiscount === undefined || calcDiscount === null || calcDiscount === '') {
      calcDiscount = 0;
    }

    const calculatedOfferText = (prod.offerText && !/^\d+%\s*OFF$/i.test(prod.offerText.trim()))
      ? prod.offerText
      : (calcDiscount > 0 ? `${calcDiscount}% OFF` : (prod.offerText || ''));

    setProdForm({
      name: prod.name || '',
      category: prod.category || 'Vespa',
      subcategory: prod.subcategory || 'Electric Ride-on',
      brand: prod.brand || 'FUNRADO',
      image: prod.image || '/images/cycles_showcase/hero_cycle.png',
      galleryImages: prod.galleryImages || prod.secondaryImages || [],
      mrp: prod.mrp || prod.originalPrice || '',
      sellingPrice: prod.sellingPrice || prod.price || '',
      discountPercent: calcDiscount > 0 ? calcDiscount : '',
      offerPrice: prod.offerPrice || '',
      offerText: calculatedOfferText,
      shortDescription: prod.shortDescription || '',
      description: prod.description || '',
      specsStr: Array.isArray(prod.specs) ? prod.specs.join(', ') : (prod.specs || ''),
      coloursStr: Array.isArray(prod.availableColours) ? prod.availableColours.join(', ') : (prod.availableColours || 'Red, Blue, White'),
      ageGroup: prod.ageGroup || '12 To 36 Months',
      stock: prod.stock ?? 25,
      sku: prod.sku || `FND-${Math.floor(1000 + Math.random() * 9000)}`,
      status: prod.status || (prod.stock > 0 ? 'In Stock' : 'Out of Stock'),
      isFeatured: Boolean(prod.isFeatured),
      isBestSeller: Boolean(prod.isBestSeller),
      isNewArrival: Boolean(prod.isNewArrival),
      isTrending: Boolean(prod.isTrending),
      isHidden: Boolean(prod.isHidden)
    });
    setIsFormModalOpen(true);
  };

  // Handle Drag & Drop Main Image Upload
  const handleMainImageFileUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProdForm(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Handle Gallery Images Upload
  const handleGalleryImagesUpload = (files) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    
    fileList.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProdForm(prev => ({
          ...prev,
          galleryImages: [...prev.galleryImages, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  // Save Product Handler (Create or Update)
  const handleSaveProductForm = (e) => {
    e.preventDefault();
    if (!prodForm.name.trim() || !prodForm.sellingPrice) {
      showToast("Please provide product name and selling price.");
      return;
    }

    const mrpVal = Number(prodForm.mrp || 0);
    const sellVal = Number(prodForm.sellingPrice || 0);
    let finalDisc = Number(prodForm.discountPercent || 0);
    if (mrpVal > 0 && sellVal > 0 && mrpVal >= sellVal) {
      finalDisc = Math.round(((mrpVal - sellVal) / mrpVal) * 100);
    }

    const payload = {
      ...prodForm,
      discountPercent: finalDisc,
      offerText: prodForm.offerText || (finalDisc > 0 ? `${finalDisc}% OFF` : ''),
      price: Number(prodForm.sellingPrice),
      sellingPrice: Number(prodForm.sellingPrice),
      originalPrice: Number(prodForm.mrp || (prodForm.sellingPrice * 1.25)),
      mrp: Number(prodForm.mrp || (prodForm.sellingPrice * 1.25)),
      stock: Number(prodForm.stock ?? 25),
      status: prodForm.status || (Number(prodForm.stock ?? 25) > 0 ? 'In Stock' : 'Out of Stock'),
      specs: prodForm.specsStr.split(',').map(s => s.trim()).filter(Boolean),
      availableColours: prodForm.coloursStr.split(',').map(c => c.trim()).filter(Boolean)
    };

    if (editingProductId) {
      updateProduct(editingProductId, payload);
    } else {
      addProduct(payload);
    }

    setIsFormModalOpen(false);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery = !query || 
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.sku && p.sku.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query));

      const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesBrand = brandFilter === 'All' || (p.brand || 'FUNRADO') === brandFilter;

      let matchesStock = true;
      if (stockFilter === 'In Stock') matchesStock = p.status !== 'Out of Stock' && (p.stock === undefined || Number(p.stock) > 0);
      if (stockFilter === 'Out of Stock') matchesStock = p.status === 'Out of Stock' || (p.stock !== undefined && Number(p.stock) <= 0);
      if (stockFilter === 'Low Stock') matchesStock = p.status !== 'Out of Stock' && Number(p.stock || 0) > 0 && Number(p.stock || 0) <= 10;

      let matchesStatus = true;
      if (statusFilter === 'Active') matchesStatus = !p.isHidden;
      if (statusFilter === 'Hidden') matchesStatus = p.isHidden;

      const matchesFeatured = featuredFilter === 'All' || (featuredFilter === 'Featured' && p.isFeatured);

      return matchesQuery && matchesCat && matchesBrand && matchesStock && matchesStatus && matchesFeatured;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortBy === 'price-low') return (a.sellingPrice || a.price) - (b.sellingPrice || b.price);
      if (sortBy === 'price-high') return (b.sellingPrice || b.price) - (a.sellingPrice || a.price);
      if (sortBy === 'name-az') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });
  }, [products, searchQuery, categoryFilter, brandFilter, stockFilter, statusFilter, featuredFilter, sortBy]);

  return (
    <div className="space-y-6">
      
      {/* Product Management Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/80 p-5 rounded-2xl border border-stone-800 backdrop-blur-md">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Product Catalog Grid</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
              {filteredProducts.length} Products
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Manage product cards, pricing, offer tags, stock levels, images, and customer store visibility.
          </p>
        </div>

        {/* Clear + Add New Product Button */}
        <button
          onClick={handleOpenAddModal}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Header */}
      <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Bar */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input 
              type="text" 
              placeholder="Search products by Name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:border-amber-400 outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-1">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-200 outline-none focus:border-amber-400"
            >
              <option value="All">All Categories ({categoryNames.length})</option>
              {categoryNames.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div className="space-y-1">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-200 outline-none focus:border-amber-400"
            >
              <option value="All">All Stock Status</option>
              <option value="In Stock">In Stock (&gt; 0)</option>
              <option value="Low Stock">Low Stock (&lt; 10)</option>
              <option value="Out of Stock">Out of Stock (= 0)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="space-y-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-200 outline-none focus:border-amber-400"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="price-low">Sort: Price Low to High</option>
              <option value="price-high">Sort: Price High to Low</option>
              <option value="name-az">Sort: Name A to Z</option>
            </select>
          </div>

        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PRODUCT CARDS GRID (3 CARDS PER ROW ON DESKTOP)                */}
      {/* ------------------------------------------------------------- */}
      {filteredProducts.length === 0 ? (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center space-y-3">
          <Package className="w-12 h-12 text-stone-600 mx-auto" />
          <h3 className="text-base font-extrabold text-stone-300">No products matched your search or filters</h3>
          <p className="text-xs text-stone-500">Try adjusting your category filter or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((p) => {
            const isOut = p.status === 'Out of Stock' || (p.stock !== undefined && p.stock !== null && Number(p.stock) <= 0);
            const isComingSoon = p.status === 'Coming Soon';
            const isHidden = p.isHidden;
            const mrp = p.mrp || p.originalPrice || p.price * 1.25;
            const price = p.sellingPrice || p.price;
            const discount = p.discountPercent || Math.round(((mrp - price) / mrp) * 100) || 20;

            return (
              <div 
                key={p.id || p._id} 
                className={`bg-stone-900 border rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-amber-500/40 ${
                  isHidden ? 'border-rose-500/30 opacity-70' : 'border-stone-800'
                }`}
              >
                
                {/* Top Image Preview Box */}
                <div className="relative h-52 bg-black overflow-hidden group border-b border-stone-800">
                  <img 
                    src={p.image || '/images/cycles_showcase/hero_cycle.png'} 
                    alt={p.name} 
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => { e.target.src = '/images/cycles_showcase/hero_cycle.png'; }}
                  />

                  {/* Top-Left Category Badge */}
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] font-extrabold text-amber-300 shadow">
                    {p.category}
                  </div>

                  {/* Top-Right Visibility & Stock Status Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border backdrop-blur-md shadow ${
                      isHidden 
                        ? 'bg-rose-500/30 text-rose-300 border-rose-500/40' 
                        : isOut 
                          ? 'bg-rose-500/30 text-rose-300 border-rose-500/40'
                          : isComingSoon
                            ? 'bg-amber-500/30 text-amber-300 border-amber-500/40' 
                            : 'bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {isHidden ? 'Hidden' : isOut ? 'Out of Stock' : isComingSoon ? 'Coming Soon' : 'Active'}
                    </span>
                  </div>

                  {/* Bottom-Left Offer Tag */}
                  <div className="absolute bottom-3 left-3 bg-rose-500/90 text-white text-[10px] font-black px-2.5 py-0.5 rounded-md shadow uppercase">
                    {p.offerText || `${discount}% OFF`}
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-4 bg-stone-900 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-black text-white truncate hover:text-amber-400 transition-colors">
                      {p.name}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-stone-400 mt-1">
                      <span className="font-mono text-[11px] text-stone-400">SKU: {p.sku || `FNZ-${p.id}`}</span>
                      <span className="text-[10px] font-bold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Stock: {p.stock} pcs
                      </span>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-baseline justify-between pt-2.5 border-t border-stone-800/80 mt-2">
                      <div className="space-x-2">
                        <span className="text-xs text-stone-400 line-through">MRP: ₹{Number(mrp).toLocaleString('en-IN')}</span>
                        <span className="text-base font-black text-amber-300">₹{Number(price).toLocaleString('en-IN')}</span>
                      </div>
                      
                      <span className="text-[10px] font-extrabold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
                        {discount}% OFF
                      </span>
                    </div>
                  </div>

                  {/* Badges Bar */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {p.isFeatured && <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">★ Featured</span>}
                    {p.isBestSeller && <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">🔥 Best Seller</span>}
                    {p.isNewArrival && <span className="text-[9px] font-bold bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded border border-sky-500/30">✦ New</span>}
                  </div>
                </div>

                {/* Card Action Buttons (Edit | Preview | Delete) */}
                <div className="p-3 bg-stone-950 border-t border-stone-800 grid grid-cols-3 gap-2">
                  
                  {/* ✏ Edit */}
                  <button
                    onClick={() => handleOpenEditModal(p)}
                    className="bg-stone-800 hover:bg-amber-500/20 text-stone-200 hover:text-amber-300 border border-stone-700 hover:border-amber-500/40 p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    title="Edit Product Details"
                  >
                    <Edit className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit</span>
                  </button>

                  {/* 👁 Preview */}
                  <button
                    onClick={() => setPreviewProductModal(p)}
                    className="bg-stone-800 hover:bg-stone-700 text-stone-200 p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-stone-700 transition-colors cursor-pointer"
                    title="Preview Product Card"
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-400" />
                    <span>Preview</span>
                  </button>

                  {/* 🗑 Delete */}
                  <button
                    onClick={() => setDeleteConfirmProd(p)}
                    className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-rose-500/30 transition-colors cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Delete</span>
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* EDIT / ADD PRODUCT MODAL FORM                                 */}
      {/* ------------------------------------------------------------- */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 w-full max-w-4xl rounded-3xl p-6 shadow-2xl space-y-6 relative my-auto max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setIsFormModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-white rounded-full bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-stone-800 pb-4">
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-400" />
                <span>{editingProductId ? 'Edit Product Details' : 'Add New Product'}</span>
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                {editingProductId ? 'Update pricing, images, descriptions, stock, and features for this product.' : 'Fill in product details, pricing, discount, stock, status, and upload high-res product photos.'}
              </p>
            </div>

            <form onSubmit={handleSaveProductForm} className="space-y-6">
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-stone-300">Product Name *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. FUNRADO Italian Retro Vespa 12V Electric Scooter"
                    value={prodForm.name} 
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Product SKU / Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. FND-9842"
                    value={prodForm.sku} 
                    onChange={(e) => setProdForm({ ...prodForm, sku: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Category, Subcategory & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Category *</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none"
                  >
                    {categoryNames.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Subcategory</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Electric Ride-On"
                    value={prodForm.subcategory} 
                    onChange={(e) => setProdForm({ ...prodForm, subcategory: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Brand Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. FUNRADO"
                    value={prodForm.brand} 
                    onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Pricing & Offer Section */}
              <div className="bg-stone-950 border border-stone-800 p-4 rounded-2xl space-y-4">
                <h4 className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">Pricing & Discount Setup</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Original Price / MRP (₹)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 18999"
                      value={prodForm.mrp} 
                      onChange={(e) => handlePricingChange('mrp', e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Selling Price (₹) *</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 14499"
                      value={prodForm.sellingPrice} 
                      onChange={(e) => handlePricingChange('sellingPrice', e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-sm text-amber-300 font-bold focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Discount (%)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 20"
                      value={prodForm.discountPercent} 
                      onChange={(e) => handlePricingChange('discountPercent', e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Offer Price (Optional)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 13999"
                      value={prodForm.offerPrice} 
                      onChange={(e) => handlePricingChange('offerPrice', e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-300">Offer Text Tag</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Summer Sale 20% OFF"
                      value={prodForm.offerText} 
                      onChange={(e) => setProdForm({ ...prodForm, offerText: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-400 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Main & Gallery Image Upload Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Main Product Image Control */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-300">Main Product Image *</label>
                  <div className="border border-stone-800 bg-stone-950 rounded-2xl p-4 space-y-3">
                    {prodForm.image ? (
                      <div className="relative h-44 w-full rounded-xl overflow-hidden group bg-black border border-stone-800">
                        <img src={prodForm.image} alt="Main" className="w-full h-full object-contain p-1" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                          
                          {/* Replace Image */}
                          <label className="bg-amber-500 hover:bg-amber-400 text-stone-950 px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer shadow">
                            Replace Image
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={(e) => handleMainImageFileUpload(e.target.files?.[0])}
                            />
                          </label>

                          {/* Remove Image */}
                          <button
                            type="button"
                            onClick={() => setProdForm({ ...prodForm, image: '' })}
                            className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg text-xs font-black shadow"
                          >
                            Remove Image
                          </button>

                        </div>
                      </div>
                    ) : (
                      <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          handleMainImageFileUpload(e.dataTransfer.files?.[0]);
                        }}
                        className="py-10 border-2 border-dashed border-stone-800 rounded-xl text-center flex flex-col items-center gap-2 cursor-pointer hover:border-amber-400/50 transition-colors"
                      >
                        <Upload className="w-8 h-8 text-amber-400" />
                        <span className="text-xs font-bold text-stone-300">Drag & Drop Main Image</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="main-img-input-empty" 
                          className="hidden" 
                          onChange={(e) => handleMainImageFileUpload(e.target.files?.[0])}
                        />
                        <label htmlFor="main-img-input-empty" className="text-xs font-extrabold text-amber-400 cursor-pointer hover:underline">
                          Browse Local File
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Gallery Images Control */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-300">Additional Gallery Images</label>
                  <div className="border border-stone-800 bg-stone-950 rounded-2xl p-4 space-y-3 min-h-[200px]">
                    <div className="grid grid-cols-4 gap-2">
                      {prodForm.galleryImages.map((img, idx) => (
                        <div key={idx} className="relative h-18 rounded-lg overflow-hidden border border-stone-800 group bg-black">
                          <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setProdForm({ ...prodForm, galleryImages: prodForm.galleryImages.filter((_, i) => i !== idx) })}
                            className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove Gallery Image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setProdForm({ ...prodForm, image: img })}
                            className="absolute bottom-1 left-1 bg-amber-500 text-black text-[8px] font-extrabold px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Set Main
                          </button>
                        </div>
                      ))}
                    </div>

                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      id="gallery-img-input" 
                      className="hidden" 
                      onChange={(e) => handleGalleryImagesUpload(e.target.files)}
                    />
                    <label htmlFor="gallery-img-input" className="block text-center text-xs font-extrabold text-amber-400 cursor-pointer hover:underline py-2 bg-stone-900 border border-stone-800 rounded-xl hover:bg-stone-800">
                      + Add More Images
                    </label>
                  </div>
                </div>

              </div>

              {/* Description & Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Full Product Description</label>
                  <textarea
                    rows="3"
                    placeholder="Enter detailed features, battery specs, build quality..."
                    value={prodForm.description}
                    onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Product Features / Specs (Comma Separated)</label>
                  <textarea
                    rows="3"
                    placeholder="e.g. Rechargeable 12V Battery, Working Headlight, Foot Throttle"
                    value={prodForm.specsStr}
                    onChange={(e) => setProdForm({ ...prodForm, specsStr: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Stock, Colours & Age Group */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Stock Quantity</label>
                  <input 
                    type="number" 
                    value={prodForm.stock} 
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Product Status</label>
                  <select
                    value={prodForm.status}
                    onChange={(e) => setProdForm({ ...prodForm, status: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Coming Soon">Coming Soon</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Available Colours</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Red, Blue, Pink, White"
                    value={prodForm.coloursStr} 
                    onChange={(e) => setProdForm({ ...prodForm, coloursStr: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Age Group</label>
                  <select
                    value={prodForm.ageGroup}
                    onChange={(e) => setProdForm({ ...prodForm, ageGroup: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-amber-400 outline-none"
                  >
                    <option value="0 To 6 Month">0 To 6 Month</option>
                    <option value="6 To 12 Months">6 To 12 Months</option>
                    <option value="12 To 36 Months">12 To 36 Months</option>
                    <option value="36+ Months">36+ Months</option>
                  </select>
                </div>
              </div>

              {/* Toggles Bar */}
              <div className="bg-stone-950 border border-stone-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-300">
                  <input 
                    type="checkbox" 
                    checked={prodForm.isFeatured} 
                    onChange={(e) => setProdForm({ ...prodForm, isFeatured: e.target.checked })} 
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                  <span>Featured Product</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-300">
                  <input 
                    type="checkbox" 
                    checked={prodForm.isBestSeller} 
                    onChange={(e) => setProdForm({ ...prodForm, isBestSeller: e.target.checked })} 
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                  <span>Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-300">
                  <input 
                    type="checkbox" 
                    checked={prodForm.isNewArrival} 
                    onChange={(e) => setProdForm({ ...prodForm, isNewArrival: e.target.checked })} 
                    className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                  />
                  <span>New Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-300">
                  <input 
                    type="checkbox" 
                    checked={prodForm.isTrending} 
                    onChange={(e) => setProdForm({ ...prodForm, isTrending: e.target.checked })} 
                    className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                  />
                  <span>Trending</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-300">
                  <input 
                    type="checkbox" 
                    checked={prodForm.isHidden} 
                    onChange={(e) => setProdForm({ ...prodForm, isHidden: e.target.checked })} 
                    className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
                  />
                  <span className={prodForm.isHidden ? 'text-rose-400 font-black' : ''}>Hide Product on Website</span>
                </label>

              </div>

              {/* Action Buttons (Cancel and Save Changes) */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-6 py-3 rounded-xl text-xs font-bold bg-stone-800 text-stone-300 hover:bg-stone-700 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl text-sm font-black bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:from-amber-400 hover:to-amber-500 shadow-xl shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingProductId ? 'Save Changes' : 'Add Product'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PREVIEW PRODUCT MODAL                                         */}
      {/* ------------------------------------------------------------- */}
      {previewProductModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-950 border border-stone-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 relative">
            <button 
              onClick={() => setPreviewProductModal(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white p-2 rounded-full bg-stone-900"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="h-60 rounded-2xl overflow-hidden bg-black border border-stone-800 p-2 flex items-center justify-center">
              <img src={previewProductModal.image} alt={previewProductModal.name} className="max-h-full max-w-full object-contain" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                  {previewProductModal.category}
                </span>
                <span className="text-xs text-stone-400 font-mono">SKU: {previewProductModal.sku}</span>
              </div>

              <h3 className="text-xl font-black text-white">{previewProductModal.name}</h3>
              <p className="text-xs text-stone-300 leading-relaxed">{previewProductModal.description}</p>
              
              <div className="flex items-center justify-between pt-3 border-t border-stone-800">
                <span className="text-xs text-stone-400 line-through">MRP: ₹{previewProductModal.mrp || previewProductModal.originalPrice}</span>
                <span className="text-xl font-black text-amber-300">Selling Price: ₹{previewProductModal.sellingPrice || previewProductModal.price}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DELETE CONFIRMATION POPUP                                      */}
      {/* ------------------------------------------------------------- */}
      {deleteConfirmProd && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-rose-500/40 w-full max-w-md rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-white">Permanently Delete Product?</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Are you sure you want to permanently delete this product?
              <br />
              <strong className="text-white mt-1 block font-bold text-sm">"{deleteConfirmProd.name}"</strong>
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmProd(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-stone-800 text-stone-300 hover:bg-stone-700"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  deleteProduct(deleteConfirmProd.id || deleteConfirmProd._id);
                  setDeleteConfirmProd(null);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-500/20"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
