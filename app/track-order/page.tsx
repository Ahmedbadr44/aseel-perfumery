"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Timestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ShoppingBag,
  Phone,
} from "lucide-react";
import Image from "next/image";

type TrackOrder = {
  id: string;
  governorate: string;
  city: string;
  address: string;
  total: number;
  payment_method: "cash" | "vodafone_insta" | "card";
  status: "pending" | "completed" | "cancelled";
  created_at: Date | Timestamp | string | null;
  items: Array<{
    name: string;
    image?: string;
    price: number;
    quantity: number;
  }>;
};

const statusConfig = {
  pending: {
    label: "قيد المراجعة",
    color: "text-amber-600 bg-amber-50 border-amber-200",
    icon: Clock,
    description: "طلبك تحت المراجعة وسيتم تأكيده قريباً",
  },
  completed: {
    label: "تم الشحن",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    icon: CheckCircle,
    description: "تم شحن طلبك وهو في الطريق إليك",
  },
  cancelled: {
    label: "ملغي",
    color: "text-red-600 bg-red-50 border-red-200",
    icon: XCircle,
    description: "تم إلغاء هذا الطلب",
  },
};

export default function TrackOrderPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<TrackOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const formatOrderDate = (value: TrackOrder["created_at"]) => {
    if (!value) return "غير متاح";
    if (value instanceof Timestamp) {
      return value
        .toDate()
        .toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
    }
    return new Date(value).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phone.trim().replace(/\s/g, "");
    if (!/^01[0125][0-9]{8}$/.test(cleaned)) {
      setError("يرجى إدخال رقم هاتف مصري صحيح (مثال: 01012345678)");
      return;
    }

    setError("");
    setLoading(true);
    setSearched(false);

    try {
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleaned }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || "TRACK_FAILED");
      }
      setOrders(payload.orders || []);
      setSearched(true);
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء البحث، يرجى المحاولة مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background" dir="rtl">
      <Navbar />

      {/* Header */}
      <div className="pt-32 pb-12 bg-primary text-white text-center px-6">
        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Truck size={40} />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
          تتبع طلبك
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto">
          أدخل رقم هاتفك المسجل في الطلب لمتابعة حالة شحنك
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Search Form */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-12"
        >
          <h2 className="text-xl font-display font-bold text-primary mb-6">
            ابحث برقم الهاتف
          </h2>
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Phone
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError("");
                }}
                placeholder="01xxxxxxxxx"
                className="w-full pr-12 pl-4 py-4 rounded-2xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all text-lg text-left"
                dir="ltr"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
            >
              <Search size={20} />
              {loading ? "جاري البحث..." : "بحث"}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-3 flex items-center gap-2">
              ⚠️ {error}
            </p>
          )}
        </motion.form>

        {/* Results */}
        <AnimatePresence>
          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                  <h3 className="text-xl font-bold text-primary mb-2">
                    لا توجد طلبات
                  </h3>
                  <p className="text-gray-500">
                    لم نجد أي طلبات مرتبطة بهذا الرقم
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-gray-500 font-medium">
                    تم العثور على {orders.length} طلب
                  </p>
                  {orders.map((order) => {
                    const status =
                      statusConfig[order.status] || statusConfig.pending;
                    const StatusIcon = status.icon;
                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                      >
                        {/* Order Header */}
                        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">رقم الطلب</p>
                            <p className="font-bold text-primary font-mono">
                              #{order.id.slice(-8).toUpperCase()}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatOrderDate(order.created_at)}
                            </p>
                          </div>
                          <div
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm ${status.color}`}
                          >
                            <StatusIcon size={16} />
                            {status.label}
                          </div>
                        </div>

                        {/* Status Bar */}
                        <div className={`px-6 py-3 text-sm ${status.color} border-b`}>
                          {status.description}
                        </div>

                        {/* Items */}
                        <div className="p-6">
                          <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">
                            المنتجات
                          </h4>
                          <div className="space-y-3 mb-6">
                            {order.items.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl"
                              >
                                <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 relative bg-white">
                                  <Image
                                    src={item.image || "/placeholder.png"}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-bold text-primary text-sm">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    الكمية: {item.quantity}
                                  </p>
                                </div>
                                <p className="font-bold text-primary text-sm">
                                  {item.price * item.quantity} جنيه
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Delivery Info */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                            <div>
                              <p className="text-xs text-gray-400 mb-1">عنوان التوصيل</p>
                              <p className="text-sm font-bold text-primary">
                                {order.governorate} - {order.city}
                              </p>
                              <p className="text-sm text-gray-500">{order.address}</p>
                            </div>
                            <div className="text-left">
                              <p className="text-xs text-gray-400 mb-1">الإجمالي</p>
                              <p className="text-2xl font-bold text-primary">
                                {order.total} جنيه
                              </p>
                              <p className="text-xs text-gray-400">
                                {order.payment_method === "cash"
                                  ? "الدفع عند الاستلام"
                                  : "فودافون كاش / انستا باي"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}
