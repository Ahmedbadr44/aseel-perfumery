"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "motion/react";
import { Gem, Leaf, Award, Heart } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: Gem,
      title: "عطور فاخرة",
      description: "نقدم لكم مجموعة مميزة من العطور الفاخرة بأجود الخامات الطبيعية"
    },
    {
      icon: Leaf,
      title: "مكونات طبيعية",
      description: "نستخدم فقط أفضل المكونات الطبيعية والمستخلصة من أجود المصادر"
    },
    {
      icon: Award,
      title: "جودة مضمونة",
      description: "نضمن لكم جودة عالية في كل منتج مع ضمان استبدال كامل"
    },
    {
      icon: Heart,
      title: "خدمة عملاء",
      description: "فريق متخصص لخدمة عملائنا على مدار الساعة"
    }
  ];

  return (
    <main className="min-h-screen bg-background" dir="rtl">
      <Navbar />

      <div className="pt-32 pb-12 bg-primary text-white text-center px-6">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
          من نحن
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto">
          أصيل للعود والعطور الفاخرة - وجهتكم الأولى للعطور العربية الأصيلة
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 mb-12"
        >
          <h2 className="text-2xl font-display font-bold text-primary mb-6">
            قصتنا
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            أصيل للعود والعطور الفاخرة هي وجهتكم الأولى للحصول على أجود أنواع العطور العربية الأصيلة. 
            نؤمن بأن العطر الجيد هو جزء لا يتجزأ من الشخصية، ولذلك نحرص على تقديم منتجات ذات جودة عالية 
            تلبي توقعاتكم.
          </p>
          <p className="text-gray-600 leading-relaxed">
            تأسست أصيل بنهج واضح: تقديم عطور فاخرة بأسعار مناسبة مع ضمان جودة لا مثيل لها. 
            نختار مكوناتنا بعناية فائقة لضمان أن كل عطر يعكس أصالة وجودة لا حدود لها.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="text-primary" size={28} />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h2 className="text-2xl font-display font-bold mb-4">
            رؤيتنا
          </h2>
          <p className="text-white/90 leading-relaxed max-w-2xl mx-auto">
            أن نكون الخيار الأول لكل من يبحث عن العطور الفاخرة في مصر والعالم العربي، 
            وأن نضع معايير جديدة للجودة والخدمة في عالم العطور.
          </p>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
