import React, { useState } from 'react';
import { X, MapPin, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const POPULAR_LOCATIONS = [
  "Mumbai, 400001",
  "Delhi NCR, 110001",
  "Bengaluru, 560001",
  "Hyderabad, 500001",
  "Chennai, 600001",
  "Kolkata, 700001",
  "Pune, 411001",
  "Ahmedabad, 380001"
];

export const LocationModal = () => {
  const { isLocationOpen, setIsLocationOpen, selectedLocation, setSelectedLocation, showToast } = useStore();
  const [customPincode, setCustomPincode] = useState('');

  if (!isLocationOpen) return null;

  const handleSelect = (loc) => {
    setSelectedLocation(loc);
    setIsLocationOpen(false);
    showToast(`Delivery location set to ${loc} 📍`);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customPincode.length >= 6) {
      handleSelect(`Pincode: ${customPincode}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-stone-200 overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-900">
            <MapPin className="w-5 h-5 text-brand-burgundy" />
            <h2 className="text-base font-extrabold">Select Delivery Location</h2>
          </div>
          <button
            onClick={() => setIsLocationOpen(false)}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter 6-digit Pincode"
              value={customPincode}
              maxLength={6}
              onChange={(e) => setCustomPincode(e.target.value.replace(/\D/g, ''))}
              className="flex-1 px-4 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-burgundy"
            />
            <button
              type="submit"
              disabled={customPincode.length < 6}
              className="bg-brand-burgundy text-white font-bold text-xs px-4 py-2 rounded-xl disabled:opacity-50 hover:bg-brand-burgundyDark transition-all"
            >
              Apply
            </button>
          </form>

          <div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2.5">
              Popular Cities
            </p>
            <div className="grid grid-cols-2 gap-2">
              {POPULAR_LOCATIONS.map((loc) => {
                const isCurrent = selectedLocation === loc;
                return (
                  <button
                    key={loc}
                    onClick={() => handleSelect(loc)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-brand-roseTint border-brand-burgundy text-brand-burgundy shadow-sm'
                        : 'bg-stone-50 border-stone-100 text-stone-700 hover:bg-white hover:border-stone-300'
                    }`}
                  >
                    <span>{loc}</span>
                    {isCurrent && <Check className="w-4 h-4 text-brand-burgundy" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
