import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, Play, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const Product3DViewer = ({ product, images = [] }) => {
  const [activeTab, setActiveTab] = useState('photo'); // 'photo' | 'video'
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const videoRef = useRef(null);
  const allImages = images.length > 0 ? images : [product.image, ...(product.secondaryImages || [])];
  const activeImage = allImages[selectedImgIndex] || product.image;
  const isScooterProduct = product?.category === 'Scooters' || product?.name?.toLowerCase().includes('scooter') || product?.id?.includes('scooter');
  const isBikeProduct = product?.category === 'Electric Bikes' || product?.id?.startsWith('bike');
  const video360Src = product.videoUrl || (isScooterProduct ? '/wespa-scooter-vid.mp4' : isBikeProduct ? '/bike_3d_vid.mp4' : '/car_1_video.mp4');

  useEffect(() => {
    if (activeTab === 'video' && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [activeTab, video360Src]);

  return (
    <div className="w-full flex flex-col items-center select-none space-y-2">
      
      {/* Tab Switcher: Photos vs 3D Video */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-200/80 rounded-xl w-full justify-center text-xs font-extrabold mb-1">
        <button
          onClick={() => setActiveTab('photo')}
          className={`flex-1 py-1 px-2.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === 'photo'
              ? 'bg-white text-brand-burgundy shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Product Photos</span>
        </button>

        <button
          onClick={() => setActiveTab('video')}
          className={`flex-1 py-1 px-2.5 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === 'video'
              ? 'bg-white text-brand-burgundy shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>3D Video</span>
        </button>
      </div>

      {/* Main Display Stage */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-md flex items-center justify-center group">
        
        {activeTab === 'photo' ? (
          <>
            {/* Actual Product Photo */}
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
            />

            {/* Click to Zoom Overlay Badge */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute bottom-2.5 right-2.5 bg-stone-900/80 hover:bg-stone-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur flex items-center gap-1 transition-all opacity-80 group-hover:opacity-100 cursor-pointer"
            >
              <ZoomIn className="w-3 h-3 text-amber-300" />
              <span>Full Screen</span>
            </button>
          </>
        ) : (
          /* 3D Video View */
          <video
            ref={videoRef}
            src={video360Src}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            controls={false}
            className="w-full h-full object-contain bg-black"
          />
        )}
      </div>

      {/* Full-Screen High-Resolution Image Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/20 hover:bg-white text-white hover:text-stone-900 transition-all cursor-pointer"
            title="Close Fullscreen View"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous / Next Image Navigation inside Lightbox */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImgIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                className="absolute left-4 z-10 p-3 rounded-full bg-white/20 hover:bg-white text-white hover:text-stone-900 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setSelectedImgIndex((prev) => (prev + 1) % allImages.length)}
                className="absolute right-4 z-10 p-3 rounded-full bg-white/20 hover:bg-white text-white hover:text-stone-900 transition-all cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Full Screen Image */}
          <div className="max-w-4xl max-h-[85vh] flex items-center justify-center p-2">
            <img
              src={activeImage}
              alt={product.name}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-xs font-bold bg-white/20 backdrop-blur px-4 py-1.5 rounded-full">
            {product.name} ({selectedImgIndex + 1} of {allImages.length})
          </div>
        </div>
      )}

    </div>
  );
};
