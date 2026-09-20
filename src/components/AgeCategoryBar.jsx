import React from 'react';
import { AGE_CATEGORIES } from '../data/products';
import { useStore } from '../context/StoreContext';
import { Play } from 'lucide-react';

export const AgeCategoryBar = () => {
  const { selectedAge, setSelectedAge } = useStore();

  const handleCategoryClick = (id) => {
    if (selectedAge === id) {
      setSelectedAge('all'); // toggle back to show all if clicked again
    } else {
      setSelectedAge(id);
    }
  };

  return (
    <div className="bg-white border-b border-stone-200/60 py-3 px-4 shadow-xs">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-4 sm:gap-10 md:gap-16 no-scrollbar overflow-hidden">
        {AGE_CATEGORIES.map((cat) => {
          const isActive = selectedAge === cat.id;
          const isZeroToSix = cat.id === '0 To 6 Month';

          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="flex flex-col items-center justify-end cursor-pointer group text-center focus:outline-none transition-transform duration-200 hover:scale-105"
            >
              {/* Small Fitted Cutout Graphic / Small 3-second Video Slot */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center relative mb-1.5">
                {isZeroToSix ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <video
                      ref={(el) => {
                        if (el) {
                          el.defaultMuted = true;
                          el.muted = true;
                          const p = el.play();
                          if (p !== undefined) {
                            p.catch(() => {
                              el.muted = true;
                              el.play().catch(() => {});
                            });
                          }
                        }
                      }}
                      src="/convert_the_image_to_sec_vid.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      onEnded={(e) => {
                        e.target.currentTime = 0;
                        e.target.play().catch(() => {});
                      }}
                      className="w-full h-full object-cover rounded-xl shadow-xs pointer-events-none"
                    />
                  </div>
                ) : (
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-contain filter drop-shadow-xs transition-transform duration-300 group-hover:scale-110 img-hd-sharp"
                    style={{ imageRendering: '-webkit-optimize-contrast' }}
                  />
                )}
              </div>

              {/* Title label matching reference screenshot font & style */}
              <span
                className={`font-serif text-xs sm:text-sm md:text-base font-bold tracking-tight whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-brand-burgundy underline decoration-brand-burgundy decoration-2 underline-offset-4'
                    : 'text-stone-900 group-hover:text-brand-burgundy'
                }`}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
