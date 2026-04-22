"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  X,
  Home,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    if (confirm("هل أنت متأكد من تسجيل الخروج؟")) {
      await logout();
      window.location.href = "/login";
    }
  };

  const menuItems = [
    { name: "الرئيسية", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "المنتجات", href: "/admin/products", icon: Package },
    { name: "الطلبات", href: "/admin/orders", icon: ShoppingBag },
    { name: "العملاء", href: "/admin/users", icon: Users },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <aside
      className={`bg-primary text-white w-64 fixed h-full transition-all duration-300 z-50 ${
        isOpen ? "right-0" : "-right-64"
      }`}
    >
      <div className="p-8 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold">لوحة التحكم</h2>
        <button onClick={onClose} className="lg:hidden">
          <X size={20} />
        </button>
      </div>

      <nav className="p-6 h-[calc(100%-100px)] flex flex-col justify-between">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                isActive(item.href)
                  ? "bg-secondary text-white font-bold"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="space-y-4 pt-10">
          <div className="border-t border-white/10 pt-4">
            <Link
              href="/"
              className="flex items-center gap-4 p-4 rounded-xl text-secondary hover:bg-secondary/10 transition-all font-bold"
            >
              <Home size={20} />
              <span>الرجوع للمتجر</span>
            </Link>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-red-500/10 transition-all text-red-400 w-full text-right"
          >
            <LogOut size={20} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};
