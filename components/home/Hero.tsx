'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald/5 -skew-x-12 translate-x-1/4" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Text Content - Right Side in RTL */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="order-2 lg:order-1"
        >
          <span className="text-secondary font-medium tracking-widest mb-4 block">مجموعة أصيل الحصرية</span>
          <h1 className="text-5xl lg:text-7xl font-display font-bold text-primary leading-tight mb-6">
            عطور فاخرة <br />
            <span className="text-secondary">مستوحاة من العالمية</span>
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
            اكتشف تشكيلتنا الفريدة من العطور التي تجمع بين سحر الشرق وأناقة الغرب، مصممة خصيصاً لمن يبحث عن التميز والفخامة.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="bg-primary text-white px-10 py-4 rounded-full font-bold hover:bg-primary/90 transition-all flex items-center gap-2 group"
            >
              تسوق الآن
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
            </Link>
            <Link
              href="/about"
              className="border border-primary text-primary px-10 py-4 rounded-full font-bold hover:bg-primary hover:text-white transition-all"
            >
              اكتشف قصتنا
            </Link>
          </div>
        </motion.div>

        {/* Image Content - Left Side in RTL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="order-1 lg:order-2 relative"
        >
          <div className="relative w-full aspect-square max-w-md mx-auto">
            {/* Decorative Frame */}
            <div className="absolute -inset-4 border border-secondary/30 rounded-full animate-pulse" />
            <div className="absolute -inset-8 border border-secondary/10 rounded-full" />
            
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl">
              <Image
                src="/assets/images/products/men.png"
                alt="ASEEL Luxury Perfume"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden md:block"
            >
              <p className="text-secondary font-bold text-sm">ثبات يدوم 12 ساعة</p>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden md:block"
            >
              <p className="text-primary font-bold text-sm">مكونات طبيعية 100%</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
