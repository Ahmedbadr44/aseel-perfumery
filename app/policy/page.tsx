"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "motion/react";
import { RefreshCw, Shield, Truck, CreditCard, Clock, CheckCircle } from "lucide-react";

export default function PolicyPage() {
  const policies = [
    {
      icon: RefreshCw,
      title: "سياسة الاستبدال والاسترجاع",
      items: [
        "يحق للعميل استبدال المنتج خلال 14 يوم من تاريخ الاستلام",
        "يجب أن يكون المنتج في حالته الأصلية غير مستخدم",
        "يتم تحمل العميل لتكلفة الشحن في حالة الاستبدال",
        "لا يتم استرجاع المبالغ المالية، بل يتم استبدال المنتج فقط"
      ]
    },
    {
      icon: Shield,
      title: "ضمان الجودة",
      items: [
        "نضمن أن جميع منتجاتنا أصلية 100%",
        "في حالة وصول منتج تالف أو به عيب، يتم استبداله مجاناً",
        "الصور المعروضة على الموقع مطابقة للمنتج الفعلي"
      ]
    },
    {
      icon: Truck,
      title: "سياسة الشحن والتوصيل",
      items: [
        "التوصيل خلال 2-5 أيام عمل لجميع المحافظات",
        "التوصيل مجاني للطلبات فوق 500 جنيه",
        "يتم التواصل مع العميل قبل الشحن للتأكيد"
      ]
    },
    {
      icon: CreditCard,
      title: "طرق الدفع",
      items: [
        "الدفع عند الاستلام (كاش)",
        "الدفع عبر فودافون كاش",
        "الدفع عبر انستا باي"
      ]
    },
    {
      icon: Clock,
      title: "أوقات العمل",
      items: [
        "متاحون على مدار الساعة",
        "خدمة العملاء متاحة 24/7",
        "الرد على الرسائل خلال 24 ساعة"
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-background" dir="rtl">
      <Navbar />

      <div className="pt-32 pb-12 bg-primary text-white text-center px-6">
        <Shield size={48} className="mx-auto mb-4 opacity-80" />
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
          سياسة الاستبدال
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto">
          جميع حقوقك محفوظة - تعرف على سياساتنا وشروطنا
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 mb-12"
        >
          <h2 className="text-2xl font-display font-bold text-primary mb-6">
            سياسة الاستبدال والاسترجاع
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            نحن في أصيل للعود والعطور الفاخرة نضمن لكم حق الاستبدال الكامل. نؤمن بأن رضاكم هو أولويتنا الأولى، 
            لذلك نحرص على تقديم سياسة استبدال مرنة وسهلة.
          </p>
          <div className="bg-secondary/10 rounded-2xl p-6 border border-secondary/20">
            <p className="text-secondary font-bold flex items-center gap-2">
              <CheckCircle size={20} />
              ملخص السياسة
            </p>
            <p className="text-gray-600 mt-2 leading-relaxed">
              يمكنك استبدال أي منتج خلال 14 يوم من تاريخ الاستلام، بشرط أن يكون في حالته الأصلية. 
              لا يتم استرجاع المبالغ المالية - الاستبدال فقط.
            </p>
          </div>
        </motion.div>

        <div className="space-y-6">
          {policies.map((policy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <policy.icon className="text-primary" size={24} />
                </div>
                <h3 className="text-lg font-bold text-primary">
                  {policy.title}
                </h3>
              </div>
              <ul className="space-y-3">
                {policy.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <span className="text-primary mt-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 md:p-12 text-white"
        >
          <h3 className="text-xl font-display font-bold mb-4">
            هل لديك أي استفسار؟
          </h3>
          <p className="text-white/90 mb-6 leading-relaxed">
            فريق خدمة العملاء متاح على مدار الساعة للإجابة على جميع استفساراتك
          </p>
          <a
            href="tel:01012345678"
            className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all"
          >
            اتصل الآن: 01012345678
          </a>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
