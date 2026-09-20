import React from 'react';
import { MapPin, ChevronDown, Sparkles, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const TopBanner = () => {
  const { selectedLocation, setIsLocationOpen } = useStore();

  return (
    <div className="bg-[#FAF9F6] border-b border-stone-200 text-xs py-2 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left Side: Delivery Promise */}
        <div className="flex items-center gap-2 text-stone-700 font-medium">
          <div className="flex items-center gap-1.5 bg-brand-roseTint text-brand-burgundy px-2.5 py-1 rounded-full text-[11px] font-semibold border border-brand-burgundy/10">
            <MapPin className="w-3.5 h-3.5 text-brand-burgundy" />
            <span>Get It Same Day</span>
          </div>
          <span className="hidden md:inline text-stone-400">•</span>
          <span className="hidden md:inline text-stone-600">
            Free Express Shipping on orders over ₹2,499
          </span>
        </div>

        {/* Right Side: Location Selector Button */}
        <button
          onClick={() => setIsLocationOpen(true)}
          className="flex items-center gap-1.5 bg-brand-burgundy hover:bg-brand-burgundyDark text-white px-3.5 py-1 rounded-md text-[11px] font-semibold transition-all shadow-sm hover:shadow active:scale-95"
        >
          <span>Choose a Location</span>
          <span className="text-stone-300 font-normal">({selectedLocation.split(',')[0]})</span>
          <ChevronDown className="w-3 h-3 text-white/80" />
        </button>
      </div>
    </div>
  );
};
