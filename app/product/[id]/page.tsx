"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import { useCartStore } from "@/lib/store/useCartStore";
import { productsService, Product } from "@/lib/services/firebase-db";
import {
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('50ml');
  const [isAdded, setIsAdded] = useState(false);

  const SIZES: Record<string, number> = { '30ml': 150, '50ml': 250, '100ml': 500 };
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await productsService.getById(productId);

        if (!productData) {
          router.push("/shop");
          return;
        }

        setProduct(productData);

        const related = await productsService.getByCategory(
          productData.category,
        );
        setRelatedProducts(
          related.filter((p) => p.id !== productId).slice(0, 4),
        );
      } catch (error) {
        console.error("Error fetching product:", error);
        router.push("/shop");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  const handleAddToCart = () => {
    if (product) {
      const currentPrice = SIZES[selectedSize] || product.price;
      for (let i = 0; i < quantity; i++) {
        addItem(product, selectedSize, currentPrice);
      }
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
      setQuantity(1);
    }
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-2xl mb-8" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24 max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500">المنتج غير موجود</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/shop" className="hover:text-primary transition">
            المتجر
          </Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-primary font-semibold">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-display font-bold text-primary mb-2">
                    {product.name}
                  </h1>
                  <p className="text-gray-500">{product.category}</p>
                </div>
                {product.is_best_seller && (
                  <span className="bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold">
                    الأكثر مبيعاً
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-primary mt-4">
                {(SIZES[selectedSize] || product.price).toLocaleString()} جنيه
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed text-lg">
              {product.description}
            </p>

            {/* Fragrance Notes */}
            <div className="space-y-4 bg-gray-50 p-6 rounded-2xl">
              <h3 className="font-display font-bold text-lg text-primary">
                ملاحظات العطر
              </h3>

              <div>
                <p className="text-sm text-gray-500 mb-2">الرأس</p>
                <div className="flex flex-wrap gap-2">
                  {product.notes?.top.map((note, idx) => (
                    <span
                      key={idx}
                      className="bg-white px-3 py-1 rounded-full text-sm text-primary border border-primary/20"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">القلب</p>
                <div className="flex flex-wrap gap-2">
                  {product.notes?.middle.map((note, idx) => (
                    <span
                      key={idx}
                      className="bg-white px-3 py-1 rounded-full text-sm text-primary border border-primary/20"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">القاعدة</p>
                <div className="flex flex-wrap gap-2">
                  {product.notes?.base.map((note, idx) => (
                    <span
                      key={idx}
                      className="bg-white px-3 py-1 rounded-full text-sm text-primary border border-primary/20"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Inspired By */}
            {product.inspired_by_name && (
              <div className="bg-secondary/5 p-4 rounded-2xl">
                <p className="text-sm text-gray-500 mb-1">مستوحى من</p>
                <p className="font-semibold text-primary">
                  {product.inspired_by_name}
                </p>
              </div>
            )}

            {/* Gender & Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl text-center">
                <p className="text-xs text-gray-500 mb-1">للجنسين</p>
                <p className="font-semibold text-primary">
                  {product.gender === "men"
                    ? "رجالي"
                    : product.gender === "women"
                      ? "نسائي"
                      : "جميع الجنسين"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl text-center">
                <p className="text-xs text-gray-500 mb-1">الكاتيجوري</p>
                <p className="font-semibold text-primary capitalize">
                  {product.category}
                </p>
              </div>
            </div>

            {/* Size & Quantity & Add to Cart */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700">الحجم:</label>
                <div className="flex gap-3">
                  {['30ml', '50ml', '100ml'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-200 text-gray-600 hover:border-primary/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-sm font-bold text-gray-700">الكمية:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 hover:bg-gray-100 transition"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(parseInt(e.target.value))
                    }
                    className="w-16 text-center border-l border-r border-gray-300 py-2"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <p className="text-gray-500 font-medium">السعر للحجم المختار:</p>
                <p className="text-2xl font-bold text-primary">
                  {(SIZES[selectedSize] || product.price).toLocaleString()} جنيه
                </p>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-primary text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition relative overflow-hidden group"
              >
                <AnimatePresence>
                  {isAdded ? (
                    <motion.div
                      key="added"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={20} />
                      تمت الإضافة للسلة
                    </motion.div>
                  ) : (
                    <motion.div
                      key="add"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingBag size={20} />
                      أضف إلى السلة
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Share & Wishlist */}
            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <Heart
                  size={20}
                  className={isWishlisted ? "fill-red-500 text-red-500" : ""}
                />
                <span className="text-sm">
                  {isWishlisted ? "مضاف للمفضلة" : "أضف للمفضلة"}
                </span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Share2 size={20} />
                <span className="text-sm">شارك</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="space-y-8">
            <h2 className="text-3xl font-display font-bold text-primary">
              منتجات ذات صلة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
