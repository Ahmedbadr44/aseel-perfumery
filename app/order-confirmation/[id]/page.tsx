'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'motion/react';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const orderId = params?.id || '';

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <Navbar />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-md w-full"
      >
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={48} />
        </div>
        <h1 className="text-3xl font-display font-bold text-primary mb-4">تم استلام طلبك بنجاح!</h1>
        <p className="text-gray-500 mb-4 leading-relaxed">
          شكراً لثقتك في أصيل. سيقوم فريقنا بالتواصل معك قريباً لتأكيد الطلب وشحنه إليك.
        </p>
        <p className="text-xs text-gray-400 mb-8">رقم الطلب: {orderId.slice(-8).toUpperCase()}</p>
        <div className="bg-gray-50 p-4 rounded-xl mb-8 text-sm text-gray-600">
          سيتم تحويلك للرئيسية خلال 5 ثوانٍ...
        </div>
        <button
          onClick={() => router.push('/')}
          className="w-full bg-primary text-white py-4 rounded-full font-bold hover:bg-primary/90 transition-all"
        >
          العودة للرئيسية
        </button>
      </motion.div>
      <Footer />
    </main>
  );
}
