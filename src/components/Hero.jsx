import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';


const bannerImages = [

  {
    id: 1,
    src: '/images/banner/banner1.png',
    alt: 'Little Rides, Big Adventures - Ride-on Electric Cars and Bikes'
  },
  {
    id: 2,
    src: '/images/banner/banner2.png',
    alt: 'Little Rider, Big Dreams! Ride. Smile. Shine.'
  },
  {
    id: 3,
    src: '/images/banner/banner3.jpg',
    alt: 'Growing Through Every Ride'
  },
  {
    id: 4,
    src: '/images/banner/banner4.jpg',
    alt: 'Navigate the Sparkle of Discovery'
  }
];

export const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(bannerImages.length - 1);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Automatic right-to-left sliding every 3 seconds endlessly
  useEffect(() => {
    const timer = setInterval(() => {
      setPrevIndex(currentIndex);
      setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const goToNext = () => {
    setPrevIndex(currentIndex);
    setCurrentIndex((prev) => (prev + 1) % bannerImages.length);
  };

  const goToPrev = () => {
    setPrevIndex(currentIndex);
    setCurrentIndex((prev) => (prev === 0 ? bannerImages.length - 1 : prev - 1));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 40) {
      goToNext();
    } else if (touchEndX.current - touchStartX.current > 40) {
      goToPrev();
    }
  };

  return (
    <section 
      className="relative w-full max-w-[96%] sm:max-w-7xl mx-auto my-3 sm:my-5 h-[45vh] min-h-[320px] sm:h-[60vh] md:h-[72vh] lg:h-[82vh] xl:h-[86vh] overflow-hidden bg-[#0D0D11] select-none rounded-3xl sm:rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(224,90,71,0.25)] border-2 border-white/60 z-10 floating-section"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >


      {/* Layered Stacked Slides - Guarantees Right to Left Infinite Loop */}


      <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
        {bannerImages.map((image, index) => {
          let positionClass = 'translate-x-full opacity-0 z-0'; // Waiting on right

          if (index === currentIndex) {
            positionClass = 'translate-x-0 opacity-100 z-20'; // Active center
          } else if (index === prevIndex) {
            positionClass = '-translate-x-full opacity-0 z-10'; // Exiting left
          }

          return (
            <div
              key={image.id}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out transform flex items-center justify-center bg-[#0D0D11] ${positionClass}`}
            >
              {/* Blurred background glow for full screen immersion */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-25 blur-2xl scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${image.src})` }}
              />

              {/* Full Image Display - Crystal Clear & Uncropped */}
              <img
                src={image.src}
                alt={image.alt}
                className="relative z-10 w-full h-full object-contain object-center drop-shadow-2xl antialiased img-hd-sharp"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          );
        })}
      </div>

      {/* Left Navigation Arrow */}
      <button
        onClick={goToPrev}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-13 sm:h-13 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl transition-all duration-200 hover:scale-110 group"
        aria-label="Previous Banner Image"
      >
        <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      {/* Right Navigation Arrow */}
      <button
        onClick={goToNext}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-13 sm:h-13 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl transition-all duration-200 hover:scale-110 group"
        aria-label="Next Banner Image"
      >
        <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Bottom Dot Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 shadow-2xl">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setPrevIndex(currentIndex);
              setCurrentIndex(index);
            }}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === index
                ? 'w-8 h-2.5 bg-amber-400 shadow-md scale-105'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/90'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
