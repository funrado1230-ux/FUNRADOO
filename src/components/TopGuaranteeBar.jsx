import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, RotateCcw, Video, Clock, Sparkles, PhoneCall } from 'lucide-react';

export const TopGuaranteeBar = ({ onOpenVirtualDemo }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  // Ticking countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 5, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#8B1A1A] text-white text-xs py-2 px-4 border-b border-rose-900/40 shadow-inner select-none relative z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] font-semibold">
        
        {/* Left: BlueStone Trust Badges Ticker */}
        <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start text-stone-200">
          <span className="flex items-center gap-1.5 text-amber-300 font-extrabold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> 100% Certified Safe
          </span>
          <span className="hidden sm:inline-block text-stone-500">•</span>
          <span className="flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> 30-Day Money Back
          </span>
          <span className="hidden sm:inline-block text-stone-500">•</span>
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-amber-400" /> Free Insured Doorstep Delivery
          </span>
        </div>

        {/* Right: Flash Sale Countdown & Try-at-Home / Virtual Tour Button */}
        <div className="flex items-center gap-3">
          
          {/* Flash Sale Timer */}
          <div className="hidden lg:flex items-center gap-1.5 bg-black/30 backdrop-blur px-2.5 py-1 rounded-full border border-amber-500/30 text-amber-300">
            <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
            <span className="font-mono text-[10px] font-bold">
              Express Sale Ends In: {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
            </span>
          </div>

          {/* BlueStone-Style "Book 1-on-1 Virtual Video Tour / Try at Home" Button */}
          <button
            onClick={onOpenVirtualDemo}
            className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-stone-950 px-3 py-1 rounded-full font-black hover:brightness-110 transition-all shadow-md flex items-center gap-1.5 text-[10px] uppercase tracking-wider border border-amber-200"
          >
            <Video className="w-3 h-3 fill-stone-950" />
            <span>Book Virtual VIP Video Tour</span>
          </button>

        </div>

      </div>
    </div>
  );
};
