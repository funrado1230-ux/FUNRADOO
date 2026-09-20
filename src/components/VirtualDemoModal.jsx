import React, { useState } from 'react';
import { X, Video, Calendar, Clock, MapPin, CheckCircle2, ShieldCheck, Sparkles, Send } from 'lucide-react';
import { sendWhatsAppNotification } from '../services/whatsappService';

export const VirtualDemoModal = ({ isOpen, onClose }) => {
  const [demoType, setDemoType] = useState('virtual'); // 'virtual' | 'doorstep'
  const [selectedProduct, setSelectedProduct] = useState('FUNRADO Police Special Forces 4x4 SUV Patrol Jeep');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Bengaluru',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '02:00 PM - 04:00 PM'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    // Dispatch WhatsApp notification to merchant and customer
    const text = `📹 *New FUNRADO VIP ${demoType === 'virtual' ? 'Virtual Video Tour' : 'Doorstep Trial'} Request*\n\n` +
      `👤 *Customer:* ${formData.name}\n` +
      `📱 *WhatsApp:* ${formData.phone}\n` +
      `🏙️ *City:* ${formData.city}\n` +
      `🏎️ *Model Requested:* ${selectedProduct}\n` +
      `📅 *Preferred Slot:* ${formData.date} (${formData.timeSlot})`;

    sendWhatsAppNotification({
      customerPhone: formData.phone,
      message: text
    });

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#3A1017] via-[#581C25] to-[#3A1017] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1 text-amber-300 font-extrabold text-xs">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>FUNRADO VIP CONCIERGE</span>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
            Book 1-on-1 Virtual Video Tour
          </h2>
          <p className="text-stone-300 text-xs mt-1">
            Experience our 4x4 ride-ons, supercar features & 3D 360° details live with an expert over WhatsApp video.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-stone-900">
              VIP Tour Scheduled Successfully! 🎉
            </h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{formData.name}</strong>! Our VIP Ride-On Specialist will connect with you via WhatsApp Video at <strong>{formData.phone}</strong> on <strong>{formData.date} ({formData.timeSlot})</strong>.
            </p>
            <div className="pt-4">
              <button
                onClick={() => { setIsSubmitted(false); onClose(); }}
                className="bg-[#581C25] text-white px-8 py-3 rounded-full font-bold text-xs shadow-lg hover:bg-stone-900 transition-all"
              >
                Back to Store
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
            
            {/* Tour Type Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDemoType('virtual')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  demoType === 'virtual' 
                    ? 'border-[#581C25] bg-rose-50/50 ring-2 ring-[#581C25]/20' 
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                <Video className={`w-5 h-5 mt-0.5 ${demoType === 'virtual' ? 'text-[#581C25]' : 'text-stone-400'}`} />
                <div>
                  <div className="text-xs font-extrabold text-stone-900">Virtual HD Video Tour</div>
                  <div className="text-[10px] text-stone-500 font-semibold">1-on-1 WhatsApp Call</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDemoType('doorstep')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                  demoType === 'doorstep' 
                    ? 'border-[#581C25] bg-rose-50/50 ring-2 ring-[#581C25]/20' 
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                }`}
              >
                <MapPin className={`w-5 h-5 mt-0.5 ${demoType === 'doorstep' ? 'text-[#581C25]' : 'text-stone-400'}`} />
                <div>
                  <div className="text-xs font-extrabold text-stone-900">Doorstep Trial</div>
                  <div className="text-[10px] text-stone-500 font-semibold">Home Ride-On Demo</div>
                </div>
              </button>
            </div>

            {/* Ride-on Model Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Select Ride-On Model to Inspect:
              </label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#581C25]"
              >
                <option>FUNRADO Police Special Forces 4x4 SUV Patrol Jeep</option>
                <option>Rolls-Royce Phantom Luxury Two-Tone Convertible Roadster</option>
                <option>R1250 GS Sport 3-Wheel Trike (Racing Red)</option>
                <option>Mountain Explorer 4x4 All-Terrain Buggy UTV</option>
                <option>Smart 8.5" All-Terrain Bluetooth Hoverboard</option>
                <option>TOI TOYS Pastel Pink "Rhino" Push-Along Toddler Walker</option>
              </select>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#581C25]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">WhatsApp Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#581C25]"
                />
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Preferred Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#581C25]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Time Slot</label>
                <select
                  value={formData.timeSlot}
                  onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#581C25]"
                >
                  <option>10:00 AM - 12:00 PM</option>
                  <option>12:00 PM - 02:00 PM</option>
                  <option>02:00 PM - 04:00 PM</option>
                  <option>04:00 PM - 06:00 PM</option>
                  <option>06:00 PM - 08:00 PM</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#581C25] to-[#3A1017] text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 mt-4 border border-amber-500/20"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span>Confirm VIP Video Tour Booking</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
