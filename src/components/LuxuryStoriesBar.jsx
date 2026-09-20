import React from 'react';
import { Sparkles, Play, RotateCw, Flame, Award, Heart } from 'lucide-react';

export const LuxuryStoriesBar = ({ onSelectCategory, activeCategory }) => {
  const stories = [
    {
      id: "All Products",
      title: "All Luxe",
      badge: "HOT",
      image: "/images/ride-ons/rolls-royce-phantom.jpg",
      ringColor: "from-amber-400 via-amber-300 to-amber-500",
      isVideo: false
    },
    {
      id: "3D 360 Studio",
      title: "3D 360° Studio",
      badge: "LIVE 🎥",
      image: "/images/ride-ons/mercedes-g63-police.jpg",
      ringColor: "from-rose-500 via-amber-400 to-rose-600",
      isVideo: true
    },
    {
      id: "Electric Ride-On Cars & 4x4s",
      title: "4x4 Supercars",
      badge: "BESTSELLER",
      image: "/images/ride-ons/blue-orange-buggy.jpg",
      ringColor: "from-amber-400 via-amber-200 to-amber-500",
      isVideo: false
    },
    {
      id: "Luxury Superbikes & Vespa Scooters",
      title: "Superbikes & Trikes",
      badge: "3-WHEEL",
      image: "/images/ride-ons/red-gs-motorbike.jpg",
      ringColor: "from-red-500 via-amber-400 to-red-600",
      isVideo: false
    },
    {
      id: "Hoverboards & Smart Wheels",
      title: "Hoverboards",
      badge: "TECH ⚡",
      image: "/images/ride-ons/smart-hoverboards.jpg",
      ringColor: "from-cyan-400 via-blue-500 to-indigo-500",
      isVideo: false
    },
    {
      id: "0 To 6 Month",
      title: "0-6M Newborn",
      badge: "NURSERY",
      image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1000&auto=format&fit=crop",
      ringColor: "from-pink-400 via-rose-300 to-pink-500",
      isVideo: true
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 select-none">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-stone-900">
            FUNRADO Luxury Collections & Stories
          </h2>
        </div>
        <span className="text-[11px] font-bold text-stone-400">Swipe to Explore</span>
      </div>

      {/* Horizontal Story Reel Carousel */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
        {stories.map((story) => {
          const isActive = activeCategory === story.id;
          return (
            <button
              key={story.id}
              onClick={() => onSelectCategory(story.id)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none"
            >
              {/* Outer Animated Ring */}
              <div className={`relative p-0.5 rounded-full bg-gradient-to-tr ${story.ringColor} transition-transform duration-300 group-hover:scale-105 ${isActive ? 'scale-110 shadow-lg' : ''}`}>
                
                {/* Inner Image Container */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1 overflow-hidden relative shadow-inner border border-stone-200">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300 img-hd-sharp"
                  />
                  {story.isVideo && (
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  )}
                </div>

                {/* Badge Overlay */}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-stone-900 text-amber-300 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full shadow border border-amber-400/30 whitespace-nowrap">
                  {story.badge}
                </span>

              </div>

              {/* Title */}
              <span className={`text-[11px] font-bold transition-colors ${isActive ? 'text-[#581C25] font-black' : 'text-stone-700 group-hover:text-[#581C25]'}`}>
                {story.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
