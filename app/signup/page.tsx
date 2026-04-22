"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion } from "motion/react";
import { FaGoogle } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { googleSignIn, user, isAdmin, loading: authLoading } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      if (isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/shop");
      }
    }
  }, [user, isAdmin, authLoading, router]);

  const handleGoogleSignUp = async () => {
    setError("");
    setLoading(true);
    try {
      await googleSignIn();
    } catch (error: any) {
      const errorMessage = error?.message || "فشل التسجيل عبر جوجل";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10">
          <div className="text-center mb-10">
            <Link href="/" className="inline-block mb-6">
              <h1 className="text-3xl font-display font-bold text-primary tracking-widest">
                ASEEL <span className="text-secondary">أصيل</span>
              </h1>
            </Link>
            <h2 className="text-2xl font-display font-bold text-primary mb-2">
              إنشاء حساب جديد
            </h2>
            <p className="text-gray-500">
              سجل عبر جوجل للانضمام لعائلة أصيل
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium flex items-center gap-2"
            >
              <span>⚠️</span>
              {error}
            </motion.div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading || authLoading}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <FaGoogle className="text-xl" />
            {loading || authLoading ? "جاري التسجيل..." : "التسجيل عبر جوجل"}
          </button>

          <div className="text-center mt-8">
            <p className="text-gray-600 text-sm">
              هل لديك حساب بالفعل؟{" "}
              <Link href="/login" className="text-secondary font-bold hover:underline">
                سجل الدخول
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors"
          >
            <ArrowLeft size={20} />
            العودة للرئيسية
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
