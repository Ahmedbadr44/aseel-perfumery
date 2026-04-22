"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  Search,
  LayoutDashboard,
  ShoppingBag,
  Users,
  LogOut,
  X,
  Menu,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Order } from "@/lib/services/firebase-db";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, isAdmin, logout, loading: authLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = await user.getIdToken();
        const response = await fetch("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error || "FETCH_FAILED");
        setOrders(payload.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [authLoading, user, isAdmin, router]);

  const updateStatus = async (orderId: string, status: Order["status"]) => {
    try {
      if (!user) return;
      const token = await user.getIdToken();
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, status }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || "UPDATE_FAILED");

      const refreshed = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const refreshedPayload = await refreshed.json();
      if (!refreshed.ok) throw new Error(refreshedPayload?.error || "REFETCH_FAILED");
      setOrders(refreshedPayload.orders || []);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
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
            إدارة الطلبات
          </h1>
          <div className="w-10 h-10" /> {/* Spacer */}
        </header>

        <div className="p-8">
          {/* Search */}
          <div className="mb-8 relative max-w-md">
            <Search
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="ابحث برقم الطلب أو اسم العميل..."
              className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-secondary outline-none bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                  <tr>
                    <th className="p-4 font-medium">رقم الطلب</th>
                    <th className="p-4 font-medium">العميل</th>
                    <th className="p-4 font-medium">الهاتف</th>
                    <th className="p-4 font-medium">الإجمالي</th>
                    <th className="p-4 font-medium">الدفع</th>
                    <th className="p-4 font-medium">الحالة</th>
                    <th className="p-4 font-medium">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders
                    .filter(
                      (o) =>
                        o.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        o.id?.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 font-bold text-primary">
                          #{order.id.slice(-6).toUpperCase()}
                        </td>
                        <td className="p-4 text-gray-600">
                          {order.customer_name}
                        </td>
                        <td className="p-4 text-gray-400 text-sm">
                          {order.phone}
                        </td>
                        <td className="p-4 font-bold text-primary">
                          {order.total} جنيه
                        </td>
                        <td className="p-4 text-xs font-bold">
                          <span
                            className={order.payment_method === "cash" ? "text-blue-600 font-bold text-[10px]" : "text-purple-600 font-bold text-[10px]"}
                          >
                            {order.payment_method === "cash" ? "كاش" : "تحويل"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              order.status === "pending"
                                ? "bg-amber-50 text-amber-600"
                                : order.status === "completed"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-red-50 text-red-600"
                            }`}
                          >
                            {order.status === "pending"
                              ? "قيد الانتظار"
                              : order.status === "completed"
                                ? "مكتمل"
                                : "ملغي"}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-primary hover:bg-gray-100 rounded-lg transition-all"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 border-b flex items-center justify-between bg-gray-50">
                <div>
                  <h3 className="text-2xl font-display font-bold text-primary">
                    تفاصيل الطلب
                  </h3>
                  <p className="text-sm text-gray-400">
                    #{selectedOrder.id.toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-primary"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
                      بيانات العميل
                    </h4>
                    <p className="font-bold text-primary">
                      {selectedOrder.customer_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedOrder.phone}
                    </p>
                    <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-500">
                      <p className="font-bold text-primary mb-1">{selectedOrder.governorate} - {selectedOrder.city}</p>
                      <p>{selectedOrder.address}</p>
                    </div>
                    <div className="mt-3">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">طريقة الدفع</span>
                      <span className="text-sm font-bold text-secondary">
                        {selectedOrder.payment_method === 'cash' ? 'الدفع عند الاستلام' : 'فودافون كاش / انستا باي'}
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">
                      حالة الطلب
                    </h4>
                    <div className="flex flex-col gap-2 items-end">
                      <button
                        onClick={() =>
                          updateStatus(selectedOrder.id, "pending")
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedOrder.status === "pending" ? "bg-amber-100 text-amber-600" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                      >
                        <Clock size={16} />
                        قيد الانتظار
                      </button>
                      <button
                        onClick={() =>
                          updateStatus(selectedOrder.id, "completed")
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedOrder.status === "completed" ? "bg-emerald-100 text-emerald-600" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                      >
                        <CheckCircle size={16} />
                        مكتمل
                      </button>
                      <button
                        onClick={() =>
                          updateStatus(selectedOrder.id, "cancelled")
                        }
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedOrder.status === "cancelled" ? "bg-red-100 text-red-600" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                      >
                        <XCircle size={16} />
                        ملغي
                      </button>
                    </div>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">
                  المنتجات
                </h4>
                <div className="space-y-4 mb-8">
                  {selectedOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl"
                    >
                      <div className="w-12 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0 relative">
                        <Image
                          src={item.image || "/placeholder.png"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-primary">{item.name}</p>
                        <p className="text-xs text-gray-400">
                          الكمية: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-primary">
                        {item.price * item.quantity} جنيه
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-6 flex justify-between items-center">
                  <span className="text-xl font-display font-bold text-primary">
                    الإجمالي النهائي
                  </span>
                  <span className="text-2xl font-bold text-secondary">
                    {selectedOrder.total} جنيه
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
