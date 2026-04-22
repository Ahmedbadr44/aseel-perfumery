'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, User, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { FaGoogle } from 'react-icons/fa';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, googleSignIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username.trim(), password);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('AUTH_USER_MISSING');
      }

      const [tokenResult, userDoc] = await Promise.all([
        currentUser.getIdTokenResult(),
        getDoc(doc(db, 'users', currentUser.uid)),
      ]);

      const profile = userDoc.data() as { is_admin?: boolean } | undefined;
      if (!tokenResult.claims.admin && !profile?.is_admin) {
        await auth.signOut();
        throw new Error('NOT_ADMIN');
      }

      router.push('/admin/dashboard');
    } catch (error: any) {
      if (error?.message === 'NOT_ADMIN') {
        setError('هذا الحساب لا يملك صلاحية الدخول للوحة التحكم');
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await googleSignIn();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('AUTH_USER_MISSING');
      }
      const [tokenResult, userDoc] = await Promise.all([
        currentUser.getIdTokenResult(),
        getDoc(doc(db, 'users', currentUser.uid)),
      ]);
      const profile = userDoc.data() as { is_admin?: boolean } | undefined;
      if (!tokenResult.claims.admin && !profile?.is_admin) {
        await auth.signOut();
        throw new Error('NOT_ADMIN');
      }
      router.push('/admin/dashboard');
    } catch (error: any) {
      if (error?.message === 'NOT_ADMIN') {
        setError('هذا الحساب لا يملك صلاحية الدخول للوحة التحكم');
      } else {
        setError('فشل تسجيل الدخول عبر جوجل');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-primary flex items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 border-4 border-secondary rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 border-4 border-secondary rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-display font-bold text-primary">لوحة تحكم أصيل</h1>
          <p className="text-gray-400 text-sm mt-2">يرجى تسجيل الدخول للمتابعة</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">البريد الإلكتروني للمدير</label>
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pr-12 pl-4 py-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-secondary outline-none transition-all"
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-12 pl-4 py-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-secondary outline-none transition-all"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm">أو</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          <FaGoogle className="text-xl" />
          تسجيل الدخول عبر جوجل
        </button>

        <button
          onClick={() => router.push('/')}
          className="w-full mt-6 text-gray-400 hover:text-primary transition-colors text-sm flex items-center justify-center gap-2"
        >
          <ArrowLeft size={16} />
          العودة للمتجر
        </button>
      </motion.div>
    </main>
  );
}
