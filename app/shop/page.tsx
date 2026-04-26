'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/shop/ProductCard';
import { TrustBar } from '@/components/shared/TrustBar';
import { Product } from '@/lib/services/firebase-db';
import { productsService } from '@/lib/services/firebase-db';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productsService.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch = 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesGender = selectedGender === 'all' || product.gender === selectedGender;
        return matchesSearch && matchesGender;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
        if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
        const aDate = a.created_at instanceof Timestamp ? a.created_at.toMillis() : new Date(a.created_at || 0).getTime();
        const bDate = b.created_at instanceof Timestamp ? b.created_at.toMillis() : new Date(b.created_at || 0).getTime();
        return bDate - aDate;
      });
  }, [products, searchQuery, selectedGender, sortBy]);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="pt-32 pb-12 bg-primary text-white text-center px-6">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">متجر أصيل</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          استكشف مجموعتنا الكاملة من العطور الفاخرة المصممة بعناية لتناسب جميع الأذواق والمناسبات.
        </p>
      </div>

      <TrustBar />

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between mb-12">
          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="ابحث عن عطرك المفضل (مثلاً: رويال عود)..."
              className="w-full pr-12 pl-4 py-3 rounded-full border border-gray-200 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none transition-all text-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200">
              <span className="text-sm text-gray-500">النوع:</span>
              <select
                className="bg-transparent outline-none text-sm font-bold text-primary cursor-pointer"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <option value="all">الكل</option>
                <option value="men">رجالي</option>
                <option value="women">نسائي</option>
                <option value="unisex">للجنسين</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200">
              <span className="text-sm text-gray-500">ترتيب حسب:</span>
              <select
                className="bg-transparent outline-none text-sm font-bold text-primary cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">الأحدث</option>
                <option value="price-low">السعر: من الأقل</option>
                <option value="price-high">السعر: من الأعلى</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-secondary" size={48} />
            <p className="text-gray-500 font-medium">جاري تحميل عطرك المفضل...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-xl text-gray-500">عذراً، لم نجد أي منتجات تطابق بحثك.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedGender('all'); }}
              className="mt-4 text-secondary font-bold underline"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
