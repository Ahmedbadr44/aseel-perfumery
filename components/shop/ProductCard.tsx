'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Eye, Truck } from 'lucide-react';
import { Product } from '@/lib/services/firebase-db';
import { useCartStore } from '@/lib/store/useCartStore';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        
        {/* Badges */}
        {product.is_best_seller && (
          <div className="absolute top-4 right-4 bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg z-10">
            الأكثر مبيعاً
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button
            onClick={() => addItem(product, '30ml', product.prices?.['30ml'] ?? product.price)}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-all shadow-lg"
            title="أضف للسلة"
          >
            <ShoppingCart size={20} />
          </button>
          <Link
            href={`/product/${product.id}`}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-all shadow-lg"
            title="عرض التفاصيل"
          >
            <Eye size={20} />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 text-center">
        <p className="text-xs text-secondary font-medium mb-2 uppercase tracking-widest">
          {product.gender === 'men' ? 'للرجال' : product.gender === 'women' ? 'للنساء' : 'للجنسين'}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3 className="text-xl font-display font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg font-bold text-primary">يبدأ من {(product.prices?.['30ml'] ?? product.price).toLocaleString()} جنيه</span>
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
          <Truck size={14} />
          <span>توصيل 2-4 أيام عمل</span>
        </div>

        {product.inspired_by_name && (
          <p className="text-[10px] text-gray-400 mt-3 border-t pt-3">
            مستوحى من: {product.inspired_by_name}
          </p>
        )}
      </div>
    </motion.div>
  );
};
