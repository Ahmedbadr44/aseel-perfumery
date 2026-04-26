'use client';

import { MessageCircleMore, ShieldCheck, Truck } from 'lucide-react';
import { STORE_TRUST_POINTS } from '@/lib/data/commerce';

const ICONS = [Truck, ShieldCheck, MessageCircleMore];

export function TrustBar() {
  return (
    <section className="py-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {STORE_TRUST_POINTS.map((item, index) => {
          const Icon = ICONS[index];

          return (
            <div
              key={item.title}
              className="bg-white/90 border border-gray-100 rounded-3xl p-5 shadow-sm flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                <Icon size={22} />
              </div>
              <div>
                <h3 className="font-bold text-primary mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-6">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
