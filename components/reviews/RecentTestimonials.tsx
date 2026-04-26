'use client';

import React, { useEffect, useState } from 'react';
import { Quote, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  product_name: string;
  user_name: string;
  rating: number;
  comment: string;
}

export function RecentTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials?limit=3');
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error || 'LOAD_TESTIMONIALS_FAILED');
        }
        setItems(payload.testimonials || []);
      } catch (error) {
        console.error('Error loading testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  if (loading && items.length === 0) {
    return (
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="animate-pulse bg-background rounded-3xl p-6 h-48" />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-secondary font-medium tracking-widest mb-3 block">آراء عملائنا</span>
          <h2 className="text-4xl font-display font-bold text-primary">تجارب حقيقية بعد الشراء</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <article key={item.id} className="bg-background rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-secondary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < item.rating ? 'fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <Quote className="text-secondary/60" size={20} />
              </div>
              <p className="text-gray-600 leading-7 mb-5 min-h-[84px]">{item.comment}</p>
              <div className="border-t border-gray-100 pt-4">
                <p className="font-bold text-primary">{item.user_name}</p>
                <p className="text-xs text-gray-400 mt-1">{item.product_name}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
