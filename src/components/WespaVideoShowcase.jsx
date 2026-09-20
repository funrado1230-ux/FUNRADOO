import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, Maximize2, ShieldCheck, Zap, ShoppingCart, Eye } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WespaVideoShowcase = () => {
  const { setQuickViewProduct, addToCart, buyNow, products } = useStore();
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Find a scooter product to link with CTA
  const wespaProduct = products.find(p => p.category === 'Scooters' || p.name.toLowerCase().includes('scooter')) || {
    id: 'scooter-rise-1',
    name: 'Wespa Ultra-Glider Kids Scooter with LED Light Wheels',
    price: 2184,
    originalPrice: 5999,
    rating: 4.9,
    image: '/images/store/40.jpeg',
    category: 'Scooters'
  };

  // Visibility observer: auto-pause when out of view, auto-resume when scrolled into view
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration || 1;
    setProgress((current / duration) * 100);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    }
  };

  return (
    <div ref={containerRef} className="w-full max-w-7xl mx-auto my-8 select-none">
      <div className="relative rounded-3xl overflow-hidden bg-stone-950 border border-amber-500/20 shadow-2xl group">
        
        {/* Glow ambient background effects */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-0">
          
          {/* Main HD Smooth Video Stage Column */}
          <div className="lg:col-span-7 relative bg-black aspect-video lg:aspect-[16/10] overflow-hidden flex items-center justify-center">
            
            {/* Loading Skeleton Pulse before video renders */}
            {!isLoaded && (
              <div className="absolute inset-0 bg-stone-900 animate-pulse flex items-center justify-center text-stone-500 text-xs font-bold gap-2 z-10">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>Loading HD Wespa Video...</span>
              </div>
            )}

            {/* Smooth HTML5 Video Element */}
            <video
              ref={videoRef}
              src="/wespa-scooter-vid.mp4"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              onLoadedData={() => setIsLoaded(true)}
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-cover object-center will-change-transform transform transition-all duration-500"
              style={{
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translateZ(0)'
              }}
            />

            {/* Subtle Gradient Overlays for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Top Badge Overlay */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-black text-white shadow-lg">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>WESPA SCOOTER IN ACTION</span>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[11px] font-extrabold px-3 py-1 rounded-full">
                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Smooth 60 FPS Playback</span>
              </div>
            </div>

            {/* Center Play Button Overlay on Hover */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105 z-20 cursor-pointer shadow-2xl"
              title={isPlaying ? "Pause Video" : "Play Video"}
            >
              {isPlaying ? <Pause className="w-7 h-7 text-amber-400" /> : <Play className="w-7 h-7 text-amber-400 fill-amber-400 ml-1" />}
            </button>

            {/* Bottom Floating Control Bar */}
            <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-col gap-1.5 bg-black/65 backdrop-blur-md p-2.5 rounded-2xl border border-white/15 shadow-xl">
              
              {/* Timeline Progress Bar */}
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1 text-white text-xs font-bold">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-amber-400 fill-amber-400" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>

                  <button
                    onClick={toggleMute}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    <span>{isMuted ? 'Unmute Sound' : 'Muted'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-stone-300 font-semibold tracking-wider uppercase">HD 1080P Ultra Smooth</span>
                  <button
                    onClick={handleFullscreen}
                    className="hover:text-amber-400 transition-colors cursor-pointer p-1"
                    title="Fullscreen Mode"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Product Details & Purchase CTA Column */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-center space-y-5 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white h-full border-t lg:border-t-0 lg:border-l border-white/10">
            
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-300 px-3.5 py-1 rounded-full text-xs font-extrabold w-fit">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Wespa Mobility Series</span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                Wespa Ride-On Adventure
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm mt-2 leading-relaxed font-normal">
                Watch our flagship Wespa scooter in action. Engineered with dual-beam LED front lamps, smooth silent PU wheels, ergonomic safety frame, and lean-to-steer balance technology.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-bold text-stone-200">100% Anti-Tip Safe</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[11px] font-bold text-stone-200">Magnetic Light Wheels</span>
              </div>
            </div>

            {/* Pricing & Call to Action Buttons */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <span className="text-2xl font-black text-amber-400">
                  ₹{wespaProduct.price.toLocaleString('en-IN')}.00
                </span>
                <span className="text-xs text-stone-400 line-through ml-2">
                  ₹{wespaProduct.originalPrice.toLocaleString('en-IN')}.00
                </span>
                {(wespaProduct.status === 'Out of Stock' || (wespaProduct.stock !== undefined && Number(wespaProduct.stock) <= 0)) ? (
                  <div className="text-[10px] text-rose-400 font-bold">Out of Stock • Restock Pending</div>
                ) : (
                  <div className="text-[10px] text-emerald-400 font-bold">In Stock • Fast Express Dispatch</div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuickViewProduct(wespaProduct)}
                  className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-amber-300" />
                  <span>Inspect</span>
                </button>

                <button
                  onClick={() => buyNow(wespaProduct)}
                  disabled={wespaProduct.status === 'Out of Stock' || (wespaProduct.stock !== undefined && Number(wespaProduct.stock) <= 0)}
                  className={`flex-1 sm:flex-none px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    wespaProduct.status === 'Out of Stock' || (wespaProduct.stock !== undefined && Number(wespaProduct.stock) <= 0)
                      ? 'bg-stone-600 text-stone-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-lg shadow-amber-500/20 cursor-pointer'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{(wespaProduct.status === 'Out of Stock' || (wespaProduct.stock !== undefined && Number(wespaProduct.stock) <= 0)) ? 'Out of Stock' : 'Buy Now'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
