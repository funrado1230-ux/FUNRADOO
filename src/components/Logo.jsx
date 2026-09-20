import React from 'react';
import { Sparkles } from 'lucide-react';

export const Logo = ({ size = "md", light = false, showTagline = true, className = "", variant = "full" }) => {
  // Sizing variants
  const sizeConfig = {
    sm: {
      img: "w-8 h-8",
      fullHeight: "h-7 sm:h-8",
      text: "text-lg",
      sub: "text-[8px]",
      gap: "gap-2"
    },
    md: {
      img: "w-10 h-10 sm:w-11 sm:h-11",
      fullHeight: "h-8 sm:h-9",
      text: "text-xl sm:text-2xl",
      sub: "text-[9px]",
      gap: "gap-2.5"
    },
    lg: {
      img: "w-12 h-12 sm:w-14 sm:h-14",
      fullHeight: "h-11 sm:h-12",
      text: "text-2xl sm:text-3xl",
      sub: "text-[10px]",
      gap: "gap-3"
    }
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;

  if (variant === "full") {
    return (
      <div className={`inline-flex flex-col justify-center group cursor-pointer select-none ${className}`}>
        <div className="flex items-center gap-1.5">
          <img
            src={light ? "/images/funrado_logo_light.png" : "/images/funrado_logo_dark.png"}
            alt="FUNRADO"
            className={`${currentSize.fullHeight} w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm`}
          />
        </div>
        {showTagline && (
          <div className="flex items-center gap-1 mt-0.5 ml-1">
            <span className={`font-black tracking-widest uppercase ${currentSize.sub} ${light ? 'text-amber-300/90' : 'text-amber-600'}`}>
              KIDS STORE
            </span>
            <span className="w-1 h-1 rounded-full bg-rose-500 inline-block" />
            <span className={`text-[8px] font-bold tracking-wider uppercase ${light ? 'text-stone-300' : 'text-stone-500'}`}>
              LUXURY
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${currentSize.gap} group cursor-pointer select-none ${className}`}>
      {/* Emblem Icon Container with Glowing Gradient */}
      <div className="relative flex-shrink-0">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500 rounded-2xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300 group-hover:scale-105" />
        <div className={`${currentSize.img} rounded-xl overflow-hidden bg-stone-950 border border-amber-400/40 p-1 shadow-lg relative z-10 flex items-center justify-center`}>
          <img 
            src="/images/funrado_mark.png" 
            alt="FUNRADO Logo"
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className={`font-black tracking-tight leading-none ${currentSize.text} flex items-center gap-0.5`}>
          <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent font-black drop-shadow-xs">
            FUN
          </span>
          <span className={light ? "text-white" : "text-stone-900"}>
            RADO
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse fill-amber-400 ml-0.5" />
        </div>
        {showTagline && (
          <div className="flex items-center gap-1 mt-1">
            <span className={`font-black tracking-widest uppercase ${currentSize.sub} ${light ? 'text-amber-300/90' : 'text-amber-600'}`}>
              KIDS STORE
            </span>
            <span className="w-1 h-1 rounded-full bg-rose-500 inline-block" />
            <span className={`text-[8px] font-bold tracking-wider uppercase ${light ? 'text-stone-400' : 'text-stone-500'}`}>
              LUXURY
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
