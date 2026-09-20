import React from 'react';

export const FloatingAmbientBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Base soft white background */}
      <div className="absolute inset-0 bg-[#FAFAFA]" />

      {/* Dynamic Animated Glowing Ambient Orbs (Peach, Pista, Champagne) */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#FFE5D9]/40 via-[#F7E7CE]/30 to-transparent rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-[25%] -right-32 w-[600px] h-[600px] bg-gradient-to-bl from-[#D8F3DC]/40 via-[#FFE5D9]/30 to-transparent rounded-full blur-3xl animate-float-reverse" />
      <div className="absolute top-[55%] -left-32 w-[550px] h-[550px] bg-gradient-to-tr from-[#F7E7CE]/45 via-[#D8F3DC]/35 to-transparent rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-t from-[#FFE5D9]/50 via-[#F7E7CE]/30 to-transparent rounded-full blur-3xl animate-pulse-glow" />

      {/* Subtle Dot Mesh Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.035]" 
        style={{
          backgroundImage: `radial-gradient(#2C1E1A 1.2px, transparent 1.2px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Floating 3D Micro Particle Accent Orbs */}
      <div className="absolute top-24 left-[8%] w-3 h-3 rounded-full bg-amber-400/50 blur-[1px] animate-float-slow" />
      <div className="absolute top-48 right-[10%] w-4 h-4 rounded-full bg-coral/50 blur-[1px] animate-float-reverse" />
      <div className="absolute top-[45%] left-[4%] w-2.5 h-2.5 rounded-full bg-mint/60 blur-[1px] animate-float-slow" />
      <div className="absolute top-[70%] right-[6%] w-3.5 h-3.5 rounded-full bg-amber-300/60 blur-[1px] animate-float-reverse" />
    </div>
  );
};
