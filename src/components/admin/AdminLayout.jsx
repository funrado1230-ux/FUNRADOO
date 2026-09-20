import React from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart,
  Settings,
  LogOut,
  Bell,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminLayout = ({ children, activeTab = 'dashboard', setActiveTab }) => {
  const { user, logout } = useAdminAuth();

  const menuItems = [
    { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'products', icon: <Package className="w-5 h-5" />, label: 'Products' },
    { id: 'orders', icon: <ShoppingCart className="w-5 h-5" />, label: 'Orders' },
    { id: 'customers', icon: <Users className="w-5 h-5" />, label: 'Customers' },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-stone-900 border-r border-stone-800 flex flex-col justify-between shadow-2xl flex-shrink-0"
      >
        <div>
          <div className="p-6 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 via-amber-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-stone-950 font-black text-lg">A</span>
              </div>
              <div>
                <h1 className="text-sm font-extrabold text-white">FUNRADO Admin</h1>
                <p className="text-[11px] text-stone-400 font-medium">Store Control Center</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setActiveTab && setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group cursor-pointer text-xs font-bold ${
                  activeTab === item.id 
                    ? 'bg-amber-400 text-stone-950 shadow-md font-black' 
                    : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <span className="group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </motion.button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-stone-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-300 group cursor-pointer text-xs font-bold"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Logout Admin</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header */}
        <header className="bg-stone-900 border-b border-stone-800 p-4 sticky top-0 z-40">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-base sm:text-lg font-black text-white capitalize">{activeTab || 'Dashboard'}</h2>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders, products..."
                  className="pl-9 pr-4 py-2 bg-stone-800 border border-stone-700 text-xs text-white rounded-xl focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
              
              <button className="relative p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors cursor-pointer">
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-2 bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700">
                <div className="w-7 h-7 rounded-full bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center">
                  {user?.name ? user.name[0].toUpperCase() : 'A'}
                </div>
                <span className="text-xs font-extrabold text-white truncate max-w-[120px]">{user?.name || 'Super Admin'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
