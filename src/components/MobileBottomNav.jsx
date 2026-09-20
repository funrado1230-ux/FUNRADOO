import React from 'react';
import { Home, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

export const MobileBottomNav = () => {
  const { wishlist, cartItemCount, setIsWishlistOpen, setIsCartOpen } = useStore();
  const { setIsAccountModalOpen } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const focusSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const searchInput = document.querySelector('header input[type="text"]');
      if (searchInput) searchInput.focus();
    }, 150);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-stone-950/95 backdrop-blur-xl border-t border-stone-800 text-stone-300 py-1.5 px-2 shadow-[0_-8px_30px_rgba(0,0,0,0.35)] select-none">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Home */}
        <button
          onClick={scrollToTop}
          className="flex flex-col items-center gap-0.5 p-2 rounded-xl text-stone-400 hover:text-amber-400 active:scale-95 transition"
        >
          <Home className="w-5 h-5 text-stone-300" />
          <span className="text-[10px] font-bold tracking-tight">Home</span>
        </button>

        {/* Search */}
        <button
          onClick={focusSearch}
          className="flex flex-col items-center gap-0.5 p-2 rounded-xl text-stone-400 hover:text-amber-400 active:scale-95 transition"
        >
          <Search className="w-5 h-5 text-stone-300" />
          <span className="text-[10px] font-bold tracking-tight">Search</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => setIsWishlistOpen(true)}
          className="flex flex-col items-center gap-0.5 p-2 rounded-xl text-stone-400 hover:text-amber-400 active:scale-95 transition relative"
        >
          <div className="relative">
            <Heart className="w-5 h-5 text-stone-300" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-amber-400 text-stone-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight">Wishlist</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-0.5 p-2 rounded-xl text-amber-400 font-bold active:scale-95 transition relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white font-black text-[9px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center animate-bounce-subtle">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-extrabold tracking-tight text-amber-400">Cart</span>
        </button>

        {/* Account */}
        <button
          onClick={() => setIsAccountModalOpen(true)}
          className="flex flex-col items-center gap-0.5 p-2 rounded-xl text-stone-400 hover:text-amber-400 active:scale-95 transition"
        >
          <User className="w-5 h-5 text-stone-300" />
          <span className="text-[10px] font-bold tracking-tight">Account</span>
        </button>

      </div>
    </div>
  );
};
