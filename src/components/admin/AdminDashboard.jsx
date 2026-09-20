import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Package, Users, Tag, BarChart3, Settings, LogOut,
  Plus, Edit, Trash2, Search, Filter, ShieldCheck, CheckCircle, AlertTriangle, X,
  TrendingUp, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, Truck, Eye, Lock, RefreshCw, Layers,
  Image as ImageIcon, Sparkles, Globe
} from 'lucide-react';
import { Logo } from '../Logo';
import { db } from '../../services/db';
import { getActiveAdminSession, logoutAdmin } from '../../services/authService';
import { useStore } from '../../context/StoreContext';
import { ProductManager } from './ProductManager';
import { CategoryManager } from './CategoryManager';
import { WebsiteImageManager } from './WebsiteImageManager';
import { OffersManager } from './OffersManager';
import { OrdersManager } from './OrdersManager';

export const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'products' | 'categories' | 'images' | 'offers' | 'orders' | 'customers' | 'content' | 'settings'
  const [adminSession, setAdminSession] = useState(null);
  
  const { products, categories, websiteImages, offers, orders: storeOrders } = useStore();

  // DB Fallback States
  const [dbOrders, setDbOrders] = useState([]);
  const [dbCustomers, setDbCustomers] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  // Modals & Order Filter
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);
  const [customerSearch, setCustomerSearch] = useState('');

  useEffect(() => {
    const session = getActiveAdminSession();
    setAdminSession(session);
    refreshDbData();
  }, []);

  const refreshDbData = () => {
    try {
      setDbOrders(db.orders.find() || []);
      setDbCustomers(db.users.find() || []);
      setActivityLogs(db.activityLogs.find() || []);
    } catch (e) {
      console.error('Error fetching DB logs:', e);
    }
  };

  // Summary Metrics Calculation
  const totalProductsCount = products.length;
  const totalCategoriesCount = categories.length;
  const outOfStockCount = products.filter(p => p.status === 'Out of Stock' || (p.stock !== undefined && p.stock !== null && Number(p.stock) <= 0)).length;
  const activeOffersCount = offers.filter(o => o.isActive).length;
  const featuredProductsCount = products.filter(p => p.isFeatured).length;

  const totalSalesAmount = storeOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrdersCount = storeOrders.length;

  // Sidebar Menu Items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: ShoppingBag, count: totalProductsCount },
    { id: 'categories', label: 'Categories', icon: Layers, count: totalCategoriesCount },
    { id: 'images', label: 'Website Images', icon: ImageIcon, count: websiteImages.length },
    { id: 'offers', label: 'Offers & Coupons', icon: Tag, count: activeOffersCount },
    { id: 'orders', label: 'Orders', icon: Package, count: totalOrdersCount },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'content', label: 'Website Content', icon: Globe },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    try {
      db.orders.update(orderId, { orderStatus: newStatus });
      refreshDbData();
    } catch (e) {
      console.error('Error updating order:', e);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans select-none">
      
      {/* Top Navigation Bar */}
      <header className="h-16 bg-stone-900/90 border-b border-stone-800 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Logo light={true} />
          <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-md hidden sm:inline-block">
            CMS Admin Control Center
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="block text-xs font-black text-white">{adminSession?.name || 'Super Admin'}</span>
            <span className="block text-[10px] text-stone-400 font-mono">{adminSession?.email || 'admin@funrado.com'}</span>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-64 bg-stone-900/60 border-r border-stone-800 p-4 hidden md:flex flex-col justify-between shrink-0">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-stone-500">
              Admin Navigation
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-amber-500 text-stone-950 shadow-md font-black' 
                      : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-stone-950 text-amber-300 font-bold' : 'bg-stone-800 text-stone-400'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-stone-950/80 rounded-2xl border border-stone-800 text-center space-y-1">
            <span className="block text-[10px] text-stone-400 font-mono">FUNRADO CMS v2.4</span>
            <span className="block text-[9px] text-emerald-400 font-bold flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live Store Synchronised
            </span>
          </div>
        </aside>

        {/* Mobile Horizontal Tab Navigation */}
        <div className="md:hidden bg-stone-900 border-b border-stone-800 p-2 overflow-x-auto flex items-center gap-2 scrollbar-none sticky top-16 z-30">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive ? 'bg-amber-500 text-stone-950 font-black' : 'bg-stone-800 text-stone-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto space-y-6">
          
          {/* Top Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            
            {/* Total Products Card */}
            <div 
              onClick={() => setActiveTab('products')}
              className="bg-stone-900 border border-stone-800 p-4 rounded-2xl cursor-pointer hover:border-amber-500/40 transition-all shadow-lg group"
            >
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Total Products</span>
                <ShoppingBag className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">{totalProductsCount}</div>
              <span className="text-[10px] text-amber-300 font-semibold mt-1 block">Live Catalog Items</span>
            </div>

            {/* Total Categories Card */}
            <div 
              onClick={() => setActiveTab('categories')}
              className="bg-stone-900 border border-stone-800 p-4 rounded-2xl cursor-pointer hover:border-amber-500/40 transition-all shadow-lg group"
            >
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Categories</span>
                <Layers className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">{totalCategoriesCount}</div>
              <span className="text-[10px] text-sky-300 font-semibold mt-1 block">Store Collections</span>
            </div>

            {/* Out of Stock Card */}
            <div 
              onClick={() => setActiveTab('products')}
              className="bg-stone-900 border border-stone-800 p-4 rounded-2xl cursor-pointer hover:border-rose-500/40 transition-all shadow-lg group"
            >
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Out of Stock</span>
                <AlertTriangle className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-rose-400">{outOfStockCount}</div>
              <span className="text-[10px] text-rose-300 font-semibold mt-1 block">Requires Restock</span>
            </div>

            {/* Active Offers Card */}
            <div 
              onClick={() => setActiveTab('offers')}
              className="bg-stone-900 border border-stone-800 p-4 rounded-2xl cursor-pointer hover:border-emerald-500/40 transition-all shadow-lg group"
            >
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Active Offers</span>
                <Tag className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-300">{activeOffersCount}</div>
              <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">Live Flash Deals</span>
            </div>

            {/* Featured Products Card */}
            <div 
              onClick={() => setActiveTab('products')}
              className="bg-stone-900 border border-stone-800 p-4 rounded-2xl cursor-pointer hover:border-purple-500/40 transition-all shadow-lg group col-span-2 sm:col-span-1"
            >
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Featured</span>
                <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-purple-300">{featuredProductsCount}</div>
              <span className="text-[10px] text-purple-300 font-semibold mt-1 block">Hero Showcase</span>
            </div>

          </div>

          {/* Render Active View Tab Component */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Quick Metrics Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-stone-400 uppercase">Total Sales Recorded</div>
                  <div className="text-3xl font-black text-amber-300">₹{totalSalesAmount.toLocaleString('en-IN')}</div>
                  <p className="text-[11px] text-stone-400">{totalOrdersCount} Customer Checkout Orders</p>
                </div>

                <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-stone-400 uppercase">Store Categories</div>
                  <div className="text-3xl font-black text-sky-300">{totalCategoriesCount} Collections</div>
                  <p className="text-[11px] text-stone-400">Vespa, Cycles, Scooters, Cars, Bikes, etc.</p>
                </div>

                <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-stone-400 uppercase">Active Banners & Images</div>
                  <div className="text-3xl font-black text-purple-300">{websiteImages.length} Image Assets</div>
                  <p className="text-[11px] text-stone-400">Synchronised live across desktop & mobile</p>
                </div>
              </div>

              {/* Quick Navigation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <button
                  onClick={() => setActiveTab('products')}
                  className="bg-stone-900 hover:bg-stone-800 border border-stone-800 p-5 rounded-2xl text-left space-y-3 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/30 group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">Manage Products</h4>
                    <p className="text-xs text-stone-400 mt-0.5">Add, edit, change prices, update stock, and replace product photos.</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('categories')}
                  className="bg-stone-900 hover:bg-stone-800 border border-stone-800 p-5 rounded-2xl text-left space-y-3 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center border border-sky-500/30 group-hover:scale-110 transition-transform">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">Manage Categories</h4>
                    <p className="text-xs text-stone-400 mt-0.5">Add new categories, edit category names & banner graphics.</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('images')}
                  className="bg-stone-900 hover:bg-stone-800 border border-stone-800 p-5 rounded-2xl text-left space-y-3 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">Website Image Manager</h4>
                    <p className="text-xs text-stone-400 mt-0.5">Replace hero banners, offer graphics, and website background images.</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('offers')}
                  className="bg-stone-900 hover:bg-stone-800 border border-stone-800 p-5 rounded-2xl text-left space-y-3 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">Offers & Coupons</h4>
                    <p className="text-xs text-stone-400 mt-0.5">Create coupon codes, promotional discounts, and flash sale tags.</p>
                  </div>
                </button>

              </div>

            </div>
          )}

          {activeTab === 'products' && <ProductManager />}
          {activeTab === 'categories' && <CategoryManager initialCreate={false} key="cat-list" />}
          {activeTab === 'images' && <WebsiteImageManager />}
          {activeTab === 'offers' && <OffersManager />}

          {/* Orders Section */}
          {activeTab === 'orders' && <OrdersManager />}

          {/* Customers Section */}
          {activeTab === 'customers' && (
            <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-xl font-black text-white">Registered Store Customers</h3>
              <p className="text-xs text-stone-400">View registered user accounts and contact information.</p>
              
              <div className="border border-stone-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-950 text-stone-400 uppercase font-bold text-[10px]">
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 text-stone-300">
                    {dbCustomers.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="py-8 text-center text-stone-500 font-bold">No registered customer accounts.</td>
                      </tr>
                    ) : (
                      dbCustomers.map((u, i) => (
                        <tr key={u._id || i} className="hover:bg-stone-800/50">
                          <td className="py-3 px-4 font-bold text-white">{u.name || 'Customer'}</td>
                          <td className="py-3 px-4 text-stone-400">{u.email}</td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold uppercase">
                              {u.role || 'Customer'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Website Content Section */}
          {activeTab === 'content' && (
            <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-xl font-black text-white">Website Content & Marquee Headlines</h3>
              <p className="text-xs text-stone-400">Edit announcements, ticker text, and support contact details.</p>
              
              <div className="space-y-4 max-w-xl">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Header Announcement Ticker Text</label>
                  <input 
                    type="text" 
                    defaultValue="🎉 Flat 20% OFF on all Vespa Electric Ride-Ons • Free Express Delivery Across India" 
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-300">Store Concierge WhatsApp Number</label>
                  <input 
                    type="text" 
                    defaultValue="+91 98765 43210" 
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>

                <button 
                  onClick={() => alert("Website content settings saved!")}
                  className="bg-amber-500 text-stone-950 font-black text-xs px-5 py-2.5 rounded-xl shadow cursor-pointer"
                >
                  Save Content Changes
                </button>
              </div>
            </div>
          )}

          {/* Settings Section */}
          {activeTab === 'settings' && (
            <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-xl font-black text-white">Store Settings & System Info</h3>
              <div className="space-y-2 text-xs text-stone-300">
                <p><strong className="text-white">Store Name:</strong> FUNRADO Kids Ride-On Store</p>
                <p><strong className="text-white">Platform Version:</strong> v2.4 CMS Engine</p>
                <p><strong className="text-white">Image Upload Format Supported:</strong> JPG, JPEG, PNG, WEBP</p>
                <p><strong className="text-white">Database Status:</strong> Synchronised Live</p>
              </div>
            </div>
          )}

        </main>

      </div>

    </div>
  );
};
