"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  X,
  Menu,
  Shield,
  User,
  Mail,
  Calendar,
} from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { usersService, UserProfile } from "@/lib/services/firebase-db";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push("/login");
      return;
    }

    const fetchUsers = async () => {
      try {
        const { getDocs } = await import("firebase/firestore");
        const { collection } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        const snapshot = await getDocs(collection(db, "users"));
        const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile));
        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const toggleAdmin = async (userId: string, currentStatus: boolean) => {
    try {
      await usersService.update(userId, { is_admin: !currentStatus });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, is_admin: !currentStatus } : u
        )
      );
    } catch (error) {
      console.error("Error updating admin status:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
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
            إدارة العملاء
          </h1>
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold text-sm">
            {users.length} عميل مسجل
          </div>
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
              placeholder="ابحث باسم العميل أو البريد الإلكتروني..."
              className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-secondary outline-none bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: "إجمالي العملاء", value: users.length, icon: Users, color: "blue" },
              { label: "المشرفون", value: users.filter(u => u.is_admin).length, icon: Shield, color: "amber" },
              { label: "عملاء هذا الشهر", value: users.filter(u => { const date = u.created_at instanceof Timestamp ? u.created_at.toDate() : new Date(u.created_at); return date.getMonth() === new Date().getMonth(); }).length, icon: Calendar, color: "green" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <stat.icon size={24} className="text-primary" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="text-center py-16 text-gray-400">جاري تحميل البيانات...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-16">
                <Users size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400">لا يوجد عملاء مسجلون بعد</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-gray-50 text-gray-500 text-sm">
                    <tr>
                      <th className="p-4 font-medium">العميل</th>
                      <th className="p-4 font-medium">البريد الإلكتروني</th>
                      <th className="p-4 font-medium">تاريخ التسجيل</th>
                      <th className="p-4 font-medium">الصلاحية</th>
                      <th className="p-4 font-medium">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                              {user.display_name?.charAt(0) || <User size={18} />}
                            </div>
                            <span className="font-bold text-primary">
                              {user.display_name || "بدون اسم"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-500 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail size={14} />
                            {user.email}
                          </div>
                        </td>
                        <td className="p-4 text-gray-400 text-sm">
                          {user.created_at instanceof Timestamp ? user.created_at.toDate().toLocaleDateString("ar-EG") : new Date(user.created_at).toLocaleDateString("ar-EG")}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              user.is_admin
                                ? "bg-amber-50 text-amber-600"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {user.is_admin ? "مشرف" : "عميل"}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleAdmin(user.id, user.is_admin)}
                            className={`text-xs px-3 py-2 rounded-lg font-bold transition-all ${
                              user.is_admin
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                            }`}
                          >
                            {user.is_admin ? "إلغاء الإدارة" : "منح صلاحية إدارة"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
