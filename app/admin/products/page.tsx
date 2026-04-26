"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { productsService, Product } from "@/lib/services/firebase-db";
import { ProductForm } from "@/components/admin/ProductForm";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function AdminProductsPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const data = await productsService.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push("/login");
      return;
    }

    const loadProducts = async () => {
      try {
        const data = await productsService.getAll();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    void loadProducts();
  }, [router, user, isAdmin]);

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try {
        await productsService.delete(id);
        await fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "mr-64" : "mr-0"}`}
      >
        <header className="bg-white border-b border-gray-100 p-6 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`${isSidebarOpen ? "hidden" : "block"} text-primary`}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-display font-bold text-primary">
            إدارة المنتجات
          </h1>
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="bg-secondary text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-secondary/90 transition-all"
          >
            <Plus size={20} />
            إضافة منتج
          </button>
        </header>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
            <div className="relative w-full max-w-md">
              <Search
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="ابحث عن منتج بالاسم..."
                className="w-full pr-12 pl-4 py-3 rounded-2xl border border-gray-200 focus:border-secondary outline-none bg-white shadow-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
                >
                  <div className="relative aspect-[4/5] bg-gray-50 p-4 space-y-4">
                    <div className="relative h-full w-full rounded-2xl overflow-hidden bg-white shadow-inner">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {product.inspired_by_image && (
                      <div className="absolute bottom-6 left-6 w-16 h-16 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-100 shadow-lg overflow-hidden flex items-center justify-center p-1">
                        <Image
                          src={product.inspired_by_image}
                          alt="Inspired Original"
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                    )}

                    {product.is_best_seller && (
                      <div className="absolute top-6 right-6 bg-secondary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                        الأكثر مبيعاً
                      </div>
                    )}

                    {product.is_trending_now && (
                      <div className="absolute top-6 left-6 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                        رائج حالياً
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{product.category}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{product.gender}</span>
                      </div>
                      <h3 className="text-lg font-display font-bold text-primary line-clamp-1">{product.name}</h3>
                      {(product.selling_points?.longevity || product.selling_points?.sillage || product.selling_points?.occasion) && (
                        <div className="mt-2 space-y-1 text-xs text-gray-400">
                          {product.selling_points?.longevity && <p>الثبات: {product.selling_points.longevity}</p>}
                          {product.selling_points?.sillage && <p>الفوحان: {product.selling_points.sillage}</p>}
                          {product.selling_points?.occasion && <p>الوقت: {product.selling_points.occasion}</p>}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <div className="text-xl font-bold text-primary">
                        {product.price.toLocaleString()} <span className="text-xs text-gray-400">جنيه</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-primary hover:bg-gray-100 rounded-xl transition-all"
                          title="تعديل"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                          title="حذف"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {products.length > 0 && filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
              <Package className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">لا توجد منتجات تطابق بحثك</p>
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b flex items-center justify-between">
                <h3 className="text-2xl font-display font-bold text-primary">
                  {editingProduct ? "تعديل منتج" : "إضافة منتج جديد"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-primary"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 max-h-[75vh] overflow-y-auto">
                <ProductForm
                  product={editingProduct}
                  onSuccess={async () => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                    await fetchProducts();
                  }}
                  onCancel={() => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
