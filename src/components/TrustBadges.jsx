import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Headset } from 'lucide-react';

export const TrustBadges = () => {
  const BADGES = [
    {
      icon: Truck,
      title: "Express QuickShip",
      desc: "Same-day dispatch for orders before 2 PM"
    },
    {
      icon: ShieldCheck,
      title: "Apple-Standard Safety",
      desc: "Non-toxic organic finishes & FSC Beechwood"
    },
    {
      icon: RefreshCw,
      title: "14-Day Easy Returns",
      desc: "No questions asked doorstep pickups"
    },
    {
      icon: Headset,
      title: "Parent Support 24/7",
      desc: "Dedicated pediatric safety advisors"
    }
  ];

  return (
    <section className="bg-white border-y border-stone-200/80 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {BADGES.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50/50 border border-stone-100">
              <div className="bg-brand-roseTint p-3 rounded-xl text-brand-burgundy border border-brand-burgundy/10 flex-shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-stone-900 mb-0.5">{b.title}</h3>
                <p className="text-[11px] text-stone-500 leading-relaxed font-medium">{b.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
