"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { motion } from "motion/react";
import { LogOut, User, Package, Heart, Settings, Mail } from "lucide-react";
import { useState, useEffect } from "react";

export default function AccountPage() {
  const router = useRouter();
  const { user, userProfile, logout, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "wishlist" | "settings">("profile");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold text-primary mb-2">
              حسابي
            </h1>
            <p className="text-gray-500">إدارة حسابك والطلبات والمفضلات</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition-all disabled:opacity-50"
          >
            <LogOut size={20} />
            تسجيل الخروج
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-br from-primary to-primary/80 text-white p-6 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} />
                </div>
                <h3 className="font-bold text-lg mb-1">
                  {userProfile?.display_name || "المستخدم"}
                </h3>
                <p className="text-white/70 text-sm">{userProfile?.email}</p>
              </div>

              <nav className="p-4 space-y-2">
                {[
                  { id: "profile" as const, label: "الملف الشخصي", icon: User },
                  { id: "orders" as const, label: "الطلبات", icon: Package },
                  { id: "wishlist" as const, label: "المفضلات", icon: Heart },
                  { id: "settings" as const, label: "الإعدادات", icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-right ${
                      activeTab === item.id
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon size={20} />
                    {item.label}
                  </button>
                ))}

                {isAdmin && (
                  <a
                    href="/admin/dashboard"
                    className="w-full flex items-center gap-3 p-3 rounded-lg transition-all text-right bg-amber-50 text-amber-600 font-bold"
                  >
                    <Settings size={20} />
                    لوحة التحكم
                  </a>
                )}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
              >
                <h2 className="text-2xl font-display font-bold text-primary mb-8">
                  الملف الشخصي
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-bold text-gray-600 block mb-2">
                        الاسم
                      </label>
                      <p className="text-lg text-primary font-bold">
                        {userProfile?.display_name || "لم يتم تعيينه"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-600 block mb-2">
                        البريد الإلكتروني
                      </label>
                      <p className="text-lg text-primary flex items-center gap-2">
                        <Mail size={18} />
                        {userProfile?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-display font-bold text-primary">
                    طلباتي
                  </h2>
                  <a
                    href="/track-order"
                    className="text-sm text-secondary font-bold hover:underline flex items-center gap-1"
                  >
                    تتبع طلب برقم الهاتف ←
                  </a>
                </div>

                <div className="text-center py-12">
                  <Package size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">
                    لمتابعة طلباتك، استخدم صفحة تتبع الطلبات برقم هاتفك
                  </p>
                  <a
                    href="/track-order"
                    className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-all"
                  >
                    تتبع طلباتي
                  </a>
                </div>
              </motion.div>
            )}

            {activeTab === "wishlist" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
              >
                <h2 className="text-2xl font-display font-bold text-primary mb-8">
                  المفضلات
                </h2>

                <div className="text-center py-12">
                  <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">لم تضف أي عطور إلى المفضلات</p>
                </div>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
              >
                <h2 className="text-2xl font-display font-bold text-primary mb-8">
                  الإعدادات
                </h2>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                    <span className="font-bold text-gray-700">
                      إشعارات البريد الإلكتروني
                    </span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                    <span className="font-bold text-gray-700">إشعارات الطلبات</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
