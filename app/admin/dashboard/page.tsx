"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

import { productsService, Order } from "@/lib/services/firebase-db";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

interface DashboardStats {
  totalSales: number;
  pendingOrders: number;
  completedOrders: number;
  totalProducts: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAdmin, logout, loading: authLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    setChecked(true);
    
    if (!user || !isAdmin) {
      router.push("/login");
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        if (!user) return;

        const products = await productsService.getAll();
        const token = await user.getIdToken();
        const ordersResponse = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordersPayload = await ordersResponse.json();
        if (!ordersResponse.ok) throw new Error(ordersPayload?.error || "ORDERS_FETCH_FAILED");
        const orders = (ordersPayload.orders || []) as Order[];

        const totalSales = orders.reduce((sum, order) => sum + Number(order.total), 0);
        const pendingOrders = orders.filter(
          (o) => o.status === "pending",
        ).length;
        const completedOrders = orders.filter(
          (o) => o.status === "completed",
        ).length;

        setStats({
          totalSales,
          pendingOrders,
          completedOrders,
          totalProducts: products.length,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && isAdmin) {
      loadDashboardData();
    }
  }, [user, isAdmin]);

  if (authLoading || !checked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">جاري التحقق...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const seedDatabase = async () => {
    setIsSeeding(true);
    try {
      const existingProducts = await productsService.getAll();

      if (existingProducts && existingProducts.length > 0) {
        alert("قاعدة البيانات تحتوي بالفعل على منتجات.");
        setIsSeeding(false);
        return;
      }

      const MOCK_PRODUCTS = [
        {
          name: "أصيل رويال عود",
          price: 850,
          description: "عطر ملكي يجمع بين فخامة العود ودفء العنبر.",
          gender: "unisex" as const,
          category: "oriental",
          image: "https://picsum.photos/seed/p1/600/800",
          notes: { top: ["زعفران"], middle: ["عود"], base: ["عنبر"] },
          inspired_by_name: "Oud Wood - Tom Ford",
          is_best_seller: true,
        },
        {
          name: "ليلة سحرية",
          price: 650,
          description: "عطر زهري منعش يجسد أنوثة طاغية.",
          gender: "women" as const,
          category: "floral",
          image: "https://picsum.photos/seed/p2/600/800",
          notes: { top: ["ياسمين"], middle: ["ورد"], base: ["مسك"] },
          inspired_by_name: "Miss Dior",
          is_best_seller: false,
        },
        {
          name: "بحر الرمال",
          price: 720,
          description: "عطر خشبي حار يعكس قوة الشخصية.",
          gender: "men" as const,
          category: "woody",
          image: "https://picsum.photos/seed/p3/600/800",
          notes: { top: ["فلفل"], middle: ["خشب الصندل"], base: ["جلد"] },
          inspired_by_name: "Sauvage - Dior",
          is_best_seller: true,
        },
      ];

      for (const product of MOCK_PRODUCTS) {
        await productsService.create(product);
      }

      alert("تم إضافة المنتجات التجريبية بنجاح!");
      window.location.reload();
    } catch (error) {
      console.error("Error seeding database:", error);
      alert("حدث خطأ أثناء إضافة المنتجات.");
    } finally {
      setIsSeeding(false);
    }
  };

  const statCards = [
    {
      label: "إجمالي المبيعات",
      value: `${stats.totalSales.toLocaleString()} جنيه`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "الطلبات الجديدة",
      value: stats.pendingOrders.toString(),
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "الطلبات المكتملة",
      value: stats.completedOrders.toString(),
      icon: CheckCircle,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "إجمالي المنتجات",
      value: stats.totalProducts.toString(),
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-600";
      case "completed":
        return "bg-emerald-50 text-emerald-600";
      case "cancelled":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "ملغى";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "mr-64" : "mr-0"}`}
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-100 p-6 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`${isSidebarOpen ? "hidden" : "block"} text-primary`}
            >
              <Menu size={24} />
            </button>
            <button
              onClick={seedDatabase}
              disabled={isSeeding}
              className="bg-secondary/10 text-secondary px-4 py-2 rounded-full text-xs font-bold hover:bg-secondary hover:text-white transition-all disabled:opacity-50"
            >
              {isSeeding ? "جاري الإضافة..." : "إضافة بيانات تجريبية"}
            </button>
          </div>
          <div className="flex items-center gap-4 mr-auto">
            <div className="text-left">
              <p className="text-sm font-bold text-primary">أدمن أصيل</p>
              <p className="text-[10px] text-gray-400">مدير النظام</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-10">
            <h1 className="text-3xl font-display font-bold text-primary mb-2">
              مرحباً بك مجدداً
            </h1>
            <p className="text-gray-500">
              إليك نظرة سريعة على أداء متجرك اليوم.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statCards.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
              >
                <div
                  className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}
                >
                  <stat.icon size={24} />
                </div>
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-primary">
                  {loading ? "-" : stat.value}
                </h3>
              </motion.div>
            ))}
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-primary">
                آخر الطلبات
              </h3>
              <Link
                href="/admin/orders"
                className="text-secondary text-sm font-bold hover:underline"
              >
                عرض الكل
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                  <tr>
                    <th className="p-4 font-medium">رقم الطلب</th>
                    <th className="p-4 font-medium">العميل</th>
                    <th className="p-4 font-medium">التاريخ</th>
                    <th className="p-4 font-medium">الإجمالي</th>
                    <th className="p-4 font-medium">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-400">
                        جاري التحميل...
                      </td>
                    </tr>
                  ) : recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-400">
                        لا توجد طلبات حتى الآن
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 font-bold text-primary">
                          #{order.id.slice(0, 8)}
                        </td>
                        <td className="p-4 text-gray-600">
                          {order.customer_name}
                        </td>
                        <td className="p-4 text-gray-400 text-sm">
                          {order.created_at instanceof Timestamp ? order.created_at.toDate().toLocaleDateString("ar-EG") : new Date(order.created_at).toLocaleDateString("ar-EG")}
                        </td>
                        <td className="p-4 font-bold text-primary">
                          {order.total.toLocaleString()} جنيه
                        </td>
                        <td className="p-4">
                          <span
                            className={`${getStatusColor(order.status)} px-3 py-1 rounded-full text-xs font-bold`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
