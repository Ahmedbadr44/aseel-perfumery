'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { productsService, Product } from '@/lib/services/firebase-db';
import { ShoppingBag } from 'lucide-react';

export const BestSellers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsService.getBestSellers();
        setProducts(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching best sellers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Mock data as fallback if DB is empty
  const fallbackProducts: (Partial<Product> & { id: string })[] = [
    {
      id: '1',
      name: 'ليالي الشرق',
      price: 850,
      image: '/assets/images/products/men.png',
      inspired_by_name: 'Sauvage - Dior',
      category: 'Oriental'
    },
    {
      id: '2',
      name: 'سحر العود',
      price: 1200,
      image: '/assets/images/products/unisex.png',
      inspired_by_name: 'Oud Wood - Tom Ford',
      category: 'Oud'
    },
    {
      id: '3',
      name: 'نسيم البحر',
      price: 750,
      image: '/assets/images/products/women.png',
      inspired_by_name: 'Acqua di Gio - Armani',
      category: 'Fresh'
    }
  ];

  const displayProducts = products.length > 0 ? products : (fallbackProducts as Product[]);

  if (loading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 opacity-50">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 rounded-2xl mb-6" />
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {displayProducts.map((product) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link href={`/product/${product.id}`} className="group cursor-pointer">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl mb-6 bg-white shadow-xl border border-gray-100 p-4">
              <Image
                src={product.image || '/assets/images/products/women.png'}
                alt={product.name}
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-700 p-6"
              />
              <div className="absolute top-4 right-4 bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
                الأكثر مبيعاً
              </div>
              <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="bg-primary/90 backdrop-blur-sm text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-xl">
                  <ShoppingBag size={16} />
                  تسوق الآن
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-secondary text-xs font-bold mb-1 uppercase tracking-widest">{product.category}</p>
              <h3 className="text-2xl font-display font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                {product.name}
              </h3>
              {product.inspired_by_name && (
                <p className="text-gray-400 text-xs mb-3">مستوحى من: {product.inspired_by_name}</p>
              )}
              <p className="text-xl font-bold text-primary">{product.price} جنيه</p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};
