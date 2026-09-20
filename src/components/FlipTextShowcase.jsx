import React, { useState } from 'react';
import { FlipText } from './ui/flip-text';
import { Sparkles, Sliders, RefreshCw, Zap, Play, CheckCircle2, Copy } from 'lucide-react';

export const FlipTextShowcase = () => {
  const [inputText, setInputText] = useState('UNLEASH THE FUN WITH FUNRADO');
  const [duration, setDuration] = useState(2.2);
  const [delay, setDelay] = useState(0);
  const [loop, setLoop] = useState(true);
  const [together, setTogether] = useState(false);
  const [theme, setTheme] = useState('gold');
  const [copied, setCopied] = useState(false);

  const presets = [
    { text: 'LITTLE RIDES BIG ADVENTURES', label: '🚀 Ride-on Hero' },
    { text: 'PREMIUM ELECTRIC CARS & BIKES', label: '⚡ Electric Speed' },
    { text: 'SAME DAY EXPRESS DELIVERY', label: '🚚 Express Shipping' },
    { text: 'EXPLORE THE JOY OF DISCOVERY', label: '✨ Magic & Fun' },
  ];

  const themeClasses = {
    gold: 'flip-gold-gradient drop-shadow-[0_4px_12px_rgba(245,158,11,0.4)]',
    rose: 'flip-rose-gradient drop-shadow-[0_4px_12px_rgba(225,29,72,0.4)]',
    cyan: 'flip-cyan-gradient drop-shadow-[0_4px_12px_rgba(56,189,248,0.4)]',
    emerald: 'flip-emerald-gradient drop-shadow-[0_4px_12px_rgba(16,185,129,0.4)]',
    white: 'text-white drop-shadow-[0_4px_14px_rgba(255,255,255,0.6)]',
  };

  const handleCopyCode = () => {
    const codeSnippet = `<FlipText\n  duration={${duration}}\n  delay={${delay}}\n  loop={${loop}}\n  together={${together}}\n  className="${themeClasses[theme]}"\n>\n  ${inputText}\n</FlipText>`;
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-stone-900 text-white relative overflow-hidden my-8 rounded-3xl border border-amber-500/20 shadow-2xl">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Next-Gen 3D Character Flip Experience</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">3D FlipText Engine</span>
          </h2>
          <p className="text-stone-400 max-w-2xl mx-auto text-sm sm:text-base">
            Watch character keyframes transform text into 3D rotating motion with sine-staggered wave delay logic.
          </p>
        </div>

        {/* Live Main 3D Stage */}
        <div className="min-h-[180px] sm:min-h-[220px] rounded-2xl bg-stone-950/80 border border-stone-800 p-6 sm:p-10 flex flex-col items-center justify-center text-center shadow-inner relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />

          {/* Rendered Live FlipText */}
          <FlipText
            key={`${inputText}-${duration}-${delay}-${loop}-${together}-${theme}`}
            duration={duration}
            delay={delay}
            loop={loop}
            together={together}
            className={`text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider ${themeClasses[theme]}`}
          >
            {inputText || 'TYPE YOUR TEXT'}
          </FlipText>

          <span className="text-xs text-stone-500 mt-6 font-medium tracking-wide">
            💡 Hover over individual 3D letters to trigger dynamic perspective tilt!
          </span>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-stone-950/40 p-6 rounded-2xl border border-stone-800/80 backdrop-blur-md">
          
          {/* 1. Custom Input & Presets */}
          <div className="space-y-3 lg:col-span-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Custom Text Input
            </label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type custom text..."
              className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 text-sm focus:outline-none focus:border-amber-400 transition"
            />

            <div className="flex flex-wrap gap-1.5 pt-1">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(p.text)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-amber-500/20 hover:text-amber-300 text-stone-300 transition-colors border border-stone-700"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Sliders & Mode Switches */}
          <div className="space-y-4 lg:col-span-1">
            <div>
              <div className="flex justify-between text-xs text-stone-300 font-semibold mb-1">
                <span>Duration ({duration}s)</span>
                <span className="text-amber-400">{duration < 1.8 ? 'Turbo' : duration > 2.8 ? 'Dramatic' : 'Standard'}</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="4.0"
                step="0.2"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-stone-300">Infinite Loop</span>
              <button
                onClick={() => setLoop(!loop)}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${loop ? 'bg-amber-500' : 'bg-stone-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${loop ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-300">Together (No Stagger)</span>
              <button
                onClick={() => setTogether(!together)}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${together ? 'bg-amber-500' : 'bg-stone-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${together ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* 3. Theme Preset Selector & Code Export */}
          <div className="space-y-4 lg:col-span-1 flex flex-col justify-between">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 block mb-2">
                Color & Gradient Palette
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'gold', color: 'bg-amber-400' },
                  { id: 'rose', color: 'bg-rose-500' },
                  { id: 'cyan', color: 'bg-sky-400' },
                  { id: 'emerald', color: 'bg-emerald-400' },
                  { id: 'white', color: 'bg-white' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`w-8 h-8 rounded-full ${t.color} border-2 transition-all ${
                      theme === t.id ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg active:scale-95"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-stone-950" />
                  <span>Code Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-stone-950" />
                  <span>Copy React JSX Snippet</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feature Cards Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          <div className="bg-stone-950/60 p-5 rounded-2xl border border-stone-800 flex flex-col justify-between hover:border-amber-500/40 transition">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
              ✨ Staggered Wave Preset
            </div>
            <div className="my-4 min-h-[50px] flex items-center">
              <FlipText duration={2.4} className="text-xl font-extrabold flip-gold-gradient">
                SPEED & ADVENTURE
              </FlipText>
            </div>
            <p className="text-xs text-stone-400">
              Each character flips sequentially using a smooth sine function for maximum rhythm.
            </p>
          </div>

          <div className="bg-stone-950/60 p-5 rounded-2xl border border-stone-800 flex flex-col justify-between hover:border-sky-500/40 transition">
            <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">
              ⚡ Turbo Synchronized Preset
            </div>
            <div className="my-4 min-h-[50px] flex items-center">
              <FlipText duration={1.6} together={true} className="text-xl font-extrabold flip-cyan-gradient">
                ELECTRIC CARS
              </FlipText>
            </div>
            <p className="text-xs text-stone-400">
              All letters execute 3D flip simultaneously for uniform high-energy impact.
            </p>
          </div>

          <div className="bg-stone-950/60 p-5 rounded-2xl border border-stone-800 flex flex-col justify-between hover:border-rose-500/40 transition">
            <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">
              🌹 Rose Velvet Luxury Preset
            </div>
            <div className="my-4 min-h-[50px] flex items-center">
              <FlipText duration={3.0} className="text-xl font-extrabold flip-rose-gradient">
                PREMIUM RIDE-ONS
              </FlipText>
            </div>
            <p className="text-xs text-stone-400">
              Silky slow motion turn with rich metallic gradient shading for premium branding.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
