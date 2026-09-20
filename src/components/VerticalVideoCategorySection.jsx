import React, { useRef, useEffect } from 'react';

export const VerticalVideoCategorySection = () => {
  const videoRefs = useRef([]);

  const ALL_FIVE_VIDEOS = [
    { id: 'v1-wespa-2', videoUrl: '/videos/wespa-vid2.mp4' },
    { id: 'v2-car-1', videoUrl: '/videos/cars-car1.mp4' },
    { id: 'v3-bike-1', videoUrl: '/videos/bikes-bike1.mp4' },
    { id: 'v4-stroller-s1', videoUrl: '/videos/stroller-s1.mp4' },
    { id: 'v5-scooter-1', videoUrl: '/videos/scooter-scooter1.mp4' }
  ];

  // Auto-pause video cards out of view using IntersectionObserver
  useEffect(() => {
    const refs = videoRefs.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (video) {
            if (entry.isIntersecting) {
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    refs.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      refs.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto my-6 bg-stone-950 rounded-3xl p-3 sm:p-4 border border-white/10 shadow-2xl select-none relative overflow-hidden">
      
      {/* 1 SINGLE LINE WITH ALL 5 PURE VIDEOS SIDE-BY-SIDE */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 w-full relative z-10">
        {ALL_FIVE_VIDEOS.map((item) => (
          <div
            key={item.id}
            className="relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/15 hover:border-amber-400/50 transition-all duration-300 group/vcard flex items-center justify-center"
          >
            {/* Pure Continuous Vertical Video Loop */}
            <video
              ref={(el) => (videoRefs.current[item.id] = el)}
              src={item.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover object-center rounded-2xl group-hover/vcard:scale-105 transition-transform duration-500 will-change-transform"
              style={{ transform: 'translateZ(0)' }}
            />
          </div>
        ))}
      </div>

    </div>
  );
};
