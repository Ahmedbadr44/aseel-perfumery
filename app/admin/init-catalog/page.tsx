"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Database, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { productsService } from "@/lib/services/firebase-db";
import { INITIAL_CATALOG } from "@/lib/data/perfume-catalog";
import { useAuth } from "@/context/AuthContext";

export default function InitCatalogPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedCount, setProcessedCount] = useState(0);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    setChecked(true);
    
    if (!user) {
      router.push("/login");
    } else if (!isAdmin) {
      router.push("/shop");
    }
  }, [user, isAdmin, authLoading, router]);

  if (authLoading || !checked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin w-12 h-12 text-primary mx-auto mb-4" />
          <p className="text-gray-500">جاري التحقق...</p>
        </div>
      </div>
    );
  }

  const handleSeed = async () => {
    setLoading(true);
    setError(null);
    setProcessedCount(0);

    try {
      let count = 0;
      for (const product of INITIAL_CATALOG) {
        await productsService.create(product);
        count++;
        setProcessedCount(count);
      }

      setSuccess(true);
    } catch (err: any) {
      console.error("Seeding error:", err);
      setError(err.message || "حدث خطأ أثناء إضافة المنتجات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <Link 
          href="/admin/orders" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>العودة للوحة التحكم</span>
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Database className="text-primary" size={40} />
          </div>

          <h1 className="text-3xl font-display font-bold text-primary mb-4">
            إعداد كتالوج أصيل
          </h1>
          <p className="text-gray-500 mb-10 leading-relaxed">
            سيقوم هذا المعالج بإضافة {INITIAL_CATALOG.length} عطر فاخر إلى متجرك، بما في ذلك التصنيفات والمكونات العطرية والوصف الكامل.
          </p>

          {success ? (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 rounded-2xl flex items-center gap-4 text-emerald-600 text-right">
                <CheckCircle2 size={24} className="shrink-0" />
                <div>
                  <p className="font-bold">تم بنجاح!</p>
                  <p className="text-sm">تمت إضافة جميع المنتجات إلى قاعدة البيانات.</p>
                </div>
              </div>
              <Link
                href="/shop"
                className="block w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={20} />
                تصفح المنتجات الآن
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 rounded-2xl flex items-center gap-4 text-red-600 text-right">
                  <AlertCircle size={24} className="shrink-0" />
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}

              <button
                onClick={handleSeed}
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>جاري الإضافة ({processedCount}/{INITIAL_CATALOG.length})...</span>
                  </>
                ) : (
                  <>
                    <Database size={20} />
                    <span>البدء في إضافة الكتالوج</span>
                  </>
                )}
              </button>
              
              <p className="text-[10px] text-gray-400">
                ملاحظة: تأكد من أن قاعدة البيانات مهيأة بشكل صحيح قبل البدء.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
