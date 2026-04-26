"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/shop/ProductCard";
import { TestimonialsSection } from "@/components/reviews/TestimonialsSection";
import { useCartStore } from "@/lib/store/useCartStore";
import { productsService, Product } from "@/lib/services/firebase-db";
import { PRODUCT_SIZE_GUIDE } from "@/lib/data/commerce";
import {
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  MessageCircleMore,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function getProductSellingPoints(product: Product) {
  if (
    product.selling_points?.longevity ||
    product.selling_points?.sillage ||
    product.selling_points?.occasion
  ) {
    return {
      longevity: product.selling_points?.longevity || "ثبات جيد",
      sillage: product.selling_points?.sillage || "فوحان متوازن",
      occasion: product.selling_points?.occasion || "مناسب لعدة أوقات",
    };
  }

  const category = product.category.toLowerCase();

  if (category.includes("oud") || category.includes("عود") || category.includes("orient") || category.includes("شرقي")) {
    return {
      longevity: "ثبات 8-12 ساعة",
      sillage: "فوحان متوسط إلى قوي",
      occasion: "مثالي للمساء والمناسبات",
    };
  }

  if (category.includes("fresh") || category.includes("منعش") || category.includes("aqu")) {
    return {
      longevity: "ثبات 5-7 ساعات",
      sillage: "فوحان هادئ ومنعش",
      occasion: "مثالي للنهار والعمل",
    };
  }

  if (category.includes("floral") || category.includes("زهري")) {
    return {
      longevity: "ثبات 6-8 ساعات",
      sillage: "فوحان ناعم وواضح",
      occasion: "مثالي للزيارات والخروجات",
    };
  }

  return {
    longevity: "ثبات جيد للاستخدام اليومي",
    sillage: "فوحان متوازن غير مزعج",
    occasion: "مناسب لليوم والمساء",
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<"30ml" | "50ml" | "100ml">("50ml");
  const [isAdded, setIsAdded] = useState(false);
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

        const related = await productsService.getByCategory(productData.category);
        setRelatedProducts(related.filter((p) => p.id !== productId).slice(0, 4));
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
      const currentPrice = product.prices?.[selectedSize] ?? product.price;
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

  const sellingPoints = getProductSellingPoints(product);
  const whatsappUrl = `https://wa.me/201030950177?text=${encodeURIComponent(`مرحباً، أريد استشارة سريعة بخصوص عطر ${product.name}`)}`;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
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

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
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
                    الأكثر مبيعًا
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-primary mt-4">
                {(product.prices?.[selectedSize] ?? product.price).toLocaleString()} جنيه
              </p>
            </div>

            <p className="text-gray-600 leading-relaxed text-lg">
              {product.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <p className="text-xs text-gray-400 mb-2">الثبات</p>
                <p className="font-bold text-primary">{sellingPoints.longevity}</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <p className="text-xs text-gray-400 mb-2">الفوحان</p>
                <p className="font-bold text-primary">{sellingPoints.sillage}</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <p className="text-xs text-gray-400 mb-2">أنسب وقت للاستخدام</p>
                <p className="font-bold text-primary">{sellingPoints.occasion}</p>
              </div>
            </div>

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

            {product.inspired_by_name && (
              <div className="bg-secondary/5 p-4 rounded-2xl">
                <p className="text-sm text-gray-500 mb-1">مستوحى من</p>
                <p className="font-semibold text-primary">
                  {product.inspired_by_name}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl text-center">
                <p className="text-xs text-gray-500 mb-1">الفئة المناسبة</p>
                <p className="font-semibold text-primary">
                  {product.gender === "men"
                    ? "رجالي"
                    : product.gender === "women"
                      ? "نسائي"
                      : "جميع الجنسين"}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl text-center">
                <p className="text-xs text-gray-500 mb-1">التصنيف</p>
                <p className="font-semibold text-primary capitalize">
                  {product.category}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-700">الحجم:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PRODUCT_SIZE_GUIDE.map((option) => (
                    <button
                      key={option.size}
                      onClick={() => setSelectedSize(option.size)}
                      className={`p-4 rounded-2xl border text-right transition-all ${
                        selectedSize === option.size
                          ? "border-primary bg-primary text-white shadow-lg"
                          : "border-gray-200 text-gray-600 hover:border-primary/50 bg-white"
                      }`}
                    >
                      <div className="font-bold mb-1 flex items-center justify-between">
                        <span>{option.size}</span>
                        <span className="text-xs">{option.label}</span>
                      </div>
                      <p className={`text-xs leading-6 ${selectedSize === option.size ? "text-white/90" : "text-gray-500"}`}>
                        {option.description}
                      </p>
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
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value || "1", 10))}
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
                  {(product.prices?.[selectedSize] ?? product.price).toLocaleString()} جنيه
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

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-[#25D366] text-[#128C7E] py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-[#25D366] hover:text-white transition"
              >
                <MessageCircleMore size={20} />
                استشارة سريعة عبر واتساب قبل الشراء
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-background rounded-2xl p-4 border border-gray-100">
                <div className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-3">
                  <Truck size={18} />
                </div>
                <h3 className="font-bold text-primary mb-1">توصيل سريع</h3>
                <p className="text-sm text-gray-500">يصلك الطلب خلال 2-4 أيام عمل لمعظم المحافظات.</p>
              </div>
              <div className="bg-background rounded-2xl p-4 border border-gray-100">
                <div className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-3">
                  <ShieldCheck size={18} />
                </div>
                <h3 className="font-bold text-primary mb-1">ضمان الجودة</h3>
                <p className="text-sm text-gray-500">استبدال سريع إذا وصلك المنتج بحالة غير سليمة.</p>
              </div>
              <div className="bg-background rounded-2xl p-4 border border-gray-100">
                <div className="w-10 h-10 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-3">
                  <Sparkles size={18} />
                </div>
                <h3 className="font-bold text-primary mb-1">مساعدة في الاختيار</h3>
                <p className="text-sm text-gray-500">إذا كنت محتارًا بين الأحجام أو الروائح فنحن معك مباشرة.</p>
              </div>
            </div>

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

        <TestimonialsSection productId={product.id} productName={product.name} />
      </div>

      <Footer />
    </main>
  );
}
