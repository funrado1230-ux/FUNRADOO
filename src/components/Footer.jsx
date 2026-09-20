import React, { useState } from 'react';
import { Logo } from './Logo';
import { 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Truck, 
  RotateCcw, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Sparkles,
  CreditCard,
  CheckCircle2,
  Award
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer = ({ onOpenAdmin }) => {
  const { setSelectedCategory, setIsTrackOrderOpen } = useStore();

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800/80 pt-16 pb-12 px-4 sm:px-8 relative overflow-hidden select-none">
      
      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Brand Description */}
        <div className="md:col-span-5 space-y-5">
          <Logo light={true} size="lg" />
          <p className="text-xs text-stone-400 leading-relaxed max-w-sm font-normal">
            FUNRADO creates high-end, luxury ride-ons, smart scooters, and nursery essentials for modern parents. Engineered with pure materials, BIS safety precision, and ultra-realistic detailing.
          </p>
        </div>

        {/* Column 2: Popular Collections */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-black text-white uppercase tracking-wider">Collections</h4>
          <ul className="space-y-2.5 text-xs text-stone-400 font-medium">
            <li 
              onClick={() => setSelectedCategory('Electric Ride-On Cars & 4x4s')} 
              className="hover:text-amber-400 cursor-pointer transition-colors"
            >
              Electric Ride-On Cars
            </li>
            <li 
              onClick={() => setSelectedCategory('Luxury Superbikes & Vespa Scooters')} 
              className="hover:text-amber-400 cursor-pointer transition-colors"
            >
              Superbikes & Vespas
            </li>
            <li 
              onClick={() => setSelectedCategory('Kids Kick Scooters & Convertible Trikes')} 
              className="hover:text-amber-400 cursor-pointer transition-colors"
            >
              Kick Scooters & Trikes
            </li>
            <li 
              onClick={() => setSelectedCategory('Hoverboards & Smart Wheels')} 
              className="hover:text-amber-400 cursor-pointer transition-colors"
            >
              Hoverboards & Wheels
            </li>
            <li 
              onClick={() => setSelectedCategory('Nursery & Furniture')} 
              className="hover:text-amber-400 cursor-pointer transition-colors"
            >
              Nursery & Furniture
            </li>
            <li 
              onClick={() => setSelectedCategory('Strollers & Travel')} 
              className="hover:text-amber-400 cursor-pointer transition-colors"
            >
              Strollers & Travel
            </li>
          </ul>
        </div>

        {/* Column 3: Age Category Filters */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-black text-white uppercase tracking-wider">Shop by Age</h4>
          <ul className="space-y-2.5 text-xs text-stone-400 font-medium">
            <li className="hover:text-amber-400 cursor-pointer transition-colors">0 to 6 Months</li>
            <li className="hover:text-amber-400 cursor-pointer transition-colors">6 to 12 Months</li>
            <li className="hover:text-amber-400 cursor-pointer transition-colors">12 to 36 Months</li>
            <li className="hover:text-amber-400 cursor-pointer transition-colors">3 to 6 Years</li>
            <li className="hover:text-amber-400 cursor-pointer transition-colors">6 to 12 Years</li>
          </ul>
        </div>

        {/* Column 4: Parent Support & Admin */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-black text-white uppercase tracking-wider">Parent Concierge</h4>
          <ul className="space-y-2.5 text-xs text-stone-400 font-medium">
            <li onClick={() => setIsTrackOrderOpen(true)} className="hover:text-amber-400 cursor-pointer transition-colors flex items-center gap-1.5">
              <span>Track Shipment Status</span>
            </li>
            <li className="hover:text-amber-400 cursor-pointer transition-colors">BIS Certification & Safety</li>
            <li className="hover:text-amber-400 cursor-pointer transition-colors">14-Day Return Guarantee</li>
            <li className="hover:text-amber-400 cursor-pointer transition-colors">1-Year Warranty Claim</li>
          </ul>

          {/* Contact Support */}
          <div className="pt-2 space-y-1.5 text-xs text-stone-400">
            <div className="flex items-center gap-2 text-stone-300">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold">+91 1800-FUNRADO (1800-386-7236)</span>
            </div>
            <div className="flex items-center gap-2 text-stone-400 text-[11px]">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>support@funrado.com</span>
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-400 hover:text-amber-300 bg-stone-900 hover:bg-stone-800 px-3.5 py-2 rounded-xl border border-amber-500/30 transition-all shadow-md cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Portal Login</span>
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Legal & Payment Badges */}
      <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-stone-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
        <p>© {new Date().getFullYear()} FUNRADO Luxury Kids Store. All rights reserved. 256-Bit SSL Encrypted Checkout.</p>
        
        {/* Payment Icons */}
        <div className="flex items-center gap-3 text-stone-400 text-[11px] font-bold">
          <span className="bg-stone-900 border border-stone-800 px-2.5 py-1 rounded-md text-emerald-400">⚡ UPI Instant Pay</span>
          <span className="bg-stone-900 border border-stone-800 px-2.5 py-1 rounded-md">Google Pay</span>
          <span className="bg-stone-900 border border-stone-800 px-2.5 py-1 rounded-md">PhonePe & Paytm</span>
          <span className="bg-stone-900 border border-stone-800 px-2.5 py-1 rounded-md">0% Fee Instant QR</span>
        </div>

        <div className="flex gap-4 text-[11px]">
          <span className="hover:text-stone-300 cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-stone-300 cursor-pointer">Terms of Service</span>
          <span>•</span>
          <span className="hover:text-stone-300 cursor-pointer">BIS Safety Compliance</span>
        </div>
      </div>

    </footer>
  );
};
