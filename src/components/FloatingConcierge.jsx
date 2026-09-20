import React, { useState } from 'react';
import { MessageCircle, X, ShieldCheck, Sparkles, Send, ChevronRight, Video, Phone } from 'lucide-react';

export const FloatingConcierge = ({ onOpenVirtualDemo }) => {
  const [isOpen, setIsOpen] = useState(false);

  const quickQuestions = [
    { label: "🏎️ Which 4x4 Jeep is best for my child?", query: "Hi FUNRADO! Which 4x4 ride-on jeep is best for a 3-year-old?" },
    { label: "🎥 Request 3D 360° Video Demo", query: "Hi FUNRADO! I would like to see a 3D 360° video demonstration of a ride-on car." },
    { label: "💳 UPI Payment Assistance", query: "Hi FUNRADO! I need assistance with UPI payment methods." },
    { label: "🚚 Check Express Delivery Time", query: "Hi FUNRADO! What is the estimated delivery time for my pincode?" }
  ];

  const handleOpenWhatsApp = (customMessage) => {
    const encoded = encodeURIComponent(customMessage || "Hi FUNRADO! I am browsing your luxury ride-on store and have a question.");
    window.open(`https://wa.me/917090679912?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end select-none">
      
      {/* Expanded VIP Concierge Menu */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-slide-up">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3A1017] via-[#581C25] to-[#3A1017] text-white p-4 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">VIP Concierge Online</span>
            </div>

            <h3 className="text-sm font-black text-white">
              FUNRADO Luxury Assistance
            </h3>
            <p className="text-[11px] text-stone-300">
              Need help choosing the perfect supercar or trike? Chat with our experts!
            </p>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-3 bg-stone-50/50">
            
            {/* Virtual Demo Promotion Button */}
            <button
              onClick={() => { setIsOpen(false); onOpenVirtualDemo(); }}
              className="w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-stone-950 p-2.5 rounded-xl font-extrabold text-xs shadow hover:brightness-105 transition-all flex items-center justify-between border border-amber-200"
            >
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-stone-950 fill-stone-950" />
                <span>Book 1-on-1 Virtual Video Tour</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-950" />
            </button>

            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-1">
              Quick Questions:
            </div>

            <div className="space-y-1.5">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOpenWhatsApp(q.query)}
                  className="w-full bg-white hover:bg-rose-50/50 text-stone-800 p-2.5 rounded-xl border border-stone-200 text-left text-xs font-semibold transition-all flex items-center justify-between group shadow-xs"
                >
                  <span>{q.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#581C25] transition-colors" />
                </button>
              ))}
            </div>

            {/* Direct WhatsApp Launch */}
            <button
              onClick={() => handleOpenWhatsApp()}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-2.5 rounded-xl font-extrabold text-xs shadow-mint transition-all flex items-center justify-center gap-2 mt-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chat Directly on WhatsApp</span>
            </button>

          </div>

        </div>
      )}

      {/* Floating Toggle Button - Mint Success Combo */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] text-white p-4 rounded-full shadow-mint hover:scale-105 transition-all duration-300 border-2 border-white/40 flex items-center gap-2.5 group relative"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>

        <MessageCircle className="w-6 h-6 fill-white text-[#10B981]" />

        <span className="hidden sm:inline-block font-extrabold text-xs tracking-wider pr-1 text-white">
          VIP Concierge
        </span>

        <span className="absolute -top-1 -right-1 bg-amber-400 text-stone-950 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow border border-amber-200">
          24/7
        </span>
      </button>

    </div>
  );
};
