import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Plus, Edit, Trash2, Eye, Check, X, 
  Sparkles, ToggleLeft, ToggleRight, AlertTriangle, Save,
  Search, Filter, Package, ArrowUpDown, Layers, CheckCircle2,
  XCircle, FolderPlus, Info
} from 'lucide-react';

const ICON_OPTIONS = ['🚗', '🚲', '🛴', '🏍️', '🛞', '🚜', '🧸', '🏎️'];
const BADGE_DROPDOWN_OPTIONS = ['No Badge', 'Popular', 'Best Seller', 'New', 'Trending', 'Premium', 'Kids Favourite'];
const PRODUCT_FILTER_OPTIONS = ['All Products', 'Cars', 'Cycles', 'Scooters', 'Ride-Ons', 'Electric Bikes', 'Swing Cars', 'Hoverboards'];

export const CategoryManager = ({ initialOpenAdd = false }) => {
  const { 
    categories, 
    products, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    toggleCategoryStatus, 
    showToast,
    setQuickViewProduct
  } = useStore();

  // Page level filter & search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all | active | inactive | empty
  const [sortBy, setSortBy] = useState('newest'); // newest | oldest | a-z | z-a | most-products | least-products

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(initialOpenAdd || false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [managingProductsCat, setManagingProductsCat] = useState(null);
  const [deleteConfirmCat, setDeleteConfirmCat] = useState(null);

  // Form State for Add / Edit Modal
  const [catForm, setCatForm] = useState({
    name: '',
    description: '',
    emoji: '🛞',
    badge: 'No Badge',
    status: 'active', // 'active' | 'inactive'
    selectedProductIds: []
  });

  // Modal Product Search & Filter
  const [modalProductSearch, setModalProductSearch] = useState('');
  const [modalProductCategoryFilter, setModalProductCategoryFilter] = useState('All Products');

  // Helper: Get products associated with a category
  const getProductsForCategory = useMemo(() => {
    return (category) => {
      if (!category) return [];
      // Look up latest category from state if available
      const catObj = categories.find(c => c.id === category.id || c.name === category.name) || category;
      if (Array.isArray(catObj.productIds)) {
        const assignedIds = new Set(catObj.productIds);
        return products.filter(p => assignedIds.has(p.id) || assignedIds.has(p._id));
      }

      const catNameLower = (catObj.name || '').toLowerCase().trim();
      return products.filter(p => {
        const pCatLower = (p.category || '').toLowerCase().trim();
        if (pCatLower === catNameLower) return true;
        if (Array.isArray(p.categories) && p.categories.some(c => (c || '').toLowerCase().trim() === catNameLower)) return true;
        return false;
      });
    };
  }, [products, categories]);

  // Helper: Category Thumbnail Image Priority
  // 1. First Product Image -> 2. Default FUNRADO Placeholder
  const getCategoryDisplayImage = (category, assignedProducts) => {
    if (category.thumbnail && category.thumbnail.trim() !== '' && !category.thumbnail.includes('placeholder_fallback')) {
      return category.thumbnail;
    }
    if (category.bannerImage && category.bannerImage.trim() !== '' && !category.bannerImage.includes('placeholder_fallback')) {
      return category.bannerImage;
    }
    if (assignedProducts && assignedProducts.length > 0 && assignedProducts[0]?.image) {
      return assignedProducts[0].image;
    }
    return '/images/store/cycles/73.jpeg';
  };

  // Dashboard Summary Stats
  const stats = useMemo(() => {
    const total = categories.length;
    const active = categories.filter(c => !c.isDisabled).length;
    const hidden = categories.filter(c => c.isDisabled).length;
    const empty = categories.filter(c => getProductsForCategory(c).length === 0).length;

    return { total, active, hidden, empty };
  }, [categories, getProductsForCategory]);

  // Filtered & Sorted Categories list for Main View
  const filteredCategories = useMemo(() => {
    return categories
      .filter(cat => {
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase().trim();
          const matchName = (cat.name || '').toLowerCase().includes(q);
          const matchBadge = (cat.badge || '').toLowerCase().includes(q);
          const matchDesc = (cat.description || cat.tagline || '').toLowerCase().includes(q);
          const assignedProds = getProductsForCategory(cat);
          const matchProdName = assignedProds.some(p => (p.name || '').toLowerCase().includes(q));

          if (!matchName && !matchBadge && !matchDesc && !matchProdName) return false;
        }

        const assignedCount = getProductsForCategory(cat).length;
        if (filterStatus === 'active' && cat.isDisabled) return false;
        if (filterStatus === 'inactive' && !cat.isDisabled) return false;
        if (filterStatus === 'empty' && assignedCount > 0) return false;

        return true;
      })
      .sort((a, b) => {
        const countA = getProductsForCategory(a).length;
        const countB = getProductsForCategory(b).length;

        if (sortBy === 'a-z') return (a.name || '').localeCompare(b.name || '');
        if (sortBy === 'z-a') return (b.name || '').localeCompare(a.name || '');
        if (sortBy === 'most-products') return countB - countA;
        if (sortBy === 'least-products') return countA - countB;
        return 0;
      });
  }, [categories, searchTerm, filterStatus, sortBy, getProductsForCategory]);

  // Filter products inside Add / Edit Modal
  const selectableModalProducts = useMemo(() => {
    return products.filter(p => {
      // Text Search (Name, SKU, Brand, ID)
      if (modalProductSearch.trim()) {
        const q = modalProductSearch.toLowerCase().trim();
        const mName = (p.name || '').toLowerCase().includes(q);
        const mSku = (p.sku || '').toLowerCase().includes(q);
        const mId = (p.id || p._id || '').toLowerCase().includes(q);
        const mBrand = (p.brand || '').toLowerCase().includes(q);
        if (!mName && !mSku && !mId && !mBrand) return false;
      }

      // Filter Category Dropdown
      if (modalProductCategoryFilter !== 'All Products') {
        const catLower = modalProductCategoryFilter.toLowerCase().trim();
        const pCatLower = (p.category || '').toLowerCase().trim();
        if (!pCatLower.includes(catLower) && !catLower.includes(pCatLower)) return false;
      }

      return true;
    });
  }, [products, modalProductSearch, modalProductCategoryFilter]);

  // Handle Add Category Form Submission
  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) {
      showToast("Please enter a category name.");
      return;
    }
    if (catForm.selectedProductIds.length === 0) {
      showToast("Please select at least one product.");
      return;
    }

    // Auto image from first product
    let firstProdImage = '/images/store/cycles/73.jpeg';
    const firstProd = products.find(p => p.id === catForm.selectedProductIds[0] || p._id === catForm.selectedProductIds[0]);
    if (firstProd && firstProd.image) {
      firstProdImage = firstProd.image;
    }

    addCategory({
      name: catForm.name.trim(),
      description: catForm.description.trim(),
      emoji: catForm.emoji,
      badge: catForm.badge === 'No Badge' ? '' : catForm.badge,
      isDisabled: catForm.status === 'inactive',
      productIds: catForm.selectedProductIds,
      bannerImage: firstProdImage,
      thumbnail: firstProdImage
    });

    setIsAddModalOpen(false);
    resetForm();
  };

  // Handle Edit Category Form Submission
  const handleEditCategorySubmit = (e) => {
    e.preventDefault();
    if (!editingCategory || !catForm.name.trim()) {
      showToast("Please enter a category name.");
      return;
    }
    if (catForm.selectedProductIds.length === 0) {
      showToast("Please select at least one product.");
      return;
    }

    let firstProdImage = editingCategory.thumbnail || editingCategory.bannerImage;
    if (catForm.selectedProductIds.length > 0) {
      const firstProd = products.find(p => p.id === catForm.selectedProductIds[0] || p._id === catForm.selectedProductIds[0]);
      if (firstProd && firstProd.image) {
        firstProdImage = firstProd.image;
      }
    }

    updateCategory(editingCategory.id, {
      name: catForm.name.trim(),
      description: catForm.description.trim(),
      emoji: catForm.emoji,
      badge: catForm.badge === 'No Badge' ? '' : catForm.badge,
      isDisabled: catForm.status === 'inactive',
      productIds: catForm.selectedProductIds,
      bannerImage: firstProdImage,
      thumbnail: firstProdImage
    });

    setEditingCategory(null);
    resetForm();
  };

  const resetForm = () => {
    setCatForm({
      name: '',
      description: '',
      emoji: '🛞',
      badge: 'No Badge',
      status: 'active',
      selectedProductIds: []
    });
    setModalProductSearch('');
    setModalProductCategoryFilter('All Products');
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (cat) => {
    const assignedProducts = getProductsForCategory(cat);
    const assignedIds = cat.productIds || assignedProducts.map(p => p.id);

    setCatForm({
      name: cat.name || '',
      description: cat.description || cat.tagline || '',
      emoji: cat.emoji || '🛞',
      badge: cat.badge || 'No Badge',
      status: cat.isDisabled ? 'inactive' : 'active',
      selectedProductIds: assignedIds
    });
    setModalProductSearch('');
    setModalProductCategoryFilter('All Products');
    setEditingCategory(cat);
  };

  return (
    <div className="space-y-6">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. SUMMARY STAT CARDS                                         */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-2xl shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider">Total Categories</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.total}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Configured in Store</div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-2xl shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Active</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">{stats.active}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Visible on Customer Site</div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-2xl shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-400">Hidden</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400">{stats.hidden}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Inactive in Admin</div>
        </div>

        <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-2xl shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">Empty Categories</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">{stats.empty}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">0 Assigned Products</div>
        </div>
      </div>

      {/* HEADER & ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/80 p-5 rounded-2xl border border-stone-800 backdrop-blur-md">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <span>Category Management</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-extrabold">
              {categories.length} Collections
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Manage categories, assign products, set badges, and control live store visibility.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* SEARCH, FILTER & SORT CONTROLS */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-stone-900/60 p-4 rounded-2xl border border-stone-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories by name, badge, or assigned products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-stone-500 focus:border-amber-400 outline-none transition-colors"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All' },
              { id: 'active', label: 'Active' },
              { id: 'inactive', label: 'Hidden' },
              { id: 'empty', label: 'Empty (0)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  filterStatus === tab.id
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-stone-950 border border-stone-800 px-3 py-1.5 rounded-xl text-xs text-stone-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer"
            >
              <option value="newest" className="bg-stone-900 text-white">Newest First</option>
              <option value="oldest" className="bg-stone-900 text-white">Oldest First</option>
              <option value="a-z" className="bg-stone-900 text-white">A – Z</option>
              <option value="z-a" className="bg-stone-900 text-white">Z – A</option>
              <option value="most-products" className="bg-stone-900 text-white">Most Products</option>
              <option value="least-products" className="bg-stone-900 text-white">Least Products</option>
            </select>
          </div>
        </div>
      </div>

      {/* CATEGORIES GRID LIST */}
      {filteredCategories.length === 0 ? (
        <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-12 text-center space-y-3">
          <FolderPlus className="w-12 h-12 text-stone-600 mx-auto" />
          <h3 className="text-lg font-bold text-stone-300">No Categories Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            No category collections match your current filter or search criteria.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
            className="mt-2 text-xs font-extrabold text-amber-400 hover:underline cursor-pointer"
          >
            Clear Filters & Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat) => {
            const assignedProducts = getProductsForCategory(cat);
            const productCount = assignedProducts.length;
            const displayImg = getCategoryDisplayImage(cat, assignedProducts);
            const isDisabled = cat.isDisabled;

            return (
              <div 
                key={cat.id} 
                className={`bg-stone-900 border rounded-3xl overflow-hidden transition-all duration-300 shadow-xl flex flex-col justify-between group ${
                  isDisabled ? 'border-rose-500/30 opacity-75' : 'border-stone-800 hover:border-amber-500/40 hover:shadow-amber-500/5'
                }`}
              >
                <div className="relative h-44 bg-stone-950 overflow-hidden">
                  <img 
                    src={displayImg} 
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => { e.target.src = '/images/store/cycles/73.jpeg'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl p-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 shadow">
                        {cat.emoji || '🛞'}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md ${
                        isDisabled ? 'bg-rose-500/30 text-rose-300 border-rose-500/40' : 'bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {isDisabled ? 'Hidden' : 'Active'}
                      </span>
                    </div>

                    {cat.badge && (
                      <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-amber-500 text-stone-950 shadow-md">
                        {cat.badge}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black backdrop-blur-md border shadow-lg ${
                      productCount === 0 
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                        : 'bg-black/80 text-white border-white/20'
                    }`}>
                      <Package className="w-3.5 h-3.5 text-amber-400" />
                      <span>{productCount} {productCount === 1 ? 'Product' : 'Products'}</span>
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                      <span>{cat.name}</span>
                    </h3>
                    <p className="text-xs text-stone-400 line-clamp-2 mt-1 leading-relaxed">
                      {cat.description || cat.tagline || 'No description provided.'}
                    </p>
                  </div>

                  {productCount === 0 && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-2 text-xs text-amber-300">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                        <span>No products assigned</span>
                      </div>
                      <button
                        onClick={() => setManagingProductsCat(cat)}
                        className="px-2.5 py-1 bg-amber-500 text-stone-950 rounded-lg font-black hover:bg-amber-400 transition-colors text-[11px]"
                      >
                        + Add Products
                      </button>
                    </div>
                  )}

                  <div className="pt-2 border-t border-stone-800/80 grid grid-cols-5 gap-1.5">
                    <button
                      onClick={() => setViewingCategory(cat)}
                      className="col-span-1 bg-stone-800 hover:bg-stone-700 text-stone-200 p-2.5 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center gap-1 border border-stone-700 transition-all cursor-pointer"
                      title="View Products in Category"
                    >
                      <Eye className="w-4 h-4 text-amber-400" />
                      <span className="text-[9px] uppercase tracking-tighter text-stone-300">View</span>
                    </button>

                    <button
                      onClick={() => openEditModal(cat)}
                      className="col-span-1 bg-stone-800 hover:bg-stone-700 text-stone-200 p-2.5 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center gap-1 border border-stone-700 transition-all cursor-pointer"
                      title="Edit Category Details"
                    >
                      <Edit className="w-4 h-4 text-blue-400" />
                      <span className="text-[9px] uppercase tracking-tighter text-stone-300">Edit</span>
                    </button>

                    <button
                      onClick={() => setManagingProductsCat(cat)}
                      className="col-span-1 bg-stone-800 hover:bg-stone-700 text-stone-200 p-2.5 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center gap-1 border border-stone-700 transition-all cursor-pointer"
                      title="Add or Remove Products"
                    >
                      <Package className="w-4 h-4 text-emerald-400" />
                      <span className="text-[9px] uppercase tracking-tighter text-stone-300">Manage</span>
                    </button>

                    <button
                      onClick={() => toggleCategoryStatus(cat.id)}
                      className={`col-span-1 p-2.5 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                        isDisabled
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-amber-500/20 hover:text-amber-300'
                      }`}
                      title={isDisabled ? "Show on Customer Site" : "Hide from Customer Site"}
                    >
                      {isDisabled ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-amber-400" />}
                      <span className="text-[9px] uppercase tracking-tighter">{isDisabled ? "Show" : "Hide"}</span>
                    </button>

                    <button
                      onClick={() => setDeleteConfirmCat(cat)}
                      className="col-span-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 p-2.5 rounded-xl text-xs font-extrabold flex flex-col items-center justify-center gap-1 border border-rose-500/30 transition-all cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4 text-rose-400" />
                      <span className="text-[9px] uppercase tracking-tighter text-rose-300">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ADD NEW CATEGORY & EDIT CATEGORY MODAL (CLEAN SINGLE MODAL)   */}
      {/* ------------------------------------------------------------- */}
      {(isAddModalOpen || editingCategory) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-5 relative my-auto max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 shrink-0">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>{editingCategory ? `Edit Category` : `Add New Category`}</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Create a collection and choose the products that belong to it.
                </p>
              </div>

              <button 
                onClick={() => { setIsAddModalOpen(false); setEditingCategory(null); resetForm(); }}
                className="p-2 text-stone-400 hover:text-white rounded-full bg-stone-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form 
              onSubmit={editingCategory ? handleEditCategorySubmit : handleAddCategorySubmit} 
              className="space-y-4 overflow-y-auto pr-1 flex-1"
            >
              
              {/* Category Details: 2-Column Row (Name & Icon) */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-3 space-y-1.5">
                  <label className="text-xs font-bold text-stone-300">Category Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Swing Cars"
                    value={catForm.name} 
                    onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div className="sm:col-span-1 space-y-1.5">
                  <label className="text-xs font-bold text-stone-300">Icon</label>
                  <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
                    {ICON_OPTIONS.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setCatForm({ ...catForm, emoji: icon })}
                        className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all shrink-0 border cursor-pointer ${
                          catForm.emoji === icon 
                            ? 'bg-amber-500/20 border-amber-400 scale-105 shadow-sm' 
                            : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-800'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300">Short Description</label>
                <input 
                  type="text" 
                  placeholder="Fun and easy ride-on swing cars for kids"
                  value={catForm.description} 
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:border-amber-400 outline-none"
                />
              </div>

              {/* Badge Dropdown & Status Toggle (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300">Badge – Optional</label>
                  <select
                    value={catForm.badge}
                    onChange={(e) => setCatForm({ ...catForm, badge: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-400 outline-none cursor-pointer"
                  >
                    {BADGE_DROPDOWN_OPTIONS.map(opt => (
                      <option key={opt} value={opt} className="bg-stone-900 text-white">{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-300">Category Status</label>
                  <div className="flex items-center gap-2 bg-stone-950 border border-stone-800 p-1.5 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setCatForm({ ...catForm, status: 'active' })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        catForm.status === 'active' 
                          ? 'bg-emerald-500 text-stone-950 shadow-xs' 
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCatForm({ ...catForm, status: 'inactive' })}
                      className={`flex-1 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        catForm.status === 'inactive' 
                          ? 'bg-rose-500 text-white shadow-xs' 
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Inactive</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-stone-400">Active categories appear on the customer website.</p>
                </div>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* ADD PRODUCTS SECTION                                         */}
              {/* ------------------------------------------------------------- */}
              <div className="space-y-3 pt-3 border-t border-stone-800">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-black text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-400" />
                    <span>Add Products</span>
                  </label>
                  <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                    Selected: {catForm.selectedProductIds.length} {catForm.selectedProductIds.length === 1 ? 'Product' : 'Products'}
                  </span>
                </div>

                {/* Product Search & Dropdown Filter Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2 relative">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search by product name, SKU or brand..."
                      value={modalProductSearch}
                      onChange={(e) => setModalProductSearch(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <select
                      value={modalProductCategoryFilter}
                      onChange={(e) => setModalProductCategoryFilter(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 outline-none cursor-pointer"
                    >
                      {PRODUCT_FILTER_OPTIONS.map(opt => (
                        <option key={opt} value={opt} className="bg-stone-900 text-white">{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fixed Scrollable Product List (max-h-60) */}
                <div className="max-h-60 overflow-y-auto border border-stone-800 rounded-2xl bg-stone-950 divide-y divide-stone-800/60 p-1">
                  {selectableModalProducts.length === 0 ? (
                    <div className="p-6 text-center text-xs text-stone-500">
                      No products match your search or filter.
                    </div>
                  ) : (
                    selectableModalProducts.map(prod => {
                      const pId = prod.id || prod._id;
                      const isChecked = catForm.selectedProductIds.includes(pId);
                      return (
                        <label 
                          key={pId}
                          className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                            isChecked ? 'bg-amber-500/15 border border-amber-500/40 text-white' : 'hover:bg-stone-900 text-stone-300 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCatForm(prev => ({ ...prev, selectedProductIds: [...prev.selectedProductIds, pId] }));
                                } else {
                                  setCatForm(prev => ({ ...prev, selectedProductIds: prev.selectedProductIds.filter(id => id !== pId) }));
                                }
                              }}
                              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                            />
                            <img src={prod.image} alt="" className="w-10 h-10 object-cover rounded-lg bg-stone-900 shrink-0" />
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate">{prod.name}</div>
                              <div className="text-[10px] text-stone-400 flex items-center gap-2">
                                <span>SKU: {prod.sku || prod.id}</span>
                                <span>•</span>
                                <span>Stock: {prod.stock}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-xs font-black text-amber-400 shrink-0 ml-2">
                            ₹{prod.price?.toLocaleString('en-IN')}
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Modal Sticky Footer */}
              <div className="pt-3 flex items-center justify-between border-t border-stone-800 shrink-0">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingCategory(null); resetForm(); }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-stone-800 text-stone-300 hover:bg-stone-700 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-xl text-xs font-black bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* VIEW PRODUCTS MODAL */}
      {viewingCategory && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 relative">
            <button 
              onClick={() => setViewingCategory(null)}
              className="absolute top-6 right-6 p-2 text-stone-400 hover:text-white rounded-full bg-stone-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <span className="text-2xl p-2 rounded-xl bg-stone-800 border border-stone-700">{viewingCategory.emoji || '🛞'}</span>
              <div>
                <h3 className="text-xl font-black text-white">{viewingCategory.name}</h3>
                <p className="text-xs text-stone-400">
                  {getProductsForCategory(viewingCategory).length} Products assigned to this category
                </p>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
              {getProductsForCategory(viewingCategory).length === 0 ? (
                <div className="p-8 text-center bg-stone-950 rounded-2xl border border-stone-800 text-stone-400 text-xs">
                  No products are currently assigned to this category.
                </div>
              ) : (
                getProductsForCategory(viewingCategory).map(prod => (
                  <div 
                    key={prod.id || prod._id}
                    className="p-3 bg-stone-950 border border-stone-800 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={prod.image} alt="" className="w-12 h-12 object-cover rounded-xl shrink-0 bg-stone-900" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                        <div className="text-[11px] text-stone-400 flex items-center gap-2 mt-0.5">
                          <span>SKU: {prod.sku || prod.id}</span>
                          <span>•</span>
                          <span className="text-amber-400 font-extrabold">₹{prod.price?.toLocaleString('en-IN')}</span>
                          <span>•</span>
                          <span>Stock: {prod.stock}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setViewingCategory(null);
                          setQuickViewProduct(prod);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-stone-800 hover:bg-stone-700 text-stone-200 cursor-pointer"
                      >
                        View Product
                      </button>

                      <button
                        onClick={() => {
                          const currentAssigned = getProductsForCategory(viewingCategory);
                          const pId = prod.id || prod._id;
                          const updatedIds = currentAssigned.filter(p => p.id !== pId && p._id !== pId).map(p => p.id || p._id);
                          updateCategory(viewingCategory.id, { productIds: updatedIds });
                          setViewingCategory(prev => (prev ? { ...prev, productIds: updatedIds } : null));
                          showToast(`Removed "${prod.name}" from ${viewingCategory.name}`);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MANAGE PRODUCTS MODAL */}
      {managingProductsCat && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-8 relative">
            <button 
              onClick={() => setManagingProductsCat(null)}
              className="absolute top-6 right-6 p-2 text-stone-400 hover:text-white rounded-full bg-stone-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                <Package className="w-6 h-6 text-amber-400" />
                <span>Manage Products – {managingProductsCat.name}</span>
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Add or remove products for this category. Changes take effect immediately.
              </p>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-1 border border-stone-800 rounded-2xl bg-stone-950 p-2">
              {products.map(prod => {
                const assigned = getProductsForCategory(managingProductsCat);
                const isAssigned = assigned.some(ap => ap.id === prod.id || ap._id === prod.id);
                return (
                  <div 
                    key={prod.id || prod._id}
                    className={`p-3 rounded-xl flex items-center justify-between gap-3 border transition-colors ${
                      isAssigned ? 'bg-amber-500/10 border-amber-500/30 text-white' : 'bg-stone-900 border-stone-800 text-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={prod.image} alt="" className="w-10 h-10 object-cover rounded-lg shrink-0 bg-stone-900" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold truncate">{prod.name}</h4>
                        <span className="text-[10px] text-amber-400 font-extrabold">₹{prod.price?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const currentAssigned = getProductsForCategory(managingProductsCat);
                        const pId = prod.id || prod._id;
                        let updatedIds = [];
                        if (isAssigned) {
                          updatedIds = currentAssigned.filter(p => p.id !== pId && p._id !== pId).map(p => p.id || p._id);
                        } else {
                          updatedIds = [...currentAssigned.map(p => p.id || p._id), pId];
                        }
                        updateCategory(managingProductsCat.id, { productIds: updatedIds });
                        setManagingProductsCat(prev => (prev ? { ...prev, productIds: updatedIds } : null));
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                        isAssigned 
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30' 
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                      }`}
                    >
                      {isAssigned ? 'Remove' : '+ Add'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-end border-t border-stone-800">
              <button
                onClick={() => setManagingProductsCat(null)}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-lg cursor-pointer"
              >
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DELETE CATEGORY CONFIRMATION */}
      {deleteConfirmCat && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-rose-500/40 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-4 relative">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-white">Delete {deleteConfirmCat.name}?</h3>
            <p className="text-xs text-stone-300 leading-relaxed bg-stone-950 p-4 rounded-2xl border border-stone-800">
              The category will be deleted, but its products will remain in the Products section.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmCat(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-stone-800 text-stone-300 hover:bg-stone-700 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  deleteCategory(deleteConfirmCat.id);
                  setDeleteConfirmCat(null);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-black bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-500/20 cursor-pointer"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
