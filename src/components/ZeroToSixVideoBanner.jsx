import React from 'react';
import { Sparkles } from 'lucide-react';

export const ZeroToSixVideoBanner = () => {
  return (
    <div className="mb-3 rounded-2xl overflow-hidden bg-stone-950 text-white shadow-xl border border-white/10 relative group">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
        
        {/* Dual Side-by-Side Video Showcase Column */}
        <div className="lg:col-span-7 relative bg-stone-950 p-3 sm:p-4 flex items-center justify-center overflow-hidden">
          
          {/* Triple Videos 3-Column Grid for Ultra-Smooth Live Action */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full relative z-10">
            
            {/* Video 1: Wespa Scooter (vid 1.mp4) */}
            <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-black shadow-2xl border border-amber-400/30 group/v1">
              <video
                src="/wespa-scooter-vid.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover object-center rounded-2xl group-hover/v1:scale-105 transition-transform duration-500 will-change-transform"
                style={{ transform: 'translateZ(0)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-2 left-2 bg-rose-600/90 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                Featured Wespa
              </div>
              <div className="absolute bottom-2.5 left-2.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-extrabold text-amber-300 border border-white/15 shadow z-10">
                <span>Wespa Scooter</span>
              </div>
            </div>

            {/* Video 2: Baby Moving */}
            <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/15 group/v2">
              <video
                src="/videos/stroller-s1.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover object-center rounded-2xl group-hover/v2:scale-105 transition-transform duration-500 will-change-transform"
                style={{ transform: 'translateZ(0)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-extrabold text-amber-300 border border-white/15 shadow z-10">
                <span>Baby Ride-On</span>
              </div>
            </div>

            {/* Video 3: Baby Scooter */}
            <div className="relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/15 group/v3">
              <video
                src="/videos/scooter-scooter1.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover object-center rounded-2xl group-hover/v3:scale-105 transition-transform duration-500 will-change-transform"
                style={{ transform: 'translateZ(0)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-extrabold text-amber-300 border border-white/15 shadow z-10">
                <span>Scooter Glide</span>
              </div>
            </div>

          </div>
        </div>

        {/* Video Info Column - Matching Caption */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-stone-900/90 flex flex-col justify-center space-y-4 border-t lg:border-t-0 lg:border-l border-white/10 h-full">
          <div className="inline-flex items-center gap-2 bg-brand-burgundy/30 border border-brand-burgundy/50 text-rose-300 px-3 py-1 rounded-full text-xs font-bold w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ride-Ons & Scooter Showcase</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Active Mobility & Endless Fun
          </h3>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
            Experience our live showcase of premium twister ride-ons and LED balance scooters engineered with non-toxic ergonomic frames, smooth PU wheels, and child-safe balance support.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('products-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-brand-burgundy hover:bg-rose-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Active Play Collection</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
