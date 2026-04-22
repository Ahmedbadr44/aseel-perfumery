"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const { user, logout, userProfile, isAdmin } = useAuth();

  useEffect(() => {
    const mountTimer = window.setTimeout(() => setMounted(true), 0);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.clearTimeout(mountTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "المتجر", href: "/shop" },
    { name: "من نحن", href: "/about" },
    { name: "تواصل معنا", href: "/contact" },
  ];

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 px-6 py-4",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Links - Right Side in RTL */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-primary font-medium hover:text-secondary transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/track-order"
            className="text-primary font-medium hover:text-secondary transition-colors"
          >
            تتبع طلبك
          </Link>
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className="bg-secondary/10 text-secondary px-4 py-2 rounded-full font-bold text-sm hover:bg-secondary hover:text-white transition-all"
            >
              لوحة التحكم
            </Link>
          )}
        </div>

        {/* Logo - Centered */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <div className="relative w-12 h-12 md:w-16 md:h-16">
            <Image
              src="/logo.png"
              alt="ASEEL Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Actions - Left Side in RTL */}
        <div className="flex items-center gap-5">
          {/* User Menu */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 text-primary hover:text-secondary transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs">
                  {user.displayName?.charAt(0) || user.email?.charAt(0)}
                </div>
              </button>
            ) : (
              <Link
                href="/login"
                className="text-primary hover:text-secondary transition-colors"
              >
                <User size={22} />
              </Link>
            )}

            {/* User Dropdown */}
            <AnimatePresence>
              {isUserMenuOpen && user && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsUserMenuOpen(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-50">
                      <p className="font-bold text-primary truncate">{user.displayName || 'مستخدم أصيل'}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User size={16} />
                        حسابي
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-secondary hover:bg-secondary/5 rounded-lg transition-colors font-bold"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <LayoutDashboard size={16} />
                          لوحة التحكم
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors text-right"
                      >
                        <LogOut size={16} />
                        تسجيل الخروج
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Shopping Cart */}
          <Link
            href="/cart"
            className="relative text-primary hover:text-secondary transition-colors"
          >
            <ShoppingBag size={22} />
            {mounted && itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 space-y-2 pb-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-primary hover:bg-gray-50 rounded-lg transition-colors font-medium border-b border-gray-50 last:border-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/track-order"
              className="block px-4 py-2 text-primary hover:bg-gray-50 rounded-lg transition-colors font-medium border-b border-gray-50 last:border-0"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              تتبع طلبك
            </Link>
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="block px-4 py-2 text-secondary hover:bg-secondary/5 rounded-lg transition-colors font-bold border-b border-gray-50 last:border-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                لوحة التحكم
              </Link>
            )}
            {!user ? (
              <div className="pt-4 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="block px-4 py-3 text-primary hover:bg-primary/5 rounded-xl transition-colors font-bold text-center border border-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-3 text-white bg-primary hover:bg-primary/90 rounded-xl transition-colors font-bold text-center shadow-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  إنشاء حساب
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full mt-4 px-4 py-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-bold text-center"
              >
                تسجيل الخروج
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
