'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCartStore } from '@/lib/store/useCartStore';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-display font-bold text-primary mb-12">سلة المشتريات</h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.cartItemId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6"
                  >
                    <div className="relative w-24 h-32 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-right">
                      <h3 className="text-xl font-display font-bold text-primary mb-1">{item.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">{item.gender === 'men' ? 'رجالي' : item.gender === 'women' ? 'نسائي' : 'للجنسين'}</p>
                      <div className="flex items-center gap-2 mb-4 justify-center sm:justify-end">
                        <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-bold">حجم {item.size}</span>
                      </div>
                      <p className="text-primary font-bold">{item.price} جنيه</p>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-2">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="text-primary hover:text-secondary transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-8 text-center font-bold text-primary">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="text-primary hover:text-secondary transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <div className="text-left min-w-[100px]">
                      <p className="text-lg font-bold text-primary mb-2">{item.price * item.quantity} جنيه</p>
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="text-red-400 hover:text-red-600 transition-colors flex items-center gap-1 text-xs mx-auto sm:mr-auto sm:ml-0"
                      >
                        <Trash2 size={14} />
                        حذف
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-32">
              <h2 className="text-2xl font-display font-bold text-primary mb-8 border-b pb-4">ملخص الطلب</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>عدد المنتجات</span>
                  <span>{getItemCount()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>سعر المنتجات</span>
                  <span>{getTotal()} جنيه</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>الشحن</span>
                  <span className="text-gray-500 text-sm font-medium">يُحسب عند الدفع</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl font-bold text-primary">
                  <span>الإجمالي</span>
                  <span>{getTotal()} جنيه</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-primary text-white py-4 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-primary/90 transition-all shadow-lg"
              >
                إتمام الشراء
                <ArrowRight size={20} />
              </Link>
              
              <Link
                href="/shop"
                className="w-full text-center block mt-6 text-gray-400 hover:text-primary transition-colors text-sm"
              >
                مواصلة التسوق
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
              <ShoppingBag size={48} />
            </div>
            <h2 className="text-2xl font-display font-bold text-primary mb-4">سلتك فارغة حالياً</h2>
            <p className="text-gray-500 mb-10">اكتشف مجموعتنا الرائعة وابدأ بالتسوق الآن.</p>
            <Link
              href="/shop"
              className="bg-primary text-white px-12 py-4 rounded-full font-bold hover:bg-primary/90 transition-all inline-flex items-center gap-3"
            >
              اذهب للمتجر
              <ArrowRight size={20} />
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
